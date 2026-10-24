-- ====================================================================
-- ANUP FABRICATION - PRODUCTION DATABASE SCHEMA & RLS MIGRATION
-- Business Location: 31/1 Nangli Sakrawati, Najafgarh, New Delhi 110043
-- Website: https://anupfabrication.infinityfree.me
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Utility Trigger Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES Table (Referencing auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_language VARCHAR(5) DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. USER ROLES Table (Strict Role-Based Access Control)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Helper function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. SERVICES Catalog Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  starting_price NUMERIC(10, 2),
  estimated_lead_time VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. PROJECTS Showcase Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en TEXT NOT NULL,
  title_hi TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  cover_image_path TEXT,
  location TEXT DEFAULT 'Delhi NCR',
  publication_status VARCHAR(20) DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENQUIRIES Table (Public and Authenticated Quote Requests)
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number VARCHAR(30) UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email TEXT,
  service_category VARCHAR(50) NOT NULL,
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL,
  dimensions TEXT,
  quantity INTEGER DEFAULT 1,
  budget_range TEXT,
  preferred_date DATE,
  location TEXT NOT NULL,
  preferred_language VARCHAR(5) DEFAULT 'en',
  preferred_contact VARCHAR(20) DEFAULT 'phone',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'booked', 'in_progress', 'completed', 'cancelled')),
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_enquiries_customer_id ON public.enquiries(customer_id);
CREATE INDEX idx_enquiries_status ON public.enquiries(status);
CREATE INDEX idx_enquiries_ref ON public.enquiries(reference_number);

-- 8. ENQUIRY FILES (Private drawings and technical specs)
CREATE TABLE IF NOT EXISTS public.enquiry_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. QUOTATIONS Table
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  quotation_number VARCHAR(30) UNIQUE NOT NULL,
  subtotal NUMERIC(12, 2) NOT NULL,
  tax_rate_percent NUMERIC(5, 2) DEFAULT 18.00,
  tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(12, 2) DEFAULT 0.00,
  total_amount NUMERIC(12, 2) NOT NULL,
  advance_percent NUMERIC(5, 2) DEFAULT 40.00,
  advance_amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  valid_until DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. QUOTATION ITEMS (Line items breakdown)
CREATE TABLE IF NOT EXISTS public.quotation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL,
  line_total NUMERIC(12, 2) NOT NULL
);

-- 11. BOOKINGS Table (Site inspections and installation work)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
  service_category VARCHAR(50) NOT NULL,
  requested_date DATE NOT NULL,
  confirmed_date DATE,
  time_slot VARCHAR(50),
  site_address TEXT NOT NULL,
  status VARCHAR(30) DEFAULT 'requested' CHECK (status IN ('requested', 'under_review', 'quotation_sent', 'awaiting_payment', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  customer_notes TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PAYMENTS Table (Razorpay Verified Transactions)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  reference_no VARCHAR(50) UNIQUE NOT NULL,
  provider VARCHAR(30) DEFAULT 'razorpay',
  provider_order_id TEXT,
  provider_payment_id TEXT UNIQUE,
  amount_paise BIGINT NOT NULL,
  amount_inr NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. AUDIT LOGS Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. BUSINESS SETTINGS Table (Configurable details)
CREATE TABLE IF NOT EXISTS public.business_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
  business_name TEXT NOT NULL DEFAULT 'Anup Fabrication',
  address TEXT NOT NULL DEFAULT '31/1 Nangli Sakrawati, Najafgarh, New Delhi, Delhi 110043, India',
  primary_phone TEXT NOT NULL DEFAULT '7217853257',
  secondary_phone TEXT NOT NULL DEFAULT '7838640423',
  whatsapp_number TEXT NOT NULL DEFAULT '917217853257',
  email TEXT NOT NULL DEFAULT 'contact@anupfabrication.infinityfree.me',
  service_areas JSONB DEFAULT '["Najafgarh", "Nangli Sakrawati", "Dwarka", "Gurgaon NCR", "West Delhi", "Noida"]'::jsonb,
  website_url TEXT NOT NULL DEFAULT 'https://anupfabrication.infinityfree.me',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiry_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Customers can read and update their own profile; admins can read all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Services: Public read for active; admin full access
CREATE POLICY "Public can view active services" ON public.services
  FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (public.is_admin(auth.uid()));

-- 3. Projects: Public read for published; admin full access
CREATE POLICY "Public can view published projects" ON public.projects
  FOR SELECT USING (publication_status = 'published' OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL USING (public.is_admin(auth.uid()));

-- 4. Enquiries: Customers view own; public can insert with rate limits; admins full access
CREATE POLICY "Anyone can submit an enquiry" ON public.enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Customers view own enquiries" ON public.enquiries
  FOR SELECT USING (auth.uid() = customer_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins update enquiries" ON public.enquiries
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- 5. Quotations: Customers can view their own quotations; admins manage
CREATE POLICY "Customers view own quotations" ON public.quotations
  FOR SELECT USING (auth.uid() = customer_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins manage quotations" ON public.quotations
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Quotation items visible with quotation" ON public.quotation_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quotations 
      WHERE quotations.id = quotation_items.quotation_id 
      AND (quotations.customer_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );

-- 6. Bookings: Customers view own bookings; admins manage
CREATE POLICY "Customers view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = customer_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins manage bookings" ON public.bookings
  FOR ALL USING (public.is_admin(auth.uid()));

-- 7. Payments: Customers view own payments; server/admin inserts/updates
CREATE POLICY "Customers view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = customer_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admins manage payments" ON public.payments
  FOR ALL USING (public.is_admin(auth.uid()));

-- 8. Business Settings: Public read; admin write
CREATE POLICY "Public can view business settings" ON public.business_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update business settings" ON public.business_settings
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- ====================================================================
-- SEED INITIAL DATA (Services & Business Info)
-- ====================================================================
INSERT INTO public.business_settings (id, business_name, address, primary_phone, secondary_phone, email, website_url)
VALUES (
  'main', 
  'Anup Fabrication', 
  '31/1 Nangli Sakrawati, Najafgarh, New Delhi, Delhi 110043, India',
  '7217853257',
  '7838640423',
  'contact@anupfabrication.infinityfree.me',
  'https://anupfabrication.infinityfree.me'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.services (name_en, name_hi, description_en, description_hi, category, starting_price, estimated_lead_time, display_order)
VALUES
('Gates, Grills & Railings', 'गेट, ग्रिल एवं डिजाइनर रेलिंग', 'Custom heavy-duty wrought iron boundary gates, balcony railings, SS railings, and laser-cut security window grills.', 'मजबूत लोहे के बाउंड्री गेट, बालकनी रेलिंग, एसएस रेलिंग और लेजर कट सुरक्षा ग्रिल।', 'gates_grills', 350, '5 - 10 Days', 1),
('Structural Steel & Industrial Sheds', 'स्ट्रक्चरल स्टील एवं इंडस्ट्रियल शेड', 'Heavy structural steel fabrication including I-beam fabrication, factory warehouse sheds, and roof truss assembly.', 'हैवी स्ट्रक्चरल स्टील फैब्रिकेशन, आई-बीम असेंबली, फैक्ट्री गोदाम शेड और रूफ ट्रस निर्माण।', 'structural_steel', 65, '14 - 30 Days', 2),
('Custom Metal Fabrication from Drawings', 'ड्राइंग अनुसार कस्टम मेटल फैब्रिकेशन', 'Bespoke metal structures engineered strictly from architect or client architectural drawings.', 'आर्किटेक्ट या ग्राहक की ड्राइंग अनुसार विशेष मेटल स्ट्रक्चर एवं फैब्रिकेशन।', 'custom_metal', 500, '7 - 14 Days', 3),
('Welding & High-Strength Metal Joining', 'वेल्डिंग एवं मेटल जॉइनिंग कार्य', 'Certified MIG, TIG, and Shielded Metal Arc Welding with uniform penetration and clean weld beads.', 'सर्टिफाइड मिग, टिग और आर्क वेल्डिंग मजबूत जोड़ एवं साफ फिनिशिंग के साथ।', 'welding_joining', 250, '1 - 3 Days', 4)
ON CONFLICT DO NOTHING;

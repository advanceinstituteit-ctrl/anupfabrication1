export type Language = 'en' | 'hi';

export type UserRole = 'customer' | 'staff' | 'admin';

export type FabricationStatus = 
  | 'pending_approval'
  | 'in_fabrication'
  | 'ready_for_delivery'
  | 'delivered';

export interface OrderTimelineItem {
  id: string;
  stage: string;
  status: 'completed' | 'current' | 'upcoming';
  timestamp?: string;
  note?: string;
}

export interface OrderItem {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  project_title: string;
  service_category: ServiceCategory;
  dimensions?: string;
  material_grade?: string;
  status: FabricationStatus;
  current_stage_description: string;
  estimated_delivery_date: string;
  workshop_station: string;
  progress_percent: number;
  timeline: OrderTimelineItem[];
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  preferred_language: Language;
  role: UserRole;
  created_at: string;
}

export type ServiceCategory = 
  | 'gates_grills'
  | 'structural_steel'
  | 'custom_metal'
  | 'welding_joining'
  | 'frames_trusses'
  | 'repair_modification';

export interface ServiceItem {
  id: string;
  name_en: string;
  name_hi: string;
  description_en: string;
  description_hi: string;
  category: ServiceCategory;
  starting_price?: number;
  estimated_lead_time?: string;
  is_active: boolean;
  display_order: number;
  features_en: string[];
  features_hi: string[];
}

export interface ProjectItem {
  id: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  category: ServiceCategory;
  cover_image_path?: string;
  publication_status: 'draft' | 'published';
  location: string;
  completed_year: string;
}

export type EnquiryStatus = 'pending' | 'quoted' | 'booked' | 'in_progress' | 'completed' | 'cancelled';

export interface EnquiryFile {
  id: string;
  enquiry_id: string;
  storage_path: string;
  original_filename: string;
  content_type: string;
  file_size: number;
  uploaded_by?: string;
  created_at: string;
}

export interface EnquiryItem {
  id: string;
  reference_number: string;
  customer_id?: string;
  customer_name: string;
  phone: string;
  email: string;
  service_category: ServiceCategory;
  project_title: string;
  project_description: string;
  dimensions?: string;
  quantity: number;
  budget_range?: string;
  preferred_date?: string;
  location: string;
  preferred_language: Language;
  preferred_contact: 'phone' | 'whatsapp' | 'email';
  status: EnquiryStatus;
  internal_notes?: string;
  files?: EnquiryFile[];
  created_at: string;
  updated_at: string;
}

export interface QuotationLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface QuotationItem {
  id: string;
  enquiry_id: string;
  customer_id: string;
  quotation_number: string;
  customer_name: string;
  customer_phone: string;
  project_title: string;
  items: QuotationLineItem[];
  subtotal: number;
  tax_rate_percent: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  advance_percent: number;
  advance_amount: number;
  currency: string;
  valid_until: string;
  status: QuotationStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = 
  | 'requested'
  | 'under_review'
  | 'quotation_sent'
  | 'awaiting_payment'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface BookingItem {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  enquiry_id?: string;
  quotation_id?: string;
  service_category: ServiceCategory;
  requested_date: string;
  confirmed_date?: string;
  time_slot?: string;
  site_address: string;
  status: BookingStatus;
  customer_notes?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface PaymentRecord {
  id: string;
  customer_id: string;
  customer_name: string;
  quotation_id?: string;
  booking_id?: string;
  reference_no: string;
  provider: 'razorpay' | 'cash_on_site';
  provider_order_id?: string;
  provider_payment_id?: string;
  amount_paise: number;
  amount_inr: number;
  currency: string;
  status: PaymentStatus;
  verified_at?: string;
  created_at: string;
}

export interface BusinessSettings {
  business_name: string;
  address: string;
  phones: string[];
  primary_phone: string;
  whatsapp_number: string;
  email: string;
  service_areas: string[];
  website_url: string;
  consultation_available: boolean;
}

export interface AuditLogItem {
  id: string;
  actor_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  created_at: string;
}

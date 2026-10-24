import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  ServiceItem,
  ProjectItem,
  EnquiryItem,
  QuotationItem,
  BookingItem,
  PaymentRecord,
  BusinessSettings,
  AuditLogItem,
  QuotationLineItem
} from '../../types';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { db, auth, googleProvider } from '../firebase/client';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, doc, setDoc, onSnapshot, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebase/error';

export const INITIAL_BUSINESS_SETTINGS: BusinessSettings = {
  business_name: 'Anup Fabrication',
  address: '31/1 Nangli Sakrawati, Najafgarh, New Delhi, Delhi 110043, India',
  phones: ['7217853257', '7838640423'],
  primary_phone: '7217853257',
  whatsapp_number: '917217853257',
  email: 'contact@anupfabrication.infinityfree.me',
  service_areas: [
    'Najafgarh',
    'Nangli Sakrawati',
    'Dwarka & Uttam Nagar',
    'Janakpuri & Vikaspuri',
    'Gurgaon (Gurugram) NCR',
    'Noida & Greater Noida',
    'Bahadurgarh & West Delhi'
  ],
  website_url: 'https://anupfabrication.infinityfree.me',
  consultation_available: true
};

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name_en: 'Gates, Grills & Railings',
    name_hi: 'गेट, ग्रिल एवं डिजाइनर रेलिंग',
    description_en: 'Custom heavy-duty wrought iron boundary gates, balcony railings, SS (stainless steel) railings, and laser-cut security window grills with anti-rust primer.',
    description_hi: 'मजबूत लोहे के बाउंड्री गेट, बालकनी रेलिंग, एसएस (स्टेनलेस स्टील) रेलिंग और लेजर कट सुरक्षा ग्रिल एंटी-रस्ट कोटिंग के साथ।',
    category: 'gates_grills',
    starting_price: 350,
    estimated_lead_time: '5 - 10 Days',
    is_active: true,
    display_order: 1,
    features_en: ['Wrought Iron & Mild Steel', 'Grade 304 Stainless Steel', 'Custom CAD Laser-Cut Grills', 'Zinc Chromate Anti-Rust Primer'],
    features_hi: ['रॉट आयरन एवं माइल्ड स्टील', 'ग्रेड 304 स्टेनलेस स्टील', 'कस्टम लेजर कट ग्रिल', 'जिंक क्रोमेट एंटी-रस्ट प्राइमर']
  },
  {
    id: 'srv-2',
    name_en: 'Structural Steel & Industrial Sheds',
    name_hi: 'स्ट्रक्चरल स्टील एवं इंडस्ट्रियल शेड',
    description_en: 'Heavy structural steel fabrication including I-beam fabrication, factory warehouse sheds, PEB framing, and roof truss assembly.',
    description_hi: 'हैवी स्ट्रक्चरल स्टील फैब्रिकेशन, आई-बीम असेंबली, फैक्ट्री गोदाम शेड और रूफ ट्रस निर्माण।',
    category: 'structural_steel',
    starting_price: 65,
    estimated_lead_time: '14 - 30 Days',
    is_active: true,
    display_order: 2,
    features_en: ['Heavy I-Beam & C-Channel Columns', 'Tubular Truss Fabrication', 'Industrial Factory & Godown Sheds', 'Load-Bearing Structural Calculations'],
    features_hi: ['हैवी आई-बीम व चैनल कॉलम', 'ट्यूबुलर ट्रस निर्माण', 'फैक्ट्री व गोदाम शेड', 'वजन वहन क्षमता की गणना']
  },
  {
    id: 'srv-3',
    name_en: 'Custom Metal Fabrication from Drawings',
    name_hi: 'ड्राइंग अनुसार कस्टम मेटल फैब्रिकेशन',
    description_en: 'Bespoke metal structures engineered strictly from architect or client architectural drawings, sheet metal bending, and CNC plasma cutting.',
    description_hi: 'आर्किटेक्ट या ग्राहक की ड्राइंग अनुसार विशेष मेटल स्ट्रक्चर, शीट मेटल बेंडिंग एवं प्लाज्मा कटिंग।',
    category: 'custom_metal',
    starting_price: 500,
    estimated_lead_time: '7 - 14 Days',
    is_active: true,
    display_order: 3,
    features_en: ['Fabrication from Technical Drawings', 'Precision Tolerances (±1mm)', 'Mild Steel, GI & Stainless Steel', 'Custom Fixtures & Brackets'],
    features_hi: ['तकनीकी ड्राइंग अनुसार निर्माण', 'सटीक माप व फिनिशिंग', 'माइल्ड स्टील, जीआई व एसएस', 'कस्टम ब्रैकेट व असेंबली']
  },
  {
    id: 'srv-4',
    name_en: 'Welding & High-Strength Metal Joining',
    name_hi: 'वेल्डिंग एवं मेटल जॉइनिंग कार्य',
    description_en: 'Certified MIG (GMAW), TIG (GTAW), and Shielded Metal Arc Welding (SMAW) with uniform penetration and clean weld beads for heavy equipment.',
    description_hi: 'सर्टिफाइड मिग, टिग और आर्क वेल्डिंग मजबूत जोड़ एवं साफ फिनिशिंग के साथ।',
    category: 'welding_joining',
    starting_price: 250,
    estimated_lead_time: '1 - 3 Days',
    is_active: true,
    display_order: 4,
    features_en: ['TIG Welding for Stainless Steel', 'Heavy MIG Welding for Structures', 'On-Site Mobile Welding Unit', 'Slag Removal & Surface Grinding'],
    features_hi: ['स्टेनलेस स्टील हेतु टिग वेल्डिंग', 'हैवी स्ट्रक्चर हेतु मिग वेल्डिंग', 'ऑन-साइट मोबाइल वेल्डिंग सुविधा', 'सतह ग्राइंडिंग व स्मूथिंग']
  },
  {
    id: 'srv-5',
    name_en: 'Industrial Metal Frames & Mezzanine Floors',
    name_hi: 'इंडस्ट्रियल मेटल फ्रेम व मेजेनाइन फ्लोर',
    description_en: 'Modular machine support frames, warehouse mezzanine floors, staircase steel stringers, and commercial display structural skeletons.',
    description_hi: 'मशीन सपोर्ट फ्रेम, गोदाम मेजेनाइन फ्लोरिंग, लोहे की सीढ़ियां और शोरूम स्ट्रक्चर।',
    category: 'frames_trusses',
    starting_price: 180,
    estimated_lead_time: '10 - 20 Days',
    is_active: true,
    display_order: 5,
    features_en: ['High Load Bearing Capacity', 'Modular Bolt & Weld Assembly', 'Industrial Staircases & Handrails', 'Space Optimization Structures'],
    features_hi: ['उच्च भार क्षमता', 'बोल्ट व वेल्ड असेंबली', 'इंडस्ट्रियल सीढ़ियां एवं रेलिंग', 'जगह का अधिकतम उपयोग']
  },
  {
    id: 'srv-6',
    name_en: 'Repair, Strengthening & Site Modification',
    name_hi: 'रिपेयर, सुदृढ़ीकरण एवं साइट मॉडिफिकेशन',
    description_en: 'On-site structural reinforcement, gate realignment, rusted section replacement, beam retrofitting, and emergency industrial repair.',
    description_hi: 'ऑन-साइट स्ट्रक्चरल मरम्मत, जंग लगे हिस्सों का प्रतिस्थापन, बीम सपोर्ट और आपातकालीन रिपेयर।',
    category: 'repair_modification',
    starting_price: 1500,
    estimated_lead_time: '1 - 5 Days',
    is_active: true,
    display_order: 6,
    features_en: ['Corrosion Cutting & Gusset Plating', 'Hinge & Roller Replacement', 'Structure Strengthening', 'Rapid On-Call Team in Delhi NCR'],
    features_hi: ['जंग लगे हिस्से हटाकर नई प्लेटिंग', 'हिंज व रोलर प्रतिस्थापन', 'स्ट्रक्चर को मजबूत करना', 'दिल्ली एनसीआर में त्वरित सेवा']
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title_en: 'Heavy Industrial Warehouse Truss & Shed Frame',
    title_hi: 'हैवी इंडस्ट्रियल वेयरहाउस ट्रस एवं शेड फ्रेम',
    description_en: 'Engineered and erected 45ft span structural steel trusses with C-purlins and wind bracing for an industrial logistics hub.',
    description_hi: 'औद्योगिक लॉजिस्टिक्स हब के लिए 45 फीट स्पैन स्ट्रक्चरल स्टील ट्रस और सी-पर्लिन का निर्माण एवं इंस्टॉलेशन।',
    category: 'structural_steel',
    publication_status: 'published',
    location: 'Najafgarh Industrial Belt, New Delhi',
    completed_year: '2026'
  },
  {
    id: 'proj-2',
    title_en: 'Modern Stainless Steel & Teak-Style Gate Installation',
    title_hi: 'मॉडर्न स्टेनलेस स्टील एवं वुडन-स्टाइल मेन गेट',
    description_en: 'Grade 304 stainless steel sliding entrance gate with electro-galvanized framing and anti-rust satin coat for a private residence.',
    description_hi: 'ग्रेड 304 स्टेनलेस स्टील स्लाइडिंग गेट, इलेक्ट्रो-गैल्वनाइज्ड फ्रेमिंग के साथ निजी आवास हेतु निर्माण।',
    category: 'gates_grills',
    publication_status: 'published',
    location: 'Dwarka Sector 19, New Delhi',
    completed_year: '2026'
  },
  {
    id: 'proj-3',
    title_en: 'Heavy Duty Mezzanine Floor & Steel Spiral Staircase',
    title_hi: 'हैवी ड्यूटी मेजेनाइन फ्लोर एवं स्पाइरल सीढ़ी',
    description_en: 'Fabricated an 800 sq.ft industrial storage mezzanine with 150x75mm channel joists and safety balustrades.',
    description_hi: '800 वर्ग फुट इंडस्ट्रियल स्टोरेज मेजेनाइन और चैनल जॉइस्ट युक्त सेफ्टी रेलिंग का निर्माण।',
    category: 'frames_trusses',
    publication_status: 'published',
    location: 'Udyog Vihar Phase 4, Gurgaon NCR',
    completed_year: '2025'
  }
];

export const INITIAL_ENQUIRIES: EnquiryItem[] = [
  {
    id: 'enq-101',
    reference_number: 'AF-2026-8941',
    customer_id: 'cust-demo-1',
    customer_name: 'Rajesh Sharma',
    phone: '9811223344',
    email: 'rajesh.sharma@example.com',
    service_category: 'gates_grills',
    project_title: 'Main Entrance Sliding Gate & Boundary Railing',
    project_description: 'Need a 14ft wide x 7ft high heavy iron sliding gate with motorized track channel and matching 40 running feet boundary railing.',
    dimensions: '14ft x 7ft gate + 40ft railing',
    quantity: 1,
    budget_range: '₹60,000 - ₹90,000',
    preferred_date: '2026-11-05',
    location: 'Dwarka Sector 12, New Delhi',
    preferred_language: 'en',
    preferred_contact: 'phone',
    status: 'quoted',
    internal_notes: 'Site inspection scheduled. Quotation Q-2026-042 sent.',
    created_at: '2026-10-20T10:30:00Z',
    updated_at: '2026-10-21T14:15:00Z'
  },
  {
    id: 'enq-102',
    reference_number: 'AF-2026-9124',
    customer_id: 'cust-demo-2',
    customer_name: 'Vikas Gupta',
    phone: '9873112233',
    email: 'vikas.gupta@factory.in',
    service_category: 'structural_steel',
    project_title: 'Warehouse Factory Shed 50ft x 30ft',
    project_description: 'Tubular truss steel roof structure with GI profile sheet roofing and polycarbonate skylights.',
    dimensions: '50ft x 30ft (1500 sq ft)',
    quantity: 1,
    budget_range: '₹2,50,000 - ₹3,50,000',
    preferred_date: '2026-11-15',
    location: 'Nangli Sakrawati Industrial Area, Najafgarh',
    preferred_language: 'hi',
    preferred_contact: 'whatsapp',
    status: 'pending',
    internal_notes: 'Awaiting architectural drawings from client.',
    created_at: '2026-10-23T09:10:00Z',
    updated_at: '2026-10-23T09:10:00Z'
  }
];

export const INITIAL_QUOTATIONS: QuotationItem[] = [
  {
    id: 'quote-42',
    enquiry_id: 'enq-101',
    customer_id: 'cust-demo-1',
    quotation_number: 'AF-QT-2026-042',
    customer_name: 'Rajesh Sharma',
    customer_phone: '9811223344',
    project_title: 'Main Entrance Sliding Gate & Boundary Railing',
    items: [
      {
        id: 'item-1',
        description: 'Heavy duty MS sliding main gate (14ft x 7ft) with bottom heavy roller bearing channel and anti-rust epoxy primer',
        quantity: 1,
        unit_price: 48000,
        line_total: 48000
      },
      {
        id: 'item-2',
        description: 'Modern geometric boundary wall railing in 40x40mm MS box pipe and 12mm square bars (40 Running Feet)',
        quantity: 40,
        unit_price: 750,
        line_total: 30000
      },
      {
        id: 'item-3',
        description: 'On-site installation, alignment, concrete footing anchors and touch-up finishing at Dwarka site',
        quantity: 1,
        unit_price: 6500,
        line_total: 6500
      }
    ],
    subtotal: 84500,
    tax_rate_percent: 18,
    tax_amount: 15210,
    discount_amount: 2500,
    total_amount: 97210,
    advance_percent: 40,
    advance_amount: 38884,
    currency: 'INR',
    valid_until: '2026-11-10',
    status: 'sent',
    notes: 'Quotation includes genuine Jindal / Tata structural steel sections, red oxide zinc chromate primer, and 1-year workmanship warranty.',
    created_at: '2026-10-21T14:00:00Z',
    updated_at: '2026-10-21T14:00:00Z'
  }
];

export const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: 'book-1',
    customer_id: 'cust-demo-1',
    customer_name: 'Rajesh Sharma',
    customer_phone: '9811223344',
    enquiry_id: 'enq-101',
    quotation_id: 'quote-42',
    service_category: 'gates_grills',
    requested_date: '2026-11-05',
    confirmed_date: '2026-11-05',
    time_slot: '10:00 AM - 1:00 PM',
    site_address: 'Plot 42, Sector 12, Dwarka, New Delhi 110078',
    status: 'awaiting_payment',
    customer_notes: 'Site gate pillar foundations are already poured and cured.',
    internal_notes: 'Installation truck scheduled with 3 technicians.',
    created_at: '2026-10-21T15:00:00Z',
    updated_at: '2026-10-22T09:00:00Z'
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-seed-1',
    customer_id: 'cust-demo-1',
    customer_name: 'Rajesh Sharma',
    quotation_id: 'quote-42',
    booking_id: 'book-1',
    reference_no: 'RCP-AF-8942',
    provider: 'razorpay',
    provider_order_id: 'order_test_99214',
    provider_payment_id: 'pay_test_8819234',
    amount_paise: 3888400,
    amount_inr: 38884,
    currency: 'INR',
    status: 'success',
    verified_at: '2026-10-22T10:15:30Z',
    created_at: '2026-10-22T10:15:00Z'
  }
];

interface AppContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  businessSettings: BusinessSettings;
  updateBusinessSettings: (settings: Partial<BusinessSettings>) => void;
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  toggleServiceActive: (id: string) => void;
  projects: ProjectItem[];
  enquiries: EnquiryItem[];
  createEnquiry: (enquiry: Omit<EnquiryItem, 'id' | 'reference_number' | 'created_at' | 'updated_at' | 'status'>) => Promise<EnquiryItem>;
  updateEnquiryStatus: (id: string, status: EnquiryItem['status'], notes?: string) => void;
  quotations: QuotationItem[];
  createQuotation: (quote: Omit<QuotationItem, 'id' | 'created_at' | 'updated_at'>) => QuotationItem;
  updateQuotationStatus: (id: string, status: QuotationItem['status']) => void;
  bookings: BookingItem[];
  createBooking: (booking: Omit<BookingItem, 'id' | 'created_at' | 'updated_at'>) => BookingItem;
  updateBookingStatus: (id: string, status: BookingItem['status'], confirmedDate?: string, notes?: string) => void;
  payments: PaymentRecord[];
  recordPayment: (payment: Omit<PaymentRecord, 'id' | 'created_at'>) => PaymentRecord;
  auditLogs: AuditLogItem[];
  logAuditAction: (action: string, entity_type: string, entity_id: string, details: string) => void;
  switchToRole: (role: 'visitor' | 'customer' | 'admin') => void;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default user is logged in as demo customer or admin toggleable easily
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return {
      id: 'cust-demo-1',
      email: 'rajesh.sharma@example.com',
      full_name: 'Rajesh Sharma',
      phone: '9811223344',
      preferred_language: 'en',
      role: 'customer',
      created_at: '2026-10-15T00:00:00Z'
    };
  });

  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(INITIAL_BUSINESS_SETTINGS);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [projects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(INITIAL_ENQUIRIES);
  const [quotations, setQuotations] = useState<QuotationItem[]>(INITIAL_QUOTATIONS);
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-1',
      actor_email: 'admin@anupfabrication.infinityfree.me',
      action: 'QUOTATION_CREATED',
      entity_type: 'quotation',
      entity_id: 'quote-42',
      details: 'Generated quotation AF-QT-2026-042 for Rajesh Sharma (₹97,210)',
      created_at: '2026-10-21T14:00:00Z'
    },
    {
      id: 'log-2',
      actor_email: 'system@anupfabrication.infinityfree.me',
      action: 'PAYMENT_VERIFIED',
      entity_type: 'payment',
      entity_id: 'pay-seed-1',
      details: 'Razorpay payment verified for Advance amount ₹38,884 (pay_test_8819234)',
      created_at: '2026-10-22T10:15:30Z'
    }
  ]);

  const logAuditAction = (action: string, entity_type: string, entity_id: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      actor_email: currentUser?.email || 'admin@anupfabrication.infinityfree.me',
      action,
      entity_type,
      entity_id,
      details,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateBusinessSettings = (settings: Partial<BusinessSettings>) => {
    setBusinessSettings(prev => {
      const updated = { ...prev, ...settings };
      logAuditAction('SETTINGS_UPDATED', 'business_settings', 'main', 'Business contact or profile updated');
      return updated;
    });
  };

  const addService = (serviceData: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...serviceData,
      id: `srv-${Date.now()}`
    };
    setServices(prev => [...prev, newService]);
    logAuditAction('SERVICE_CREATED', 'service', newService.id, `Created service: ${newService.name_en}`);
  };

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logAuditAction('SERVICE_UPDATED', 'service', id, `Updated service parameters`);
  };

  const toggleServiceActive = (id: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.is_active;
        logAuditAction('SERVICE_STATUS_TOGGLED', 'service', id, `Service active status changed to ${nextState}`);
        return { ...s, is_active: nextState };
      }
      return s;
    }));
  };

  // Listen for real Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const isAdmin = fbUser.email === 'suresh.solanky@gmail.com' || fbUser.email === 'admin@anupfabrication.infinityfree.me';
        setCurrentUser({
          id: fbUser.uid,
          email: fbUser.email || '',
          full_name: fbUser.displayName || 'Customer',
          phone: fbUser.phoneNumber || '9811223344',
          preferred_language: 'en',
          role: isAdmin ? 'admin' : 'customer',
          created_at: new Date().toISOString()
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google sign-in error:', err);
    }
  };

  const signOutUser = async () => {
    try {
      await fbSignOut(auth);
      setCurrentUser(null);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const createEnquiry = async (
    enquiryData: Omit<EnquiryItem, 'id' | 'reference_number' | 'created_at' | 'updated_at' | 'status'>
  ): Promise<EnquiryItem> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const refNo = `AF-${new Date().getFullYear()}-${randomSuffix}`;
    const newEnquiry: EnquiryItem = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      reference_number: refNo,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setEnquiries(prev => [newEnquiry, ...prev]);
    logAuditAction('ENQUIRY_SUBMITTED', 'enquiry', newEnquiry.id, `Customer ${newEnquiry.customer_name} submitted quote request ${refNo}`);

    // Persist to Firestore if online
    try {
      await setDoc(doc(db, 'enquiries', newEnquiry.id), {
        referenceNumber: newEnquiry.reference_number,
        customerId: newEnquiry.customer_id || null,
        customerName: newEnquiry.customer_name,
        phone: newEnquiry.phone,
        email: newEnquiry.email || null,
        serviceCategory: newEnquiry.service_category,
        projectTitle: newEnquiry.project_title,
        projectDescription: newEnquiry.project_description,
        dimensions: newEnquiry.dimensions || null,
        quantity: newEnquiry.quantity || 1,
        location: newEnquiry.location,
        status: newEnquiry.status,
        createdAt: newEnquiry.created_at
      });
    } catch (err) {
      console.warn('Firestore write warning:', err);
    }

    return newEnquiry;
  };

  const updateEnquiryStatus = (id: string, status: EnquiryItem['status'], notes?: string) => {
    setEnquiries(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          status,
          internal_notes: notes !== undefined ? notes : e.internal_notes,
          updated_at: new Date().toISOString()
        };
      }
      return e;
    }));
    logAuditAction('ENQUIRY_STATUS_UPDATED', 'enquiry', id, `Status updated to ${status}`);
  };

  const createQuotation = (quoteData: Omit<QuotationItem, 'id' | 'created_at' | 'updated_at'>): QuotationItem => {
    const newQuote: QuotationItem = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setQuotations(prev => [newQuote, ...prev]);
    logAuditAction('QUOTATION_CREATED', 'quotation', newQuote.id, `Quotation ${newQuote.quotation_number} sent to customer`);
    return newQuote;
  };

  const updateQuotationStatus = (id: string, status: QuotationItem['status']) => {
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, status, updated_at: new Date().toISOString() } : q));
    logAuditAction('QUOTATION_STATUS_UPDATED', 'quotation', id, `Quotation status marked ${status}`);
  };

  const createBooking = (bookingData: Omit<BookingItem, 'id' | 'created_at' | 'updated_at'>): BookingItem => {
    const newBooking: BookingItem = {
      ...bookingData,
      id: `book-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setBookings(prev => [newBooking, ...prev]);
    logAuditAction('BOOKING_REQUESTED', 'booking', newBooking.id, `Booking scheduled for ${newBooking.requested_date}`);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingItem['status'], confirmedDate?: string, notes?: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status,
          confirmed_date: confirmedDate || b.confirmed_date,
          internal_notes: notes !== undefined ? notes : b.internal_notes,
          updated_at: new Date().toISOString()
        };
      }
      return b;
    }));
    logAuditAction('BOOKING_STATUS_UPDATED', 'booking', id, `Booking status set to ${status}`);
  };

  const recordPayment = (paymentData: Omit<PaymentRecord, 'id' | 'created_at'>): PaymentRecord => {
    const newPayment: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      created_at: new Date().toISOString(),
      verified_at: new Date().toISOString()
    };
    setPayments(prev => [newPayment, ...prev]);
    logAuditAction('PAYMENT_VERIFIED', 'payment', newPayment.id, `Payment ${newPayment.reference_no} verified for ₹${newPayment.amount_inr}`);
    return newPayment;
  };

  const switchToRole = (role: 'visitor' | 'customer' | 'admin') => {
    if (role === 'visitor') {
      setCurrentUser(null);
    } else if (role === 'customer') {
      setCurrentUser({
        id: 'cust-demo-1',
        email: 'rajesh.sharma@example.com',
        full_name: 'Rajesh Sharma',
        phone: '9811223344',
        preferred_language: 'en',
        role: 'customer',
        created_at: '2026-10-15T00:00:00Z'
      });
    } else {
      setCurrentUser({
        id: 'admin-1',
        email: 'admin@anupfabrication.infinityfree.me',
        full_name: 'Anup Workshop Master',
        phone: '7217853257',
        preferred_language: 'hi',
        role: 'admin',
        created_at: '2026-10-01T00:00:00Z'
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        businessSettings,
        updateBusinessSettings,
        services,
        addService,
        updateService,
        toggleServiceActive,
        projects,
        enquiries,
        createEnquiry,
        updateEnquiryStatus,
        quotations,
        createQuotation,
        updateQuotationStatus,
        bookings,
        createBooking,
        updateBookingStatus,
        payments,
        recordPayment,
        auditLogs,
        logAuditAction,
        switchToRole,
        signInWithGoogle,
        signOutUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};

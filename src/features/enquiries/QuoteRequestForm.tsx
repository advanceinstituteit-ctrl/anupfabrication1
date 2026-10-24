import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppStore } from '../../lib/store';
import { ServiceCategory } from '../../types';
import { 
  CheckCircle2, 
  Upload, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle,
  Search,
  Sparkles,
  Wrench,
  ChevronDown,
  Layers,
  X
} from 'lucide-react';

interface ProductOption {
  id: string;
  category: ServiceCategory;
  nameEn: string;
  nameHi: string;
  suggestedTitle: string;
  descriptionEn: string;
  descriptionHi: string;
}

const POPULAR_PRODUCTS: ProductOption[] = [
  {
    id: 'prod-gate-slide',
    category: 'gates_grills',
    nameEn: 'Sliding Main Entrance Gate (Motorized / Manual)',
    nameHi: 'स्लाइडिंग मेन गेट (मोटराइज्ड / मैनुअल)',
    suggestedTitle: 'Heavy Duty MS Sliding Main Entrance Gate',
    descriptionEn: 'Custom heavy iron sliding gate with bottom bearing roller track and anti-rust epoxy primer.',
    descriptionHi: 'नीचे हैवी रोलर बेयरिंग ट्रैक और एंटी-रस्ट कोटिंग युक्त स्लाइडिंग मेन गेट।'
  },
  {
    id: 'prod-gate-swing',
    category: 'gates_grills',
    nameEn: 'Wrought Iron Designer Double Swing Gate',
    nameHi: 'रॉट आयरन डिजाइनर डबल स्विंग गेट',
    suggestedTitle: 'Ornamental Wrought Iron Double Swing Gate',
    descriptionEn: 'Double leaf swing gate with decorative forging, spearheads, and heavy pivot hinges.',
    descriptionHi: 'डिजाइनर नक्काशी व मजबूत कब्जों वाला डबल पल्ले का मेन गेट।'
  },
  {
    id: 'prod-railing-ss',
    category: 'gates_grills',
    nameEn: 'Grade 304 Stainless Steel Balcony & Stair Railing',
    nameHi: 'ग्रेड 304 स्टेनलेस स्टील बालकनी व सीढ़ी रेलिंग',
    suggestedTitle: 'SS 304 Balcony & Staircase Railing with Toughened Glass',
    descriptionEn: 'Rust-proof high gloss or satin finished stainless steel railings for residences & offices.',
    descriptionHi: 'जंग-रहित उच्च कोटि की स्टेनलेस स्टील रेलिंग बालकनी एवं सीढ़ियों हेतु।'
  },
  {
    id: 'prod-laser-grill',
    category: 'gates_grills',
    nameEn: 'CNC Laser-Cut Modern Window Grills',
    nameHi: 'सीएनसी लेजर कट मॉडर्न खिड़की ग्रिल',
    suggestedTitle: 'Laser Cut Sheet Metal Security Window Grills',
    descriptionEn: 'Precision laser-cut geometric or floral safety grills in 2.5mm - 4mm MS sheet.',
    descriptionHi: '2.5mm से 4mm शीट में कंप्यूटर लेजर कटिंग युक्त आकर्षक सुरक्षा ग्रिल।'
  },
  {
    id: 'prod-shed-warehouse',
    category: 'structural_steel',
    nameEn: 'Industrial Factory / Warehouse Shed',
    nameHi: 'इंडस्ट्रियल फैक्ट्री / वेयरहाउस शेड',
    suggestedTitle: 'Tubular Roof Truss & Structural Steel Warehouse Shed',
    descriptionEn: 'Large span tubular or I-beam roof trusses with color-coated GI profile roofing.',
    descriptionHi: 'बड़े स्पैन वाले पाइप व आई-बीम ट्रस शेड रंगीन प्रोफाइल शीट छत के साथ।'
  },
  {
    id: 'prod-peb-frame',
    category: 'structural_steel',
    nameEn: 'PEB Columns, Heavy I-Beams & Trusses',
    nameHi: 'PEB कॉलम, हैवी आई-बीम व ट्रस स्ट्रक्चर',
    suggestedTitle: 'Heavy Structural Steel PEB Columns and Wind Bracing',
    descriptionEn: 'Heavy duty load-bearing structural fabrication for industrial premises.',
    descriptionHi: 'फैक्ट्री व गोदाम हेतु वजन वहन क्षमता युक्त हैवी स्ट्रक्चरल कॉलम व बीम।'
  },
  {
    id: 'prod-mezzanine',
    category: 'frames_trusses',
    nameEn: 'Industrial Mezzanine Floor & Storage Platform',
    nameHi: 'इंडस्ट्रियल मेजेनाइन फ्लोर व स्टोरेज प्लेटफॉर्म',
    suggestedTitle: 'Heavy Duty Warehouse Storage Mezzanine Floor Structure',
    descriptionEn: 'Modular high load-bearing mezzanine floor with safety handrails and steel staircase.',
    descriptionHi: 'वेयरहाउस में अतिरिक्त जगह हेतु मजबूत लोहे का मेजेनाइन फ्लोर व रेलिंग।'
  },
  {
    id: 'prod-staircase',
    category: 'frames_trusses',
    nameEn: 'Metal Spiral & Stringer Staircase',
    nameHi: 'लोहे की सीढ़ियां एवं स्पाइरल स्टेप्स',
    suggestedTitle: 'Heavy MS Channel Stringer Staircase with Checker Plate Steps',
    descriptionEn: 'Industrial and commercial fire escape and internal access staircases.',
    descriptionHi: 'चेकर्ड प्लेट स्टेप्स युक्त इंडस्ट्रियल व रेजिडेंशियल लोहे की सीढ़ियां।'
  },
  {
    id: 'prod-welding-job',
    category: 'welding_joining',
    nameEn: 'Precision MIG / TIG Welding Job Work',
    nameHi: 'प्रिसिजन मिग / टिग वेल्डिंग जॉब वर्क',
    suggestedTitle: 'On-Site / Workshop High-Strength Welding & Metal Joining',
    descriptionEn: 'Clean uniform penetration welding for carbon steel, stainless steel, and GI.',
    descriptionHi: 'कार्बन स्टील, एसएस और जीआई हेतु कुशल मिग व टिग वेल्डिंग सेवाएं।'
  },
  {
    id: 'prod-repair-site',
    category: 'repair_modification',
    nameEn: 'On-Site Repair & Structure Reinforcement',
    nameHi: 'साइट पर रिपेयर एवं स्ट्रक्चर मजबूती कार्य',
    suggestedTitle: 'On-Site Structural Repair, Rust Cutting & Beam Strengthening',
    descriptionEn: 'Emergency structural welding, rusted section replacement, and hinge realignment.',
    descriptionHi: 'आपातकालीन वेल्डिंग, जंग लगे हिस्से हटाकर नई प्लेटिंग व स्ट्रक्चर मजबूती।'
  }
];

interface QuoteRequestFormProps {
  onSuccess?: (refNo: string) => void;
  preselectedCategory?: ServiceCategory;
}

export const QuoteRequestForm: React.FC<QuoteRequestFormProps> = ({ onSuccess, preselectedCategory }) => {
  const { t, language } = useLanguage();
  const { createEnquiry, currentUser, services } = useAppStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Search & Custom states
  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Form states
  const [customerName, setCustomerName] = useState(currentUser?.full_name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>(preselectedCategory || 'gates_grills');
  const [projectTitle, setProjectTitle] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [budgetRange, setBudgetRange] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [location, setLocation] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'whatsapp' | 'email'>('phone');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFormError('File size must be under 10MB.');
        return;
      }
      setFileName(file.name);
      setFormError(null);
    }
  };

  const handleNextStep1 = () => {
    if (!projectTitle.trim()) {
      setFormError('Please enter a brief project title.');
      return;
    }
    setFormError(null);
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!projectDescription.trim()) {
      setFormError('Please provide a short description of the fabrication work.');
      return;
    }
    setFormError(null);
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !location.trim()) {
      setFormError('Please fill in your name, contact phone, and site location.');
      return;
    }

    if (phone.trim().length < 10) {
      setFormError('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const newEnquiry = await createEnquiry({
        customer_id: currentUser?.id,
        customer_name: customerName,
        phone: phone,
        email: email || `${phone}@placeholder.anupfabrication.in`,
        service_category: serviceCategory,
        project_title: projectTitle,
        project_description: projectDescription,
        dimensions: dimensions || undefined,
        quantity: Number(quantity) || 1,
        budget_range: budgetRange || undefined,
        preferred_date: preferredDate || undefined,
        location: location,
        preferred_language: language,
        preferred_contact: preferredContact,
        files: fileName ? [{
          id: `f-${Date.now()}`,
          enquiry_id: '',
          storage_path: `enquiry-files/${fileName}`,
          original_filename: fileName,
          content_type: 'application/pdf',
          file_size: 102400,
          created_at: new Date().toISOString()
        }] : undefined
      });

      setSubmittedRef(newEnquiry.reference_number);
      if (onSuccess) {
        onSuccess(newEnquiry.reference_number);
      }
    } catch (err: any) {
      setFormError('Failed to submit enquiry. Please check your network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedRef) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl">
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{t('quote_success_title')}</h3>
        <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">
          {t('quote_success_msg')}
        </p>

        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 inline-block mb-8">
          <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">{t('quote_success_ref')}</div>
          <div className="text-2xl font-mono font-bold text-amber-400">{submittedRef}</div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              setSubmittedRef(null);
              setStep(1);
              setProjectTitle('');
              setProjectDescription('');
              setDimensions('');
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors cursor-pointer"
          >
            Submit Another Requirement
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
      {/* Step Indicators */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
          <span className={`px-2.5 py-1 rounded ${step === 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
            {t('step_1')}
          </span>
          <span className="text-slate-600">→</span>
          <span className={`px-2.5 py-1 rounded ${step === 2 ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
            {t('step_2')}
          </span>
          <span className="text-slate-600">→</span>
          <span className={`px-2.5 py-1 rounded ${step === 3 ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
            {t('step_3')}
          </span>
        </div>
        <span className="text-xs font-mono text-slate-500">Step {step} of 3</span>
      </div>

      <div className="p-6 sm:p-8">
        {formError && (
          <div className="mb-6 p-3.5 bg-red-950/40 border border-red-800/60 rounded-lg text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* STEP 1: Search, Dropdown & Custom Product Selector */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Top Toolbar: Search Bar + Custom Product Button */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>{language === 'hi' ? 'उत्पाद / सेवा का चयन करें' : 'Select Product or Service'} *</span>
                </label>

                {/* Custom Product Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomMode(true);
                    setSelectedProductId('custom');
                    setServiceCategory('custom_metal');
                    setProjectTitle('');
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                    isCustomMode
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                      : 'bg-slate-950 border-amber-500/50 hover:bg-amber-500/10 text-amber-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? '✨ आवश्यकता अनुसार कस्टम उत्पाद' : '✨ Custom Requirement / Other'}</span>
                </button>
              </div>

              {/* Quick Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (isCustomMode && e.target.value) {
                      setIsCustomMode(false);
                    }
                  }}
                  placeholder={language === 'hi' 
                    ? 'उत्पाद खोजें (जैसे: गेट, शेड, रेलिंग, सीढ़ी, ग्रिल, मेजेनाइन)...' 
                    : 'Search fabrication products (e.g., Gate, Shed, Railing, Staircase, Grill, Mezzanine)...'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Dropdown Menu (Select Pick List) */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  {language === 'hi' ? 'या ड्रॉपडाउन मेनू से चुनें:' : 'Or Select From Dropdown Menu:'}
                </label>
                <div className="relative">
                  <select
                    value={isCustomMode ? 'custom' : selectedProductId}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'custom') {
                        setIsCustomMode(true);
                        setSelectedProductId('custom');
                        setServiceCategory('custom_metal');
                        setProjectTitle('');
                      } else {
                        const found = POPULAR_PRODUCTS.find(p => p.id === val);
                        if (found) {
                          setIsCustomMode(false);
                          setSelectedProductId(found.id);
                          setServiceCategory(found.category);
                          setProjectTitle(found.suggestedTitle);
                        }
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 appearance-none font-medium cursor-pointer"
                  >
                    <option value="" disabled>-- {language === 'hi' ? 'उत्पाद चुनें' : 'Choose a Fabrication Product'} --</option>
                    
                    <optgroup label="Gates, Grills & Railings (गेट एवं रेलिंग)">
                      <option value="prod-gate-slide">Sliding Main Entrance Gate (स्लाइडिंग मेन गेट)</option>
                      <option value="prod-gate-swing">Wrought Iron Designer Swing Gate (रॉट आयरन स्विंग गेट)</option>
                      <option value="prod-railing-ss">Grade 304 Stainless Steel Railing (एसएस 304 रेलिंग)</option>
                      <option value="prod-laser-grill">CNC Laser-Cut Modern Window Grills (लेजर कट खिड़की ग्रिल)</option>
                    </optgroup>

                    <optgroup label="Structural Steel & Sheds (स्ट्रक्चरल शेड एवं कॉलम)">
                      <option value="prod-shed-warehouse">Industrial Factory / Warehouse Shed (फैक्ट्री शेड)</option>
                      <option value="prod-peb-frame">PEB Columns, Heavy I-Beams & Trusses (PEB स्ट्रक्चर)</option>
                    </optgroup>

                    <optgroup label="Frames, Mezzanines & Staircases (मेजेनाइन व सीढ़ियां)">
                      <option value="prod-mezzanine">Industrial Mezzanine Floor & Platform (मेजेनाइन फ्लोर)</option>
                      <option value="prod-staircase">Metal Spiral & Stringer Staircase (लोहे की सीढ़ियां)</option>
                    </optgroup>

                    <optgroup label="Welding & Site Repair (वेल्डिंग व रिपेयर)">
                      <option value="prod-welding-job">Precision MIG / TIG Welding Job Work (मिग/टिग वेल्डिंग)</option>
                      <option value="prod-repair-site">On-Site Repair & Structure Reinforcement (साइट रिपेयर कार्य)</option>
                    </optgroup>

                    <optgroup label="Custom Engineering (कस्टम)">
                      <option value="custom">✨ {language === 'hi' ? 'अपनी आवश्यकता अनुसार कस्टम उत्पाद' : 'Custom Product / Fabricate from Drawing'}</option>
                    </optgroup>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Custom Mode Active Box */}
            {isCustomMode ? (
              <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{language === 'hi' ? 'कस्टम फैब्रिकेशन मोड सक्रिय है' : 'Custom Fabrication Mode Selected'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'hi' 
                    ? 'नीचे अपने प्रोजेक्ट का नाम या विवरण लिखें। अगले स्टेप में आप आर्किटेक्ट ड्राइंग, ब्लू-प्रिंट या फोटो भी अपलोड कर सकते हैं।' 
                    : 'Enter your custom fabrication requirement below. In the next steps, you can specify exact dimensions, material preferences (MS, SS, GI), and upload architectural blueprints or reference drawings.'}
                </p>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-200 mb-1.5">
                    {language === 'hi' ? 'कस्टम प्रोजेक्ट का नाम / शीर्षक' : 'Custom Project Title / Requirement'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. विशेष आकार का बालकनी शेड, मशीन सपोर्ट फ्रेम या शोरूम डिस्प्ले' : 'e.g. Custom curved cantilever roof, machine base skid frame, or showroom structure'}
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            ) : (
              /* Product Search Results Cards */
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>
                    {searchQuery 
                      ? `${POPULAR_PRODUCTS.filter(p => p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || p.nameHi.toLowerCase().includes(searchQuery.toLowerCase())).length} ${language === 'hi' ? 'उत्पाद मिले' : 'products found'}`
                      : (language === 'hi' ? 'लोकप्रिय फैब्रिकेशन उत्पाद' : 'Popular Fabrication Products')}
                  </span>
                  <span>{language === 'hi' ? 'क्लिक करके चुनें' : 'Click to select'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {POPULAR_PRODUCTS
                    .filter(p => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return p.nameEn.toLowerCase().includes(q) || 
                             p.nameHi.toLowerCase().includes(q) ||
                             p.suggestedTitle.toLowerCase().includes(q) ||
                             p.descriptionEn.toLowerCase().includes(q);
                    })
                    .map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => {
                          setSelectedProductId(prod.id);
                          setIsCustomMode(false);
                          setServiceCategory(prod.category);
                          setProjectTitle(prod.suggestedTitle);
                        }}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          selectedProductId === prod.id
                            ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm shadow-amber-500/20'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs sm:text-sm font-bold text-slate-100 flex items-center justify-between">
                          <span>{language === 'hi' ? prod.nameHi : prod.nameEn}</span>
                          {selectedProductId === prod.id && (
                            <span className="text-amber-400 font-bold text-xs">✓</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {language === 'hi' ? prod.descriptionHi : prod.descriptionEn}
                        </div>
                      </button>
                    ))}
                </div>

                {/* Project Title Input for chosen standard item */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    {t('field_project_title')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. 14ft Main Entrance Gate with Laser-cut pattern, or Industrial Factory Shed"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end border-t border-slate-800">
              <button
                type="button"
                onClick={handleNextStep1}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <span>Continue to Dimensions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Dimensions & Description */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t('field_dimensions')}
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. 14ft width x 7ft height"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t('field_quantity')}
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                {t('field_description')} *
              </label>
              <textarea
                rows={4}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Mention material preference (Mild Steel, Stainless Steel 304, GI sheet, etc.), design details, or specific site constraints..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                {t('field_upload')}
              </label>
              <div className="border-2 border-dashed border-slate-800 rounded-lg p-6 text-center hover:border-slate-700 transition-colors">
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <label className="text-xs text-amber-400 font-semibold cursor-pointer hover:underline block mb-1">
                  Click to select architectural drawing or site photo
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.dwg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-slate-500">Supports PDF, DWG, PNG, JPG (Max 10MB)</span>
                {fileName && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-amber-300 text-xs font-mono">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{fileName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep2}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Site & Contact</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Contact & Location */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t('field_name')} *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t('field_phone')} (10-Digit Mobile) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9811223344"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t('field_email')} (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t('field_date')}
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                {t('field_address')} (Delhi NCR Site Address) *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Plot 14, Nangli Industrial Area, Najafgarh, or Sector 12 Dwarka"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t('field_budget')}
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">Flexible / Based on measurement</option>
                  <option value="Under ₹25,000">Under ₹25,000</option>
                  <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                  <option value="₹1,00,000 - ₹5,00,000">₹1,00,000 - ₹5,00,000</option>
                  <option value="Above ₹5,00,000 (Commercial/Industrial)">Above ₹5,00,000 (Commercial/Industrial)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  {t('field_contact_pref')}
                </label>
                <div className="flex gap-2">
                  {(['phone', 'whatsapp', 'email'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPreferredContact(mode)}
                      className={`flex-1 py-2 rounded border text-xs font-medium capitalize transition-colors cursor-pointer ${
                        preferredContact === mode
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                {submitting ? (
                  <span>Submitting Enquiry...</span>
                ) : (
                  <>
                    <span>{t('btn_submit_quote')}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

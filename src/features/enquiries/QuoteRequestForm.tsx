import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppStore } from '../../lib/store';
import { ServiceCategory } from '../../types';
import { CheckCircle2, Upload, FileText, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

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

        {/* STEP 1: Service Category & Title */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                {t('field_service')} *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setServiceCategory(srv.category)}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                      serviceCategory === srv.category
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-100">
                      {language === 'hi' ? srv.name_hi : srv.name_en}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {language === 'hi' ? srv.description_hi : srv.description_en}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                {t('field_project_title')} *
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. 14ft Main Entrance Gate with Laser-cut pattern, or Industrial Factory Shed"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep1}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
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

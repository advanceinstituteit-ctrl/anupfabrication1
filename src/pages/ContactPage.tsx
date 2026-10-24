import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppStore } from '../lib/store';
import { Phone, MapPin, Mail, Send, CheckCircle2, Navigation, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const { businessSettings, createEnquiry } = useAppStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    setSubmitting(true);
    try {
      await createEnquiry({
        customer_name: name,
        phone: phone,
        email: `${phone}@contact.anupfabrication.in`,
        service_category: 'custom_metal',
        project_title: 'Direct Website Inquiry',
        project_description: message,
        quantity: 1,
        location: 'Delhi NCR',
        preferred_language: 'en',
        preferred_contact: 'phone'
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('31/1 Nangli Sakrawati, Najafgarh, New Delhi 110043')}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
          WORKSHOP LOCATION & INQUIRIES
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('contact_title')}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          {t('contact_subtitle')} We welcome prospective clients and contractors to our workshop to review ongoing structural work and steel material samples.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Workshop Address Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {t('contact_address_label')}
                </h3>
                <p className="text-sm font-semibold text-white mt-1 leading-snug">
                  {businessSettings.address}
                </p>
              </div>
            </div>

            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-700 hover:border-amber-500 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer w-full justify-center"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('btn_get_directions')}</span>
            </a>
          </div>

          {/* Calling Lines */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {t('contact_phones_label')}
                </h3>
                <span className="text-xs text-slate-400">Direct Workshop Desk</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={`tel:${businessSettings.phones[0]}`}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-lg text-center transition-colors group cursor-pointer"
              >
                <div className="text-[10px] text-slate-500 uppercase font-mono">{t('btn_call_now')}</div>
                <div className="text-sm font-bold text-white group-hover:text-amber-400 font-mono">
                  +91 {businessSettings.phones[0]}
                </div>
              </a>

              <a
                href={`tel:${businessSettings.phones[1]}`}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-lg text-center transition-colors group cursor-pointer"
              >
                <div className="text-[10px] text-slate-500 uppercase font-mono">{t('btn_call_alt')}</div>
                <div className="text-sm font-bold text-white group-hover:text-amber-400 font-mono">
                  +91 {businessSettings.phones[1]}
                </div>
              </a>
            </div>
          </div>

          {/* Service Area */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              {t('contact_area_label')}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('contact_area_val')}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {businessSettings.service_areas.map((area, i) => (
                <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Send Message Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
          <div className="border-b border-slate-800 pb-4 mb-6">
            <h2 className="text-lg font-bold text-white">{t('contact_send_msg')}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Leave your inquiry or request a call back from our workshop master.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-8 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Inquiry Received</h3>
              <p className="text-xs text-emerald-200 max-w-md mx-auto">
                {t('contact_msg_sent')}
              </p>
              <button
                onClick={() => { setSubmitted(false); setMessage(''); }}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-mono text-[10px] text-slate-400 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Subhash Chand"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[10px] text-slate-400 mb-1">Mobile Phone (10-Digit) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 9811223344"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[10px] text-slate-400 mb-1">Inquiry / Fabrication Requirement *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us about the project, dimensions, or questions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending...' : 'Transmit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

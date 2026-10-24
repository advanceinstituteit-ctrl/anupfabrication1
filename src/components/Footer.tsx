import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppStore } from '../lib/store';
import { Phone, MapPin, Mail, ArrowUpRight, ShieldCheck, Clock, Server } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
  openDeployModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView, openDeployModal }) => {
  const { t } = useLanguage();
  const { businessSettings } = useAppStore();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Business Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm">
                AF
              </div>
              <span className="text-lg font-bold text-white">{t('brand')}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Industrial structural steel fabrication, custom boundary gates, window grills, designer railings, and heavy machinery support framing in Delhi NCR.
            </p>
            <div className="pt-2 flex flex-col gap-1.5">
              <div className="text-xs font-mono text-slate-400">
                Domain: <span className="text-amber-400">anupfabrication.kesug.com</span>
              </div>
              {openDeployModal && (
                <button
                  onClick={openDeployModal}
                  className="text-left text-xs text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1.5 cursor-pointer font-semibold"
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>InfinityFree Deploy Kit (403 Fix)</span>
                </button>
              )}
            </div>
          </div>

          {/* Col 2: Services Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Fabrication Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('services')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Gates, Grills & Railings
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('services')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Structural Steel & Industrial Sheds
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('services')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Custom Metal Fabrication from Drawings
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('services')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Welding & High-Strength Metal Joining
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('services')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Industrial Frames & Mezzanines
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('services')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Repair & Site Modification
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Workshop Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Najafgarh Workshop</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-slate-300">{businessSettings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${businessSettings.primary_phone}`} className="text-slate-300 hover:text-amber-400 font-mono">
                  +91 {businessSettings.phones[0]}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${businessSettings.phones[1]}`} className="text-slate-300 hover:text-amber-400 font-mono">
                  +91 {businessSettings.phones[1]}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-slate-300 font-mono">{businessSettings.email}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Verified Policies & Action */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Customer Assurance</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Transparent Itemized Quotations</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Physical Site Measurement in Delhi NCR</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Secure Razorpay Advance Payment</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => setCurrentView('quote')}
                className="w-full py-2 px-3 text-xs font-bold text-center bg-slate-900 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800 text-slate-200 hover:text-amber-400 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Request Project Estimate</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Anup Fabrication. 31/1 Nangli Sakrawati, Najafgarh, New Delhi 110043. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('contact')} className="hover:text-slate-400 cursor-pointer">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => setCurrentView('contact')} className="hover:text-slate-400 cursor-pointer">
              Terms & Conditions
            </button>
            <span>·</span>
            <span className="font-mono text-slate-500">Bilingual: EN / HI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

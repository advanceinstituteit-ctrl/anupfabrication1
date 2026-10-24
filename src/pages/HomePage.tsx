import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppStore } from '../lib/store';
import { IndustrialVisual } from '../components/IndustrialVisuals';
import { ServiceCategory } from '../types';
import { 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  Hammer, 
  Truck, 
  Phone, 
  MapPin, 
  Check, 
  FileCheck
} from 'lucide-react';

interface HomePageProps {
  setCurrentView: (view: string) => void;
  onSelectServiceForQuote?: (cat: ServiceCategory) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentView, onSelectServiceForQuote }) => {
  const { t, language } = useLanguage();
  const { services, projects, businessSettings } = useAppStore();

  const handleServiceQuoteClick = (cat: ServiceCategory) => {
    if (onSelectServiceForQuote) {
      onSelectServiceForQuote(cat);
    } else {
      setCurrentView('quote');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Proposition & CTAs */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>Najafgarh, New Delhi</span>
                <span aria-hidden="true">·</span>
                <span>Industrial & Architectural Metal Works</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
                {t('hero_title')}
              </h1>

              <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                {t('hero_subtitle')}
              </p>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentView('quote')}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <span>{t('hero_cta_quote')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentView('services')}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  {t('hero_cta_services')}
                </button>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Physical Site Inspection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Transparent Itemized Quotation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Secure Razorpay Payments</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-5 h-full min-h-[340px]">
              <IndustrialVisual type="hero" className="w-full h-full min-h-[340px]" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & CAPABILITY STRIP (FULL WIDTH BELOW HERO) */}
      <section className="bg-slate-900/60 border-y border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">31/1 Nangli Sakrawati</div>
              <div className="text-xs text-slate-400 mt-1">Najafgarh Workshop Location</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">100% Custom</div>
              <div className="text-xs text-slate-400 mt-1">Fabricated from Client Drawings</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">Tested High Grade</div>
              <div className="text-xs text-slate-400 mt-1">Jindal / Tata MS & SS 304</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">Delhi NCR</div>
              <div className="text-xs text-slate-400 mt-1">Residential & Industrial Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-1">
              ENGINEERED METAL SOLUTIONS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {t('services_heading')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-2 leading-relaxed">
              {t('services_subheading')}
            </p>
          </div>
          <button
            onClick={() => setCurrentView('services')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start md:self-auto cursor-pointer"
          >
            <span>View Full Service Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service, idx) => (
            <div
              key={service.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>0{idx + 1}.</span>
                  <span>Lead Time: {service.estimated_lead_time}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {language === 'hi' ? service.name_hi : service.name_en}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {language === 'hi' ? service.description_hi : service.description_en}
                  </p>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  {(language === 'hi' ? service.features_hi : service.features_en).slice(0, 3).map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {t('service_starting_from')}: <span className="font-mono text-white font-bold">₹{service.starting_price}</span>
                </span>
                <button
                  onClick={() => handleServiceQuoteClick(service.category)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-semibold rounded transition-colors cursor-pointer"
                >
                  Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW THE PROCESS WORKS */}
      <section className="bg-slate-900/40 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              TRANSPARENT WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              From Drawing to On-Site Erection
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Clear stages with written specifications, verified quotations, and advance milestone tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-white">Consultation & Drawing</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Submit dimensions, requirements, or CAD blueprints. Physical site measurement scheduled across Delhi NCR.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-white">Itemized Quotation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive an itemized quote with steel grades, thicknesses, labor, and applicable GST. No hidden costs.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-white">Precision Workshop Fabrication</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fabrication at our Najafgarh workshop with certified MIG/TIG welding, anti-rust primer, and tolerance checks.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold">
                04
              </div>
              <h3 className="text-base font-bold text-white">Delivery & Site Erection</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Transportation to site, anchor bolting, alignment, and client sign-off with warranty documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PROJECTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
              PORTFOLIO
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Fabricated Installations in Delhi NCR</h2>
          </div>
          <button
            onClick={() => setCurrentView('projects')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <span>All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map(proj => (
            <div key={proj.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group">
              <div className="h-44 bg-slate-950 flex items-center justify-center">
                <IndustrialVisual 
                  type={proj.category === 'structural_steel' ? 'shed' : proj.category === 'gates_grills' ? 'gates' : 'structural'} 
                  className="w-full h-full"
                />
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{proj.location}</span>
                  <span>{proj.completed_year}</span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  {language === 'hi' ? proj.title_hi : proj.title_en}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'hi' ? proj.description_hi : proj.description_en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION & DIRECT CONTACT STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              GET IN TOUCH DIRECTLY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Have a fabrication drawing or requirement?</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Visit our workshop at 31/1 Nangli Sakrawati, Najafgarh or submit dimensions online for an engineering review.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-300">
              <a href={`tel:${businessSettings.primary_phone}`} className="flex items-center gap-1.5 hover:text-amber-400">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+91 {businessSettings.phones[0]}</span>
              </a>
              <span>·</span>
              <a href={`tel:${businessSettings.phones[1]}`} className="flex items-center gap-1.5 hover:text-amber-400">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+91 {businessSettings.phones[1]}</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setCurrentView('quote')}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <span>{t('hero_cta_quote')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-colors cursor-pointer text-center"
            >
              <span>{t('nav_contact')}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppStore } from '../lib/store';
import { ServiceCategory } from '../types';
import { IndustrialVisual } from '../components/IndustrialVisuals';
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, Tag } from 'lucide-react';

interface ServicesPageProps {
  onSelectServiceForQuote: (cat: ServiceCategory) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onSelectServiceForQuote }) => {
  const { t, language } = useLanguage();
  const { services } = useAppStore();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredServices = services.filter(s => {
    if (selectedFilter === 'all') return true;
    return s.category === selectedFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
          ANUP FABRICATION CAPABILITIES
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('services_heading')}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          {t('services_subheading')} All fabrication work is executed at our 31/1 Nangli Sakrawati workshop using high-tensile steel and certified welding processes.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
            selectedFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Services ({services.length})
        </button>
        <button
          onClick={() => setSelectedFilter('gates_grills')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
            selectedFilter === 'gates_grills' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Gates, Grills & Railings
        </button>
        <button
          onClick={() => setSelectedFilter('structural_steel')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
            selectedFilter === 'structural_steel' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Structural Steel & Sheds
        </button>
        <button
          onClick={() => setSelectedFilter('custom_metal')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
            selectedFilter === 'custom_metal' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Custom from Drawings
        </button>
        <button
          onClick={() => setSelectedFilter('welding_joining')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
            selectedFilter === 'welding_joining' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Welding & Joining
        </button>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredServices.map((srv, idx) => (
          <div
            key={srv.id}
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="h-48 bg-slate-950">
                <IndustrialVisual 
                  type={srv.category === 'structural_steel' ? 'shed' : srv.category === 'gates_grills' ? 'gates' : 'welding'} 
                  className="w-full h-full"
                />
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>CATEGORY: {srv.category.toUpperCase().replace('_', ' ')}</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{srv.estimated_lead_time}</span>
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white">
                  {language === 'hi' ? srv.name_hi : srv.name_en}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {language === 'hi' ? srv.description_hi : srv.description_en}
                </p>

                <div className="pt-2">
                  <span className="text-[11px] font-mono uppercase text-slate-500 block mb-2 font-bold">Key Specifications:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {(language === 'hi' ? srv.features_hi : srv.features_en).map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Baseline Pricing</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  From ₹{srv.starting_price} <span className="text-xs text-slate-400 font-normal">/ unit or sq.ft</span>
                </span>
              </div>

              <button
                onClick={() => onSelectServiceForQuote(srv.category)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-amber-500/20"
              >
                <span>Request Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppStore } from '../lib/store';
import { IndustrialVisual } from '../components/IndustrialVisuals';
import { MapPin, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

interface ProjectsPageProps {
  onOpenQuote: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenQuote }) => {
  const { language } = useLanguage();
  const { projects } = useAppStore();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredProjects = projects.filter(p => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
          VERIFIED PROJECT RECORD
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Executed Fabrication Work
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Completed industrial structural framing, residential gates, and custom fabrication installations across Najafgarh, Dwarka, Gurgaon, and West Delhi.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
            filterCategory === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Projects ({projects.length})
        </button>
        <button
          onClick={() => setFilterCategory('structural_steel')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
            filterCategory === 'structural_steel' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Structural Steel & Sheds
        </button>
        <button
          onClick={() => setFilterCategory('gates_grills')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
            filterCategory === 'gates_grills' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Gates & Railings
        </button>
        <button
          onClick={() => setFilterCategory('frames_trusses')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
            filterCategory === 'frames_trusses' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Frames & Mezzanines
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(proj => (
          <div key={proj.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/40 transition-colors flex flex-col justify-between">
            <div>
              <div className="h-48 bg-slate-950">
                <IndustrialVisual 
                  type={proj.category === 'structural_steel' ? 'shed' : proj.category === 'gates_grills' ? 'gates' : 'structural'} 
                  className="w-full h-full"
                />
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-amber-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{proj.location}</span>
                  </span>
                  <span>{proj.completed_year}</span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {language === 'hi' ? proj.title_hi : proj.title_en}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'hi' ? proj.description_hi : proj.description_en}
                </p>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Site Delivery</span>
              </span>
              <button
                onClick={onOpenQuote}
                className="text-amber-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Request Similar</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

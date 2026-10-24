import React from 'react';

interface VisualProps {
  type: 'hero' | 'gates' | 'structural' | 'custom' | 'welding' | 'frames' | 'repair' | 'shed';
  className?: string;
  title?: string;
}

export const IndustrialVisual: React.FC<VisualProps> = ({ type, className = '', title }) => {
  switch (type) {
    case 'hero':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-xl ${className}`}>
          {/* Blueprint Engineering Grid */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-hero" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2,2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-hero)" />
          </svg>

          {/* Heavy Steel Beam & Arc Welding Art */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <svg viewBox="0 0 800 450" className="w-full h-full max-h-[380px] drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Warehouse Roof Truss Structure */}
              <path d="M 100 320 L 400 80 L 700 320 Z" stroke="#334155" strokeWidth="6" />
              <path d="M 100 320 L 700 320" stroke="#475569" strokeWidth="8" />
              <line x1="250" y1="200" x2="250" y2="320" stroke="#334155" strokeWidth="4" />
              <line x1="400" y1="80" x2="400" y2="320" stroke="#0ea5e9" strokeWidth="5" />
              <line x1="550" y1="200" x2="550" y2="320" stroke="#334155" strokeWidth="4" />
              <line x1="100" y1="320" x2="400" y2="200" stroke="#1e293b" strokeWidth="3" />
              <line x1="700" y1="320" x2="400" y2="200" stroke="#1e293b" strokeWidth="3" />

              {/* Heavy I-Beam in Foreground */}
              <g transform="translate(180, 260)">
                <rect x="0" y="0" width="440" height="16" fill="#64748b" />
                <rect x="200" y="16" width="40" height="70" fill="#475569" />
                <rect x="0" y="86" width="440" height="16" fill="#64748b" />
                {/* Structural Bolt Holes */}
                <circle cx="40" cy="8" r="4" fill="#0f172a" />
                <circle cx="80" cy="8" r="4" fill="#0f172a" />
                <circle cx="360" cy="8" r="4" fill="#0f172a" />
                <circle cx="400" cy="8" r="4" fill="#0f172a" />
              </g>

              {/* Precision Welding Torch & Radiant Arc Glow */}
              <g transform="translate(390, 240)">
                <circle cx="10" cy="20" r="45" fill="url(#arc-glow)" opacity="0.8" />
                <circle cx="10" cy="20" r="16" fill="#ffffff" />
                <circle cx="10" cy="20" r="6" fill="#fef08a" />
                {/* Sparks radiating */}
                <line x1="10" y1="20" x2="-25" y2="-15" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="10" y1="20" x2="45" y2="-20" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                <line x1="10" y1="20" x2="-35" y2="35" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="10" y1="20" x2="35" y2="45" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <line x1="10" y1="20" x2="5" y2="-30" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
                {/* Torch Nozzle */}
                <path d="M 60 -10 L 25 10 L 15 15" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
                <path d="M 90 -30 L 60 -10" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
              </g>

              <defs>
                <radialGradient id="arc-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
                  <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#ea580c" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-800">
            <span className="font-mono text-amber-400 tracking-wider">ANUP FABRICATION WORKSHOP</span>
            <span>Najafgarh, New Delhi · Structural Steel & Heavy Metal Works</span>
          </div>
        </div>
      );

    case 'gates':
      return (
        <div className={`relative overflow-hidden bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center p-6 ${className}`}>
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Gate Pillars */}
            <rect x="30" y="40" width="30" height="240" fill="#334155" rx="2" />
            <rect x="340" y="40" width="30" height="240" fill="#334155" rx="2" />
            {/* Gate Outer Frame */}
            <rect x="70" y="70" width="260" height="200" stroke="#64748b" strokeWidth="6" rx="3" fill="#0f172a" fillOpacity="0.6" />
            {/* Geometric Modern Grill Patterns */}
            <line x1="200" y1="70" x2="200" y2="270" stroke="#64748b" strokeWidth="4" />
            {/* Decorative vertical bars */}
            {[100, 130, 160, 240, 270, 300].map((x) => (
              <line key={x} x1={x} y1="70" x2={x} y2="270" stroke="#475569" strokeWidth="2.5" />
            ))}
            {/* Center diamond ornament */}
            <path d="M 135 170 L 200 110 L 265 170 L 200 230 Z" stroke="#f59e0b" strokeWidth="3" fill="none" />
            <circle cx="200" cy="170" r="10" fill="#f59e0b" fillOpacity="0.4" stroke="#f59e0b" strokeWidth="2" />
            {/* Spearhead Top Finials */}
            {[100, 130, 160, 200, 240, 270, 300].map((x) => (
              <path key={x} d={`M ${x-6} 70 L ${x} 50 L ${x+6} 70 Z`} fill="#f59e0b" />
            ))}
            {/* Bottom ground track */}
            <line x1="20" y1="280" x2="380" y2="280" stroke="#1e293b" strokeWidth="6" />
          </svg>
          {title && <span className="absolute bottom-2 left-3 text-[11px] font-mono text-slate-400">{title}</span>}
        </div>
      );

    case 'structural':
    case 'shed':
      return (
        <div className={`relative overflow-hidden bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center p-6 ${className}`}>
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Warehouse Truss System */}
            <path d="M 40 220 L 200 60 L 360 220 Z" stroke="#0ea5e9" strokeWidth="4" fill="#0f172a" fillOpacity="0.5" />
            <line x1="40" y1="220" x2="360" y2="220" stroke="#38bdf8" strokeWidth="5" />
            <line x1="200" y1="60" x2="200" y2="220" stroke="#0ea5e9" strokeWidth="3" />
            <line x1="120" y1="140" x2="120" y2="220" stroke="#334155" strokeWidth="2" />
            <line x1="280" y1="140" x2="280" y2="220" stroke="#334155" strokeWidth="2" />
            <line x1="40" y1="220" x2="200" y2="140" stroke="#475569" strokeWidth="2" />
            <line x1="360" y1="220" x2="200" y2="140" stroke="#475569" strokeWidth="2" />
            {/* Columns */}
            <rect x="35" y="220" width="15" height="70" fill="#64748b" />
            <rect x="350" y="220" width="15" height="70" fill="#64748b" />
            <line x1="20" y1="290" x2="380" y2="290" stroke="#1e293b" strokeWidth="4" />
          </svg>
          {title && <span className="absolute bottom-2 left-3 text-[11px] font-mono text-slate-400">{title}</span>}
        </div>
      );

    case 'welding':
    default:
      return (
        <div className={`relative overflow-hidden bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center p-6 ${className}`}>
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 160 L 200 160" stroke="#64748b" strokeWidth="18" strokeLinecap="square" />
            <path d="M 200 160 L 350 160" stroke="#64748b" strokeWidth="18" strokeLinecap="square" />
            {/* Weld Bead Pattern */}
            <path d="M 190 148 Q 200 160 190 172 Q 202 160 198 148 Q 206 160 202 172" stroke="#f59e0b" strokeWidth="4" />
            <circle cx="200" cy="160" r="28" fill="#f59e0b" fillOpacity="0.25" />
            <circle cx="200" cy="160" r="10" fill="#ffffff" />
            <line x1="200" y1="160" x2="260" y2="90" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
            <line x1="260" y1="90" x2="310" y2="40" stroke="#334155" strokeWidth="14" strokeLinecap="round" />
          </svg>
          {title && <span className="absolute bottom-2 left-3 text-[11px] font-mono text-slate-400">{title}</span>}
        </div>
      );
  }
};

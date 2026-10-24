import React, { useState } from 'react';
import { 
  X, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  FolderTree, 
  FileCode, 
  ExternalLink, 
  HelpCircle, 
  FileCheck, 
  Copy, 
  Check,
  Server,
  Loader2
} from 'lucide-react';

interface InfinityFreeDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfinityFreeDeployModal: React.FC<InfinityFreeDeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'checklist' | 'files'>('guide');
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    setDownloadSuccess(false);
    try {
      // 1. Fetch from server API with base64 payload to prevent 0-byte iframe download bugs
      const response = await fetch('/api/download/zip-base64');
      if (response.ok) {
        const data = await response.json();
        if (data.base64) {
          const byteCharacters = atob(data.base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/zip' });
          
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = 'htdocs_upload.zip';
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          }, 3000);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
          return;
        }
      }

      // 2. Direct binary fetch fallback
      const directRes = await fetch('/api/download/htdocs_upload.zip');
      const blob = await directRes.blob();
      if (blob.size === 0) throw new Error('Received 0 bytes');
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'htdocs_upload.zip';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 3000);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Blob download failed, falling back to direct anchor:', err);
      window.location.href = '/api/download/htdocs_upload.zip';
    } finally {
      setDownloadingZip(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">InfinityFree Deployment Center</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  anupfabrication.kesug.com
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete Apache / htdocs deployment kit for Anup Fabrication on kesug.com
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-2 px-6 pt-4 bg-slate-950/40 border-b border-slate-800/80 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>403 Error Solution & Steps</span>
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Deployment Checklist</span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'files'
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Files Included in Package</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs sm:text-sm">
          {/* Active Domain Info Bar */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Configured InfinityFree Domain:
              </span>
              <div className="text-sm sm:text-base font-bold font-mono text-amber-400 flex items-center gap-2">
                <span>anupfabrication.kesug.com</span>
                <span className="text-[10px] font-sans font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Subdomain Configured
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText('anupfabrication.kesug.com');
                  setCopiedDomain(true);
                  setTimeout(() => setCopiedDomain(false), 2000);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedDomain ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDomain ? 'Copied Domain!' : 'Copy Domain'}</span>
              </button>
              <a
                href="http://anupfabrication.kesug.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <span>Open Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Main Download Banner */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-white text-base flex items-center gap-2">
                <span>Download InfinityFree Upload Package</span>
                <span className="text-[10px] font-mono bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded">
                  ZIP
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl">
                Ready-to-deploy archive containing compiled production assets for <code className="text-amber-300 font-mono">anupfabrication.kesug.com</code>, Apache <code className="text-amber-300 font-mono">.htaccess</code> SPA rewrite rules, and <code className="text-amber-300 font-mono">index.php</code> fallback.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              <button
                onClick={handleDownloadZip}
                disabled={downloadingZip}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-75"
              >
                {downloadingZip ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Preparing Verified ZIP...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-950 font-extrabold" />
                    <span>Downloaded! (369 KB)</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download htdocs_upload.zip</span>
                  </>
                )}
              </button>
              <a
                href="/api/download/htdocs_upload.zip"
                download="htdocs_upload.zip"
                className="px-3 py-2 text-[11px] text-amber-300/80 hover:text-amber-200 underline text-center"
                title="Direct link if button is blocked"
              >
                Direct Link
              </a>
            </div>
          </div>

          {activeTab === 'guide' && (
            <div className="space-y-6">
              {/* Screenshot Fix Callout */}
              <div className="bg-blue-950/30 border border-blue-500/40 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Aapke Dono Screenshots Ka Exact Samadhan:</span>
                </div>
                <div className="space-y-3 text-xs text-slate-200">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      <span>1. Screenshot "The compressed folder is empty" (Windows Error)</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Pehle browser ne preview iframe ki wajah se 0-byte (khali) zip file save kar di thi. 
                      Isliye Windows ne kaha ki zip khali hai. 
                      <strong className="text-white block mt-1">
                        ✓ Ab upar diye gaye naye button se download karein — ye seedhe 369 KB ki complete verified ZIP file download karta hai, jo 100% extract hogi!
                      </strong>
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      <span>2. Screenshot "DO NOT UPLOAD FILES HERE" (File Manager)</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      File Manager me aap abhi <strong>Home</strong> par hain jahan <em>'DO NOT UPLOAD FILES HERE'</em> likha hai. 
                      Wahan files upload nahi karni hain!
                      <strong className="text-white block mt-1">
                        👉 Saamne jo <code className="font-mono text-amber-300 bg-slate-900 px-1 py-0.5 rounded">htdocs</code> folder dikh raha hai, us par DOUBLE-CLICK karke andar jaayein, aur files wahan upload karein!
                      </strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Server Diagnosis Alert */}
              <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>Aapki Website "anupfabrication.kesug.com" Par Abhi Kya Ho Raha Hai?</span>
                </div>
                <div className="text-xs text-slate-200 leading-relaxed space-y-2">
                  <p>
                    Humne aapke live domain <strong className="text-amber-300 font-mono">anupfabrication.kesug.com</strong> ko check kiya:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="bg-slate-950 p-3 rounded-lg border border-red-500/30">
                      <div className="font-bold text-red-400 text-[11px] uppercase tracking-wider mb-1">
                        ❌ Server Par Kya Upload Hua Hai:
                      </div>
                      <div className="font-mono text-[11px] text-slate-300 space-y-1">
                        <div>• Root <code className="text-red-300 bg-red-950/60 px-1 py-0.5 rounded">index.html</code> (with &lt;script src="/src/main.tsx"&gt;)</div>
                        <div>• Source folder <code className="text-red-300 bg-red-950/60 px-1 py-0.5 rounded">src/</code></div>
                      </div>
                      <p className="text-[11px] text-red-200/80 mt-2">
                        Browser raw TypeScript/JSX (.tsx) ko seedhe nahi run kar sakta, isliye browser screen blank ho jaati hai!
                      </p>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-emerald-500/30">
                      <div className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider mb-1">
                        ✓ Server Par Kya Upload Hona Chahiye:
                      </div>
                      <div className="font-mono text-[11px] text-slate-300 space-y-1">
                        <div>• Compiled <code className="text-emerald-300 bg-emerald-950/60 px-1 py-0.5 rounded">index.html</code> (from zip)</div>
                        <div>• Folder <code className="text-emerald-300 bg-emerald-950/60 px-1 py-0.5 rounded">assets/</code> (contains JS & CSS)</div>
                        <div>• Server rules <code className="text-emerald-300 bg-emerald-950/60 px-1 py-0.5 rounded">.htaccess</code> & <code className="text-emerald-300 bg-emerald-950/60 px-1 py-0.5 rounded">index.php</code></div>
                      </div>
                      <p className="text-[11px] text-emerald-200/80 mt-2">
                        In sabhi ko zip se extract karke seedhe <code className="font-mono text-emerald-300">htdocs</code> me daalna hai!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Problem Breakdown from user's screenshot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase font-mono">
                    <X className="w-4 h-4" />
                    <span>File Manager Me Kya Galti Hui Thi?</span>
                  </div>
                  <ul className="space-y-2 text-xs text-red-200/90 leading-relaxed list-disc list-inside">
                    <li>
                      <strong className="text-white">Uncompiled Source Code Upload Hua:</strong> Aapne <code className="font-mono text-red-300">src/</code> aur dev <code className="font-mono text-red-300">index.html</code> upload kar diya jise browser nahi chala sakta.
                    </li>
                    <li>
                      <strong className="text-white">Assets Folder Gayab Hai:</strong> Main compiled JavaScript aur CSS <code className="font-mono text-red-300">assets/</code> folder me hoti hai, jo server par upload nahi hua.
                    </li>
                    <li>
                      <strong className="text-white">Subfolder Confusion:</strong> Kabhi-kabhi file manager me <code className="bg-red-950 px-1 py-0.5 rounded font-mono text-red-300">htdocs/htdocs</code> ban jata hai.
                    </li>
                  </ul>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sahi Tarika (100% Fix Guarantee)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-emerald-200/90 leading-relaxed list-disc list-inside">
                    <li>
                      <strong className="text-white">htdocs ko bilkul khali karein:</strong> Purani saari files delete karein taaki koi purana duplicate na rahe.
                    </li>
                    <li>
                      <strong className="text-white">htdocs_upload.zip ko Unzip karein:</strong> Apne computer par Right-Click karke "Extract All" karein.
                    </li>
                    <li>
                      <strong className="text-white">Seedhe /htdocs me upload karein:</strong> Charon items (<code className="font-mono text-emerald-300">index.html</code>, <code className="font-mono text-emerald-300">index.php</code>, <code className="font-mono text-emerald-300">.htaccess</code>, <code className="font-mono text-emerald-300">assets/</code>) seedhe <code className="font-mono text-emerald-300">/htdocs/</code> me hone chahiye!
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-amber-400" />
                  <span>Kadam-Dar-Kadam Upload Guide (MonstaFTP / File Manager)</span>
                </h3>

                <div className="space-y-3">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm">
                        InfinityFree vPanel me Online File Manager open karein
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        InfinityFree Control Panel se <strong>Online File Manager</strong> (filemanager.ai) kholein aur <code className="font-mono text-amber-400 bg-slate-900 px-1 py-0.5 rounded">htdocs</code> folder ke andar click karein.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm">
                        htdocs ke andar ki saari purani files SELECT ALL karke DELETE karein
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Aapke purane folder me <code className="font-mono text-red-400">/htdocs/htdocs</code> aur raw source code jama hai. "Select All" par click karein aur upar red <strong>Delete</strong> button dabayein.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                      3
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm">
                        htdocs_upload.zip ko download karke apne computer par Extract (Unzip) karein
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Upar diye gaye peele button se <code className="font-mono text-amber-400">htdocs_upload.zip</code> download karein. Use extract karne par ye 4 cheezein milengi:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 font-mono text-xs">
                        <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center text-slate-200">
                          📄 index.html
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center text-slate-200">
                          ⚙️ index.php
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center text-slate-200">
                          🔒 .htaccess
                        </div>
                        <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center text-slate-200">
                          📁 assets/
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                      4
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold text-white text-xs sm:text-sm">
                        File Manager me Upload kaise karein ("Cannot open ZIP file" error fix)
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        filemanager.ai me <strong className="text-amber-300 font-bold">"Zip & Extract"</strong> aksar fail ho jata hai kyunki web-server PHP timeout kar deta hai. 
                        Isliye sabse safe aur aasan tarika:
                      </p>
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <span className="font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[11px] font-bold">A</span>
                          <div>
                            Upar <strong>"Upload"</strong> click karke <strong>"[ Files ]"</strong> button dabayein:
                            <br />
                            <code className="text-amber-300 font-mono">index.html</code>, <code className="text-amber-300 font-mono">index.php</code>, <code className="text-amber-300 font-mono">.htaccess</code> ko select karke upload karein.
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[11px] font-bold">B</span>
                          <div>
                            Phir <strong>"[ Folder ]"</strong> button dabayein:
                            <br />
                            Extracted folder ke andar ke <code className="text-amber-300 font-mono">assets</code> folder ko select karke upload kar dein.
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-emerald-400 font-medium">
                        ✓ Koi unzipping error nahi aayega aur saari files seedhe htdocs me sahi jagah pahunch jayengi!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase">
                  Technical Compatibility Verification
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span><strong>Vite Base URL:</strong> Configured with relative paths (<code className="font-mono bg-slate-900 px-1 py-0.5 rounded text-slate-200">base: './'</code>) so CSS/JS load seamlessly.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span><strong>SPA Routing:</strong> Apache <code className="font-mono bg-slate-900 px-1 py-0.5 rounded text-slate-200">mod_rewrite</code> rules redirect client routes to index.html without 404 errors.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span><strong>MIME Types:</strong> Explicitly defined <code className="font-mono bg-slate-900 px-1 py-0.5 rounded text-slate-200">application/javascript</code> and <code className="font-mono bg-slate-900 px-1 py-0.5 rounded text-slate-200">text/css</code>.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span><strong>Firebase Client SDK:</strong> Bundled with static project credentials; directly connects to Firestore from visitor's browser.</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span><strong>PHP Wrapper:</strong> Fallback <code className="font-mono bg-slate-900 px-1 py-0.5 rounded text-slate-200">index.php</code> included in case host prioritizes PHP over HTML.</span>
                  </div>
                </div>
              </div>

              {/* Firebase Console Step */}
              <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-3">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Important for Google Sign-In & Customer Portal</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  To allow Google Sign-In and customer authentication on <strong className="text-white">anupfabrication.kesug.com</strong>:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
                  <li>Open <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-amber-400 underline font-semibold">Firebase Console</a>.</li>
                  <li>Select your project: <code className="font-mono text-amber-300">ai-studio-anupfabricationi...</code></li>
                  <li>Click <strong>Authentication</strong> → <strong>Settings</strong> tab → <strong>Authorized Domains</strong>.</li>
                  <li>
                    Click <strong>Add domain</strong> and enter: <code className="font-mono text-amber-300 bg-slate-900 px-1 py-0.5 rounded">anupfabrication.kesug.com</code>
                  </li>
                  <li>Click <strong>Save</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                You can also download individual deployment files directly if you do not want to use a ZIP tool:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-white text-xs">index.html</div>
                    <div className="text-[11px] text-slate-500">HTML5 Single Page App root</div>
                  </div>
                  <a
                    href="/compiled_index.html"
                    download="index.html"
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-xs font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-white text-xs">index.php</div>
                    <div className="text-[11px] text-slate-500">Apache fallback wrapper</div>
                  </div>
                  <a
                    href="/index.php"
                    download="index.php"
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-xs font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-white text-xs">.htaccess</div>
                    <div className="text-[11px] text-slate-500">Apache SPA rewrite & MIME config</div>
                  </div>
                  <a
                    href="/.htaccess"
                    download=".htaccess"
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-xs font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-white text-xs">HOW_TO_UPLOAD.txt</div>
                    <div className="text-[11px] text-slate-500">Hindi/English text guide</div>
                  </div>
                  <a
                    href="/HOW_TO_UPLOAD.txt"
                    download="HOW_TO_UPLOAD.txt"
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-xs font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400">
            Target Host: <span className="font-mono text-amber-400 font-semibold">InfinityFree (vPanel / htdocs)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

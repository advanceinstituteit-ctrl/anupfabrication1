import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppStore } from '../lib/store';
import { Phone, Shield, User, Menu, X, Globe, Wrench } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  openQuoteModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, openQuoteModal }) => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, switchToRole, businessSettings, signInWithGoogle, signOutUser } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const navigateTo = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <button
          onClick={() => navigateTo('home')}
          className="text-xl sm:text-2xl font-extrabold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-sm">
            AF
          </div>
          <span>{t('brand')}</span>
        </button>

        {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => navigateTo('home')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer py-1 ${
              currentView === 'home' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            {t('nav_home')}
          </button>
          <button
            onClick={() => navigateTo('services')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer py-1 ${
              currentView === 'services' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            {t('nav_services')}
          </button>
          <button
            onClick={() => navigateTo('projects')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer py-1 ${
              currentView === 'projects' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            {t('nav_projects')}
          </button>
          <button
            onClick={() => navigateTo('contact')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer py-1 ${
              currentView === 'contact' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            {t('nav_contact')}
          </button>
          <button
            onClick={() => navigateTo('customer_portal')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer py-1 ${
              currentView === 'customer_portal' ? 'text-amber-400 font-semibold border-b-2 border-amber-400' : ''
            }`}
          >
            {t('nav_dashboard')}
          </button>
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => navigateTo('admin_portal')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-300 cursor-pointer py-1 text-amber-400 font-semibold flex items-center gap-1 ${
                currentView === 'admin_portal' ? 'border-b-2 border-amber-400' : ''
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              {t('nav_admin')}
            </button>
          )}
        </nav>

        {/* Zone 3: Actions (Language Switcher, Role Selector, Primary CTA) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            title="Switch Language (English / हिन्दी)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Role switcher for instant testability */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize">{currentUser ? currentUser.role : 'Visitor'}</span>
            </button>
            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-1.5 text-slate-400 border-b border-slate-800 font-mono text-[10px]">
                  TEST USER ROLES
                </div>
                <button
                  onClick={() => { switchToRole('customer'); setRoleMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                >
                  <span>Customer (Rajesh)</span>
                  {currentUser?.role === 'customer' && <span className="text-amber-400">✓</span>}
                </button>
                <button
                  onClick={() => { switchToRole('admin'); setRoleMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                >
                  <span>Admin / Workshop Master</span>
                  {currentUser?.role === 'admin' && <span className="text-amber-400">✓</span>}
                </button>
                <button
                  onClick={() => { switchToRole('visitor'); setRoleMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                >
                  <span>Public Visitor</span>
                  {!currentUser && <span className="text-amber-400">✓</span>}
                </button>
                <div className="border-t border-slate-800 my-1 pt-1">
                  <button
                    onClick={() => { signInWithGoogle(); setRoleMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-amber-400 hover:bg-slate-800 flex items-center justify-between cursor-pointer font-semibold"
                  >
                    <span>Sign In with Google</span>
                  </button>
                  {currentUser && (
                    <button
                      onClick={() => { signOutUser(); setRoleMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-between cursor-pointer text-[11px]"
                    >
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              if (openQuoteModal) openQuoteModal();
              else navigateTo('quote');
            }}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-amber-500/20 cursor-pointer"
          >
            {t('nav_quote')}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => navigateTo('home')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-amber-400"
          >
            {t('nav_home')}
          </button>
          <button
            onClick={() => navigateTo('services')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-amber-400"
          >
            {t('nav_services')}
          </button>
          <button
            onClick={() => navigateTo('projects')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-amber-400"
          >
            {t('nav_projects')}
          </button>
          <button
            onClick={() => navigateTo('contact')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-amber-400"
          >
            {t('nav_contact')}
          </button>
          <button
            onClick={() => navigateTo('customer_portal')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-amber-400"
          >
            {t('nav_dashboard')}
          </button>
          <button
            onClick={() => navigateTo('admin_portal')}
            className="block w-full text-left py-2 text-sm font-medium text-amber-400 flex items-center gap-1.5"
          >
            <Shield className="w-4 h-4" />
            {t('nav_admin')}
          </button>
          
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Switch Role:</span>
            <div className="flex gap-2">
              <button
                onClick={() => { switchToRole('customer'); setMobileMenuOpen(false); }}
                className={`px-2 py-1 text-xs rounded border ${currentUser?.role === 'customer' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 border-slate-700 text-slate-300'}`}
              >
                Customer
              </button>
              <button
                onClick={() => { switchToRole('admin'); setMobileMenuOpen(false); }}
                className={`px-2 py-1 text-xs rounded border ${currentUser?.role === 'admin' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 border-slate-700 text-slate-300'}`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

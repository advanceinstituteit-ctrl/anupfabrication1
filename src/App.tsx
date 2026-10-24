import React, { useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppProvider } from './lib/store';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ContactPage } from './pages/ContactPage';
import { CustomerDashboard } from './features/customer/CustomerDashboard';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { QuoteRequestForm } from './features/enquiries/QuoteRequestForm';
import { AIAssistantWidget } from './features/ai/AIAssistantWidget';
import { ServiceCategory } from './types';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategoryForQuote, setSelectedCategoryForQuote] = useState<ServiceCategory | undefined>();

  const handleSelectServiceForQuote = (cat: ServiceCategory) => {
    setSelectedCategoryForQuote(cat);
    setCurrentView('quote');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* 3-Zone Top Navigation Bar */}
      <Header 
        currentView={currentView} 
        setCurrentView={navigateTo} 
        openQuoteModal={() => navigateTo('quote')}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage 
            setCurrentView={navigateTo} 
            onSelectServiceForQuote={handleSelectServiceForQuote}
          />
        )}

        {currentView === 'services' && (
          <ServicesPage onSelectServiceForQuote={handleSelectServiceForQuote} />
        )}

        {currentView === 'projects' && (
          <ProjectsPage onOpenQuote={() => navigateTo('quote')} />
        )}

        {currentView === 'contact' && (
          <ContactPage />
        )}

        {currentView === 'quote' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                ONLINE FABRICATION ESTIMATES
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Request an Itemized Fabrication Quote
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Provide preliminary project dimensions or drawing references. Our workshop master will prepare a formal estimate for your review.
              </p>
            </div>
            <QuoteRequestForm 
              preselectedCategory={selectedCategoryForQuote}
              onSuccess={(refNo) => {
                // Keep ref on screen for user
              }}
            />
          </div>
        )}

        {currentView === 'customer_portal' && (
          <CustomerDashboard onOpenNewQuote={() => navigateTo('quote')} />
        )}

        {currentView === 'admin_portal' && (
          <AdminDashboard />
        )}
      </main>

      {/* Quiet Industrial Footer */}
      <Footer setCurrentView={navigateTo} />

      {/* Gemini AI Fabrication Assistant */}
      <AIAssistantWidget />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </LanguageProvider>
  );
}

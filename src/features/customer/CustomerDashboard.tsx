import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppStore } from '../../lib/store';
import { QuotationItem } from '../../types';
import { QuotationViewer } from '../quotations/QuotationViewer';
import { 
  FileText, 
  Clock, 
  Calendar, 
  CreditCard, 
  Plus, 
  ArrowRight, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  User
} from 'lucide-react';

interface CustomerDashboardProps {
  onOpenNewQuote: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onOpenNewQuote }) => {
  const { t, language, setLanguage } = useLanguage();
  const { currentUser, enquiries, quotations, bookings, payments, updateBusinessSettings } = useAppStore();

  const [activeTab, setActiveTab] = useState<'enquiries' | 'quotations' | 'bookings' | 'payments' | 'profile'>('enquiries');
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationItem | null>(null);

  // Filter records belonging to the current user (or demo records if demo user)
  const userEnquiries = enquiries.filter(e => !currentUser || e.customer_id === currentUser.id || !e.customer_id);
  const userQuotations = quotations.filter(q => !currentUser || q.customer_id === currentUser.id);
  const userBookings = bookings.filter(b => !currentUser || b.customer_id === currentUser.id);
  const userPayments = payments.filter(p => !currentUser || p.customer_id === currentUser.id);

  if (selectedQuotation) {
    return (
      <div className="py-8">
        <QuotationViewer quotation={selectedQuotation} onBack={() => setSelectedQuotation(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Customer Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
            {currentUser?.full_name?.slice(0, 2).toUpperCase() || 'CU'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{currentUser?.full_name || 'Valued Customer'}</span>
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Delhi NCR
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Phone: +91 {currentUser?.phone || '7217853257'} · Customer ID: {currentUser?.id || 'CUST-GUEST'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenNewQuote}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Quote Request</span>
        </button>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-lg overflow-x-auto">
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'enquiries' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t('my_enquiries')}</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-black/20">
            {userEnquiries.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('quotations')}
          className={`px-4 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'quotations' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{t('my_quotations')}</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-black/20">
            {userQuotations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'bookings' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{t('my_bookings')}</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-black/20">
            {userBookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'payments' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>{t('my_payments')}</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-black/20">
            {userPayments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile & Language</span>
        </button>
      </div>

      {/* TAB 1: Enquiries */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tracking {userEnquiries.length} submitted requests</span>
            <span>Workshop desk contact: 7217853257</span>
          </div>

          {userEnquiries.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-sm">
              {t('no_records')}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {userEnquiries.map((enq) => (
                <div key={enq.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-amber-400">{enq.reference_number}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400 capitalize">{enq.service_category.replace('_', ' ')}</span>
                    </div>
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      enq.status === 'quoted' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      enq.status === 'booked' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {enq.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5">{enq.project_title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{enq.project_description}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono border-t border-slate-800 pt-3">
                    {enq.dimensions && <span>Dimensions: {enq.dimensions}</span>}
                    {enq.dimensions && <span>·</span>}
                    <span>Location: {enq.location}</span>
                    <span>·</span>
                    <span>Submitted: {new Date(enq.created_at).toLocaleDateString()}</span>
                  </div>

                  {enq.internal_notes && (
                    <div className="mt-3 bg-slate-950/60 border border-slate-800 rounded p-2.5 text-xs text-amber-300/90 flex items-start gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{enq.internal_notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Quotations */}
      {activeTab === 'quotations' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Click on any quotation to inspect line items, download quotation PDF, or pay the required advance.
          </div>

          {userQuotations.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-sm">
              {t('no_records')}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {userQuotations.map((qt) => (
                <div key={qt.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-500/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-amber-400">{qt.quotation_number}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">Valid until {qt.valid_until}</span>
                    </div>
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      qt.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      qt.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {qt.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2">{qt.project_title}</h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 text-xs mb-4">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Subtotal</span>
                      <span className="font-mono text-slate-200">₹{qt.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Taxes ({qt.tax_rate_percent}%)</span>
                      <span className="font-mono text-slate-200">₹{qt.tax_amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Total Amount</span>
                      <span className="font-mono font-bold text-amber-400">₹{qt.total_amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Advance Due</span>
                      <span className="font-mono font-bold text-emerald-400">₹{qt.advance_amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => setSelectedQuotation(qt)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review & Pay Advance</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Site inspections, measurements, and fabrication installations scheduled by Anup Fabrication.
          </div>

          {userBookings.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-sm">
              {t('no_records')}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {userBookings.map((b) => (
                <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-white text-sm">
                        Requested Date: <span className="font-mono text-amber-300">{b.requested_date}</span>
                      </span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-semibold border border-slate-700">
                      {b.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-2">
                    Site: <span className="text-white font-medium">{b.site_address}</span>
                  </p>

                  {b.confirmed_date && (
                    <div className="text-xs text-emerald-300 font-mono mb-2">
                      Confirmed Date: {b.confirmed_date} ({b.time_slot || 'Morning Slot'})
                    </div>
                  )}

                  {b.internal_notes && (
                    <div className="bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-400">
                      Note: {b.internal_notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Payments */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Verified online Razorpay transactions and receipts.
          </div>

          {userPayments.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-sm">
              {t('no_records')}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {userPayments.map((p) => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">{p.reference_no}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-300">Razorpay ID: {p.provider_payment_id}</span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      Timestamp: {new Date(p.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-mono font-bold text-white tabular-nums">
                      ₹{p.amount_inr.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80">
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Profile & Language */}
      {activeTab === 'profile' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 max-w-xl mx-auto space-y-6">
          <h3 className="text-lg font-bold text-white">Profile Preferences</h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 uppercase font-mono text-[10px] mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={currentUser?.full_name || 'Rajesh Sharma'}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300"
              />
            </div>
            <div>
              <label className="block text-slate-400 uppercase font-mono text-[10px] mb-1">Registered Phone</label>
              <input
                type="text"
                disabled
                value={currentUser?.phone || '9811223344'}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 uppercase font-mono text-[10px] mb-1">Preferred Language</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-2 rounded text-xs font-semibold cursor-pointer border ${
                    language === 'en' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`flex-1 py-2 rounded text-xs font-semibold cursor-pointer border ${
                    language === 'hi' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

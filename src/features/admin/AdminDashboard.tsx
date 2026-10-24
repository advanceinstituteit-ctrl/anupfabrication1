import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppStore } from '../../lib/store';
import { EnquiryItem, QuotationItem, QuotationLineItem, ServiceItem } from '../../types';
import { QuotationViewer } from '../quotations/QuotationViewer';
import { 
  BarChart3, 
  FileText, 
  Clock, 
  Calendar, 
  Wrench, 
  ShieldCheck, 
  Download, 
  Plus, 
  Trash2, 
  Search, 
  CheckCircle2, 
  Eye, 
  Edit3, 
  DollarSign
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { 
    enquiries, 
    updateEnquiryStatus, 
    quotations, 
    createQuotation, 
    bookings, 
    updateBookingStatus, 
    payments, 
    services, 
    toggleServiceActive, 
    updateService, 
    auditLogs 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'quote_generator' | 'bookings' | 'services' | 'reports' | 'audit'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuoteForView, setSelectedQuoteForView] = useState<QuotationItem | null>(null);

  // Quote Generator Form State
  const [selectedEnquiryForQuote, setSelectedEnquiryForQuote] = useState<EnquiryItem | null>(null);
  const [quoteCustomerName, setQuoteCustomerName] = useState('');
  const [quoteCustomerPhone, setQuoteCustomerPhone] = useState('');
  const [quoteProjectTitle, setQuoteProjectTitle] = useState('');
  const [quoteLineItems, setQuoteLineItems] = useState<QuotationLineItem[]>([
    { id: '1', description: 'Heavy structural steel fabrication and assembly', quantity: 1, unit_price: 35000, line_total: 35000 }
  ]);
  const [quoteTaxRate, setQuoteTaxRate] = useState<number>(18);
  const [quoteDiscount, setQuoteDiscount] = useState<number>(0);
  const [quoteAdvancePercent, setQuoteAdvancePercent] = useState<number>(40);
  const [quoteValidDays, setQuoteValidDays] = useState<number>(15);
  const [quoteNotes, setQuoteNotes] = useState('Standard 1-year workmanship warranty. Jindal / Tata quality steel sections.');

  // Real Calculated Metrics (Never Random!)
  const totalEnquiriesCount = enquiries.length;
  const pendingQuotesCount = enquiries.filter(e => e.status === 'pending').length;
  const activeBookingsCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'in_progress').length;
  const totalVerifiedRevenueINR = payments
    .filter(p => p.status === 'success')
    .reduce((acc, curr) => acc + curr.amount_inr, 0);

  // Filter enquiries
  const filteredEnquiries = enquiries.filter(e => 
    e.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.reference_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.project_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Line item helpers
  const handleAddLineItem = () => {
    setQuoteLineItems(prev => [
      ...prev,
      { id: String(Date.now()), description: '', quantity: 1, unit_price: 0, line_total: 0 }
    ]);
  };

  const handleUpdateLineItem = (id: string, field: 'description' | 'quantity' | 'unit_price', value: any) => {
    setQuoteLineItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unit_price') {
          const qty = field === 'quantity' ? Number(value) || 0 : item.quantity;
          const price = field === 'unit_price' ? Number(value) || 0 : item.unit_price;
          updated.line_total = qty * price;
        }
        return updated;
      }
      return item;
    }));
  };

  const handleRemoveLineItem = (id: string) => {
    if (quoteLineItems.length <= 1) return;
    setQuoteLineItems(prev => prev.filter(i => i.id !== id));
  };

  const subtotal = quoteLineItems.reduce((acc, item) => acc + item.line_total, 0);
  const taxAmount = Math.round((subtotal * quoteTaxRate) / 100);
  const totalAmount = Math.max(0, subtotal + taxAmount - quoteDiscount);
  const advanceAmount = Math.round((totalAmount * quoteAdvancePercent) / 100);

  const handleConvertEnquiryToQuote = (enq: EnquiryItem) => {
    setSelectedEnquiryForQuote(enq);
    setQuoteCustomerName(enq.customer_name);
    setQuoteCustomerPhone(enq.phone);
    setQuoteProjectTitle(enq.project_title);
    setQuoteLineItems([
      {
        id: '1',
        description: `${enq.project_title} (${enq.dimensions || 'As per site drawing'})`,
        quantity: enq.quantity || 1,
        unit_price: 25000,
        line_total: (enq.quantity || 1) * 25000
      }
    ]);
    setActiveTab('quote_generator');
  };

  const handleIssueQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + quoteValidDays);

    const quoteNum = `AF-QT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newQuote = createQuotation({
      enquiry_id: selectedEnquiryForQuote?.id || `enq-${Date.now()}`,
      customer_id: selectedEnquiryForQuote?.customer_id || 'cust-demo-1',
      quotation_number: quoteNum,
      customer_name: quoteCustomerName,
      customer_phone: quoteCustomerPhone,
      project_title: quoteProjectTitle,
      items: quoteLineItems,
      subtotal,
      tax_rate_percent: quoteTaxRate,
      tax_amount: taxAmount,
      discount_amount: quoteDiscount,
      total_amount: totalAmount,
      advance_percent: quoteAdvancePercent,
      advance_amount: advanceAmount,
      currency: 'INR',
      valid_until: expiryDate.toISOString().split('T')[0],
      status: 'sent',
      notes: quoteNotes
    });

    if (selectedEnquiryForQuote) {
      updateEnquiryStatus(selectedEnquiryForQuote.id, 'quoted', `Quotation ${quoteNum} prepared and issued.`);
    }

    alert(`Quotation ${quoteNum} generated successfully!`);
    setSelectedQuoteForView(newQuote);
  };

  // CSV Export utility
  const handleExportCSV = (type: 'enquiries' | 'bookings' | 'revenue') => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (type === 'enquiries') {
      csvContent += 'Reference Number,Customer Name,Phone,Category,Project Title,Location,Status,Date\n';
      enquiries.forEach(e => {
        csvContent += `"${e.reference_number}","${e.customer_name}","${e.phone}","${e.service_category}","${e.project_title}","${e.location}","${e.status}","${e.created_at}"\n`;
      });
    } else if (type === 'bookings') {
      csvContent += 'Booking ID,Customer,Phone,Requested Date,Confirmed Date,Status,Site Address\n';
      bookings.forEach(b => {
        csvContent += `"${b.id}","${b.customer_name}","${b.customer_phone}","${b.requested_date}","${b.confirmed_date || 'TBD'}","${b.status}","${b.site_address}"\n`;
      });
    } else {
      csvContent += 'Payment ID,Receipt No,Customer,Provider,Status,Amount (INR),Verified At\n';
      payments.forEach(p => {
        csvContent += `"${p.provider_payment_id || p.id}","${p.reference_no}","${p.customer_name}","${p.provider}","${p.status}",${p.amount_inr},"${p.verified_at || p.created_at}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `anup_fabrication_${type}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (selectedQuoteForView) {
    return (
      <div className="py-8 max-w-7xl mx-auto px-4">
        <QuotationViewer quotation={selectedQuoteForView} onBack={() => setSelectedQuoteForView(null)} canManage={true} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">Admin Console</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Najafgarh Workshop Master Control</span>
          </div>
          <h1 className="text-xl font-bold text-white">{t('admin_title')}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedEnquiryForQuote(null);
              setQuoteCustomerName('');
              setQuoteCustomerPhone('');
              setQuoteProjectTitle('');
              setActiveTab('quote_generator');
            }}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('btn_create_quote')}</span>
          </button>
        </div>
      </div>

      {/* Real Metric KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs uppercase font-mono text-slate-400 mb-1">{t('stat_total_enquiries')}</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">{totalEnquiriesCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Delhi NCR leads</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs uppercase font-mono text-amber-400 mb-1">{t('stat_pending_quotes')}</div>
          <div className="text-2xl font-bold font-mono text-amber-300 tabular-nums">{pendingQuotesCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting price estimation</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs uppercase font-mono text-slate-400 mb-1">{t('stat_active_bookings')}</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">{activeBookingsCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Confirmed site visits/work</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs uppercase font-mono text-emerald-400 mb-1">{t('stat_verified_revenue')}</div>
          <div className="text-2xl font-bold font-mono text-emerald-300 tabular-nums">
            ₹{totalVerifiedRevenueINR.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Verified via Razorpay</div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-lg overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'overview' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{t('admin_overview')}</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-2 rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'enquiries' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t('admin_enquiries')}</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-black/20">{enquiries.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('quote_generator')}
          className={`px-4 py-2 rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'quote_generator' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{t('admin_quotes')}</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'bookings' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{t('admin_bookings')}</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-black/20">{bookings.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'services' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>{t('admin_services')}</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reports' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t('admin_reports')}</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'audit' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t('admin_audit')}</span>
        </button>
      </div>

      {/* TAB: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Enquiries Triage */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Recent Fabrication Enquiries</span>
                </h3>
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className="text-xs text-amber-400 hover:underline cursor-pointer"
                >
                  View All ({enquiries.length})
                </button>
              </div>

              <div className="space-y-3">
                {enquiries.slice(0, 4).map(e => (
                  <div key={e.id} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-200">{e.customer_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {e.reference_number} · {e.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                        {e.status}
                      </span>
                      <button
                        onClick={() => handleConvertEnquiryToQuote(e)}
                        className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded font-semibold text-[11px] cursor-pointer"
                      >
                        Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings & Statuses */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Inspection & Fabrication Schedule</span>
                </h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs text-amber-400 hover:underline cursor-pointer"
                >
                  Manage ({bookings.length})
                </button>
              </div>

              <div className="space-y-3">
                {bookings.slice(0, 4).map(b => (
                  <div key={b.id} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-200">{b.customer_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Date: {b.confirmed_date || b.requested_date} · {b.site_address.slice(0, 30)}...
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                      {b.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Enquiries List & Triage */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search name, ref, or location..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={() => handleExportCSV('enquiries')}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Requirement</th>
                  <th className="py-3 px-4">Site Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEnquiries.map(enq => (
                  <tr key={enq.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{enq.reference_number}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{enq.customer_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">+91 {enq.phone}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-200">{enq.project_title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{enq.project_description}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{enq.location}</td>
                    <td className="py-3 px-4">
                      <select
                        value={enq.status}
                        onChange={e => updateEnquiryStatus(enq.id, e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] font-mono text-slate-200"
                      >
                        <option value="pending">Pending</option>
                        <option value="quoted">Quoted</option>
                        <option value="booked">Booked</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleConvertEnquiryToQuote(enq)}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded transition-colors cursor-pointer"
                      >
                        Create Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Quotation Generator */}
      {activeTab === 'quote_generator' && (
        <form onSubmit={handleIssueQuotation} className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Generate Itemized Quotation</h2>
              <p className="text-xs text-slate-400">
                {selectedEnquiryForQuote 
                  ? `Converting Enquiry ${selectedEnquiryForQuote.reference_number}` 
                  : 'Direct quotation generator for residential, commercial or industrial work'}
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded">
              Currency: INR (₹)
            </span>
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block uppercase font-mono text-[10px] text-slate-400 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={quoteCustomerName}
                onChange={e => setQuoteCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block uppercase font-mono text-[10px] text-slate-400 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={quoteCustomerPhone}
                onChange={e => setQuoteCustomerPhone(e.target.value)}
                placeholder="10-Digit Mobile"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block uppercase font-mono text-[10px] text-slate-400 mb-1">Project Title *</label>
              <input
                type="text"
                required
                value={quoteProjectTitle}
                onChange={e => setQuoteProjectTitle(e.target.value)}
                placeholder="e.g. MS Boundary Gate & Shed"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
              />
            </div>
          </div>

          {/* Dynamic Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Quotation Line Items</span>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('btn_add_line_item')}</span>
              </button>
            </div>

            <div className="space-y-2">
              {quoteLineItems.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 bg-slate-950 border border-slate-800 rounded p-3 text-xs items-center">
                  <div className="col-span-1 font-mono text-slate-500 text-center">#{idx + 1}</div>
                  <div className="col-span-6">
                    <input
                      type="text"
                      required
                      value={item.description}
                      onChange={e => handleUpdateLineItem(item.id, 'description', e.target.value)}
                      placeholder="Item description, material grade (e.g. Mild steel 40x40 pipe)..."
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      required
                      value={item.quantity}
                      onChange={e => handleUpdateLineItem(item.id, 'quantity', e.target.value)}
                      placeholder="Qty"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white font-mono text-right"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      required
                      value={item.unit_price}
                      onChange={e => handleUpdateLineItem(item.id, 'unit_price', e.target.value)}
                      placeholder="Unit Price"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-white font-mono text-right"
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveLineItem(item.id)}
                      className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Calculations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Applicable Tax / GST (%)</label>
                <input
                  type="number"
                  min="0"
                  max="28"
                  value={quoteTaxRate}
                  onChange={e => setQuoteTaxRate(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Commercial Discount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={quoteDiscount}
                  onChange={e => setQuoteDiscount(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Required Advance Percentage (%)</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={quoteAdvancePercent}
                  onChange={e => setQuoteAdvancePercent(Number(e.target.value) || 40)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Line Items Subtotal:</span>
                <span className="font-mono tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax Amount ({quoteTaxRate}%):</span>
                <span className="font-mono tabular-nums">₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>
              {quoteDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount:</span>
                  <span className="font-mono tabular-nums">-₹{quoteDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white border-t border-slate-800 pt-2">
                <span>Total Quotation Amount:</span>
                <span className="font-mono text-amber-400 tabular-nums">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-emerald-400 bg-emerald-950/30 p-2 rounded border border-emerald-800/40 mt-2">
                <span>Required Advance ({quoteAdvancePercent}%):</span>
                <span className="font-mono tabular-nums">₹{advanceAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Issue Official Quotation</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB: Bookings Management */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-400">Manage site inspection visits and erection dates.</div>
            <button
              onClick={() => handleExportCSV('bookings')}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Bookings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {bookings.map(b => (
              <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-base font-bold text-white">{b.customer_name}</span>
                    <span className="text-slate-500 mx-2">·</span>
                    <span className="text-xs text-slate-400 font-mono">+91 {b.customer_phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Status:</span>
                    <select
                      value={b.status}
                      onChange={e => updateBookingStatus(b.id, e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-slate-200"
                    >
                      <option value="requested">Requested</option>
                      <option value="under_review">Under Review</option>
                      <option value="awaiting_payment">Awaiting Payment</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950/60 rounded p-3">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Site Location</span>
                    <span className="text-slate-200">{b.site_address}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Confirmed Date</span>
                    <input
                      type="date"
                      value={b.confirmed_date || ''}
                      onChange={e => updateBookingStatus(b.id, b.status, e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono text-xs mt-0.5"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Services CMS */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Configure active fabrication services, baseline estimates, and turnaround lead times.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(srv => (
              <div key={srv.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{srv.name_en}</h4>
                  <button
                    onClick={() => toggleServiceActive(srv.id)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold cursor-pointer border ${
                      srv.is_active 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {srv.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{srv.description_en}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">
                    Lead time: <span className="font-mono text-slate-200">{srv.estimated_lead_time}</span>
                  </span>
                  <span className="text-slate-400">
                    Baseline: <span className="font-mono text-amber-400 font-bold">₹{srv.starting_price}/unit</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Reports & CSV */}
      {activeTab === 'reports' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h3 className="text-base font-bold text-white">Workshop Analytics & Data Exports</h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Export genuine transactional data for accounting, GST filings, and lead follow-up. Revenue reflects only verified Razorpay payments.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleExportCSV('enquiries')}
              className="p-4 bg-slate-950 border border-slate-800 hover:border-amber-500 rounded-lg text-left transition-colors cursor-pointer group"
            >
              <FileText className="w-5 h-5 text-amber-400 mb-2" />
              <div className="text-sm font-bold text-white group-hover:text-amber-400">Export All Enquiries</div>
              <div className="text-xs text-slate-500 mt-1">Download CSV with customer specs & locations</div>
            </button>

            <button
              onClick={() => handleExportCSV('bookings')}
              className="p-4 bg-slate-950 border border-slate-800 hover:border-amber-500 rounded-lg text-left transition-colors cursor-pointer group"
            >
              <Calendar className="w-5 h-5 text-amber-400 mb-2" />
              <div className="text-sm font-bold text-white group-hover:text-amber-400">Export Site Bookings</div>
              <div className="text-xs text-slate-500 mt-1">Schedule and technician dispatch records</div>
            </button>

            <button
              onClick={() => handleExportCSV('revenue')}
              className="p-4 bg-slate-950 border border-slate-800 hover:border-amber-500 rounded-lg text-left transition-colors cursor-pointer group"
            >
              <DollarSign className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-sm font-bold text-white group-hover:text-amber-400">Export Verified Revenue</div>
              <div className="text-xs text-slate-500 mt-1">Razorpay receipts with timestamps & IDs</div>
            </button>
          </div>
        </div>
      )}

      {/* TAB: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950 text-xs font-mono text-slate-400 uppercase">
            Administrative Audit Trail
          </div>
          <div className="divide-y divide-slate-800/60 max-h-96 overflow-y-auto">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3.5 text-xs flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="font-mono text-amber-400 font-semibold">{log.action}</div>
                  <div className="text-slate-300">{log.details}</div>
                  <div className="text-[10px] text-slate-500 font-mono">By: {log.actor_email}</div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono shrink-0">
                  {new Date(log.created_at).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

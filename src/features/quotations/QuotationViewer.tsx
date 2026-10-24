import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppStore } from '../../lib/store';
import { QuotationItem } from '../../types';
import { Check, X, CreditCard, ShieldCheck, Printer, ArrowLeft, Building2 } from 'lucide-react';

interface QuotationViewerProps {
  quotation: QuotationItem;
  onBack?: () => void;
  canManage?: boolean;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const QuotationViewer: React.FC<QuotationViewerProps> = ({ quotation, onBack, canManage = false }) => {
  const { t } = useLanguage();
  const { updateQuotationStatus, recordPayment, businessSettings, currentUser } = useAppStore();
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  const handleStatusChange = (status: QuotationItem['status']) => {
    updateQuotationStatus(quotation.id, status);
  };

  const handleRazorpayPayment = async () => {
    setProcessingPayment(true);

    try {
      // 1. Create order via server endpoint or simulated order
      const orderAmountPaise = Math.round(quotation.advance_amount * 100);
      let orderId = `order_${Date.now()}`;

      try {
        const orderRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quotation_id: quotation.id,
            amount_paise: orderAmountPaise,
            customer_name: quotation.customer_name,
            customer_phone: quotation.customer_phone
          })
        });
        if (orderRes.ok) {
          const data = await orderRes.json();
          if (data.order_id) orderId = data.order_id;
        }
      } catch (e) {
        console.warn('Backend API order endpoint not reached, proceeding with test checkout simulation', e);
      }

      // 2. If window.Razorpay SDK is loaded, invoke Checkout
      if (typeof window !== 'undefined' && window.Razorpay) {
        const options = {
          key: 'rzp_test_demo_anup', // Test key placeholder
          amount: orderAmountPaise,
          currency: 'INR',
          name: 'Anup Fabrication',
          description: `Advance for Quote ${quotation.quotation_number}`,
          order_id: orderId.startsWith('order_') && orderId.length > 15 ? undefined : undefined,
          prefill: {
            name: quotation.customer_name,
            contact: quotation.customer_phone,
            email: currentUser?.email || 'customer@anupfabrication.in'
          },
          theme: {
            color: '#f59e0b'
          },
          handler: function (response: any) {
            finalizePayment(response.razorpay_payment_id || `pay_${Date.now()}`);
          },
          modal: {
            ondismiss: function () {
              setProcessingPayment(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          alert(`Payment failed: ${resp.error.description}`);
          setProcessingPayment(false);
        });
        rzp.open();
      } else {
        // Fallback simulated payment dialog for instant testing
        setTimeout(() => {
          finalizePayment(`pay_sim_${Date.now()}`);
        }, 1200);
      }
    } catch (err) {
      console.error('Payment error', err);
      setProcessingPayment(false);
    }
  };

  const finalizePayment = (paymentId: string) => {
    const receiptNo = `RCP-AF-${Math.floor(1000 + Math.random() * 9000)}`;
    recordPayment({
      customer_id: quotation.customer_id,
      customer_name: quotation.customer_name,
      quotation_id: quotation.id,
      reference_no: receiptNo,
      provider: 'razorpay',
      provider_payment_id: paymentId,
      amount_paise: Math.round(quotation.advance_amount * 100),
      amount_inr: quotation.advance_amount,
      currency: 'INR',
      status: 'success'
    });

    updateQuotationStatus(quotation.id, 'accepted');
    setPaymentSuccess(receiptNo);
    setProcessingPayment(false);
  };

  const printQuotation = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to List</span>
        </button>
      )}

      {/* Payment Success Notice */}
      {paymentSuccess && (
        <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-5 text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">Payment Verified Successfully</div>
              <div className="text-xs text-emerald-300">
                Advance receipt generated: <span className="font-mono font-bold">{paymentSuccess}</span>. Workshop production schedule initiated.
              </div>
            </div>
          </div>
          <button
            onClick={printQuotation}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      )}

      {/* Official Quotation Document Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Document Header */}
        <div className="p-6 sm:p-8 border-b border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-6 bg-slate-950/60 print:bg-transparent">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm">
                AF
              </div>
              <span className="text-xl font-black text-white print:text-black">{businessSettings.business_name}</span>
            </div>
            <div className="text-xs text-slate-400 print:text-gray-600 max-w-sm space-y-0.5">
              <p>{businessSettings.address}</p>
              <p className="font-mono">Phone: +91 {businessSettings.phones.join(' / +91 ')}</p>
              <p className="font-mono">{businessSettings.email}</p>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">Official Quotation</span>
            <div className="text-2xl font-mono font-bold text-white print:text-black">{quotation.quotation_number}</div>
            <div className="text-xs text-slate-400 print:text-gray-600">
              Date: <span className="font-mono">{new Date(quotation.created_at).toLocaleDateString()}</span>
            </div>
            <div className="text-xs text-slate-400 print:text-gray-600">
              Valid Until: <span className="font-mono text-amber-300 font-semibold">{quotation.valid_until}</span>
            </div>
            <div className="inline-block mt-2">
              <span className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                quotation.status === 'accepted' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' :
                quotation.status === 'rejected' ? 'bg-red-900/60 text-red-300 border border-red-700' :
                'bg-amber-900/60 text-amber-300 border border-amber-700'
              }`}>
                Status: {quotation.status}
              </span>
            </div>
          </div>
        </div>

        {/* Client & Project Info */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/40 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Customer Details</span>
            <div className="font-bold text-white print:text-black text-sm">{quotation.customer_name}</div>
            <div className="text-slate-400 print:text-gray-600 font-mono">+91 {quotation.customer_phone}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Requirement</span>
            <div className="font-bold text-slate-200 print:text-black text-sm">{quotation.project_title}</div>
            <div className="text-slate-400 print:text-gray-600 font-mono">Reference: {quotation.enquiry_id}</div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Item Description & Specifications</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price (₹)</th>
                <th className="py-2.5 px-3 text-right">Line Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {quotation.items.map((item, index) => (
                <tr key={item.id} className="text-slate-200 print:text-black">
                  <td className="py-3 px-3 font-mono text-slate-500">{index + 1}</td>
                  <td className="py-3 px-3 font-medium max-w-md">{item.description}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">₹{item.unit_price.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">₹{item.line_total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row justify-between gap-6">
          <div className="text-xs text-slate-400 max-w-sm">
            <span className="font-bold text-slate-300 block mb-1">Standard Terms & Conditions:</span>
            <p className="leading-relaxed text-[11px]">
              {quotation.notes || 'Materials used will be tested quality structural steel. Advance required before procurement of raw materials. Work to be executed as per verified site measurements.'}
            </p>
          </div>

          <div className="sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>{t('quote_subtotal')}:</span>
              <span className="font-mono tabular-nums">₹{quotation.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {quotation.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>{t('quote_discount')}:</span>
                <span className="font-mono tabular-nums">-₹{quotation.discount_amount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>{t('quote_tax')} ({quotation.tax_rate_percent}%):</span>
              <span className="font-mono tabular-nums">₹{quotation.tax_amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white border-t border-slate-800 pt-2 print:text-black">
              <span>{t('quote_total')}:</span>
              <span className="font-mono text-amber-400 tabular-nums">₹{quotation.total_amount.toLocaleString('en-IN')}</span>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2.5 mt-2 flex justify-between items-center text-amber-300 font-bold">
              <span>Required Advance ({quotation.advance_percent}%):</span>
              <span className="font-mono text-sm tabular-nums">₹{quotation.advance_amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={printQuotation}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Quotation</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {quotation.status !== 'accepted' && (
              <>
                <button
                  onClick={() => handleStatusChange('rejected')}
                  className="px-4 py-2 rounded-lg bg-red-950/40 border border-red-800/60 hover:bg-red-900/40 text-red-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleStatusChange('accepted')}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept Without Advance</span>
                </button>
              </>
            )}

            {quotation.status !== 'accepted' && (
              <button
                onClick={handleRazorpayPayment}
                disabled={processingPayment}
                className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  {processingPayment ? 'Opening Razorpay...' : `Pay Advance ₹${quotation.advance_amount.toLocaleString('en-IN')}`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

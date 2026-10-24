import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAppStore } from '../../lib/store';
import { OrderItem, FabricationStatus } from '../../types';
import { 
  Clock, 
  Wrench, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Radio, 
  Sparkles,
  Layers,
  ArrowRight,
  Maximize2,
  RefreshCw
} from 'lucide-react';

interface OrderStatusTrackerProps {
  onOpenNewQuote?: () => void;
}

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ onOpenNewQuote }) => {
  const { t, language } = useLanguage();
  const { orders, currentUser, isOrdersLiveSynced, updateOrderStatus } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | FabricationStatus>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Filter orders for the active user or demo customer
  const userOrders = orders.filter(order => {
    if (!currentUser || currentUser.role === 'admin') return true;
    return order.customer_id === currentUser.id || !order.customer_id;
  });

  // Filter by query and status tab
  const filteredOrders = userOrders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.project_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.dimensions && order.dimensions.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Status configuration definitions
  const STAGE_CONFIG: Record<FabricationStatus, {
    labelEn: string;
    labelHi: string;
    stepIndex: number;
    badgeBg: string;
    badgeText: string;
    borderColor: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }> = {
    pending_approval: {
      labelEn: 'Pending Approval',
      labelHi: 'प्रस्ताव / ड्राइंग अनुमोदन लंबित',
      stepIndex: 1,
      badgeBg: 'bg-amber-500/15',
      badgeText: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      icon: Clock,
      accentColor: '#f59e0b'
    },
    in_fabrication: {
      labelEn: 'In Fabrication',
      labelHi: 'वर्कशॉप में निर्माण कार्य जारी',
      stepIndex: 2,
      badgeBg: 'bg-cyan-500/15',
      badgeText: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      icon: Wrench,
      accentColor: '#06b6d4'
    },
    ready_for_delivery: {
      labelEn: 'Ready for Delivery',
      labelHi: 'डिलीवरी एवं स्थापना हेतु तैयार',
      stepIndex: 3,
      badgeBg: 'bg-emerald-500/15',
      badgeText: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      icon: Truck,
      accentColor: '#10b981'
    },
    delivered: {
      labelEn: 'Delivered & Installed',
      labelHi: 'सफलतापूर्वक डिलीवर एवं स्थापित',
      stepIndex: 4,
      badgeBg: 'bg-emerald-600/20',
      badgeText: 'text-emerald-300',
      borderColor: 'border-emerald-500/40',
      icon: CheckCircle2,
      accentColor: '#059669'
    }
  };

  const STAGES_LIST: { key: FabricationStatus; titleEn: string; titleHi: string; stepNumber: number }[] = [
    { key: 'pending_approval', titleEn: 'Pending Approval', titleHi: 'अनुमोदन', stepNumber: 1 },
    { key: 'in_fabrication', titleEn: 'In Fabrication', titleHi: 'निर्माण कार्य', stepNumber: 2 },
    { key: 'ready_for_delivery', titleEn: 'Ready for Delivery', titleHi: 'डिलीवरी तैयार', stepNumber: 3 },
    { key: 'delivered', titleEn: 'Delivered', titleHi: 'स्थापित', stepNumber: 4 }
  ];

  const handleSimulateStatusChange = async (orderId: string, nextStatus: FabricationStatus) => {
    setIsUpdating(orderId);
    let station = 'Workshop Bay';
    let desc = '';

    if (nextStatus === 'pending_approval') {
      station = 'Engineering & CAD Drafting Desk';
      desc = 'Structural engineering drawings submitted for customer approval.';
    } else if (nextStatus === 'in_fabrication') {
      station = 'MIG Welding & Assembly Bay #2';
      desc = 'Heavy steel cutting completed. Precision welding and frame assembly underway.';
    } else if (nextStatus === 'ready_for_delivery') {
      station = 'Final QC & Dispatch Staging Bay';
      desc = 'Passed weld integrity test and dual-coat paint coating. Wrapped for delivery truck dispatch.';
    } else if (nextStatus === 'delivered') {
      station = 'Client Site Installation Completed';
      desc = 'Successfully delivered, anchored, and tested on site.';
    }

    try {
      await updateOrderStatus(orderId, nextStatus, station, undefined, desc);
    } finally {
      setTimeout(() => setIsUpdating(null), 400);
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Status Notification Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <Radio className="w-5 h-5 animate-pulse text-amber-400" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-white">
                  {language === 'hi' ? 'लाइव प्रोजेक्ट एवं ऑर्डर ट्रैकर' : 'Live Fabrication Order Status Tracker'}
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>{isOrdersLiveSynced ? 'REAL-TIME WORKSHOP SYNC' : 'LIVE FIRESTORE CONNECTED'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'hi'
                  ? 'अपनी मेटल फैब्रिकेशन परियोजना की वर्तमान स्थिति देखें: पेंडिंग अप्रूवल, इन फैब्रिकेशन, या रेडी फॉर डिलीवरी।'
                  : 'Track your steel & metal fabrication progress in real-time through every workshop stage.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:7217853257"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Workshop Desk</span>
            </a>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Projects ({userOrders.length})
          </button>

          <button
            onClick={() => setFilterStatus('pending_approval')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              filterStatus === 'pending_approval'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Pending Approval</span>
            <span className="font-mono text-[10px] px-1.5 rounded bg-black/20">
              {userOrders.filter(o => o.status === 'pending_approval').length}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus('in_fabrication')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              filterStatus === 'in_fabrication'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            <span>In Fabrication</span>
            <span className="font-mono text-[10px] px-1.5 rounded bg-black/20">
              {userOrders.filter(o => o.status === 'in_fabrication').length}
            </span>
          </button>

          <button
            onClick={() => setFilterStatus('ready_for_delivery')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              filterStatus === 'ready_for_delivery'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ready for Delivery</span>
            <span className="font-mono text-[10px] px-1.5 rounded bg-black/20">
              {userOrders.filter(o => o.status === 'ready_for_delivery').length}
            </span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, gate, shed..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-300">No fabrication orders found</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery 
              ? `No orders matching "${searchQuery}". Try clearing search.` 
              : 'You have no orders currently in this status category.'}
          </p>
          {onOpenNewQuote && (
            <button
              onClick={onOpenNewQuote}
              className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer transition-colors"
            >
              Request a New Fabrication Quote
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const currentConfig = STAGE_CONFIG[order.status] || STAGE_CONFIG.pending_approval;
            const StatusIcon = currentConfig.icon;
            const currentStepNum = currentConfig.stepIndex;

            return (
              <div 
                key={order.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl overflow-hidden shadow-md transition-all"
              >
                {/* Order Header Strip */}
                <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-sm font-bold text-amber-400">
                        {order.order_number}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400 capitalize">
                        {order.service_category.replace('_', ' ')}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">
                        Customer: <span className="text-slate-200 font-medium">{order.customer_name}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {order.project_title}
                    </h3>
                  </div>

                  {/* Prominent Current Status Badge */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className={`px-3.5 py-1.5 rounded-lg border flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider ${currentConfig.badgeBg} ${currentConfig.badgeText} ${currentConfig.borderColor}`}>
                      <StatusIcon className="w-4 h-4 animate-pulse" />
                      <span>{language === 'hi' ? currentConfig.labelHi : currentConfig.labelEn}</span>
                    </div>
                  </div>
                </div>

                {/* 4-Stage Visual Progress Stepper */}
                <div className="p-5 sm:p-6 bg-slate-900/60 border-b border-slate-800/60">
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono uppercase text-[11px] tracking-wider font-semibold">
                      Fabrication Lifecycle Progress
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {order.progress_percent}% Complete
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden mb-6">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400"
                      style={{ width: `${Math.max(10, order.progress_percent)}%` }}
                    />
                  </div>

                  {/* 4 Step Badges Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {STAGES_LIST.map((stage) => {
                      const isPast = stage.stepNumber < currentStepNum;
                      const isCurrent = stage.stepNumber === currentStepNum;
                      const isFuture = stage.stepNumber > currentStepNum;

                      return (
                        <div
                          key={stage.key}
                          className={`p-3 rounded-lg border transition-all text-left flex flex-col justify-between ${
                            isCurrent
                              ? 'bg-slate-950 border-amber-500/60 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                              : isPast
                              ? 'bg-slate-950/40 border-emerald-500/30 text-slate-300'
                              : 'bg-slate-950/20 border-slate-800/60 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                              isCurrent ? 'bg-amber-500 text-slate-950' :
                              isPast ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                            }`}>
                              STEP {stage.stepNumber}
                            </span>
                            {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            {isCurrent && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                          </div>

                          <div className="font-bold text-xs text-white">
                            {stage.titleEn}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 font-sans">
                            {stage.titleHi}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details Section: Workshop Station & Specifications */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Active Station */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-1">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">
                        Active Workshop Bay / Station
                      </span>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5 text-amber-300">
                        <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{order.workshop_station}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {order.current_stage_description}
                      </p>
                    </div>

                    {/* Dimensions & Grade */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-1">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">
                        Material & Dimensions Spec
                      </span>
                      <div className="font-bold text-white text-sm">
                        {order.dimensions || 'Custom architectural specs'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        Grade: <span className="text-slate-300">{order.material_grade || 'Tata/Jindal Tested Steel'}</span>
                      </div>
                    </div>

                    {/* Delivery Target */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-1">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">
                        Estimated Delivery / Installation
                      </span>
                      <div className="font-bold text-emerald-400 text-sm flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{order.estimated_delivery_date}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Najafgarh Workshop dispatch team
                      </div>
                    </div>
                  </div>

                  {/* Timestamped Timeline Activity Log */}
                  {order.timeline && order.timeline.length > 0 && (
                    <div className="border border-slate-800/80 rounded-lg bg-slate-950/30 p-4">
                      <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center justify-between">
                        <span>Milestone Activity Trail</span>
                        <span className="text-[11px] text-slate-500 font-normal">
                          Last Updated: {new Date(order.updated_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {order.timeline.map((item, idx) => (
                          <div key={item.id || idx} className="flex items-start gap-3 text-xs">
                            <div className="mt-0.5">
                              {item.status === 'completed' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : item.status === 'current' ? (
                                <div className="w-4 h-4 rounded-full border-2 border-amber-400 flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-slate-700 bg-slate-900" />
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-200">{item.stage}</span>
                                {item.timestamp && (
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    ({new Date(item.timestamp).toLocaleDateString()})
                                  </span>
                                )}
                              </div>
                              {item.note && (
                                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                                  {item.note}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Bar & Real-time Status Switcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                    {/* Fast Status Simulation buttons for instant testing and demonstration */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-mono text-slate-400">
                        {currentUser?.role === 'admin' ? 'Change Status:' : 'Demo Live Transition:'}
                      </span>
                      <button
                        onClick={() => handleSimulateStatusChange(order.id, 'pending_approval')}
                        disabled={isUpdating === order.id}
                        className={`px-2 py-1 text-[11px] font-mono rounded cursor-pointer border transition-colors ${
                          order.status === 'pending_approval' 
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-500' 
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        Pending Approval
                      </button>

                      <button
                        onClick={() => handleSimulateStatusChange(order.id, 'in_fabrication')}
                        disabled={isUpdating === order.id}
                        className={`px-2 py-1 text-[11px] font-mono rounded cursor-pointer border transition-colors ${
                          order.status === 'in_fabrication' 
                            ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-500' 
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        In Fabrication
                      </button>

                      <button
                        onClick={() => handleSimulateStatusChange(order.id, 'ready_for_delivery')}
                        disabled={isUpdating === order.id}
                        className={`px-2 py-1 text-[11px] font-mono rounded cursor-pointer border transition-colors ${
                          order.status === 'ready_for_delivery' 
                            ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500' 
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        Ready for Delivery
                      </button>
                    </div>

                    {/* Customer Support CTA */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/917217853257?text=${encodeURIComponent(
                          `Hello Anup Fabrication, I am inquiring about the status of Order ${order.order_number} (${order.project_title}).`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Updates</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { X, Coffee, Check, Clock, Sparkles, ChefHat, Play, CheckCircle2, Plus } from 'lucide-react';
import { Order, OrderStatus } from '../types/coffee';
import { soundscape } from '../utils/audioSynth';

interface BaristaKDSProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAddDemoOrder: () => void;
}

export const BaristaKDS: React.FC<BaristaKDSProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  onAddDemoOrder,
}) => {
  if (!isOpen) return null;

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'queued': return 'dialing_in';
      case 'dialing_in': return 'brewing';
      case 'brewing': return 'ready';
      case 'ready': return 'completed';
      default: return null;
    }
  };

  const getActionLabel = (current: OrderStatus): string => {
    switch (current) {
      case 'queued': return 'Start Dialing In';
      case 'dialing_in': return 'Start Brewing & Steaming';
      case 'brewing': return 'Mark Ready at Bar';
      case 'ready': return 'Mark Handed Off';
      default: return 'Completed';
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'queued':
        return <span className="text-[11px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Queued</span>;
      case 'dialing_in':
        return <span className="text-[11px] font-mono text-blue-800 bg-blue-100 px-2 py-0.5 rounded">Dialing In</span>;
      case 'brewing':
        return <span className="text-[11px] font-mono text-orange-800 bg-orange-100 px-2 py-0.5 rounded">Extracting</span>;
      case 'ready':
        return <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold animate-pulse">Ready for Pickup</span>;
      case 'completed':
        return <span className="text-[11px] font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">Completed</span>;
    }
  };

  const activeOrders = orders.filter((o) => o.status !== 'completed');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1A1513] text-[#FAF7F2] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-[#3E322A] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* KDS Header */}
        <div className="p-4 sm:p-5 border-b border-[#3E322A] bg-[#241E1A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C26D38] rounded-lg text-white">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-[#FAF7F2]">
                  Live Barista Station (KDS)
                </h2>
                <span className="text-xs bg-[#3E322A] text-[#D8C3B5] px-2 py-0.5 rounded-full font-mono">
                  Synesso MVP Bar 1
                </span>
              </div>
              <div className="text-xs text-[#A8988B] mt-0.5">
                Active Queue: <span className="font-mono tabular-nums text-white font-bold">{activeOrders.length}</span> orders
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAddDemoOrder}
              className="px-3 py-1.5 bg-[#3E322A] hover:bg-[#4E3F35] text-[#FAF7F2] text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Customer Order</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#A8988B] hover:text-white hover:bg-[#3E322A] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeOrders.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-[#3E322A] rounded-2xl p-8">
              <Coffee className="w-12 h-12 text-[#5A493E] mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#FAF7F2]">All orders fulfilled!</h3>
              <p className="text-xs text-[#A8988B] max-w-sm mx-auto mt-1 mb-6">
                The espresso queue is clear. Click below to generate a test rush ticket or place an order from the customer menu.
              </p>
              <button
                onClick={onAddDemoOrder}
                className="px-5 py-2.5 bg-[#C26D38] hover:bg-[#A85926] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Inject Realistic Rush Ticket</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOrders.map((ord) => {
                const next = getNextStatus(ord.status);
                const actionText = getActionLabel(ord.status);

                return (
                  <div
                    key={ord.id}
                    className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                      ord.status === 'ready'
                        ? 'bg-[#212E24] border-emerald-700/60'
                        : 'bg-[#241E1A] border-[#3E322A]'
                    }`}
                  >
                    <div>
                      {/* Ticket Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-[#3E322A]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#FAF7F2]">{ord.id}</span>
                          <span className="text-xs text-[#A8988B] capitalize">
                            {ord.orderType === 'dine_in' ? `Table ${ord.tableNumber}` : ord.orderType}
                          </span>
                        </div>
                        {getStatusBadge(ord.status)}
                      </div>

                      {/* Guest name */}
                      <div className="mt-2.5 mb-3">
                        <div className="text-sm font-bold text-[#FAF7F2] font-serif">
                          {ord.customerName}
                        </div>
                        <div className="text-[11px] text-[#A8988B]">
                          Target: {ord.pickupTime}
                        </div>
                      </div>

                      {/* Drink items */}
                      <div className="space-y-2 mb-4">
                        {ord.items.map((it) => (
                          <div key={it.cartItemId} className="bg-[#1A1513] p-2 rounded-lg border border-[#3E322A]/60 text-xs">
                            <div className="font-semibold text-[#FAF7F2]">
                              {it.quantity}x {it.menuItem.name}
                            </div>
                            {it.customization && (
                              <div className="text-[11px] text-[#C26D38] font-mono mt-0.5">
                                {it.customization.size} · {it.customization.milk} milk
                                {it.customization.syrup !== 'none' && ` · ${it.customization.syrup.replace('_', ' ')}`}
                                {it.customization.extraShots > 0 && ` · +${it.customization.extraShots} shots`}
                                {it.customization.temperature !== 'hot' && ` · ${it.customization.temperature}`}
                              </div>
                            )}
                            {it.customization?.specialInstructions && (
                              <div className="text-[10px] text-amber-300 italic mt-0.5">
                                Note: "{it.customization.specialInstructions}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="pt-2 border-t border-[#3E322A]">
                      {next ? (
                        <button
                          onClick={() => {
                            if (next === 'ready') {
                              soundscape.triggerChime();
                            }
                            onUpdateOrderStatus(ord.id, next);
                          }}
                          className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            ord.status === 'brewing'
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                              : 'bg-[#C26D38] hover:bg-[#A85926] text-white'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{actionText}</span>
                        </button>
                      ) : (
                        <div className="text-center text-xs text-emerald-400 font-medium py-1">
                          Ready for Customer!
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Recently Completed section */}
          {completedOrders.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#3E322A]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#A8988B] mb-3">
                Completed Tickets ({completedOrders.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {completedOrders.slice(-6).map((co) => (
                  <div key={co.id} className="bg-[#241E1A] border border-[#3E322A] px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 text-[#A8988B]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-mono text-white">{co.id}</span>
                    <span>{co.customerName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

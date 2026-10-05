import React from 'react';
import { X, CheckCircle2, Clock, Coffee, Sparkles, ChefHat, Check } from 'lucide-react';
import { Order, OrderStatus } from '../types/coffee';

interface OrderTrackerModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenKDS: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenKDS,
}) => {
  if (!isOpen || !order) return null;

  const steps: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      key: 'queued',
      label: 'Order Confirmed',
      desc: 'Sent to the Synesso espresso bar',
      icon: Clock,
    },
    {
      key: 'dialing_in',
      label: 'Weighing & Dialing In',
      desc: 'Precision 18.0g single-origin grind dose',
      icon: Sparkles,
    },
    {
      key: 'brewing',
      label: 'Extracting & Steaming',
      desc: 'Pulling golden crema & velvet microfoam',
      icon: Coffee,
    },
    {
      key: 'ready',
      label: order.orderType === 'dine_in' ? `Ready for ${order.tableNumber || 'Table'}` : 'Ready at Pickup Counter',
      desc: 'Freshly plated with wooden saucer',
      icon: CheckCircle2,
    },
  ];

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'queued': return 0;
      case 'dialing_in': return 1;
      case 'brewing': return 2;
      case 'ready': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(order.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] text-[#1A1513] rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E5DCD2] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E5DCD2] bg-[#F4EFEB] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C26D38] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#C26D38] animate-pulse" />
              <span>Live Roastery Tracker</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[#1A1513]">{order.id}</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1A1513] mt-1">
              {order.status === 'ready' ? 'Your Coffee is Ready!' : 'Brewing for ' + order.customerName}
            </h2>
            <div className="text-xs text-[#8C6A54] mt-1">
              Estimated prep: <span className="font-mono tabular-nums font-semibold text-[#1A1513]">~4–6 minutes</span>
              {order.tableNumber && <span> · Seated at {order.tableNumber}</span>}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#4A3E38] hover:text-[#1A1513] hover:bg-[#E5DCD2] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Timeline */}
        <div className="p-5 sm:p-6 space-y-6">
          
          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5DCD2]">
            {steps.map((step, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isFuture = idx > currentIndex;

              return (
                <div key={step.key} className="relative flex items-start gap-4">
                  {/* Step indicator dot */}
                  <div
                    className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isPast
                        ? 'bg-[#1A1513] text-white'
                        : isCurrent
                        ? 'bg-[#C26D38] text-white ring-4 ring-[#F7EDE4] animate-pulse'
                        : 'bg-[#E5DCD2] text-[#8C6A54]'
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : <span className="text-[11px] font-mono">{idx + 1}</span>}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-semibold ${
                          isCurrent ? 'text-[#C26D38]' : isPast ? 'text-[#1A1513]' : 'text-[#8C6A54]'
                        }`}
                      >
                        {step.label}
                      </h4>
                      {isCurrent && (
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#C26D38] font-bold">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8C6A54] mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Itemized summary receipt */}
          <div className="bg-white p-4 rounded-xl border border-[#E5DCD2] space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#4A3E38] pb-1 border-b border-[#F4EFEB]">
              Order Summary ({order.items.length} items)
            </div>
            {order.items.map((it) => (
              <div key={it.cartItemId} className="flex justify-between text-xs py-1">
                <div>
                  <span className="font-semibold">{it.quantity}x</span> {it.menuItem.name}
                  {it.customization && (
                    <div className="text-[11px] text-[#8C6A54]">
                      {it.customization.size} · {it.customization.milk} milk
                    </div>
                  )}
                </div>
                <div className="font-mono tabular-nums font-semibold">
                  ${it.calculatedPrice.toFixed(2)}
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-[#F4EFEB] flex justify-between font-serif font-bold text-sm text-[#1A1513]">
              <span>Paid Total</span>
              <span className="font-mono tabular-nums">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Barista KDS hint */}
          <div className="bg-[#F4EFEB] p-3.5 rounded-lg border border-[#E5DCD2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-[#C26D38]" />
              <span className="text-xs text-[#4A3E38]">
                Want to test barista fulfillment?
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenKDS();
              }}
              className="text-xs font-semibold text-[#C26D38] hover:underline cursor-pointer"
            >
              Open Barista KDS Station →
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5DCD2] bg-[#F4EFEB] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1A1513] text-white text-xs font-semibold rounded-lg hover:bg-[#2C2420] transition-colors cursor-pointer"
          >
            Keep Order Open in Background
          </button>
        </div>

      </div>
    </div>
  );
};

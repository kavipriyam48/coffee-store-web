import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Check, Sparkles, MapPin, Coffee, Bike } from 'lucide-react';
import { CartItem, OrderType, Order } from '../types/coffee';
import { soundscape } from '../utils/audioSynth';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
}) => {
  if (!isOpen) return null;

  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupTime, setPickupTime] = useState('asap');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number; discountAmt: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Financial calculations
  const subtotal = items.reduce((acc, curr) => acc + curr.calculatedPrice, 0);
  const discountAmount = appliedPromo
    ? appliedPromo.percent > 0
      ? (subtotal * appliedPromo.percent) / 100
      : appliedPromo.discountAmt
    : 0;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const tipAmount = (taxableSubtotal * tipPercent) / 100;
  const total = taxableSubtotal + tipAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const clean = promoCodeInput.trim().toUpperCase();
    if (clean === 'FIRSTSIP') {
      setAppliedPromo({ code: 'FIRSTSIP', percent: 15, discountAmt: 0 });
    } else if (clean === 'ROASTER') {
      setAppliedPromo({ code: 'ROASTER', percent: 0, discountAmt: 5.0 });
    } else if (clean === 'FREECOFFEE8') {
      setAppliedPromo({ code: 'FREECOFFEE8', percent: 0, discountAmt: 6.5 });
    } else {
      setPromoError('Invalid code. Try "FIRSTSIP" for 15% off.');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!customerName.trim()) {
      alert('Please enter your name for the order.');
      return;
    }

    setIsSubmitting(true);

    const newOrder: Order = {
      id: `CS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName.trim(),
      phone: customerPhone.trim() || '(555) 329-8472',
      orderType,
      tableNumber: orderType === 'dine_in' ? tableNumber.trim() || 'Bar Counter' : undefined,
      pickupTime: pickupTime === 'asap' ? 'As soon as ready (~6-8 min)' : 'Scheduled',
      items: [...items],
      subtotal,
      discount: discountAmount,
      tip: tipAmount,
      total,
      status: 'queued',
      createdAt: Date.now(),
      estimatedMinutes: 7,
    };

    setTimeout(() => {
      soundscape.triggerChime();
      onOrderPlaced(newOrder);
      onClearCart();
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#FAF7F2] text-[#1A1513] h-full shadow-2xl flex flex-col border-l border-[#E5DCD2] animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5DCD2] bg-[#F4EFEB] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1A1513]">Your Order Bag</h2>
            <div className="text-xs text-[#8C6A54] mt-0.5">
              <span className="font-mono tabular-nums">{items.length}</span> {items.length === 1 ? 'item' : 'items'} in bag
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#4A3E38] hover:text-[#1A1513] hover:bg-[#E5DCD2] rounded-full transition-colors cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          
          {/* Order Type Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-2">
              Service Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pickup', label: 'Counter Pickup', icon: Coffee },
                { id: 'dine_in', label: 'Dine-In Table', icon: MapPin },
                { id: 'curbside', label: 'Bike Courier', icon: Bike },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setOrderType(opt.id as OrderType)}
                    className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      orderType === opt.id
                        ? 'border-[#C26D38] bg-[#F7EDE4] text-[#1A1513] font-semibold'
                        : 'border-[#E5DCD2] bg-white text-[#4A3E38]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#C26D38]" />
                    <span className="text-[11px] leading-tight">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {orderType === 'dine_in' && (
              <div className="mt-2.5 animate-in fade-in">
                <input
                  type="text"
                  placeholder="Enter Table # (e.g. Table 04 or Patio 2)..."
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5DCD2] bg-white focus:outline-none focus:border-[#C26D38]"
                />
              </div>
            )}
          </div>

          {/* Itemized List */}
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <Coffee className="w-10 h-10 text-[#D8C3B5] mx-auto mb-3" />
              <p className="text-sm font-serif font-bold text-[#1A1513]">Your bag is currently empty</p>
              <p className="text-xs text-[#8C6A54] mt-1">Explore our artisanal roasts and hand-baked pastries.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8C6A54] font-medium pb-1 border-b border-[#E5DCD2]">
                <span>Ordered Items</span>
                <button
                  onClick={onClearCart}
                  className="text-xs text-[#C26D38] hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              {items.map((cartItem) => (
                <div
                  key={cartItem.cartItemId}
                  className="p-3 bg-white border border-[#E5DCD2] rounded-xl flex gap-3 relative"
                >
                  <img
                    src={cartItem.menuItem.imageUrl}
                    alt={cartItem.menuItem.name}
                    className="w-14 h-14 rounded-lg object-cover border border-[#E5DCD2] shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="text-xs font-bold text-[#1A1513] truncate">
                      {cartItem.menuItem.name}
                    </h4>

                    {/* Customization Details */}
                    {cartItem.customization && (
                      <div className="text-[11px] text-[#8C6A54] mt-0.5 leading-snug">
                        <span>{cartItem.customization.size}</span>
                        <span> · {cartItem.customization.milk} milk</span>
                        {cartItem.customization.syrup !== 'none' && (
                          <span> · {cartItem.customization.syrup.replace('_', ' ')}</span>
                        )}
                        {cartItem.customization.extraShots > 0 && (
                          <span> · +{cartItem.customization.extraShots} shot</span>
                        )}
                        {cartItem.customization.temperature !== 'hot' && (
                          <span> · {cartItem.customization.temperature.replace('_', ' ')}</span>
                        )}
                        {cartItem.customization.specialInstructions && (
                          <div className="text-[#A85926] italic text-[10px] mt-0.5">
                            "{cartItem.customization.specialInstructions}"
                          </div>
                        )}
                      </div>
                    )}

                    {/* Stepper + Subtotal */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F4EFEB]">
                      <div className="flex items-center gap-2 bg-[#F4EFEB] rounded-md px-1.5 py-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                          className="text-[#4A3E38] hover:text-[#1A1513] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold w-4 text-center tabular-nums">
                          {cartItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                          className="text-[#4A3E38] hover:text-[#1A1513] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-mono text-xs font-bold text-[#1A1513] tabular-nums">
                        ${cartItem.calculatedPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(cartItem.cartItemId)}
                    className="absolute top-2.5 right-2.5 p-1 text-[#8C6A54] hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <>
              {/* Promo Code */}
              <div className="pt-2">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. FIRSTSIP)..."
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-white border border-[#E5DCD2] rounded-lg focus:outline-none focus:border-[#C26D38] uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#E5DCD2] hover:bg-[#D8C3B5] text-[#1A1513] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
                {appliedPromo && (
                  <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Code {appliedPromo.code} applied!</span>
                  </div>
                )}
                {promoError && (
                  <div className="text-[11px] text-amber-800 mt-1">{promoError}</div>
                )}
              </div>

              {/* Barista Tip Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-1.5">
                  Support the Barista Team
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTipPercent(pct)}
                      className={`py-2 text-xs rounded-lg border font-mono tabular-nums transition-colors cursor-pointer ${
                        tipPercent === pct
                          ? 'border-[#C26D38] bg-[#F7EDE4] text-[#1A1513] font-bold'
                          : 'border-[#E5DCD2] bg-white text-[#4A3E38]'
                      }`}
                    >
                      {pct === 0 ? 'No tip' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Contact */}
              <div className="space-y-2 pt-2 border-t border-[#E5DCD2]">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38]">
                  Pickup Details
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name (for order callout) *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5DCD2] bg-white focus:outline-none focus:border-[#C26D38]"
                />
                <input
                  type="tel"
                  placeholder="Mobile # (optional, for SMS ready chime)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5DCD2] bg-white focus:outline-none focus:border-[#C26D38]"
                />
              </div>

              {/* Ledger Summary */}
              <div className="bg-white p-4 rounded-xl border border-[#E5DCD2] space-y-2 text-xs">
                <div className="flex justify-between text-[#4A3E38]">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {tipAmount > 0 && (
                  <div className="flex justify-between text-[#4A3E38]">
                    <span>Barista Tip ({tipPercent}%)</span>
                    <span className="font-mono tabular-nums">+${tipAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#F4EFEB] font-serif font-bold text-sm sm:text-base text-[#1A1513]">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer Checkout CTA */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#E5DCD2] bg-[#F4EFEB]">
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || !customerName.trim()}
              className="w-full py-3.5 bg-[#C26D38] hover:bg-[#A85926] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Transmitting Order to Roastery...</span>
              ) : (
                <>
                  <span>Send Order to Bar · ${total.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <div className="text-[11px] text-center text-[#8C6A54] mt-2">
              Free cancellation within 2 minutes of placement · SCA Dial-in guaranteed
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

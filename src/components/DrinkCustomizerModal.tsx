import React, { useState } from 'react';
import { X, Check, Plus, Minus, Sparkles } from 'lucide-react';
import {
  MenuItem,
  CustomizationOptions,
  CupSize,
  MilkOption,
  SyrupOption,
  BeanOrigin,
  TemperatureOption,
} from '../types/coffee';

interface DrinkCustomizerModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, customization: CustomizationOptions, quantity: number, calculatedPrice: number) => void;
}

export const DrinkCustomizerModal: React.FC<DrinkCustomizerModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !item) return null;

  const [size, setSize] = useState<CupSize>('12oz');
  const [milk, setMilk] = useState<MilkOption>('whole');
  const [syrup, setSyrup] = useState<SyrupOption>('none');
  const [bean, setBean] = useState<BeanOrigin>('ethiopia_guji');
  const [temperature, setTemperature] = useState<TemperatureOption>('hot');
  const [extraShots, setExtraShots] = useState<number>(0);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Price calculations
  const calculateUnitPrice = (): number => {
    let price = item.price;

    if (size === '12oz') price += 0.50;
    if (size === '16oz') price += 1.00;

    if (milk === 'oat' || milk === 'almond') price += 0.75;
    if (milk === 'macadamia') price += 0.85;
    if (milk === 'heavy_cream') price += 0.50;

    if (syrup === 'vanilla') price += 0.60;
    if (syrup === 'cardamom_honey' || syrup === 'smoked_caramel') price += 0.85;
    if (syrup === 'lavender') price += 0.75;

    if (temperature === 'iced_cube') price += 0.40;
    if (temperature === 'nitro') price += 0.75;

    price += extraShots * 1.25;

    return Number(price.toFixed(2));
  };

  const unitPrice = calculateUnitPrice();
  const totalPrice = Number((unitPrice * quantity).toFixed(2));

  const handleConfirm = () => {
    const customization: CustomizationOptions = {
      size,
      milk,
      syrup,
      bean,
      temperature,
      extraShots,
      specialInstructions,
    };
    onAddToCart(item, customization, quantity, totalPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-[#FAF7F2] text-[#1A1513] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E5DCD2] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="relative border-b border-[#E5DCD2] bg-[#F4EFEB] p-5 sm:p-6 flex items-start justify-between">
          <div className="flex gap-4 items-center">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#E5DCD2] shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8C6A54]">
                {item.category.replace('_', ' ')}
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1513]">
                {item.name}
              </h2>
              <div className="text-xs text-[#4A3E38] mt-1">
                Base price: <span className="font-mono tabular-nums font-semibold">${item.price.toFixed(2)}</span>
                {item.calories && <span> · {item.calories} kcal</span>}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#4A3E38] hover:text-[#1A1513] hover:bg-[#E5DCD2] rounded-full transition-colors cursor-pointer"
            aria-label="Close customizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Customization Controls */}
        <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto space-y-6">
          
          {/* Cup Size */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-2.5">
              Select Cup Size
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: '8oz', label: '8oz Cortado', extra: '+$0.00' },
                { id: '12oz', label: '12oz Standard', extra: '+$0.50' },
                { id: '16oz', label: '16oz Grande', extra: '+$1.00' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSize(opt.id as CupSize)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    size === opt.id
                      ? 'border-[#C26D38] bg-[#F7EDE4] text-[#1A1513] shadow-xs font-semibold'
                      : 'border-[#E5DCD2] bg-white text-[#4A3E38] hover:border-[#8C6A54]'
                  }`}
                >
                  <div className="text-xs">{opt.label}</div>
                  <div className="font-mono text-[11px] text-[#8C6A54] tabular-nums mt-0.5">{opt.extra}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Bean Roast Profile */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-2.5">
              Dialed Single-Origin Roast
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'ethiopia_guji', name: 'Ethiopia Guji Natural', note: 'White Peach, Jasmine, Bergamot' },
                { id: 'colombia_huila', name: 'Colombia Huila Washed', note: 'Dark Chocolate, Candied Pecan' },
                { id: 'costa_rica_honey', name: 'Costa Rica Honey Process', note: 'Baked Apple, Spiced Maple' },
                { id: 'swiss_water_decaf', name: 'Swiss Water Peru (Decaf)', note: 'Milk Chocolate, Dried Cherry' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBean(b.id as BeanOrigin)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    bean === b.id
                      ? 'border-[#C26D38] bg-[#F7EDE4] text-[#1A1513]'
                      : 'border-[#E5DCD2] bg-white text-[#4A3E38] hover:border-[#8C6A54]'
                  }`}
                >
                  <div className="text-xs font-medium">{b.name}</div>
                  <div className="text-[11px] text-[#8C6A54] truncate mt-0.5">{b.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Milk Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-2.5">
              Milk or Alternative
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'whole', label: 'Local Whole Farm Milk', price: 'Included' },
                { id: 'oat', label: 'Oatly Barista Edition', price: '+$0.75' },
                { id: 'almond', label: 'House Pressed Almond', price: '+$0.75' },
                { id: 'macadamia', label: 'Macadamia Cream', price: '+$0.85' },
                { id: 'heavy_cream', label: 'Heavy Whipping Cream', price: '+$0.50' },
                { id: 'none', label: 'No Milk (Black)', price: '$0.00' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMilk(m.id as MilkOption)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    milk === m.id
                      ? 'border-[#C26D38] bg-[#F7EDE4] text-[#1A1513] font-medium'
                      : 'border-[#E5DCD2] bg-white text-[#4A3E38] hover:border-[#8C6A54]'
                  }`}
                >
                  <div className="text-xs truncate">{m.label}</div>
                  <div className="font-mono text-[11px] text-[#8C6A54] tabular-nums">{m.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Flavor Infusions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-2.5">
              House-Simmered Syrups & Botanical Notes
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'Unsweetened (Zero Sugar)', price: '$0.00' },
                { id: 'cardamom_honey', label: 'Spiced Cardamom Honey', price: '+$0.85' },
                { id: 'vanilla', label: 'Madagascar Bourbon Vanilla', price: '+$0.60' },
                { id: 'smoked_caramel', label: 'Smoked Sea Salt Caramel', price: '+$0.85' },
                { id: 'lavender', label: 'Wild Lavender Blossom', price: '+$0.75' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSyrup(s.id as SyrupOption)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    syrup === s.id
                      ? 'border-[#C26D38] bg-[#F7EDE4] text-[#1A1513] font-medium'
                      : 'border-[#E5DCD2] bg-white text-[#4A3E38] hover:border-[#8C6A54]'
                  }`}
                >
                  <div className="text-xs truncate">{s.label}</div>
                  <div className="font-mono text-[11px] text-[#8C6A54] tabular-nums">{s.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Temperature & Extra Shots row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-2">
                Serving Temperature
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'hot', label: 'Standard Hot (65°C)', price: 'Standard' },
                  { id: 'extra_hot', label: 'Extra Hot (72°C)', price: 'Free' },
                  { id: 'iced_cube', label: 'Iced w/ Clear Hand-Cut Cube', price: '+$0.40' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemperature(t.id as TemperatureOption)}
                    className={`w-full p-2 text-xs rounded-lg border flex items-center justify-between transition-all cursor-pointer ${
                      temperature === t.id
                        ? 'border-[#C26D38] bg-[#F7EDE4] text-[#1A1513] font-medium'
                        : 'border-[#E5DCD2] bg-white text-[#4A3E38]'
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className="font-mono text-[11px] text-[#8C6A54] tabular-nums">{t.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-2">
                Extra Ristretto Shots (+$1.25/ea)
              </label>
              <div className="flex items-center justify-between p-3 bg-white border border-[#E5DCD2] rounded-lg">
                <span className="text-xs text-[#4A3E38]">
                  {extraShots === 0 ? 'Standard Double Shot' : `+${extraShots} Extra Shot${extraShots > 1 ? 's' : ''}`}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={extraShots <= 0}
                    onClick={() => setExtraShots((prev) => Math.max(0, prev - 1))}
                    className="p-1 rounded-md bg-[#F4EFEB] hover:bg-[#E5DCD2] disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-bold text-sm w-4 text-center tabular-nums">
                    {extraShots}
                  </span>
                  <button
                    type="button"
                    disabled={extraShots >= 3}
                    onClick={() => setExtraShots((prev) => Math.min(3, prev + 1))}
                    className="p-1 rounded-md bg-[#F4EFEB] hover:bg-[#E5DCD2] disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Special Notes input */}
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Special barista notes (e.g. cinnamon dust, extra foam)..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E5DCD2] bg-white focus:outline-none focus:border-[#C26D38] placeholder:text-[#8C6A54]/60"
                  maxLength={100}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer with Live Quantity and Total Price */}
        <div className="border-t border-[#E5DCD2] bg-[#F4EFEB] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-semibold text-[#4A3E38]">Quantity</span>
            <div className="flex items-center gap-2 bg-white border border-[#E5DCD2] rounded-lg p-1">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 rounded text-[#4A3E38] hover:bg-[#F4EFEB] disabled:opacity-30 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-sm px-2 tabular-nums">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1 rounded text-[#4A3E38] hover:bg-[#F4EFEB] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="text-right sm:text-left sm:ml-4">
              <div className="text-[11px] text-[#8C6A54]">Item Total</div>
              <div className="font-mono text-lg font-bold text-[#1A1513] tabular-nums">
                ${totalPrice.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-[#4A3E38] hover:text-[#1A1513] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#C26D38] hover:bg-[#A85926] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Add to Order · ${totalPrice.toFixed(2)}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame, Droplets, Clock, Scale, Sparkles, Check, ShoppingBag } from 'lucide-react';
import { BEAN_PROFILES, BREW_METHODS } from '../data/coffeeData';
import { BeanProfile, MenuItem } from '../types/coffee';
import { soundscape } from '../utils/audioSynth';

interface BrewGuideSectionProps {
  onAddBeanToCart: (item: MenuItem) => void;
}

export const BrewGuideSection: React.FC<BrewGuideSectionProps> = ({
  onAddBeanToCart,
}) => {
  // Beans filter
  const [selectedRoast, setSelectedRoast] = useState<string>('all');
  
  // Brew Calculator State
  const [selectedMethodId, setSelectedMethodId] = useState<string>('v60');
  const [coffeeDose, setCoffeeDose] = useState<number>(20);
  
  // Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  const activeMethod = BREW_METHODS.find((m) => m.id === selectedMethodId) || BREW_METHODS[0];
  const waterTargetGrams = Math.round(coffeeDose * activeMethod.ratioMultiplier);

  // Timer tick
  useEffect(() => {
    let interval: number | null = null;
    if (isTimerActive) {
      interval = window.setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isTimerActive && interval) {
      window.clearInterval(interval);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isTimerActive]);

  const toggleTimer = () => {
    if (!isTimerActive && timerSeconds === 0) {
      soundscape.triggerChime();
    }
    setIsTimerActive(!isTimerActive);
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimerSeconds(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const filteredBeans = BEAN_PROFILES.filter((b) => {
    if (selectedRoast === 'all') return true;
    return b.roastLevel.toLowerCase().includes(selectedRoast.toLowerCase());
  });

  return (
    <section id="beans" className="py-16 lg:py-24 bg-[#FAF7F2] text-[#1A1513]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#8C6A54] mb-2 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#C26D38]" />
            <span>Terroir & Artisan Extraction</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1513]">
            Single-Origin Roastery & Hand Brew Lab
          </h2>
          <p className="text-sm text-[#4A3E38] font-light leading-relaxed mt-2">
            Every green lot is sourced directly from ethical farming cooperatives and roasted in small 6kg batches 
            to preserve regional terroir, crisp acidity, and delicate aromatics.
          </p>
        </div>

        {/* Bean Profiles Grid */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl font-bold text-[#1A1513]">
              Curated Roasts on the Counter
            </h3>
            
            {/* Roast Level Filter */}
            <div className="flex items-center gap-1 bg-[#F4EFEB] p-1 rounded-lg text-xs">
              {['all', 'Light', 'Medium'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedRoast(lvl)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer capitalize ${
                    selectedRoast === lvl
                      ? 'bg-white text-[#1A1513] shadow-xs font-semibold'
                      : 'text-[#4A3E38] hover:text-[#1A1513]'
                  }`}
                >
                  {lvl === 'all' ? 'All Roasts' : `${lvl} Roast`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBeans.map((bean) => (
              <div
                key={bean.id}
                className="bg-white border border-[#E5DCD2] rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#8C6A54] mb-2 uppercase font-medium">
                    <span>{bean.roastLevel} Roast</span>
                    <span className="font-mono tabular-nums">{bean.altitude}</span>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-[#1A1513] leading-snug">
                    {bean.name}
                  </h4>

                  <div className="text-xs text-[#8C6A54] mt-1 font-mono">
                    {bean.process}
                  </div>

                  <p className="text-xs text-[#4A3E38] font-light leading-relaxed mt-3">
                    {bean.description}
                  </p>

                  {/* Flavor profile tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {bean.flavorProfile.map((fl) => (
                      <span
                        key={fl}
                        className="text-[10px] bg-[#FAF7F2] border border-[#E5DCD2] text-[#4A3E38] px-2 py-0.5 rounded-sm"
                      >
                        {fl}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F4EFEB] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase text-[#8C6A54]">250g Valve Bag</div>
                    <div className="font-mono text-base font-bold text-[#1A1513] tabular-nums">
                      ${bean.pricePerBag.toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const menuItem: MenuItem = {
                        id: `bean-${bean.id}`,
                        name: `${bean.name} (250g Bag)`,
                        category: 'beans',
                        price: bean.pricePerBag,
                        description: bean.description,
                        imageUrl: bean.imageUrl,
                        isCustomizable: false,
                        dietary: ['organic', 'vegan'],
                      };
                      onAddBeanToCart(menuItem);
                    }}
                    className="px-3 py-1.5 bg-[#1A1513] hover:bg-[#C26D38] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order Bag</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Interactive Brew Ratio Calculator & Pour-Over Lab */}
        <div id="brew-guide" className="bg-[#F4EFEB] border border-[#E5DCD2] rounded-2xl p-6 sm:p-8 lg:p-10">
          <div className="max-w-2xl mb-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C26D38] mb-1">
              Precision Tool
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1513]">
              Interactive Brew Ratio & Pour Timer
            </h3>
            <p className="text-xs sm:text-sm text-[#4A3E38] mt-1 font-light leading-relaxed">
              Dial in extraction yield at home. Adjust dry coffee dose to calculate target water weight, recommended grind micron range, and temperature.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Method Selector + Dose Slider */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Method Buttons */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-2">
                  Select Brewing Apparatus
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BREW_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMethodId(m.id);
                        setCoffeeDose(m.defaultCoffeeGrams);
                      }}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedMethodId === m.id
                          ? 'border-[#C26D38] bg-white text-[#1A1513] shadow-xs font-semibold'
                          : 'border-[#E5DCD2] bg-[#FAF7F2] text-[#4A3E38] hover:border-[#8C6A54]'
                      }`}
                    >
                      <div className="text-xs truncate">{m.name.split(' ')[0]}</div>
                      <div className="text-[11px] font-mono text-[#8C6A54] mt-0.5">{m.ratio}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dose Slider */}
              <div className="bg-white p-5 rounded-xl border border-[#E5DCD2] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#4A3E38] flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-[#C26D38]" />
                    <span>Ground Coffee Dose</span>
                  </span>
                  <span className="font-mono text-lg font-bold text-[#1A1513] tabular-nums">
                    {coffeeDose}g
                  </span>
                </div>

                <input
                  type="range"
                  min="12"
                  max="45"
                  step="1"
                  value={coffeeDose}
                  onChange={(e) => setCoffeeDose(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#E5DCD2] rounded-lg appearance-none cursor-pointer accent-[#C26D38]"
                />

                <div className="flex justify-between text-[11px] text-[#8C6A54] font-mono">
                  <span>12g (1 Cup)</span>
                  <span>20g (Standard V60)</span>
                  <span>45g (Carafe Batch)</span>
                </div>
              </div>

              {/* Calculated Results Badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-xl border border-[#E5DCD2]">
                  <div className="text-[11px] text-[#8C6A54] flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-600" />
                    <span>Total Water</span>
                  </div>
                  <div className="font-mono text-xl font-bold text-[#1A1513] tabular-nums mt-1">
                    {waterTargetGrams}g
                  </div>
                  <div className="text-[10px] text-[#8C6A54] mt-0.5">Ratio {activeMethod.ratio}</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E5DCD2]">
                  <div className="text-[11px] text-[#8C6A54] flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#C26D38]" />
                    <span>Water Temp</span>
                  </div>
                  <div className="font-mono text-base font-bold text-[#1A1513] mt-1">
                    {activeMethod.temp}
                  </div>
                  <div className="text-[10px] text-[#8C6A54] mt-0.5">Off boil ~45s</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E5DCD2]">
                  <div className="text-[11px] text-[#8C6A54] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#8C6A54]" />
                    <span>Target Time</span>
                  </div>
                  <div className="font-mono text-base font-bold text-[#1A1513] mt-1">
                    {activeMethod.targetTime}
                  </div>
                  <div className="text-[10px] text-[#8C6A54] mt-0.5">{activeMethod.grind}</div>
                </div>
              </div>

            </div>

            {/* Right Column: Step-by-Step + Stopwatch */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-white p-6 rounded-xl border border-[#E5DCD2]">
              
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEB] mb-4">
                  <h4 className="font-serif font-bold text-[#1A1513]">
                    {activeMethod.name} Recipe
                  </h4>
                  
                  {/* Digital Stopwatch Display */}
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-lg font-bold text-[#C26D38] tabular-nums bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#E5DCD2]">
                      {formatTime(timerSeconds)}
                    </div>
                    <button
                      onClick={toggleTimer}
                      className="p-1.5 bg-[#1A1513] hover:bg-[#C26D38] text-white rounded-md transition-colors cursor-pointer"
                      title={isTimerActive ? 'Pause Timer' : 'Start Timer'}
                    >
                      {isTimerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>
                    <button
                      onClick={resetTimer}
                      className="p-1.5 bg-[#F4EFEB] hover:bg-[#E5DCD2] text-[#4A3E38] rounded-md transition-colors cursor-pointer"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Steps List */}
                <ol className="space-y-3">
                  {activeMethod.steps.map((st, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#4A3E38]">
                      <span className="font-mono font-bold text-[#C26D38] bg-[#F7EDE4] w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{st}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F4EFEB] text-[11px] text-[#8C6A54] flex items-center justify-between">
                <span>Recommended Bloom: {Math.round(coffeeDose * 2.5)}g water for 45s</span>
                <span className="text-[#C26D38] font-medium">Ready to pour</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

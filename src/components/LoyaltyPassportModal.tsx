import React from 'react';
import { X, Check, Award, Gift, Sparkles, RotateCcw, Copy } from 'lucide-react';
import { soundscape } from '../utils/audioSynth';

interface LoyaltyPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stampsCount: number;
  onAddStamp: () => void;
  onResetStamps: () => void;
}

export const LoyaltyPassportModal: React.FC<LoyaltyPassportModalProps> = ({
  isOpen,
  onClose,
  stampsCount,
  onAddStamp,
  onResetStamps,
}) => {
  if (!isOpen) return null;

  const totalRequired = 8;
  const isRewardUnlocked = stampsCount >= totalRequired;
  const rewardCode = 'FREECOFFEE8';
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rewardCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddStampClick = () => {
    soundscape.triggerChime();
    onAddStamp();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] text-[#1A1513] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E5DCD2] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E5DCD2] bg-[#F4EFEB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#C26D38]" />
            <h2 className="font-serif text-xl font-bold text-[#1A1513]">
              Digital Coffee Passport
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#4A3E38] hover:text-[#1A1513] hover:bg-[#E5DCD2] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          
          <div className="bg-[#1A1513] text-[#FAF7F2] p-6 rounded-2xl relative overflow-hidden shadow-md">
            {/* Subtle textured overlay */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#C26D38]/10 blur-2xl pointer-events-none" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#C26D38]">
                  Cinder & Steam Roasters
                </div>
                <div className="font-serif text-lg font-bold text-[#FAF7F2]">
                  Loyalty Stamp Card
                </div>
              </div>
              <div className="font-mono text-xs bg-[#2A221E] text-[#D8C3B5] px-2.5 py-1 rounded-md border border-[#3E322A]">
                {Math.min(stampsCount, totalRequired)} / {totalRequired} Stamps
              </div>
            </div>

            {/* 8 Stamp Circles Grid */}
            <div className="grid grid-cols-4 gap-3 my-4">
              {Array.from({ length: totalRequired }).map((_, idx) => {
                const isStamped = idx < stampsCount;
                const isLast = idx === totalRequired - 1;

                return (
                  <div
                    key={idx}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isStamped
                        ? 'border-[#C26D38] bg-[#C26D38]/20 text-[#FAF7F2] scale-100 shadow-xs'
                        : isLast
                        ? 'border-dashed border-[#C26D38]/60 bg-[#2A221E] text-[#C26D38]'
                        : 'border-[#3E322A] bg-[#241E1A] text-[#5A493E]'
                    }`}
                  >
                    {isStamped ? (
                      <Check className="w-5 h-5 text-[#C26D38] stroke-[3]" />
                    ) : isLast ? (
                      <Gift className="w-4 h-4 animate-bounce" />
                    ) : (
                      <span className="font-mono text-xs text-[#8C6A54]">{idx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-[#A8988B] text-center mt-4">
              Earn 1 stamp per handcrafted drink · 8th drink on the house
            </div>
          </div>

          {/* Reward Status or Action */}
          {isRewardUnlocked ? (
            <div className="bg-[#F7EDE4] border border-[#C26D38] rounded-xl p-4 text-center space-y-2 animate-in fade-in">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#C26D38] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Complimentary Brew Unlocked!</span>
              </div>
              <p className="text-xs text-[#4A3E38]">
                Use this reward code in checkout bag for a free signature beverage:
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <div className="font-mono text-base font-bold bg-white px-3 py-1.5 rounded-lg border border-[#E5DCD2] tracking-wider text-[#1A1513]">
                  {rewardCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-2 bg-[#1A1513] text-white rounded-lg hover:bg-[#2C2420] transition-colors cursor-pointer"
                  title="Copy Code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={handleAddStampClick}
                className="w-full py-3 bg-[#1A1513] hover:bg-[#2C2420] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Stamp In-Store Cup ({stampsCount} / {totalRequired})</span>
              </button>
              <div className="text-[11px] text-[#8C6A54] mt-2">
                Stamps also accrue automatically whenever you place an order.
              </div>
            </div>
          )}

          {/* Reset link */}
          {stampsCount > 0 && (
            <div className="text-center pt-2 border-t border-[#E5DCD2]">
              <button
                onClick={onResetStamps}
                className="text-[11px] text-[#8C6A54] hover:text-[#1A1513] flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset stamp card</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

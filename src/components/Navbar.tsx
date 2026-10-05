import React from 'react';
import { ShoppingBag, Volume2, VolumeX, Coffee } from 'lucide-react';
import { soundscape } from '../utils/audioSynth';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenPassport: () => void;
  onOpenReservation: () => void;
  onOpenKDS: () => void;
  activeOrderCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  activeSection,
  onNavigate,
  onOpenPassport,
  onOpenReservation,
  onOpenKDS,
  activeOrderCount,
}) => {
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);

  const toggleSound = () => {
    const newState = soundscape.toggle();
    setIsAudioPlaying(newState);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5DCD2] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('hero');
          }}
          className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1A1513] hover:text-[#C26D38] transition-colors whitespace-nowrap"
        >
          Cinder & Steam
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A3E38]">
          <button
            onClick={() => onNavigate('menu')}
            className={`hover:text-[#1A1513] transition-colors cursor-pointer pb-0.5 whitespace-nowrap ${
              activeSection === 'menu' ? 'text-[#1A1513] font-semibold border-b-2 border-[#C26D38]' : ''
            }`}
          >
            Menu
          </button>
          
          <button
            onClick={() => onNavigate('beans')}
            className={`hover:text-[#1A1513] transition-colors cursor-pointer pb-0.5 whitespace-nowrap ${
              activeSection === 'beans' ? 'text-[#1A1513] font-semibold border-b-2 border-[#C26D38]' : ''
            }`}
          >
            Single-Origins
          </button>

          <button
            onClick={() => onNavigate('brew-guide')}
            className={`hover:text-[#1A1513] transition-colors cursor-pointer pb-0.5 whitespace-nowrap ${
              activeSection === 'brew-guide' ? 'text-[#1A1513] font-semibold border-b-2 border-[#C26D38]' : ''
            }`}
          >
            Brew Guide
          </button>

          <button
            onClick={onOpenReservation}
            className="hover:text-[#1A1513] transition-colors cursor-pointer pb-0.5 whitespace-nowrap"
          >
            Reservations
          </button>

          <button
            onClick={onOpenPassport}
            className="hover:text-[#1A1513] transition-colors cursor-pointer pb-0.5 whitespace-nowrap"
          >
            Coffee Passport
          </button>

          <button
            onClick={onOpenKDS}
            className="hover:text-[#1A1513] transition-colors cursor-pointer pb-0.5 whitespace-nowrap flex items-center gap-1.5 text-[#8C6A54]"
            title="Open Live Barista Order Station"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Barista KDS</span>
            {activeOrderCount > 0 && (
              <span className="font-mono text-xs bg-[#E8DACB] text-[#1A1513] px-1.5 py-0.2 rounded-full tabular-nums">
                {activeOrderCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            aria-label={isAudioPlaying ? 'Mute cafe soundscape' : 'Play cafe soundscape'}
            className="p-2 rounded-full text-[#4A3E38] hover:text-[#1A1513] hover:bg-[#EFE8DD] transition-colors relative cursor-pointer"
            title={isAudioPlaying ? 'Mute Cafe Ambience' : 'Play Gentle Cafe Ambience'}
          >
            {isAudioPlaying ? (
              <Volume2 className="w-5 h-5 text-[#C26D38]" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-[#1A1513] text-[#FAF7F2] hover:bg-[#2C2420] px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag</span>
            <span className="font-mono tabular-nums bg-[#C26D38] text-white text-[11px] px-1.5 py-0.5 rounded-full font-bold">
              {cartCount}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};

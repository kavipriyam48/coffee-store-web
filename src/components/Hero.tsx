import React from 'react';
import { ArrowDown, Flame, Clock, Award, Sparkles } from 'lucide-react';
import heroImage from '../assets/images/hero_artisanal_espresso_1791194480752.jpg';

interface HeroProps {
  onExploreMenu: () => void;
  onExploreBeans: () => void;
  onOpenReservation: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreMenu,
  onExploreBeans,
  onOpenReservation,
}) => {
  return (
    <section id="hero" className="relative w-full overflow-hidden bg-[#1A1513] text-[#FAF7F2]">
      {/* Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Artisanal barista pouring silky microfoam latte art"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08] transition-transform duration-1000 scale-[1.02]"
        />
        {/* Measured scrim to guarantee 4.5:1 contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14100E] via-[#1A1513]/70 to-[#1A1513]/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-36 flex flex-col justify-end min-h-[580px] lg:min-h-[720px]">
        
        {/* Editorial Subtitle with Typographic Separators */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium tracking-wide text-[#E8DACB] uppercase mb-4">
          <span className="flex items-center gap-1.5 text-[#C26D38]">
            <Flame className="w-4 h-4 fill-[#C26D38]" />
            Microlot Roastery
          </span>
          <span aria-hidden="true" className="text-[#8C6A54]">·</span>
          <span>48-Hour Cold Extraction</span>
          <span aria-hidden="true" className="text-[#8C6A54]">·</span>
          <span>Baked In-House at 5:30 AM</span>
        </div>

        {/* Display Headline with text-wrap: balance */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[#FAF7F2] max-w-4xl leading-[1.08] mb-6 [text-wrap:balance]">
          Hand-roasted single origins, extracted with quiet devotion.
        </h1>

        <p className="text-base sm:text-lg text-[#D8C3B5] max-w-2xl font-light leading-relaxed mb-10">
          From high-altitude Ethiopian volcanic soils to our custom San Franciscan drum roaster. 
          Order ahead for contactless espresso bar pickup, dine in at our sunlit timber counter, or reserve a sensory cupping flight.
        </p>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-16">
          <button
            onClick={onExploreMenu}
            className="px-6 py-3.5 bg-[#C26D38] hover:bg-[#A85926] text-[#FAF7F2] font-semibold text-sm rounded-lg transition-all shadow-md cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <span>Order for Counter Pickup</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreBeans}
            className="px-6 py-3.5 bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 border border-[#FAF7F2]/30 text-[#FAF7F2] font-medium text-sm rounded-lg transition-all backdrop-blur-sm cursor-pointer whitespace-nowrap"
          >
            Explore Roasted Beans
          </button>

          <button
            onClick={onOpenReservation}
            className="px-5 py-3.5 text-xs text-[#E8DACB] hover:text-[#FAF7F2] transition-colors cursor-pointer flex items-center gap-1.5 underline decoration-[#C26D38] underline-offset-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C26D38]" />
            Book a Pour-Over Tasting Flight
          </button>
        </div>

        {/* Adjacency Claim-to-Proof Metric Rigor */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-[#FAF7F2]/15">
          <div>
            <div className="font-serif text-2xl lg:text-3xl font-bold text-[#FAF7F2] tabular-nums">
              88.5+
            </div>
            <div className="text-xs text-[#D8C3B5] mt-1">
              Average SCA Q-Grade Score
            </div>
          </div>

          <div>
            <div className="font-serif text-2xl lg:text-3xl font-bold text-[#FAF7F2] tabular-nums">
              100%
            </div>
            <div className="text-xs text-[#D8C3B5] mt-1">
              Direct-Trade Farm Traceability
            </div>
          </div>

          <div>
            <div className="font-serif text-2xl lg:text-3xl font-bold text-[#FAF7F2] tabular-nums">
              4 to 6m
            </div>
            <div className="text-xs text-[#D8C3B5] mt-1">
              Live Average Barista Prep Time
            </div>
          </div>

          <div>
            <div className="font-serif text-2xl lg:text-3xl font-bold text-[#FAF7F2] tabular-nums">
              Daily
            </div>
            <div className="text-xs text-[#D8C3B5] mt-1">
              Morning Roasting & Pastry Bake
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

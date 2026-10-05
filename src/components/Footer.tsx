import React from 'react';
import { MapPin, Clock, Mail, Phone, Flame } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenReservation: () => void;
  onOpenPassport: () => void;
  onOpenKDS: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenReservation,
  onOpenPassport,
  onOpenKDS,
}) => {
  return (
    <footer className="bg-[#1A1513] text-[#FAF7F2] border-t border-[#3E322A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="font-serif text-2xl font-bold tracking-tight text-[#FAF7F2]">
              Cinder & Steam
            </div>
            <p className="text-xs text-[#D8C3B5] leading-relaxed font-light">
              Specialty micro-batch coffee roasters and espresso bar. Committed to transparent direct trade, 
              meticulous roast profiling, and welcoming cafe hospitality.
            </p>
            <div className="text-[11px] text-[#A8988B] flex items-center gap-1.5 pt-2">
              <Flame className="w-3.5 h-3.5 text-[#C26D38]" />
              <span>Small-batch roasting daily on cast-iron drum</span>
            </div>
          </div>

          {/* Roastery Hours & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C26D38]">
              Roastery & Cafe Hours
            </h4>
            <div className="space-y-2 text-xs text-[#D8C3B5]">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#8C6A54] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#FAF7F2] font-medium">Monday – Friday</div>
                  <div className="text-[11px]">06:30 AM – 06:00 PM</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#8C6A54] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#FAF7F2] font-medium">Saturday & Sunday</div>
                  <div className="text-[11px]">07:30 AM – 06:30 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C26D38]">
              Visit & Inquiries
            </h4>
            <div className="space-y-2 text-xs text-[#D8C3B5]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8C6A54] shrink-0 mt-0.5" />
                <span>144 Artisan Way, Old Roasters Wharf, Suite 102</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8C6A54] shrink-0" />
                <span className="font-mono text-[11px]">(415) 890-2811</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8C6A54] shrink-0" />
                <span>orders@cinderandsteam.cafe</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C26D38]">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-[#D8C3B5]">
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Seasonal Drink Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('beans')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Single-Origin Beans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('brew-guide')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pour-Over Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenReservation}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Book Tasting Flight
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPassport}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Digital Coffee Passport
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenKDS}
                  className="hover:text-[#C26D38] transition-colors cursor-pointer text-[#8C6A54]"
                >
                  Barista KDS Station
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Quiet copyright, no buzzword telemetry */}
        <div className="pt-8 border-t border-[#3E322A] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C6A54] gap-4">
          <div>
            © {new Date().getFullYear()} Cinder & Steam Artisanal Roastery. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Direct Trade Certified</span>
            <span aria-hidden="true">·</span>
            <span>Ethical Cooperative Sourced</span>
            <span aria-hidden="true">·</span>
            <span>Zero Single-Use Plastics</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

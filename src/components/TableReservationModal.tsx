import React, { useState } from 'react';
import { X, Calendar, Users, Clock, Sparkles, Check, Coffee } from 'lucide-react';
import { Reservation } from '../types/coffee';
import { soundscape } from '../utils/audioSynth';

interface TableReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReservationConfirmed: (res: Reservation) => void;
}

export const TableReservationModal: React.FC<TableReservationModalProps> = ({
  isOpen,
  onClose,
  onReservationConfirmed,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<'tasting_flight' | 'table'>('tasting_flight');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('2026-10-06');
  const [timeSlot, setTimeSlot] = useState('10:30 AM');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<Reservation | null>(null);

  const timeSlots = [
    '08:30 AM', '09:30 AM', '10:30 AM', '11:45 AM',
    '01:15 PM', '02:30 PM', '03:45 PM', '05:00 PM',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newRes: Reservation = {
      id: `RES-${Math.floor(10000 + Math.random() * 90000)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '(555) 782-1940',
      date,
      timeSlot,
      guests,
      type,
      specialRequests: specialRequests.trim(),
      createdAt: Date.now(),
    };

    soundscape.triggerChime();
    setConfirmedBooking(newRes);
    onReservationConfirmed(newRes);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] text-[#1A1513] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E5DCD2] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E5DCD2] bg-[#F4EFEB] flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C26D38] mb-1">
              Table & Sensory Experience
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1A1513]">
              {confirmedBooking ? 'Reservation Confirmed' : 'Reserve at the Roastery'}
            </h2>
            <div className="text-xs text-[#8C6A54] mt-0.5">
              144 Artisan Way, Roasters Row · Outdoor patio & timber lounge
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#4A3E38] hover:text-[#1A1513] hover:bg-[#E5DCD2] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedBooking ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-7 h-7" />
            </div>

            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-[#8C6A54]">
                Booking Reference
              </div>
              <div className="font-mono text-2xl font-bold text-[#1A1513] mt-0.5">
                {confirmedBooking.id}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E5DCD2] text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-[#8C6A54]">Experience</span>
                <span className="font-semibold text-[#1A1513]">
                  {confirmedBooking.type === 'tasting_flight' ? 'Pour-Over Tasting Flight' : 'Cozy Cafe Table'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C6A54]">Guest Name</span>
                <span className="font-semibold text-[#1A1513]">{confirmedBooking.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C6A54]">Party Size</span>
                <span className="font-semibold text-[#1A1513]">{confirmedBooking.guests} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C6A54]">Date & Time</span>
                <span className="font-semibold text-[#1A1513]">{confirmedBooking.date} at {confirmedBooking.timeSlot}</span>
              </div>
            </div>

            <p className="text-xs text-[#8C6A54]">
              A confirmation email has been dispatched to {confirmedBooking.email}. Please arrive 5 minutes prior to your allocated time slot.
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#1A1513] text-white text-xs font-semibold rounded-lg hover:bg-[#2C2420] transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            
            {/* Experience Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-2">
                Choose Experience
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setType('tasting_flight')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    type === 'tasting_flight'
                      ? 'border-[#C26D38] bg-[#F7EDE4] text-[#1A1513] font-semibold shadow-xs'
                      : 'border-[#E5DCD2] bg-white text-[#4A3E38]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs text-[#C26D38] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tasting Flight</span>
                  </div>
                  <div className="text-[11px] text-[#4A3E38] mt-1 font-normal leading-tight">
                    3 single-origins with aroma cupping card & barista narrative
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setType('table')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    type === 'table'
                      ? 'border-[#C26D38] bg-[#F7EDE4] text-[#1A1513] font-semibold shadow-xs'
                      : 'border-[#E5DCD2] bg-white text-[#4A3E38]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs text-[#1A1513] font-bold">
                    <Coffee className="w-3.5 h-3.5 text-[#8C6A54]" />
                    <span>Table Reservation</span>
                  </div>
                  <div className="text-[11px] text-[#4A3E38] mt-1 font-normal leading-tight">
                    Sunlit booth or patio table for coffee & fresh pastries
                  </div>
                </button>
              </div>
            </div>

            {/* Date & Guests row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-1.5">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#E5DCD2] rounded-lg focus:outline-none focus:border-[#C26D38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-1.5">
                  Party Size
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-white border border-[#E5DCD2] rounded-lg focus:outline-none focus:border-[#C26D38]"
                >
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <option key={g} value={g}>
                      {g} {g === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3E38] mb-1.5">
                Available Time Slots
              </label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((ts) => (
                  <button
                    key={ts}
                    type="button"
                    onClick={() => setTimeSlot(ts)}
                    className={`py-2 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                      timeSlot === ts
                        ? 'border-[#C26D38] bg-[#1A1513] text-white font-semibold'
                        : 'border-[#E5DCD2] bg-white text-[#4A3E38] hover:border-[#8C6A54]'
                    }`}
                  >
                    {ts}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Inputs */}
            <div className="space-y-2 pt-2 border-t border-[#E5DCD2]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Full Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#E5DCD2] rounded-lg focus:outline-none focus:border-[#C26D38]"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#E5DCD2] rounded-lg focus:outline-none focus:border-[#C26D38]"
                />
              </div>

              <input
                type="text"
                placeholder="Special requests (e.g. Window booth, high chair, laptop seating)..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#E5DCD2] rounded-lg focus:outline-none focus:border-[#C26D38]"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#C26D38] hover:bg-[#A85926] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Confirm Roastery Reservation
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

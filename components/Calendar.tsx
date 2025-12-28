
import React from 'react';
import { CourseSlot, CourtType, Booking } from '../types';
import { COURT_CONFIG } from '../constants';

interface CalendarProps {
  year: number;
  month: number;
  slots: CourseSlot[];
  bookings: Booking[];
  isCoachView: boolean;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ 
  year, month, slots, bookings, isCoachView, selectedDate, onDateSelect 
}) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getDaySlots = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return slots.filter(s => s.date === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="w-full select-none">
      <div className="grid grid-cols-7 bg-slate-100 border-b">
        {weekdays.map(day => (
          <div key={day} className="py-2 text-center text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-tighter">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {paddingDays.map(d => (
          <div key={`p-${d}`} className="h-24 md:h-36 border-b border-r bg-slate-50/30"></div>
        ))}
        {days.map(day => {
          const daySlots = getDaySlots(day);
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = selectedDate === dateStr;
          
          return (
            <div 
              key={day} 
              onClick={() => onDateSelect(dateStr)}
              className={`h-24 md:h-36 border-b border-r p-1 cursor-pointer transition-all flex flex-col relative
                ${isSelected ? 'bg-orange-50/50 ring-2 ring-orange-500 ring-inset z-10' : 'hover:bg-slate-50'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold leading-none ${isToday(day) ? 'bg-orange-500 text-white w-5 h-5 flex items-center justify-center rounded-full' : isSelected ? 'text-orange-600' : 'text-slate-400'}`}>
                  {day}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide">
                {daySlots.map(slot => {
                  const booking = bookings.find(b => b.slotId === slot.id);
                  const isBooked = !!booking;
                  
                  return (
                    <div 
                      key={slot.id} 
                      className={`px-1 py-0.5 rounded text-[8px] md:text-[10px] leading-tight font-bold border shadow-xs relative
                        ${isBooked ? 'opacity-90 grayscale-[0.3]' : ''}
                        ${COURT_CONFIG[slot.type].color} ${COURT_CONFIG[slot.type].textColor} ${COURT_CONFIG[slot.type].borderColor}`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate">
                          {slot.startTime} {isBooked && '✅'}
                        </span>
                      </div>
                      {isBooked && isCoachView && (
                        <div className="mt-0.5 pt-0.5 border-t border-white/20 text-[7px] md:text-[9px] text-white">
                          👤 {booking.studentName}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

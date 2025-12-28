
import React from 'react';
import { CourseSlot, CourtType, Booking } from '../types';
import { COURT_CONFIG } from '../constants';

interface SlotDetailsProps {
  slot: CourseSlot;
  booking?: Booking;
  isCoachView: boolean;
  onBook: () => void;
}

const SlotDetails: React.FC<SlotDetailsProps> = ({ slot, booking, isCoachView, onBook }) => {
  const config = COURT_CONFIG[slot.type];
  const isSocial = slot.type === CourtType.SOCIAL;
  const isBooked = !!booking;

  return (
    <div className={`bg-white rounded-xl border p-4 shadow-sm transition-all hover:shadow-md ${config.borderColor} border-l-4 ${isBooked ? 'bg-slate-50' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-1">
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${config.color} ${config.textColor} border ${config.borderColor}`}>
            {config.name} {slot.courtNumber && `(${slot.courtNumber}號場)`}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-sm font-bold text-slate-700">
              {slot.startTime} - {slot.endTime}
            </span>
          </div>
        </div>

        {isBooked && (
          <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-green-200">
            已額滿
          </span>
        )}
      </div>

      {isBooked && (
        <div className="mt-3 p-2 rounded-lg bg-slate-100 border border-slate-200">
          {isCoachView ? (
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-700">👤 學員：{booking.studentName}</div>
              <div className="text-xs text-slate-500 font-medium">📞 電話：{booking.phone}</div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 font-medium italic">此時段已被其他學員預約</div>
          )}
        </div>
      )}

      {!isBooked && !isSocial && (
        <button 
          onClick={onBook}
          className={`w-full mt-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm border
            ${config.color} ${config.textColor} ${config.borderColor} hover:brightness-110 active:scale-95`}
        >
          立即預約
        </button>
      )}
    </div>
  );
};

export default SlotDetails;

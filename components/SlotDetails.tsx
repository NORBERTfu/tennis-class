
import React from 'react';
import { CourseSlot, CourtType, Booking, MapInfo } from '../types';
import { COURT_CONFIG } from '../constants';

interface SlotDetailsProps {
  slot: CourseSlot;
  booking?: Booking;
  isCoachView: boolean;
  mapInfo?: MapInfo;
  onBook: () => void;
}

const SlotDetails: React.FC<SlotDetailsProps> = ({ slot, booking, isCoachView, mapInfo, onBook }) => {
  const config = COURT_CONFIG[slot.type];
  const isSocial = slot.type === CourtType.SOCIAL;
  const isBooked = !!booking;

  return (
    <div className={`bg-white rounded-xl border p-4 shadow-sm transition-all hover:shadow-md ${config.borderColor} border-l-4 ${isBooked ? 'bg-slate-50 opacity-90' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${config.color} ${config.textColor} border ${config.borderColor}`}>
              {config.name} {slot.courtNumber && `(${slot.courtNumber}號場)`}
            </span>
            {mapInfo && (
              <a 
                href={mapInfo.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title={mapInfo.address}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
              </a>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-sm font-bold text-slate-700">
              {slot.startTime} - {slot.endTime}
            </span>
          </div>
        </div>

        {isBooked && (
          <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-green-200">
            已預訂
          </span>
        )}
      </div>

      {isBooked && (
        <div className="mt-3 p-2 rounded-lg bg-white border border-slate-200">
          {isCoachView ? (
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-700">👤 {booking.studentName}</div>
              <div className="text-xs text-slate-500 font-medium flex justify-between items-center">
                <span>📞 {booking.phone}</span>
                {booking.calendarLink && (
                  <a href={booking.calendarLink} target="_blank" className="text-blue-500 underline text-[10px]">檢視日曆</a>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium italic">此時段已由學員預約</span>
              {booking.calendarLink && (
                <button 
                  onClick={() => window.open(booking.calendarLink, '_blank')}
                  className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 font-bold"
                >
                  加入我的日曆
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {!isBooked && !isSocial && (
        <button 
          onClick={onBook}
          className={`w-full mt-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm border
            ${config.color} ${config.textColor} ${config.borderColor} hover:brightness-110 active:scale-95`}
        >
          立即預約時段
        </button>
      )}
    </div>
  );
};

export default SlotDetails;

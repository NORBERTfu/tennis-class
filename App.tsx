
import React, { useState, useEffect, useMemo } from 'react';
import { CourtType, CourseSlot, Booking } from './types';
import { COURT_CONFIG, INITIAL_SLOTS } from './constants';
import Calendar from './components/Calendar';
import SlotDetails from './components/SlotDetails';
import BookingModal from './components/BookingModal';

const App: React.FC = () => {
  const [slots, setSlots] = useState<CourseSlot[]>(INITIAL_SLOTS);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('tennis_bookings');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedDate, setSelectedDate] = useState<string>(new Date('2026-01-01').toISOString().split('T')[0]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [isCoachView, setIsCoachView] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');

  // 導航月份 (2026 1-5月)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(0); 

  useEffect(() => {
    localStorage.setItem('tennis_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const activeSlots = useMemo(() => {
    return slots.filter(s => s.date === selectedDate);
  }, [slots, selectedDate]);

  const handleBooking = (studentName: string, phone: string) => {
    if (!activeSlotId) return;
    
    const selectedSlot = slots.find(s => s.id === activeSlotId);
    if (!selectedSlot) return;

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      slotId: activeSlotId,
      studentName,
      phone
    };

    setBookings(prev => [...prev, newBooking]);
    setIsBookingModalOpen(false);
    setActiveSlotId(null);

    // 寄送 Email 到教練信箱
    const courtName = COURT_CONFIG[selectedSlot.type].name;
    const courtNum = selectedSlot.courtNumber ? `(${selectedSlot.courtNumber}號場)` : '';
    const emailSubject = encodeURIComponent(`[預約] ${studentName} - ${selectedSlot.date}`);
    const emailBody = encodeURIComponent(
      `學員預約通知：\n\n` +
      `姓名：${studentName}\n` +
      `電話：${phone}\n` +
      `時間：${selectedSlot.date} ${selectedSlot.startTime}-${selectedSlot.endTime}\n` +
      `地點：${courtName} ${courtNum}`
    );

    window.location.href = `mailto:norbert.fu@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    alert(`預約已提交！通知信件已準備發送至 norbert.fu@gmail.com`);
  };

  const handleCoachLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'norbert') {
      setIsCoachView(true);
      setShowLoginModal(false);
      setPassword('');
    } else {
      alert('密碼錯誤！');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-orange-500">🎾</span> 網球排課系統
          </h1>
          {isCoachView && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold border border-blue-200">
              教練管理模式
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isCoachView ? (
            <button 
              onClick={() => setIsCoachView(false)}
              className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors"
            >
              退出管理
            </button>
          ) : (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-all"
            >
              教練登入
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b bg-slate-50/50">
              <button onClick={() => setCurrentMonth(m => m === 0 ? 0 : m - 1)} className="p-2 hover:bg-white rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="text-lg font-bold text-slate-800">{currentYear}年 {currentMonth + 1}月</h2>
              <button onClick={() => setCurrentMonth(m => m === 4 ? 4 : m + 1)} className="p-2 hover:bg-white rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <Calendar 
              year={currentYear} 
              month={currentMonth} 
              slots={slots} 
              bookings={bookings}
              isCoachView={isCoachView}
              selectedDate={selectedDate} 
              onDateSelect={setSelectedDate} 
            />
          </div>
        </div>

        {/* Info & Booking Section */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              {selectedDate} 當日場次
            </h3>
            <div className="space-y-3">
              {activeSlots.length > 0 ? (
                activeSlots.map(slot => {
                  const booking = bookings.find(b => b.slotId === slot.id);
                  return (
                    <SlotDetails 
                      key={slot.id} 
                      slot={slot} 
                      booking={booking}
                      isCoachView={isCoachView}
                      onBook={() => {
                        setActiveSlotId(slot.id);
                        setIsBookingModalOpen(true);
                      }}
                    />
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm italic">此日期暫無排課</div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden">
            <div className="bg-slate-800 p-4 text-white font-bold">教練模式驗證</div>
            <form onSubmit={handleCoachLogin} className="p-6 space-y-4">
              <input 
                autoFocus
                type="password" 
                placeholder="請輸入密碼 (norbert)" 
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-slate-400"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowLoginModal(false)} className="flex-1 py-2 text-slate-500 font-bold">取消</button>
                <button type="submit" className="flex-1 py-2 bg-slate-800 text-white rounded-lg font-bold">登入</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal 
          onClose={() => setIsBookingModalOpen(false)} 
          onSubmit={handleBooking} 
        />
      )}
    </div>
  );
};

export default App;


import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { CourtType, CourseSlot, Booking, MapInfo } from './types';
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
  const [mapData, setMapData] = useState<Record<string, MapInfo>>({});
  const [isLoadingMaps, setIsLoadingMaps] = useState(false);

  // 導航月份
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(0); 

  const handleApiKeyConfig = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // 重啟頁面或重新獲取數據
      window.location.reload();
    }
  };

  // 初始化 Google 地圖數據 (Maps Grounding)
  useEffect(() => {
    const fetchMaps = async () => {
      setIsLoadingMaps(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const courtNames = ['社子網球場', '雙園網球場', '美堤網球場'];
        const results: Record<string, MapInfo> = {};

        for (const name of courtNames) {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `請提供台北市「${name}」的精確地址與 Google 地圖連結。`,
            config: {
              tools: [{googleMaps: {}}],
              // 調整安全設定以避免正常的地理位置查詢被誤判阻擋
              safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
              ]
            },
          });
          
          const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
          const mapChunk = chunks?.find((c: any) => c.maps);
          
          results[name] = {
            address: response.text?.split('\n')[0] || '台北市',
            url: mapChunk?.maps?.uri || `https://www.google.com/maps/search/${encodeURIComponent(name)}`
          };
        }
        setMapData(results);
      } catch (error: any) {
        console.error("Failed to fetch maps:", error);
        // 如果報錯包含 "Requested entity was not found"，代表 API Key 權限不足或未啟用 Grounding 功能
        if (error.message?.includes("Requested entity was not found")) {
          alert("Google 安全政策提示：目前的 API 金鑰未啟用 Google 地圖功能，請重新選擇一個付費專案的金鑰。");
          handleApiKeyConfig();
        }
      } finally {
        setIsLoadingMaps(false);
      }
    };
    fetchMaps();
  }, []);

  const generateGoogleCalendarLink = (slot: CourseSlot, studentName: string) => {
    const start = slot.date.replace(/-/g, '') + 'T' + slot.startTime.replace(':', '') + '00';
    const end = slot.date.replace(/-/g, '') + 'T' + slot.endTime.replace(':', '') + '00';
    const courtName = COURT_CONFIG[slot.type].name;
    const location = mapData[courtName]?.address || courtName;
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('🎾 網球課: ' + studentName)}&dates=${start}/${end}&details=${encodeURIComponent('教練：Norbert\n預約成功！')}&location=${encodeURIComponent(location)}`;
  };

  const handleBooking = (studentName: string, phone: string) => {
    if (!activeSlotId) return;
    
    const selectedSlot = slots.find(s => s.id === activeSlotId);
    if (!selectedSlot) return;

    const calendarLink = generateGoogleCalendarLink(selectedSlot, studentName);

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      slotId: activeSlotId,
      studentName,
      phone,
      calendarLink
    };

    setBookings(prev => [...prev, newBooking]);
    setIsBookingModalOpen(false);
    setActiveSlotId(null);

    // 寄送 Email
    const courtName = COURT_CONFIG[selectedSlot.type].name;
    const emailSubject = encodeURIComponent(`[網球預約確認] ${studentName} - ${selectedSlot.date}`);
    const emailBody = encodeURIComponent(
      `您好 ${studentName}，預約已收到！\n\n` +
      `時間：${selectedSlot.date} ${selectedSlot.startTime}-${selectedSlot.endTime}\n` +
      `地點：${courtName}\n` +
      `日曆同步：${calendarLink}\n\n` +
      `教練會盡快與您聯繫。`
    );

    window.location.href = `mailto:norbert.fu@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    
    // 詢問是否加入日曆
    if (confirm('預約信件已生成！是否立即將此課程加入您的 Google 日曆？')) {
      window.open(calendarLink, '_blank');
    }
  };

  const activeSlots = useMemo(() => {
    return slots.filter(s => s.date === selectedDate);
  }, [slots, selectedDate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-orange-500">🎾</span> 網球排課系統
          </h1>
          {isCoachView && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold border border-blue-200">
              管理模式
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleApiKeyConfig}
            className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 hover:bg-slate-200 px-2 py-1 rounded border border-slate-200 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            調整安全設定
          </button>
          {isCoachView ? (
            <button onClick={() => setIsCoachView(false)} className="text-xs font-bold text-slate-500 hover:text-red-500">退出</button>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg">教練登入</button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
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

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              {selectedDate} 當日場次
            </h3>
            <div className="space-y-3">
              {isLoadingMaps && <div className="text-center py-4 text-xs text-slate-400 animate-pulse">正在同步地圖資訊...</div>}
              {activeSlots.length > 0 ? (
                activeSlots.map(slot => (
                  <SlotDetails 
                    key={slot.id} 
                    slot={slot} 
                    booking={bookings.find(b => b.slotId === slot.id)}
                    isCoachView={isCoachView}
                    mapInfo={mapData[COURT_CONFIG[slot.type].name]}
                    onBook={() => {
                      setActiveSlotId(slot.id);
                      setIsBookingModalOpen(true);
                    }}
                  />
                ))
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
            <div className="bg-slate-800 p-4 text-white font-bold text-center">教練模式驗證</div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (password === 'norbert') { setIsCoachView(true); setShowLoginModal(false); setPassword(''); }
              else alert('密碼錯誤！');
            }} className="p-6 space-y-4">
              <input 
                type="password" 
                placeholder="請輸入密碼" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-800 outline-none"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowLoginModal(false)} className="flex-1 py-2 text-slate-500 font-bold">取消</button>
                <button type="submit" className="flex-1 py-2 bg-slate-800 text-white rounded-lg font-bold">登入</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBookingModalOpen && (
        <BookingModal onClose={() => setIsBookingModalOpen(false)} onSubmit={handleBooking} />
      )}
    </div>
  );
};

export default App;

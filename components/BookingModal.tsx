
import React, { useState } from 'react';

interface BookingModalProps {
  onClose: () => void;
  onSubmit: (name: string, phone: string) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    onSubmit(name, phone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-orange-500 px-6 py-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">預約排課</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">學員姓名</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
              placeholder="請輸入姓名"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">聯絡電話</label>
            <input 
              required
              type="tel" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
              placeholder="例如: 0912345678"
            />
          </div>
          
          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all active:scale-95"
            >
              確認預約
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            提交預約後，教練將會主動與您聯繫確認細節。
          </p>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;

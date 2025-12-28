
import { CourtType, CourseSlot } from './types';

export const COURT_CONFIG = {
  [CourtType.SHEZI]: {
    name: '社子網球場',
    color: 'bg-orange-500',
    textColor: 'text-white',
    borderColor: 'border-orange-600',
    description: '橘色：租用完成，確定開課'
  },
  [CourtType.SHUANGYUAN]: {
    name: '雙園網球場',
    color: 'bg-blue-500',
    textColor: 'text-white',
    borderColor: 'border-blue-600',
    description: '藍色：租用完成，確定開課'
  },
  [CourtType.MEITI]: {
    name: '美堤網球場',
    color: 'bg-rose-500',
    textColor: 'text-white',
    borderColor: 'border-rose-600',
    description: '美：租用完成，確定開課'
  },
  [CourtType.PENDING]: {
    name: '待排課',
    color: 'bg-white',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
    description: '白色：場地待租，意願調查'
  },
  [CourtType.SOCIAL]: {
    name: '球聚',
    color: 'bg-red-600',
    textColor: 'text-white',
    borderColor: 'border-red-700',
    description: '紅色：球友交流聚會'
  }
};

// 定義一月份雙園球場的精確時段對照表
const SHUANGYUAN_JAN_SCHEDULE: Record<string, number[]> = {
  '2026-01-18': [15, 16, 17],     // 15:00 - 18:00
  '2026-01-23': [18, 19, 20, 21], // 18:00 - 22:00
  '2026-01-26': [18, 19],         // 18:00 - 20:00
  '2026-01-27': [18, 19, 20],     // 18:00 - 21:00
  '2026-01-28': [18, 19, 20, 21], // 18:00 - 22:00
  '2026-01-30': [18, 19, 20, 21], // 18:00 - 22:00
};

const generateSplitSlots = (): CourseSlot[] => {
  const slots: CourseSlot[] = [];
  const startDate = new Date('2026-01-01');
  const endDate = new Date('2026-05-31');

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const day = d.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
    const isJanuary = d.getMonth() === 0;

    // 1/1 特殊指定 (Thu)
    if (dateStr === '2026-01-01') {
      slots.push({ id: `s-0101-15`, type: CourtType.SHEZI, startTime: '15:00', endTime: '16:00', date: dateStr, isConfirmed: true });
      slots.push({ id: `s-0101-16`, type: CourtType.SHEZI, startTime: '16:00', endTime: '17:00', date: dateStr, isConfirmed: true });
      continue;
    }

    // 處理雙園球場 (SHUANGYUAN)
    if (isJanuary) {
      // 一月份：嚴格遵循 SHUANGYUAN_JAN_SCHEDULE
      if (SHUANGYUAN_JAN_SCHEDULE[dateStr]) {
        SHUANGYUAN_JAN_SCHEDULE[dateStr].forEach(h => {
          slots.push({
            id: `sy-${dateStr}-${h}`,
            type: CourtType.SHUANGYUAN,
            startTime: `${String(h).padStart(2, '0')}:00`,
            endTime: `${String(h + 1).padStart(2, '0')}:00`,
            date: dateStr,
            isConfirmed: true,
            courtNumber: '1'
          });
        });
      }
    } else {
      // 二月以後：維持原有的週二、週三規律
      if (day === 2 || day === 3) {
        slots.push({ id: `sy-${dateStr}-19`, type: CourtType.SHUANGYUAN, startTime: '19:00', endTime: '20:00', date: dateStr, isConfirmed: true, courtNumber: '1' });
        slots.push({ id: `sy-${dateStr}-20`, type: CourtType.SHUANGYUAN, startTime: '20:00', endTime: '21:00', date: dateStr, isConfirmed: true, courtNumber: '1' });
      }
    }

    // 其他固定排課 (不分月份)
    // 週一：美堤 (18-21)
    if (day === 1) {
      slots.push({ id: `m-${dateStr}-18`, type: CourtType.MEITI, startTime: '18:00', endTime: '19:00', date: dateStr, isConfirmed: true, courtNumber: '3' });
      slots.push({ id: `m-${dateStr}-19`, type: CourtType.MEITI, startTime: '19:00', endTime: '20:00', date: dateStr, isConfirmed: true, courtNumber: '3' });
      slots.push({ id: `m-${dateStr}-20`, type: CourtType.MEITI, startTime: '20:00', endTime: '21:00', date: dateStr, isConfirmed: true, courtNumber: '3' });
    }
    
    // 週四：社子 (18-22)
    if (day === 4 && dateStr !== '2026-01-01') {
      slots.push({ id: `sz-${dateStr}-18`, type: CourtType.SHEZI, startTime: '18:00', endTime: '19:00', date: dateStr, isConfirmed: true });
      slots.push({ id: `sz-${dateStr}-19`, type: CourtType.SHEZI, startTime: '19:00', endTime: '20:00', date: dateStr, isConfirmed: true });
      slots.push({ id: `sz-${dateStr}-20`, type: CourtType.SHEZI, startTime: '20:00', endTime: '21:00', date: dateStr, isConfirmed: true });
      slots.push({ id: `sz-${dateStr}-21`, type: CourtType.SHEZI, startTime: '21:00', endTime: '22:00', date: dateStr, isConfirmed: true });
    }
    
    // 週六：社子 (14-18)
    if (day === 6) {
      slots.push({ id: `sz-${dateStr}-14`, type: CourtType.SHEZI, startTime: '14:00', endTime: '15:00', date: dateStr, isConfirmed: true });
      slots.push({ id: `sz-${dateStr}-15`, type: CourtType.SHEZI, startTime: '15:00', endTime: '16:00', date: dateStr, isConfirmed: true });
      slots.push({ id: `sz-${dateStr}-16`, type: CourtType.SHEZI, startTime: '16:00', endTime: '17:00', date: dateStr, isConfirmed: true });
      slots.push({ id: `sz-${dateStr}-17`, type: CourtType.SHEZI, startTime: '17:00', endTime: '18:00', date: dateStr, isConfirmed: true });
    }
    
    // 週日：待排課 (08-12)
    if (day === 0 && !SHUANGYUAN_JAN_SCHEDULE[dateStr]) {
      slots.push({ id: `p-${dateStr}-08`, type: CourtType.PENDING, startTime: '08:00', endTime: '09:00', date: dateStr, isConfirmed: false });
      slots.push({ id: `p-${dateStr}-09`, type: CourtType.PENDING, startTime: '09:00', endTime: '10:00', date: dateStr, isConfirmed: false });
      slots.push({ id: `p-${dateStr}-10`, type: CourtType.PENDING, startTime: '10:00', endTime: '11:00', date: dateStr, isConfirmed: false });
      slots.push({ id: `p-${dateStr}-11`, type: CourtType.PENDING, startTime: '11:00', endTime: '12:00', date: dateStr, isConfirmed: false });
    }
  }
  return slots;
};

export const INITIAL_SLOTS: CourseSlot[] = generateSplitSlots();

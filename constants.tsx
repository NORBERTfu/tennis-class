
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

// 輔助函式：產生切分好的時段
const generateSplitSlots = (): CourseSlot[] => {
  const slots: CourseSlot[] = [];
  const startDate = new Date('2026-01-01');
  const endDate = new Date('2026-05-31');

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const day = d.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat

    // 1/1 特殊指定 (Thu)
    if (dateStr === '2026-01-01') {
      slots.push({ id: `s-0101-15`, type: CourtType.SHEZI, startTime: '15:00', endTime: '16:00', date: dateStr, isConfirmed: true });
      slots.push({ id: `s-0101-16`, type: CourtType.SHEZI, startTime: '16:00', endTime: '17:00', date: dateStr, isConfirmed: true });
      continue;
    }

    // 週一：美堤 (18-21)
    if (day === 1) {
      slots.push({ id: `m-${dateStr}-18`, type: CourtType.MEITI, startTime: '18:00', endTime: '19:00', date: dateStr, isConfirmed: true, courtNumber: '3' });
      slots.push({ id: `m-${dateStr}-19`, type: CourtType.MEITI, startTime: '19:00', endTime: '20:00', date: dateStr, isConfirmed: true, courtNumber: '3' });
      slots.push({ id: `m-${dateStr}-20`, type: CourtType.MEITI, startTime: '20:00', endTime: '21:00', date: dateStr, isConfirmed: true, courtNumber: '3' });
    }
    // 週二、週三：雙園 (19-21)
    else if (day === 2 || day === 3) {
      slots.push({ id: `sy-${dateStr}-19`, type: CourtType.SHUANGYUAN, startTime: '19:00', endTime: '20:00', date: dateStr, isConfirmed: true, courtNumber: '1' });
      slots.push({ id: `sy-${dateStr}-20`, type: CourtType.SHUANGYUAN, startTime: '20:00', endTime: '21:00', date: dateStr, isConfirmed: true, courtNumber: '1' });
    }
    // 週四：社子 (18-22)
    else if (day === 4) {
      slots.push({ id: `sz-${dateStr}-18`, type: CourtType.SHEZI, startTime: '18:00', endTime: '19:00', date: dateStr, isConfirmed: true });
      slots.push({ id: `sz-${dateStr}-19`, type: CourtType.SHEZI, startTime: '19:00', endTime: '20:00', date: dateStr, isConfirmed: true });
      slots.push({ id: `sz-${dateStr}-20`, type: CourtType.SHEZI, startTime: '20:00', endTime: '21:00', date: dateStr, isConfirmed: true });
      slots.push({ id: `sz-${dateStr}-21`, type: CourtType.SHEZI, startTime: '21:00', endTime: '22:00', date: dateStr, isConfirmed: true });
    }
    // 週六：社子 (14-18)
    else if (day === 6) {
      slots.push({ id: `sz-${dateStr}-14`, type: CourtType.SHEZI, startTime: '14:00', endTime: '15:00', date: dateStr, isConfirmed: true });
      slots.push({ id: `sz-${dateStr}-15`, type: CourtType.SHEZI, startTime: '15:00', endTime: '16:00', date: dateStr, isConfirmed: true });
      slots.push({ id: `sz-${dateStr}-16`, type: CourtType.SHEZI, startTime: '16:00', endTime: '17:00', date: dateStr, isConfirmed: true });
      slots.push({ id: `sz-${dateStr}-17`, type: CourtType.SHEZI, startTime: '17:00', endTime: '18:00', date: dateStr, isConfirmed: true });
    }
    // 週日：待排課 (08-12)
    else if (day === 0) {
      slots.push({ id: `p-${dateStr}-08`, type: CourtType.PENDING, startTime: '08:00', endTime: '09:00', date: dateStr, isConfirmed: false });
      slots.push({ id: `p-${dateStr}-09`, type: CourtType.PENDING, startTime: '09:00', endTime: '10:00', date: dateStr, isConfirmed: false });
      slots.push({ id: `p-${dateStr}-10`, type: CourtType.PENDING, startTime: '10:00', endTime: '11:00', date: dateStr, isConfirmed: false });
      slots.push({ id: `p-${dateStr}-11`, type: CourtType.PENDING, startTime: '11:00', endTime: '12:00', date: dateStr, isConfirmed: false });
    }
  }
  return slots;
};

export const INITIAL_SLOTS: CourseSlot[] = generateSplitSlots();


export enum CourtType {
  SHEZI = 'SHEZI',           // 橘色 - 社子
  SHUANGYUAN = 'SHUANGYUAN', // 藍色 - 雙園
  MEITI = 'MEITI',           // 美 - 美堤
  PENDING = 'PENDING',       // 白色 - 待排課
  SOCIAL = 'SOCIAL'          // 球聚
}

export interface CourseSlot {
  id: string;
  type: CourtType;
  startTime: string; // e.g., "08:00"
  endTime: string;   // e.g., "11:00"
  courtNumber?: string;
  isConfirmed: boolean;
  date: string;      // YYYY-MM-DD
}

export interface Booking {
  id: string;
  slotId: string;
  studentName: string;
  phone: string;
}

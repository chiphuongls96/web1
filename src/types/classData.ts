export type ClassStatus = 'open' | 'upcoming' | 'full' | 'ongoing';

export interface ClassItem {
  id: string; // Mã lớp: e.g. CICI-HSK1-01
  name: string; // Tên lớp: e.g. HSK 1 Khởi Động: Nhập Môn & Phát Âm Chuẩn
  level: string; // Trình độ: HSK 1, HSK 2, HSK 3, Giao Tiếp, HSKK, Thiếu Nhi
  teacher: string; // Giảng viên: Cô CiCi, Thầy Vương...
  schedule: string; // Lịch học: T2 - T4 - T6 (19:30 - 21:00)
  format: string; // Hình thức: Online Zoom, Google Meet, Offline Hà Nội, 1 Kèm 1 VIP
  startDate: string; // Khai giảng: 25/10/2026
  duration: string; // Thời lượng: 24 buổi (2 tháng)
  totalSeats: number; // Sĩ số tối đa: 15
  enrolledCount: number; // Đã đăng ký: 12
  remainingSeats: number; // Chỗ còn lại: 3
  price: string; // Học phí ưu đãi: 1.850.000 đ
  originalPrice?: string; // Học phí gốc: 2.500.000 đ
  status: ClassStatus; // open / upcoming / full / ongoing
  registrationUrl?: string; // Link form đăng ký / nhóm Zalo
  description?: string; // Mô tả khóa học & cam kết đầu ra
  curriculumHighlights?: string[]; // Điểm nổi bật
  tags?: string[]; // Tag: "Học cùng cô CiCi", "Tặng giáo trình", "Cam kết đỗ HSK"
}

export interface ClassRegistration {
  id: string;
  classId: string;
  className: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  zaloPhone?: string;
  notes?: string;
  registeredAt: string;
  status: 'pending' | 'confirmed';
}

export interface GoogleSheetSyncStatus {
  isSyncing: boolean;
  lastSyncedAt: string | null;
  sheetUrl: string;
  sheetId: string;
  isOnline: boolean;
  error: string | null;
  itemCount: number;
  source: 'google-sheets-live' | 'cache' | 'default';
}

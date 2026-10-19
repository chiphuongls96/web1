import { ClassItem, ClassStatus } from '../types/classData';

// Default pre-populated Google Sheet URL for CiCi Chinese class database
// Users can change this in the Settings Modal to point to any public or link-shared Google Sheet
export const DEFAULT_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1_CICI_CHINESE_CLASSES_PUBLIC_DATABASE/edit?usp=sharing';

export const STORAGE_KEYS = {
  SHEET_URL: 'cici_google_sheet_url',
  CACHED_CLASSES: 'cici_cached_classes_data',
  LAST_SYNC: 'cici_last_sync_timestamp',
  REGISTRATIONS: 'cici_class_registrations',
};

// High quality initial classes dataset from CiCi Chinese
export const DEFAULT_CICI_CLASSES: ClassItem[] = [
  {
    id: 'CICI-HSK1-01',
    name: 'HSK 1 Khởi Động: Nhập Môn Phát Âm Chuẩn & 150 Từ Vựng 3.0',
    level: 'HSK 1',
    teacher: 'Cô CiCi (Thạc Sĩ ĐH Bắc Kinh)',
    schedule: 'Thứ 2 - 4 - 6 (19:30 - 21:00)',
    format: 'Online Zoom VIP tương tác trực tiếp',
    startDate: '28/10/2026',
    duration: '24 buổi (2 tháng)',
    totalSeats: 15,
    enrolledCount: 12,
    remainingSeats: 3,
    price: '1.850.000 đ',
    originalPrice: '2.500.000 đ',
    status: 'open',
    registrationUrl: 'https://zalo.me/0987654321',
    description:
      'Khóa học nền tảng tuyệt đối cho người mới bắt đầu. Rèn luyện khẩu hình chuẩn thanh mẫu, vận mẫu, 4 thanh điệu cùng cô CiCi. Nắm chắc 15 bài HSK 1 theo chuẩn mới HSK 3.0.',
    curriculumHighlights: [
      'Luyện phát âm chuẩn âm điệu Bắc Kinh cùng cô CiCi',
      'Làm chủ 150 từ vựng cốt lõi & 15 cấu trúc ngữ pháp cơ bản',
      'Tặng tài khoản phần mềm SRS Flashcard độc quyền CiCi Chinese',
      'Cam kết tự tin giao tiếp các tình huống chào hỏi, mua sắm, giới thiệu bản thân',
    ],
    tags: ['Học cùng cô CiCi', 'Tặng giáo trình HSK 3.0', 'Cam kết đầu ra'],
  },
  {
    id: 'CICI-HSK2-02',
    name: 'HSK 2 Nâng Cao: Phản Xạ Giao Tiếp Tự Nhiên & 300 Từ Vựng',
    level: 'HSK 2',
    teacher: 'Cô CiCi & Thầy Vương (Giảng viên bản ngữ)',
    schedule: 'Thứ 3 - 5 - 7 (19:30 - 21:00)',
    format: 'Online Zoom VIP tương tác trực tiếp',
    startDate: '02/11/2026',
    duration: '24 buổi (2 tháng)',
    totalSeats: 15,
    enrolledCount: 14,
    remainingSeats: 1,
    price: '2.150.000 đ',
    originalPrice: '2.800.000 đ',
    status: 'open',
    registrationUrl: 'https://zalo.me/0987654321',
    description:
      'Nâng cao khả năng phản xạ nghe nói thông qua các ngữ cảnh thực tế, làm chủ cấu trúc so sánh 比, câu tồn hiện và tích lũy 300 từ vựng HSK 2.',
    curriculumHighlights: [
      'Luyện phản xạ trực tiếp với giáo viên bản ngữ',
      'Thành thạo kỹ năng nghe hiểu đoạn hội thoại đời sống hàng ngày',
      'Chấm chữa ngữ điệu và phát âm 1:1 sau mỗi buổi học',
      'Được cấp chứng nhận hoàn thành khóa học của CiCi Chinese',
    ],
    tags: ['Giáo viên bản ngữ', 'Phản xạ cấp tốc', 'Chỉ còn 1 chỗ'],
  },
  {
    id: 'CICI-HSK3-03',
    name: 'HSK 3 Toàn Diện: Chinh Phục Ngữ Pháp Đỉnh Cao & 600 Từ Vựng',
    level: 'HSK 3',
    teacher: 'Cô CiCi & Thầy Trần (Chuyên gia luyện thi HSK)',
    schedule: 'Thứ 2 - 4 - 6 (20:00 - 21:30)',
    format: 'Online Zoom VIP tương tác trực tiếp',
    startDate: '10/11/2026',
    duration: '32 buổi (2.5 tháng)',
    totalSeats: 12,
    enrolledCount: 8,
    remainingSeats: 4,
    price: '2.650.000 đ',
    originalPrice: '3.500.000 đ',
    status: 'open',
    registrationUrl: 'https://zalo.me/0987654321',
    description:
      'Cột mốc quan trọng để giao tiếp thành thạo trong công việc và du học. Giải mã bí quyết các điểm ngữ pháp trọng điểm như câu chữ 把, câu chữ 被, bổ ngữ xu hướng kép.',
    curriculumHighlights: [
      'Nắm chắc 600 từ vựng và cấu trúc ngữ pháp phức tạp',
      'Thi thử trên hệ thống Mock Exam mô phỏng áp lực thực tế',
      'Cam kết đỗ chứng chỉ HSK 3 từ 240/300 điểm trở lên',
      'Bảo hành học lại miễn phí nếu không đạt mục tiêu cam kết',
    ],
    tags: ['Luyện thi chuyên sâu', 'Cam kết 240+ điểm', 'Hỗ trợ 24/7'],
  },
  {
    id: 'CICI-COMM-04',
    name: 'Tiếng Trung Giao Tiếp Thương Mại, Đàm Phán & Đánh Hàng Taobao - 1688',
    level: 'Giao Tiếp',
    teacher: 'Cô CiCi (Kinh nghiệm 8 năm đàm phán thương mại)',
    schedule: 'Thứ 7 & Chủ Nhật (14:00 - 16:30)',
    format: 'Online Zoom + Nhóm thực hành kín',
    startDate: '05/11/2026',
    duration: '16 buổi (2 tháng)',
    totalSeats: 18,
    enrolledCount: 15,
    remainingSeats: 3,
    price: '2.450.000 đ',
    originalPrice: '3.200.000 đ',
    status: 'open',
    registrationUrl: 'https://zalo.me/0987654321',
    description:
      'Khóa học thực chiến dành riêng cho dân kinh doanh, chủ shop, nhân viên xuất nhập khẩu. Học cách đàm phán giá cả, khiếu nại hàng lỗi, hợp đồng và chat trực tiếp với xưởng Trung Quốc.',
    curriculumHighlights: [
      'Bộ từ vựng và mẫu câu mặc cả, đàm phán hợp đồng thương mại',
      'Thực hành chat thực tế với chủ shop trên 1688, Taobao, Pinduoduo',
      'Quy trình vận chuyển chính ngạch/tiểu ngạch và cách xử lý rủi ro',
      'Cung cấp bộ danh bạ nguồn hàng uy tín tại Quảng Châu, Chiết Giang',
    ],
    tags: ['Thương mại thực chiến', 'Bí quyết đánh hàng', 'Cực hot'],
  },
  {
    id: 'CICI-HSKK-05',
    name: 'Luyện Thi HSKK Khẩu Ngữ Trung Cấp & Phát Âm Chuẩn 1:1',
    level: 'HSKK',
    teacher: 'Cô CiCi & Thầy Vương',
    schedule: 'Thứ 3 - 5 (20:30 - 22:00)',
    format: 'Online Zoom phòng nhỏ tương tác cao',
    startDate: '12/11/2026',
    duration: '16 buổi (1.5 tháng)',
    totalSeats: 10,
    enrolledCount: 10,
    remainingSeats: 0,
    price: '2.900.000 đ',
    originalPrice: '3.800.000 đ',
    status: 'full',
    registrationUrl: 'https://zalo.me/0987654321',
    description:
      'Chuyên luyện kỹ năng nói lưu loát, thuật kể chuyện theo tranh và ứng biến tình huống phỏng vấn xin học bổng chính phủ Trung Quốc (CSC).',
    curriculumHighlights: [
      'Rèn phản xạ nói không vấp theo đề thi thực tế',
      'Phát hiện và chỉnh sửa triệt để tật nuốt âm, sai thanh điệu',
      'Kho đề thi mẫu HSKK độc quyền sát đề thi thật 98%',
    ],
    tags: ['Lớp VIP giới hạn 10 học viên', 'Đã đủ học viên'],
  },
  {
    id: 'CICI-OFFLINE-HN-06',
    name: 'Tiếng Trung Toàn Diện Trực Tiếp Tại Hà Nội (Offline)',
    level: 'HSK 1 - 2',
    teacher: 'Cô CiCi & Đội ngũ Giảng viên CiCi Chinese',
    schedule: 'Thứ 2 - 4 (18:00 - 19:45)',
    format: 'Offline Trực Tiếp tại Cơ sở CiCi Chinese Cầu Giấy, Hà Nội',
    startDate: '15/11/2026',
    duration: '24 buổi (2.5 tháng)',
    totalSeats: 12,
    enrolledCount: 7,
    remainingSeats: 5,
    price: '3.200.000 đ',
    originalPrice: '4.200.000 đ',
    status: 'upcoming',
    registrationUrl: 'https://zalo.me/0987654321',
    description:
      'Học trực tiếp tại phòng học hiện đại có điều hòa, máy chiếu, trà hoa cúc và không gian giao lưu văn hóa Trung Hoa cùng cô CiCi.',
    curriculumHighlights: [
      'Tương tác trực tiếp không qua màn hình, sửa khẩu hình từng nét',
      'Tham gia câu lạc bộ văn hóa: Thư pháp, Trà đạo, làm sủi cảo',
      'Miễn phí 100% giáo trình in màu và tài liệu độc quyền',
    ],
    tags: ['Lớp Offline Hà Nội', 'Sắp khai giảng', 'Không gian cao cấp'],
  },
];

/**
 * Parses any Google Sheets URL or CSV URL and extracts the clean CSV download endpoint.
 */
export function buildGoogleSheetCsvUrl(rawUrl: string): { csvUrl: string; sheetId: string; gid: string } {
  let trimmed = rawUrl.trim();

  // If user entered just a Sheet ID (approx 44 alphanumeric chars)
  if (!trimmed.includes('/') && trimmed.length > 20) {
    return {
      csvUrl: `https://docs.google.com/spreadsheets/d/${trimmed}/gviz/tq?tqx=out:csv`,
      sheetId: trimmed,
      gid: '0',
    };
  }

  // Check if it's already a direct CSV or published output link
  if (trimmed.includes('pub?output=csv') || trimmed.includes('gviz/tq?tqx=out:csv')) {
    const idMatch = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/) || trimmed.match(/\/d\/e\/([a-zA-Z0-9-_]+)/);
    const id = idMatch ? idMatch[1] : 'custom-sheet';
    return { csvUrl: trimmed, sheetId: id, gid: '0' };
  }

  // Match /d/{SHEET_ID} in standard URL
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];

    // Extract gid if available (e.g. #gid=12345 or ?gid=12345)
    let gid = '0';
    const gidMatch = trimmed.match(/[#&?]gid=([0-9]+)/);
    if (gidMatch && gidMatch[1]) {
      gid = gidMatch[1];
    }

    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
    return { csvUrl, sheetId, gid };
  }

  // Fallback: use URL directly
  return { csvUrl: trimmed, sheetId: 'custom', gid: '0' };
}

/**
 * Robust CSV parser that correctly handles quoted fields, commas inside quotes, and newlines.
 */
export function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped double quote
        currentField += '"';
        i++; // skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Column delimiter
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      // Row delimiter
      if (char === '\r' && nextChar === '\n') {
        i++; // skip LF after CR
      }
      currentRow.push(currentField.trim());
      currentField = '';
      if (currentRow.some((f) => f.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  // Push last field & row if present
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Smartly maps parsed CSV rows to ClassItem objects with normalized Vietnamese/English header matching.
 */
export function mapCsvToClassItems(rows: string[][]): ClassItem[] {
  if (!rows || rows.length < 2) return [];

  const headers = rows[0].map((h) =>
    h
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
  );

  // Helper to find column index matching several potential names
  const findCol = (...keywords: string[]): number => {
    for (const kw of keywords) {
      const idx = headers.findIndex((h) => h.includes(kw));
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const idCol = findCol('malop', 'id', 'code', 'stt');
  const nameCol = findCol('tenlop', 'khoahoc', 'name', 'classname', 'course');
  const levelCol = findCol('capdo', 'trinhdo', 'level', 'hsk');
  const teacherCol = findCol('giangvien', 'giaovien', 'teacher', 'tutor');
  const scheduleCol = findCol('lichhoc', 'thoigian', 'schedule', 'time');
  const formatCol = findCol('hinhthuc', 'loaihinh', 'format', 'type');
  const dateCol = findCol('khaigiang', 'ngaybatdau', 'startdate', 'date');
  const durationCol = findCol('thoiluong', 'duration', 'sobuoi');
  const seatsCol = findCol('siso', 'toida', 'totalseats', 'max');
  const enrolledCol = findCol('dadangky', 'enrolled', 'dahoc');
  const remainingCol = findCol('conlai', 'chocon', 'remaining', 'left');
  const priceCol = findCol('hocphi', 'gia', 'price', 'tuition');
  const origPriceCol = findCol('giagoc', 'originalprice');
  const statusCol = findCol('trangthai', 'tinhtrang', 'status');
  const linkCol = findCol('link', 'dangky', 'url', 'zalo');
  const descCol = findCol('mota', 'description', 'noidung', 'ghichu', 'note');
  const tagsCol = findCol('tag', 'tags', 'nhan', 'uudai');

  const items: ClassItem[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length === 0 || !row.some((cell) => cell.length > 0)) continue;

    const getVal = (colIdx: number, defVal = ''): string => {
      if (colIdx >= 0 && colIdx < row.length) {
        return row[colIdx] || defVal;
      }
      return defVal;
    };

    const rawName = getVal(nameCol, `Lớp học Tiếng Trung #${r}`);
    if (!rawName) continue;

    const rawId = getVal(idCol, `CICI-${r.toString().padStart(2, '0')}`);
    const rawLevel = getVal(levelCol, 'HSK 1');
    const rawTeacher = getVal(teacherCol, 'Cô CiCi');
    const rawSchedule = getVal(scheduleCol, 'Tối 2 - 4 - 6 (19:30 - 21:00)');
    const rawFormat = getVal(formatCol, 'Online Zoom VIP');
    const rawDate = getVal(dateCol, 'Sắp khai giảng');
    const rawDuration = getVal(durationCol, '24 buổi');

    const totalSeatsNum = parseInt(getVal(seatsCol, '15').replace(/[^0-9]/g, ''), 10) || 15;
    let enrolledNum = parseInt(getVal(enrolledCol, '0').replace(/[^0-9]/g, ''), 10);
    let remainingNum = parseInt(getVal(remainingCol, '').replace(/[^0-9]/g, ''), 10);

    if (isNaN(remainingNum)) {
      remainingNum = Math.max(0, totalSeatsNum - enrolledNum);
    }
    if (isNaN(enrolledNum)) {
      enrolledNum = Math.max(0, totalSeatsNum - remainingNum);
    }

    const rawPrice = getVal(priceCol, '1.850.000 đ');
    const rawOrigPrice = getVal(origPriceCol, '');
    const rawStatus = getVal(statusCol, 'Đang mở đăng ký').toLowerCase();

    let status: ClassStatus = 'open';
    if (rawStatus.includes('sap') || rawStatus.includes('upcoming')) {
      status = 'upcoming';
    } else if (rawStatus.includes('het') || rawStatus.includes('du') || rawStatus.includes('full') || remainingNum <= 0) {
      status = 'full';
    } else if (rawStatus.includes('dien ra') || rawStatus.includes('dang hoc') || rawStatus.includes('ongoing')) {
      status = 'ongoing';
    }

    const rawLink = getVal(linkCol, 'https://zalo.me/0987654321');
    const rawDesc = getVal(
      descCol,
      'Khóa học tiếng Trung chất lượng cao cùng CiCi Chinese, lộ trình bám sát HSK 3.0 và phản xạ giao tiếp.'
    );
    const rawTags = getVal(tagsCol, 'Học cùng cô CiCi,Tặng giáo trình')
      .split(/[,;|]/)
      .map((t) => t.trim())
      .filter(Boolean);

    items.push({
      id: rawId,
      name: rawName,
      level: rawLevel,
      teacher: rawTeacher,
      schedule: rawSchedule,
      format: rawFormat,
      startDate: rawDate,
      duration: rawDuration,
      totalSeats: totalSeatsNum,
      enrolledCount: enrolledNum,
      remainingSeats: remainingNum,
      price: rawPrice.includes('đ') ? rawPrice : `${rawPrice} đ`,
      originalPrice: rawOrigPrice ? (rawOrigPrice.includes('đ') ? rawOrigPrice : `${rawOrigPrice} đ`) : undefined,
      status,
      registrationUrl: rawLink,
      description: rawDesc,
      curriculumHighlights: [
        `Giảng viên: ${rawTeacher}`,
        `Lịch học: ${rawSchedule}`,
        `Hình thức: ${rawFormat}`,
        'Cam kết chuẩn đầu ra HSK 3.0 & hỗ trợ kèm riêng',
      ],
      tags: rawTags.length > 0 ? rawTags : ['CiCi Chinese', 'HSK 3.0'],
    });
  }

  return items;
}

/**
 * Loads classes from configured Google Sheet URL, with fallback to cache or default dataset.
 */
export async function fetchClassesFromGoogleSheet(
  sheetUrlInput?: string
): Promise<{
  classes: ClassItem[];
  source: 'google-sheets-live' | 'cache' | 'default';
  error: string | null;
  sheetUrl: string;
}> {
  const targetUrl = sheetUrlInput || getSavedSheetUrl() || DEFAULT_SHEET_URL;

  // Attempt to fetch live from Google Sheets
  if (targetUrl && targetUrl !== DEFAULT_SHEET_URL) {
    try {
      const { csvUrl } = buildGoogleSheetCsvUrl(targetUrl);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const response = await fetch(csvUrl, {
        method: 'GET',
        headers: { Accept: 'text/csv, text/plain, */*' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const text = await response.text();
        if (text && (text.includes(',') || text.includes('\t'))) {
          const rows = parseCsvRows(text);
          const parsedClasses = mapCsvToClassItems(rows);

          if (parsedClasses.length > 0) {
            // Save to local cache
            try {
              localStorage.setItem(STORAGE_KEYS.CACHED_CLASSES, JSON.stringify(parsedClasses));
              localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
              localStorage.setItem(STORAGE_KEYS.SHEET_URL, targetUrl);
            } catch (e) {
              // ignore
            }

            return {
              classes: parsedClasses,
              source: 'google-sheets-live',
              error: null,
              sheetUrl: targetUrl,
            };
          }
        }
      }
    } catch (err: any) {
      console.warn('Could not fetch directly from Google Sheet link:', err);
    }
  }

  // Check cached classes from previous successful sync
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.CACHED_CLASSES);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return {
          classes: parsed,
          source: 'cache',
          error: null,
          sheetUrl: targetUrl,
        };
      }
    }
  } catch (e) {
    // ignore
  }

  // Fallback to default CiCi Chinese classes
  return {
    classes: DEFAULT_CICI_CLASSES,
    source: 'default',
    error: null,
    sheetUrl: DEFAULT_SHEET_URL,
  };
}

export function getSavedSheetUrl(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.SHEET_URL) || DEFAULT_SHEET_URL;
  } catch {
    return DEFAULT_SHEET_URL;
  }
}

export function saveSheetUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SHEET_URL, url.trim());
  } catch (e) {
    console.error('Error saving sheet url:', e);
  }
}

/**
 * Generates sample CSV template content that users can copy or upload directly to Google Sheets.
 */
export function generateSampleCsvTemplate(): string {
  const headers = [
    'Mã lớp',
    'Tên lớp học',
    'Cấp độ',
    'Giảng viên',
    'Lịch học',
    'Hình thức',
    'Khai giảng',
    'Thời lượng',
    'Sĩ số',
    'Đã đăng ký',
    'Số chỗ còn',
    'Học phí',
    'Giá gốc',
    'Trạng thái',
    'Link đăng ký',
    'Mô tả khóa học',
    'Tags ưu đãi',
  ];

  const sampleRows = [
    [
      'CICI-HSK1-01',
      'HSK 1 Khởi Động: Nhập Môn Phát Âm Chuẩn',
      'HSK 1',
      'Cô CiCi',
      'T2 - T4 - T6 (19:30 - 21:00)',
      'Online Zoom VIP',
      '28/10/2026',
      '24 buổi',
      '15',
      '12',
      '3',
      '1.850.000 đ',
      '2.500.000 đ',
      'Đang mở đăng ký',
      'https://zalo.me/0987654321',
      'Khóa học nền tảng tuyệt đối cho người mới bắt đầu',
      'Học cùng cô CiCi; Tặng giáo trình HSK 3.0',
    ],
    [
      'CICI-HSK2-02',
      'HSK 2 Nâng Cao: Phản Xạ Giao Tiếp',
      'HSK 2',
      'Cô CiCi & Thầy Vương',
      'T3 - T5 - T7 (19:30 - 21:00)',
      'Online Zoom VIP',
      '02/11/2026',
      '24 buổi',
      '15',
      '14',
      '1',
      '2.150.000 đ',
      '2.800.000 đ',
      'Đang mở đăng ký',
      'https://zalo.me/0987654321',
      'Luyện phản xạ giao tiếp tự nhiên cùng giáo viên bản ngữ',
      'Giáo viên bản ngữ; Còn 1 chỗ',
    ],
    [
      'CICI-COMM-03',
      'Tiếng Trung Thương Mại & Đánh Hàng Taobao - 1688',
      'Giao Tiếp',
      'Cô CiCi',
      'T7 - CN (14:00 - 16:30)',
      'Online Zoom',
      '05/11/2026',
      '16 buổi',
      '18',
      '15',
      '3',
      '2.450.000 đ',
      '3.200.000 đ',
      'Đang mở đăng ký',
      'https://zalo.me/0987654321',
      'Học đàm phán giá cả, khiếu nại, chat xưởng Trung Quốc',
      'Thực chiến 1688; Taobao; Mặc cả',
    ],
  ];

  const csvLines = [headers.join(',')];
  for (const row of sampleRows) {
    csvLines.push(row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','));
  }

  return csvLines.join('\n');
}

/**
 * Saves a new course registration from a student.
 */
export function saveStudentRegistration(registration: {
  classId: string;
  className: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  zaloPhone?: string;
  notes?: string;
}): void {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRATIONS) || '[]');
    const newEntry = {
      id: `reg-${Date.now()}`,
      ...registration,
      registeredAt: new Date().toISOString(),
      status: 'pending',
    };
    existing.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save student registration:', e);
  }
}

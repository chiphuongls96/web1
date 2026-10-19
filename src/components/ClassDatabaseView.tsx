import React, { useState, useEffect } from 'react';
import {
  ClassItem,
  ClassStatus,
  GoogleSheetSyncStatus,
} from '../types/classData';
import {
  fetchClassesFromGoogleSheet,
  getSavedSheetUrl,
  saveSheetUrl,
  saveStudentRegistration,
  generateSampleCsvTemplate,
  DEFAULT_SHEET_URL,
  DEFAULT_CICI_CLASSES,
} from '../services/googleSheetService';
import {
  Database,
  RefreshCw,
  ExternalLink,
  Settings,
  Search,
  Filter,
  Users,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  MessageSquare,
  FileSpreadsheet,
  Download,
  Phone,
  Send,
  X,
  ChevronRight,
  BookOpen,
  LayoutGrid,
  List,
  Tag,
  Video,
  MapPin,
} from 'lucide-react';

interface ClassDatabaseViewProps {
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const ClassDatabaseView: React.FC<ClassDatabaseViewProps> = ({
  onOpenAiWithPrompt,
}) => {
  const [classes, setClasses] = useState<ClassItem[]>(DEFAULT_CICI_CLASSES);
  const [syncStatus, setSyncStatus] = useState<GoogleSheetSyncStatus>({
    isSyncing: false,
    lastSyncedAt: null,
    sheetUrl: getSavedSheetUrl(),
    sheetId: 'cici-chinese-db',
    isOnline: true,
    error: null,
    itemCount: DEFAULT_CICI_CLASSES.length,
    source: 'default',
  });

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [sheetUrlInput, setSheetUrlInput] = useState(getSavedSheetUrl());
  const [selectedClassForDetails, setSelectedClassForDetails] = useState<ClassItem | null>(null);
  const [selectedClassForReg, setSelectedClassForReg] = useState<ClassItem | null>(null);

  // Registration Form State
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regZalo, setRegZalo] = useState('');
  const [regNotes, setRegNotes] = useState('');
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    handleSync(false);
  }, []);

  const handleSync = async (forceUserUrl = false) => {
    setSyncStatus((prev) => ({ ...prev, isSyncing: true, error: null }));
    try {
      const urlToFetch = forceUserUrl ? sheetUrlInput : undefined;
      const res = await fetchClassesFromGoogleSheet(urlToFetch);

      setClasses(res.classes);
      setSyncStatus({
        isSyncing: false,
        lastSyncedAt: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        sheetUrl: res.sheetUrl,
        sheetId: res.sheetUrl.includes('/d/') ? res.sheetUrl.split('/d/')[1].split('/')[0] : 'custom',
        isOnline: true,
        error: res.error,
        itemCount: res.classes.length,
        source: res.source,
      });
    } catch (err: any) {
      setSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        error: 'Không thể kết nối đến Google Sheets. Đang hiển thị dữ liệu lưu đệm.',
      }));
    }
  };

  const handleSaveSheetConfig = () => {
    saveSheetUrl(sheetUrlInput);
    setIsConfigModalOpen(false);
    handleSync(true);
  };

  const handleResetToDefaultSheet = () => {
    setSheetUrlInput(DEFAULT_SHEET_URL);
    saveSheetUrl(DEFAULT_SHEET_URL);
    setIsConfigModalOpen(false);
    handleSync(true);
  };

  const handleDownloadCsvTemplate = () => {
    const csvContent = generateSampleCsvTemplate();
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'cici_chinese_lop_hoc_mau.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassForReg || !regFullName || !regPhone) {
      alert('Vui lòng điền Họ tên và Số điện thoại / Zalo.');
      return;
    }

    saveStudentRegistration({
      classId: selectedClassForReg.id,
      className: selectedClassForReg.name,
      fullName: regFullName,
      phoneNumber: regPhone,
      zaloPhone: regZalo || regPhone,
      notes: regNotes,
    });

    setRegSuccessMessage(
      `Đăng ký thành công lớp "${selectedClassForReg.name}"! Ban tư vấn CiCi Chinese sẽ liên hệ qua SĐT ${regPhone} trong vòng 30 phút.`
    );

    setTimeout(() => {
      setRegSuccessMessage(null);
      setSelectedClassForReg(null);
      setRegFullName('');
      setRegPhone('');
      setRegZalo('');
      setRegNotes('');
    }, 2500);
  };

  // Filtered classes logic
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      searchTerm === '' ||
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cls.description && cls.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLevel =
      selectedLevel === 'all' ||
      cls.level.toLowerCase().includes(selectedLevel.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'open' && cls.status === 'open') ||
      (selectedStatus === 'upcoming' && cls.status === 'upcoming') ||
      (selectedStatus === 'available' && cls.remainingSeats > 0);

    const matchesFormat =
      selectedFormat === 'all' ||
      (selectedFormat === 'online' && cls.format.toLowerCase().includes('online')) ||
      (selectedFormat === 'offline' && cls.format.toLowerCase().includes('offline'));

    return matchesSearch && matchesLevel && matchesStatus && matchesFormat;
  });

  // Calculate statistics
  const totalOpenClasses = classes.filter((c) => c.status === 'open').length;
  const totalSeatsLeft = classes.reduce((acc, c) => acc + (c.remainingSeats || 0), 0);
  const totalLevels = Array.from(new Set(classes.map((c) => c.level))).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Online Database Connection Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Database className="w-3.5 h-3.5" />
                <span>Google Sheets Live Database</span>
              </span>

              {syncStatus.source === 'google-sheets-live' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-500/40 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Đã kết nối trực tuyến
                </span>
              ) : syncStatus.source === 'cache' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-medium border border-amber-500/30">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Dữ liệu bộ nhớ đệm
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 text-[11px] font-medium border border-teal-500/30">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  Dữ liệu chính thức CiCi Chinese
                </span>
              )}

              {syncStatus.lastSyncedAt && (
                <span className="text-[11px] text-slate-400">
                  Đồng bộ lúc: {syncStatus.lastSyncedAt}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Danh Sách Lớp Học Trực Tuyến
              <span className="text-emerald-400 font-calligraphy text-2xl font-normal">
                (课程表)
              </span>
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Cơ sở dữ liệu danh sách lớp học được đồng bộ theo thời gian thực từ Google Sheets của{' '}
              <strong className="text-emerald-400">CiCi Chinese</strong>. Cập nhật liên tục lịch
              khai giảng, số chỗ còn trống, học phí ưu đãi và giảng viên phụ trách.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            <button
              onClick={() => handleSync(true)}
              disabled={syncStatus.isSyncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-700/30 transition-all active:scale-95 disabled:opacity-50"
              title="Đồng bộ dữ liệu mới nhất từ Google Sheets"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${syncStatus.isSyncing ? 'animate-spin' : ''}`}
              />
              <span>{syncStatus.isSyncing ? 'Đang đồng bộ...' : 'Làm mới (Sync)'}</span>
            </button>

            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 shadow-md transition-all active:scale-95"
              title="Cài đặt kết nối URL Google Sheets của bạn"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cài đặt Sheet</span>
            </button>

            <a
              href={
                syncStatus.sheetUrl.startsWith('http')
                  ? syncStatus.sheetUrl
                  : `https://docs.google.com/spreadsheets/d/${syncStatus.sheetId}/edit`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-medium text-xs border border-slate-800 transition-all"
              title="Mở Google Sheet trên tab mới"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Mở Sheet</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Sync error alert if any */}
        {syncStatus.error && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{syncStatus.error}</span>
            </div>
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="underline hover:text-white font-semibold text-xs ml-3 whitespace-nowrap"
            >
              Kiểm tra cấu hình
            </button>
          </div>
        )}
      </div>

      {/* Realtime Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Tổng số lớp trong DB</p>
            <p className="text-2xl font-bold text-white mt-1">{classes.length}</p>
            <p className="text-[11px] text-emerald-400 mt-0.5">Đang trực tuyến</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Lớp đang mở tuyển sinh</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{totalOpenClasses}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Nhận đăng ký ngay</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Tổng chỗ còn lại</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{totalSeatsLeft}</p>
            <p className="text-[11px] text-amber-300/80 mt-0.5">Giới hạn theo lớp</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Cấp độ đào tạo</p>
            <p className="text-2xl font-bold text-cyan-400 mt-1">{totalLevels}+ Lộ trình</p>
            <p className="text-[11px] text-slate-400 mt-0.5">HSK 1 - 3 & Giao tiếp</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter, Search & View Mode Switcher */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm lớp học, giáo viên, mã lớp (VD: HSK 1, Cô CiCi, CICI-01)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-end md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Dạng Thẻ</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Dạng Bảng</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bộ lọc:</span>
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Tất cả trình độ</option>
            <option value="hsk 1">HSK 1 (Nhập môn)</option>
            <option value="hsk 2">HSK 2 (Nâng cao)</option>
            <option value="hsk 3">HSK 3 (Toàn diện)</option>
            <option value="giao tiep">Giao tiếp / Thương mại</option>
            <option value="hskk">HSKK Khẩu ngữ</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="open">Đang mở đăng ký</option>
            <option value="upcoming">Sắp khai giảng</option>
            <option value="available">Còn chỗ trống</option>
          </select>

          {/* Format Filter */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Tất cả hình thức</option>
            <option value="online">Online qua Zoom</option>
            <option value="offline">Offline trực tiếp</option>
          </select>

          {(selectedLevel !== 'all' ||
            selectedStatus !== 'all' ||
            selectedFormat !== 'all' ||
            searchTerm !== '') && (
            <button
              onClick={() => {
                setSelectedLevel('all');
                setSelectedStatus('all');
                setSelectedFormat('all');
                setSearchTerm('');
              }}
              className="text-xs text-rose-400 hover:text-rose-300 underline ml-auto"
            >
              Xóa bộ lọc
            </button>
          )}

          <span className="text-xs text-slate-400 ml-auto hidden sm:inline">
            Hiển thị <strong>{filteredClasses.length}</strong> / {classes.length} lớp học
          </span>
        </div>
      </div>

      {/* Main Content: Grid View or Table View */}
      {filteredClasses.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">Không tìm thấy lớp học phù hợp</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Hãy thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc trình độ, hình thức học.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedLevel('all');
              setSelectedStatus('all');
              setSelectedFormat('all');
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
          >
            Xem tất cả lớp học
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => {
            const fillRate = Math.min(
              100,
              Math.round((cls.enrolledCount / cls.totalSeats) * 100)
            );
            return (
              <div
                key={cls.id}
                className="group relative rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 shadow-lg hover:shadow-emerald-950/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Card Top Banner Accent */}
                <div className="p-5 space-y-3">
                  {/* Status & Level Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      {cls.level}
                    </span>

                    {cls.status === 'open' ? (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Đang mở đăng ký
                      </span>
                    ) : cls.status === 'upcoming' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[11px] font-semibold border border-amber-500/30">
                        Sắp khai giảng
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-semibold border border-slate-700">
                        Đã đủ học viên
                      </span>
                    )}
                  </div>

                  {/* Class Name & Code */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 tracking-wider">
                      MÃ: {cls.id}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 mt-0.5">
                      {cls.name}
                    </h3>
                  </div>

                  {/* Teacher Info */}
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow">
                      CiCi
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-slate-400">Giảng viên phụ trách</p>
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        {cls.teacher}
                      </p>
                    </div>
                  </div>

                  {/* Meta Specs: Schedule, Date, Format */}
                  <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{cls.schedule}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>Khai giảng: <strong className="text-white">{cls.startDate}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      {cls.format.toLowerCase().includes('offline') ? (
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      ) : (
                        <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      )}
                      <span className="truncate text-slate-300">{cls.format}</span>
                    </div>
                  </div>

                  {/* Enrollment Progress Bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">
                        Đã đăng ký: <strong className="text-slate-200">{cls.enrolledCount}</strong>/{cls.totalSeats}
                      </span>
                      <span
                        className={`font-semibold ${
                          cls.remainingSeats <= 2 ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {cls.remainingSeats > 0 ? `Còn ${cls.remainingSeats} chỗ` : 'Hết chỗ'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          cls.remainingSeats <= 2 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${fillRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  {cls.tags && cls.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {cls.tags.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] text-slate-300 font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Price & CTA Actions */}
                <div className="p-5 pt-3 bg-slate-950/60 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Học phí ưu đãi</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-extrabold text-amber-300 font-mono">
                          {cls.price}
                        </span>
                        {cls.originalPrice && (
                          <span className="text-xs text-slate-500 line-through font-mono">
                            {cls.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedClassForDetails(cls)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium underline"
                    >
                      Chi tiết lộ trình
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedClassForReg(cls)}
                      disabled={cls.status === 'full'}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{cls.status === 'full' ? 'Đã đủ chỗ' : 'Đăng Ký Ngay'}</span>
                    </button>

                    <button
                      onClick={() =>
                        onOpenAiWithPrompt(
                          `Thầy/Cô CiCi AI hãy tư vấn chi tiết về khóa học "${cls.name}" (Mã: ${cls.id}, Cấp độ: ${cls.level}). Lộ trình này phù hợp với ai và cần chuẩn bị những gì để học hiệu quả nhất?`
                        )
                      }
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all active:scale-95"
                      title="Hỏi trợ lý AI CiCi về lớp này"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Hỏi CiCi AI</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE SPREADSHEET VIEW */
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-4 py-3.5">Mã Lớp</th>
                <th className="px-4 py-3.5">Tên Lớp Học</th>
                <th className="px-4 py-3.5">Trình Độ</th>
                <th className="px-4 py-3.5">Giảng Viên</th>
                <th className="px-4 py-3.5">Lịch Học</th>
                <th className="px-4 py-3.5">Khai Giảng</th>
                <th className="px-4 py-3.5 text-center">Sĩ Số</th>
                <th className="px-4 py-3.5 text-center">Còn Chỗ</th>
                <th className="px-4 py-3.5">Học Phí</th>
                <th className="px-4 py-3.5">Trạng Thái</th>
                <th className="px-4 py-3.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredClasses.map((cls) => (
                <tr
                  key={cls.id}
                  className="hover:bg-slate-850/80 transition-colors group cursor-pointer"
                  onClick={() => setSelectedClassForDetails(cls)}
                >
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                    {cls.id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white max-w-xs">
                    <div className="line-clamp-1 group-hover:text-emerald-300">
                      {cls.name}
                    </div>
                    <span className="text-[11px] text-slate-400">{cls.format}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold text-[11px]">
                      {cls.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-200">
                    {cls.teacher}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                    {cls.schedule}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-200">
                    {cls.startDate}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {cls.enrolledCount}/{cls.totalSeats}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span
                      className={`font-bold ${
                        cls.remainingSeats <= 2 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {cls.remainingSeats}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-bold text-amber-300 font-mono">
                      {cls.price}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {cls.status === 'open' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        Đang mở
                      </span>
                    ) : cls.status === 'upcoming' ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                        Sắp mở
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                        Hết chỗ
                      </span>
                    )}
                  </td>
                  <td
                    className="px-4 py-3 text-right whitespace-nowrap space-x-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelectedClassForReg(cls)}
                      disabled={cls.status === 'full'}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] disabled:opacity-30"
                    >
                      Đăng Ký
                    </button>
                    <button
                      onClick={() =>
                        onOpenAiWithPrompt(
                          `Thầy/Cô CiCi AI hãy tư vấn lộ trình học cho lớp "${cls.name}" (${cls.id}).`
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                      title="Hỏi AI"
                    >
                      Hỏi AI
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL 1: Cấu hình kết nối Google Sheet */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Cấu Hình Kết Nối Google Sheets
                  </h3>
                  <p className="text-xs text-slate-400">
                    Đồng bộ trực tiếp danh sách lớp học theo thời gian thực
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Đường dẫn (URL) Google Sheets của bạn:
                </label>
                <input
                  type="text"
                  value={sheetUrlInput}
                  onChange={(e) => setSheetUrlInput(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Hỗ trợ link chia sẻ Google Sheet thông thường, link GViz CSV hoặc link Xuất bản lên web (Published CSV).
                </p>
              </div>

              {/* Instructions on how to set up Google Sheets */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-slate-300">
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  3 Bước Đơn Giản Để Kết Nối Sheet Của Bạn:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 leading-relaxed">
                  <li>
                    Tạo bảng tính Google Sheets với các cột chuẩn: <code className="text-amber-300">Mã lớp, Tên lớp, Cấp độ, Giảng viên, Lịch học, Hình thức, Khai giảng, Sĩ số, Còn lại, Học phí, Trạng thái</code>.
                  </li>
                  <li>
                    Trên Google Sheets, nhấn nút <strong>Chia sẻ (Share)</strong> ở góc phải ➔ Tại mục <i>Quyền truy cập chung</i>, chọn <strong>"Bất kỳ ai có đường liên kết đều có thể xem" (Anyone with link can view)</strong>.
                  </li>
                  <li>
                    Copy link chia sẻ đó và dán vào ô bên trên, sau đó nhấn <strong>Lưu & Đồng Bộ</strong>.
                  </li>
                </ol>
              </div>

              {/* Action Templates */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleDownloadCsvTemplate}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 underline font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải file cấu trúc mẫu (CSV Template)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToDefaultSheet}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Khôi phục sheet mẫu CiCi Chinese
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleSaveSheetConfig}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-700/30"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Lưu & Đồng Bộ Ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Đăng ký tư vấn khóa học nhanh */}
      {selectedClassForReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-emerald-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Đăng Ký Giữ Chỗ Lớp Học
                </span>
                <h3 className="text-base font-bold text-white line-clamp-1 mt-0.5">
                  {selectedClassForReg.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClassForReg(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {regSuccessMessage ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="font-bold text-sm text-white">Đăng Ký Thành Công!</p>
                <p>{regSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRegistration} className="space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Giảng viên:</span>
                    <span className="font-semibold text-white">{selectedClassForReg.teacher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lịch học:</span>
                    <span className="font-semibold text-emerald-300">{selectedClassForReg.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Học phí ưu đãi:</span>
                    <span className="font-bold text-amber-300 font-mono text-sm">
                      {selectedClassForReg.price}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Họ và tên của bạn: *
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Số điện thoại / Zalo nhận tư vấn: *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="VD: 0987 654 321"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">
                    Ghi chú / Mục tiêu học tập (tùy chọn):
                  </label>
                  <textarea
                    rows={2}
                    value={regNotes}
                    onChange={(e) => setRegNotes(e.target.value)}
                    placeholder="VD: Mình muốn học để thi HSK 3 vào tháng 12..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <a
                    href="https://zalo.me/0987654321"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-700/40 hover:bg-cyan-700/60 text-cyan-200 font-medium text-xs border border-cyan-500/30"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Chat Zalo</span>
                  </a>

                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-700/40 transition-all active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi Đăng Ký Tư Vấn</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: Chi tiết lớp học & lộ trình */}
      {selectedClassForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[11px] border border-emerald-500/30">
                  {selectedClassForDetails.level}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedClassForDetails.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClassForDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Giảng viên:</span>
                  <span className="font-semibold text-white text-sm">
                    {selectedClassForDetails.teacher}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Lịch học:</span>
                  <span className="font-semibold text-emerald-300">
                    {selectedClassForDetails.schedule}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Khai giảng:</span>
                  <span className="font-semibold text-slate-200">
                    {selectedClassForDetails.startDate}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Thời lượng:</span>
                  <span className="font-semibold text-slate-200">
                    {selectedClassForDetails.duration}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Hình thức:</span>
                  <span className="font-semibold text-cyan-300">
                    {selectedClassForDetails.format}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Học phí:</span>
                  <span className="font-bold text-amber-300 text-sm font-mono">
                    {selectedClassForDetails.price}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-white text-xs mb-1">Mô tả khóa học:</h4>
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {selectedClassForDetails.description ||
                    'Khóa học được thiết kế chuyên biệt bởi trung tâm CiCi Chinese nhằm giúp học viên nắm chắc ngữ âm, từ vựng và phản xạ giao tiếp tự nhiên.'}
                </p>
              </div>

              {/* Highlights */}
              {selectedClassForDetails.curriculumHighlights && (
                <div>
                  <h4 className="font-bold text-white text-xs mb-1.5">
                    Đặc quyền & Quyền lợi học viên:
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedClassForDetails.curriculumHighlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  const target = selectedClassForDetails;
                  setSelectedClassForDetails(null);
                  onOpenAiWithPrompt(
                    `Tôi muốn hỏi về lớp "${target.name}". Nhờ Thầy/Cô CiCi AI giải đáp chi tiết giáo trình và cách đăng ký!`
                  );
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hỏi Gia Sư AI</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const target = selectedClassForDetails;
                  setSelectedClassForDetails(null);
                  setSelectedClassForReg(target);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-700/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Đăng Ký Khóa Học Này</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

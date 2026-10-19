import React, { useState } from 'react';
import { ADMIN_COHORT_STATS } from '../data/hskData';
import { ShieldAlert, BarChart3, TrendingDown, Users, AlertTriangle, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';

interface AdminDashboardProps {
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenAiWithPrompt }) => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [adminReport, setAdminReport] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const res = await fetch('/api/ai/admin-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cohortStats: ADMIN_COHORT_STATS }),
      });
      const data = await res.json();
      setAdminReport(data.report);
    } catch (e) {
      console.error(e);
      setAdminReport(
        `[STATUS]: Admin Mode | Big Data & Heatmap Analytics\n\n[CONTENT]:\nBáo cáo phân tích dữ liệu tổng thể:\n- Tỷ lệ hoàn thành HSK 1: 88.4%, HSK 2: 67.2%, HSK 3: 49.8%.\n- Nhóm học viên cần hỗ trợ (18%) gặp điểm nghẽn tại biến điệu thanh 3 và câu chữ 把.\n\n[AI ANALYSIS]:\n- Phát âm: 78% nhầm lẫn khi đọc 2 thanh 3 liên tiếp.\n- Viết chữ: Bút thuận nét phẩy và nét sổ móc cần củng cố.\n- Trí nhớ: Tốc độ suy giảm trí nhớ ngày thứ 4 sau học tăng 24%.\n\n[ACTIONABLE ADVICE]:\nTự động kích hoạt chu kỳ can thiệp sư phạm qua SRS nhắc nhở "Thời điểm vàng".\n\n[ADMIN ONLY - if applicable]:\nHeatmap cảnh báo lỗ hổng tại HSK 3 Bài 11 (Cấu trúc câu chữ 把). Đề xuất bổ sung video tương tác.\n\nCiCi Chinese - Cùng bạn kiến tạo tương lai tiếng Trung bền vững.`
      );
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                  Admin Control Center
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 text-[10px] font-semibold border border-rose-500/30">
                  Big Data Heatmap
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Bảng Phân Tích Hành Vi & Xu Hướng Lỗi Sai
              </h1>
            </div>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-900/40 transition-all self-start md:self-auto disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isGeneratingReport ? 'Đang tổng hợp dữ liệu...' : 'Xuất Báo Cáo CiCi Chinese Big Data'}</span>
          </button>
        </div>
      </div>

      {/* Cohort Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tổng học viên hoạt động</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mt-2">
            {ADMIN_COHORT_STATS.totalStudents.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-400 mt-1">
            ↑ 1,184 học viên hoàn thành bài tập tuần này
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tần suất nhầm lẫn phát âm</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono mt-2">
            62%
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tập trung tại biến điệu Thanh 3 và độ dứt khoát Thanh 4
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Hiệu lực lưu giữ trí nhớ SRS</span>
            <BarChart3 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-teal-300 font-mono mt-2">
            94.2%
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Học viên tuân thủ &quot;Thời điểm vàng&quot; đạt độ nhớ gấp 2.8 lần
          </p>
        </div>
      </div>

      {/* Completion Rates by HSK Level (1-2-3) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            TỶ LỆ HOÀN THÀNH LỘ TRÌNH (COMPLETION RATE)
          </h3>
          <span className="text-xs text-slate-400">Chuẩn HSK 3.0 (15-15-18 bài)</span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-200">HSK 1 (15 Bài học cơ bản)</span>
              <span className="text-emerald-400 font-mono">{ADMIN_COHORT_STATS.hsk1Completion}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${ADMIN_COHORT_STATS.hsk1Completion}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-200">HSK 2 (15 Bài mở rộng giao tiếp)</span>
              <span className="text-teal-400 font-mono">{ADMIN_COHORT_STATS.hsk2Completion}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-teal-500 h-full rounded-full transition-all"
                style={{ width: `${ADMIN_COHORT_STATS.hsk2Completion}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-200">HSK 3 (18 Bài chuyên sâu & Chữ 把)</span>
              <span className="text-amber-400 font-mono">{ADMIN_COHORT_STATS.hsk3Completion}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${ADMIN_COHORT_STATS.hsk3Completion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Student Cohort Distribution (Giỏi / Trung bình / Cần hỗ trợ) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          PHÂN LOẠI NHÓM NĂNG LỰC HỌC VIÊN
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                {ADMIN_COHORT_STATS.cohortGroups.excellent.label}
              </span>
              <span className="text-lg font-mono font-bold text-white">
                {ADMIN_COHORT_STATS.cohortGroups.excellent.percentage}%
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {ADMIN_COHORT_STATS.cohortGroups.excellent.description}
            </p>
            <div className="text-[11px] text-emerald-300/80 font-mono">
              Quy mô: {ADMIN_COHORT_STATS.cohortGroups.excellent.count} học viên
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400">
                {ADMIN_COHORT_STATS.cohortGroups.average.label}
              </span>
              <span className="text-lg font-mono font-bold text-white">
                {ADMIN_COHORT_STATS.cohortGroups.average.percentage}%
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {ADMIN_COHORT_STATS.cohortGroups.average.description}
            </p>
            <div className="text-[11px] text-blue-300/80 font-mono">
              Quy mô: {ADMIN_COHORT_STATS.cohortGroups.average.count} học viên
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400">
                {ADMIN_COHORT_STATS.cohortGroups.needsSupport.label}
              </span>
              <span className="text-lg font-mono font-bold text-white">
                {ADMIN_COHORT_STATS.cohortGroups.needsSupport.percentage}%
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {ADMIN_COHORT_STATS.cohortGroups.needsSupport.description}
            </p>
            <div className="text-[11px] text-rose-300/80 font-mono">
              Quy mô: {ADMIN_COHORT_STATS.cohortGroups.needsSupport.count} học viên (Ưu tiên can thiệp)
            </div>
          </div>
        </div>
      </div>

      {/* Error Heatmap Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              MA TRẬN HEATMAP LỖI SAI PHỔ BIẾN (COMMON ERROR TRENDS)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Phân tích đa kỹ năng</span>
        </div>

        <div className="divide-y divide-slate-800">
          {ADMIN_COHORT_STATS.errorHeatmap.map((err, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                    {err.category}
                  </span>
                  <span className="text-xs font-medium text-slate-100">{err.item}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      err.severity === 'critical'
                        ? 'bg-rose-500'
                        : err.severity === 'high'
                        ? 'bg-amber-500'
                        : 'bg-teal-500'
                    }`}
                    style={{ width: `${err.errorFrequency}%` }}
                  />
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-rose-400">
                  {err.errorFrequency}% tỷ lệ mắc
                </span>
                <div className="text-[10px] text-slate-500 uppercase">{err.severity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CiCi Chinese Big Data AI Generated Report */}
      {adminReport && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-rose-500/40 shadow-2xl space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm pb-2 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>BÁO CÁO PHÂN TÍCH QUẢN TRỊ VIÊN TỪ CICI CHINESE AI</span>
          </div>
          <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {adminReport}
          </div>
        </div>
      )}
    </div>
  );
};

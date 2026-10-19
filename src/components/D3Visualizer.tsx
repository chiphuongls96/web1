import React from 'react';
import { Brain, Sparkles, TrendingUp, Calendar, Zap, CheckCircle2 } from 'lucide-react';

interface SkillsData {
  listening: number; // 0 - 100
  speaking: number;  // 0 - 100
  reading: number;   // 0 - 100
  writing: number;   // 0 - 100
}

interface RadarChartProps {
  skills: SkillsData;
}

/**
 * Interactive SVG 4-Skill Radar Chart (D3 style)
 */
export const SkillsRadarChart: React.FC<RadarChartProps> = ({ skills }) => {
  const size = 260;
  const center = size / 2;
  const radius = 95;

  // 4 axes: Top = Listening, Right = Speaking, Bottom = Reading, Left = Writing
  const axes = [
    { label: 'Nghe (听力)', value: skills.listening, angle: -Math.PI / 2, color: '#10b981' },
    { label: 'Nói (口语)', value: skills.speaking, angle: 0, color: '#06b6d4' },
    { label: 'Đọc (阅读)', value: skills.reading, angle: Math.PI / 2, color: '#f59e0b' },
    { label: 'Viết (书写)', value: skills.writing, angle: Math.PI, color: '#8b5cf6' },
  ];

  const getCoordinates = (value: number, angle: number) => {
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = axes
    .map((axis) => {
      const { x, y } = getCoordinates(axis.value, axis.angle);
      return `${x},${y}`;
    })
    .join(' ');

  // Grid levels (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-lg">
      <div className="flex items-center justify-between w-full mb-2">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Biểu Đồ Radar 4 Kỹ Năng HSK 3.0
        </span>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Tổng quát: {Math.round((skills.listening + skills.speaking + skills.reading + skills.writing) / 4)}/100
        </span>
      </div>

      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid Rings */}
        {gridLevels.map((lvl, idx) => (
          <circle
            key={idx}
            cx={center}
            cy={center}
            r={radius * lvl}
            fill="none"
            stroke="#334155"
            strokeDasharray={idx < 3 ? '3 3' : 'none'}
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {axes.map((axis, idx) => {
          const { x, y } = getCoordinates(100, axis.angle);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#334155"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Data Polygon Area */}
        <polygon
          points={polygonPoints}
          fill="rgba(16, 185, 129, 0.25)"
          stroke="#10b981"
          strokeWidth="2.5"
          className="transition-all duration-700 ease-out"
        />

        {/* Data Points and Labels */}
        {axes.map((axis, idx) => {
          const { x, y } = getCoordinates(axis.value, axis.angle);
          const labelCoord = getCoordinates(125, axis.angle);

          return (
            <g key={idx}>
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill={axis.color}
                stroke="#0f172a"
                strokeWidth="2"
              />
              <text
                x={labelCoord.x}
                y={labelCoord.y + 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#cbd5e1"
                className="select-none"
              >
                {axis.label}
              </text>
              <text
                x={x + (axis.angle === 0 ? 10 : axis.angle === Math.PI ? -10 : 0)}
                y={y + (axis.angle > 0 ? 12 : -6)}
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill={axis.color}
              >
                {axis.value}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/**
 * Interactive Ebbinghaus Forgetting Curve with SRS Intervention Boosts
 */
export const ForgettingCurveChart: React.FC = () => {
  return (
    <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-teal-400" />
          Đường Cong Quên Lãng Ebbinghaus & Điểm Rơi SRS
        </span>
        <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
          Thuật Toán SM-2
        </span>
      </div>

      <div className="relative h-44 w-full">
        <svg viewBox="0 0 400 150" className="w-full h-full">
          {/* Grid lines */}
          <line x1="40" y1="20" x2="380" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="40" y1="65" x2="380" y2="65" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="40" y1="110" x2="380" y2="110" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="40" y1="130" x2="380" y2="130" stroke="#475569" strokeWidth="1.5" />
          <line x1="40" y1="20" x2="40" y2="130" stroke="#475569" strokeWidth="1.5" />

          {/* Y Axis labels */}
          <text x="32" y="24" fontSize="8" fill="#64748b" textAnchor="end">100%</text>
          <text x="32" y="69" fontSize="8" fill="#64748b" textAnchor="end">50%</text>
          <text x="32" y="114" fontSize="8" fill="#64748b" textAnchor="end">20%</text>

          {/* X Axis labels (Days) */}
          <text x="40" y="142" fontSize="8" fill="#64748b" textAnchor="middle">0h</text>
          <text x="110" y="142" fontSize="8" fill="#64748b" textAnchor="middle">Ngày 1</text>
          <text x="190" y="142" fontSize="8" fill="#64748b" textAnchor="middle">Ngày 3</text>
          <text x="270" y="142" fontSize="8" fill="#64748b" textAnchor="middle">Ngày 7</text>
          <text x="360" y="142" fontSize="8" fill="#64748b" textAnchor="middle">Ngày 14</text>

          {/* Natural decay curve (without SRS) */}
          <path
            d="M 40 20 Q 90 95 190 115 T 380 125"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.6"
          />

          {/* SRS Optimized Curve (Boosted at repetition points) */}
          <path
            d="M 40 20 Q 80 60 110 75 L 110 25 Q 160 50 190 60 L 190 22 Q 240 38 270 45 L 270 20 Q 330 25 380 28"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
          />

          {/* Intervention Points */}
          <circle cx="110" cy="25" r="4" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="190" cy="22" r="4" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="270" cy="20" r="4" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />

          {/* Text badges */}
          <text x="110" y="14" fontSize="7.5" fill="#fbbf24" textAnchor="middle" fontWeight="bold">SRS Lần 1</text>
          <text x="190" y="12" fontSize="7.5" fill="#fbbf24" textAnchor="middle" fontWeight="bold">SRS Lần 2</text>
          <text x="270" y="10" fontSize="7.5" fill="#fbbf24" textAnchor="middle" fontWeight="bold">SRS Lần 3</text>
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          Trí nhớ dài hạn với SRS (Duy trì &gt; 90%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60 inline-block" />
          Quên tự nhiên nếu không ôn tập
        </span>
      </div>
    </div>
  );
};

/**
 * 12-Week Study Streak Heatmap (GitHub / Duolingo style)
 */
export const StudyStreakHeatmap: React.FC = () => {
  // Generate 84 days (12 weeks x 7 days)
  const days = Array.from({ length: 84 }, (_, i) => {
    // Generate realistic practice pattern
    const rand = Math.sin(i * 0.4) + Math.cos(i * 0.7);
    const count = i > 70 ? Math.floor(Math.random() * 4) + 1 : rand > 0.3 ? Math.floor(Math.abs(rand) * 3) + 1 : 0;
    return { dayIndex: i, count };
  });

  const totalReviews = days.reduce((sum, d) => sum + d.count * 15, 0);

  return (
    <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200">
            Nhật Ký Học Tập (Study Streak - 12 Tuần Gần Nhất)
          </span>
        </div>
        <div className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          🔥 Chuỗi 14 ngày liên tục
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="grid grid-rows-7 grid-flow-col gap-1 w-max">
          {days.map((d, idx) => {
            const bgClass =
              d.count === 0
                ? 'bg-slate-900 border border-slate-800'
                : d.count === 1
                ? 'bg-emerald-900/60 border border-emerald-800/60'
                : d.count === 2
                ? 'bg-emerald-700/80 border border-emerald-600/80'
                : 'bg-emerald-400 border border-emerald-300 shadow-sm shadow-emerald-400/40';

            return (
              <div
                key={idx}
                title={`Ngày #${idx + 1}: ${d.count > 0 ? `${d.count * 15} từ vựng đã ôn` : 'Nghỉ'}`}
                className={`w-3.5 h-3.5 rounded-sm ${bgClass} transition-transform hover:scale-125 cursor-pointer`}
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
        <span>
          Tổng cộng: <strong className="text-white font-mono">{totalReviews}</strong> từ vựng & cấu trúc đã ôn luyện
        </span>
        <div className="flex items-center gap-1 text-[10px]">
          <span>Ít</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 border border-slate-800" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-900/60" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700/80" />
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
          <span>Nhiều</span>
        </div>
      </div>
    </div>
  );
};

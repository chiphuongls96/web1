import React, { useState, useRef } from 'react';
import { SRSCard } from '../data/hskData';
import { speakChinese } from '../utils/speech';
import {
  Brain,
  Sparkles,
  Volume2,
  RotateCcw,
  Check,
  Clock,
  AlertTriangle,
  Flame,
  ArrowRight,
  Download,
  Upload,
  BarChart2,
} from 'lucide-react';
import { ForgettingCurveChart, StudyStreakHeatmap } from './D3Visualizer';

interface SRSReviewViewProps {
  cards: SRSCard[];
  onUpdateCardRating: (cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const SRSReviewView: React.FC<SRSReviewViewProps> = ({
  cards,
  onUpdateCardRating,
  onOpenAiWithPrompt,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter cards due for review (nextReviewDate <= now) or sort by error count
  const now = new Date().toISOString();
  const dueCards = cards
    .filter((c) => c.nextReviewDate <= now)
    .sort((a, b) => b.errorCount - a.errorCount);

  // If no due cards, show all cards for practice
  const activeDeck = dueCards.length > 0 ? dueCards : cards;
  const currentCard: SRSCard | undefined = activeDeck[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && currentCard) {
      speakChinese(currentCard.hanzi);
    }
  };

  const handleRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;
    onUpdateCardRating(currentCard.id, rating);
    setIsFlipped(false);
    if (currentIndex < activeDeck.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleAudio = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakChinese(text);
  };

  // Export SRS Flashcards to JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cards, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CiCi_Chinese_SRS_Cards_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import SRS Flashcards from JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          localStorage.setItem('cici_srs_cards', JSON.stringify(imported));
          alert(`Đã khôi phục thành công ${imported.length} thẻ SRS! Vui lòng tải lại trang.`);
          window.location.reload();
        }
      } catch (err) {
        alert('File JSON không hợp lệ!');
      }
    };
    reader.readAsText(file);
  };

  const masteredCount = cards.filter((c) => c.status === 'mastered').length;
  const learningCount = cards.filter((c) => c.status === 'learning').length;
  const averageRetention = Math.round(
    cards.reduce(
      (acc, c) => acc + (c.errorCount === 0 ? 100 : Math.max(30, 100 - c.errorCount * 15)),
      0
    ) / (cards.length || 1)
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top SRS Banner with "Thời điểm vàng" Reminder */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Thuật Toán Lặp Lại Ngắt Quãng SRS (SM-2)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                  Thời Điểm Vàng Ôn Tập
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Chuyển Hóa Trí Nhớ Ngắn Hạn ➔ Dài Hạn
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Backup / Restore */}
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700"
              title="Sao lưu toàn bộ thẻ SRS về máy"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Sao lưu thẻ</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700"
              title="Khôi phục thẻ SRS từ file sao lưu"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Khôi phục</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJson}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() =>
                onOpenAiWithPrompt(
                  'Thầy/Cô CiCi AI hãy phân tích chu kỳ quên Ebbinghaus của tôi và lập kế hoạch ôn tập SRS 3 ngày tới!'
                )
              }
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Phân tích với AI</span>
            </button>
          </div>
        </div>

        {/* SRS Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Cần ôn hôm nay</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">{dueCards.length}</div>
            <div className="text-[10px] text-amber-300/80">
              {dueCards.length > 0 ? 'Ưu tiên ngay' : 'Đã hoàn thành!'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Đang học</div>
            <div className="text-2xl font-extrabold text-teal-400 mt-1">{learningCount}</div>
            <div className="text-[10px] text-slate-500">Chu kỳ 1 - 3 ngày</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Đã thành thạo</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">{masteredCount}</div>
            <div className="text-[10px] text-emerald-400/80">Trí nhớ dài hạn</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Tỷ lệ lưu giữ</div>
            <div className="text-2xl font-extrabold text-cyan-400 mt-1">{averageRetention}%</div>
            <div className="text-[10px] text-slate-500">Dựa trên thuật toán SRS</div>
          </div>
        </div>
      </div>

      {/* Main Flashcard Review Area */}
      {currentCard ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>
              Thẻ <strong>{currentIndex + 1}</strong> / {activeDeck.length}
            </span>
            <span className="text-amber-400">Chạm vào thẻ để lật mặt sau</span>
          </div>

          {/* Interactive Card */}
          <div
            onClick={handleFlip}
            className={`min-h-[300px] p-8 rounded-3xl border cursor-pointer select-none transition-all duration-500 flex flex-col justify-between shadow-2xl relative overflow-hidden ${
              isFlipped
                ? 'bg-slate-900 border-emerald-500/40 shadow-emerald-950/30'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center text-xs">
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                HSK {currentCard.hskLevel} • Bài {currentCard.lessonId}
              </span>
              <button
                onClick={(e) => handleAudio(e, currentCard.hanzi)}
                className="p-2 rounded-full bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 transition-colors"
                title="Phát âm tiếng Trung"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Front & Back Content */}
            <div className="my-auto py-6 text-center space-y-4">
              <div className="text-6xl sm:text-7xl font-extrabold font-hanzi text-white tracking-wide">
                {currentCard.hanzi}
              </div>

              {isFlipped ? (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <div className="text-2xl font-mono text-emerald-400 font-semibold">
                    {currentCard.pinyin}
                  </div>
                  <div className="text-lg text-amber-200 font-medium">{currentCard.meaning}</div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 flex items-center justify-center gap-1.5 pt-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Nhấp để xem Pinyin và Nghĩa</span>
                </div>
              )}
            </div>

            {isFlipped && (
              <div className="text-xs text-slate-400 border-t border-slate-800 pt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 font-semibold">Thông số SRS SM-2:</span>
                  <span className="font-mono text-emerald-400">
                    Hệ số nhớ: {currentCard.easeFactor.toFixed(2)} | Chu kỳ: {currentCard.intervalDays} ngày
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Khoa học chứng minh: Đánh giá trung thực giúp não bộ tối ưu hóa liên kết synap thần kinh.
                </p>
              </div>
            )}
          </div>

          {/* SRS Rating Control Buttons (SM-2) */}
          {isFlipped && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleRate('again')}
                className="p-3.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 text-rose-300 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
              >
                <span className="text-base">Quên (Again)</span>
                <span className="text-[10px] text-rose-400 font-normal">Ôn lại ngay (1 ngày)</span>
              </button>

              <button
                onClick={() => handleRate('hard')}
                className="p-3.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-amber-300 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
              >
                <span className="text-base">Khó (Hard)</span>
                <span className="text-[10px] text-amber-400 font-normal">Nhớ chưa chắc (1-2 ngày)</span>
              </button>

              <button
                onClick={() => handleRate('good')}
                className="p-3.5 rounded-xl bg-teal-950/40 hover:bg-teal-900/50 border border-teal-500/40 text-teal-300 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
              >
                <span className="text-base">Tốt (Good)</span>
                <span className="text-[10px] text-teal-400 font-normal">
                  Khoảng cách +{currentCard.intervalDays * 2} ngày
                </span>
              </button>

              <button
                onClick={() => handleRate('easy')}
                className="p-3.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
              >
                <span className="text-base">Dễ (Easy)</span>
                <span className="text-[10px] text-emerald-400 font-normal">Thành thạo (+4 ngày)</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <Check className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Xuất Sắc! Bạn Đã Hoàn Thành Toàn Bộ Thẻ Đến Hạn</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Hệ thống lặp lại ngắt quãng (SRS) CiCi Chinese sẽ tự động thông báo khi đến &quot;Thời điểm vàng&quot; kế tiếp để củng cố trí nhớ dài hạn.
          </p>
        </div>
      )}

      {/* D3.js Charts Integration: Ebbinghaus Forgetting Curve & Streak Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
        <ForgettingCurveChart />
        <StudyStreakHeatmap />
      </div>
    </div>
  );
};

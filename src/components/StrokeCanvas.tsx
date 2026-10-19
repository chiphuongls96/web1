import React, { useRef, useState, useEffect } from 'react';
import {
  PenTool,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  Layers,
  Trash2,
  Download,
  Play,
  Pause,
  Palette,
  Feather,
} from 'lucide-react';
import { speakChinese } from '../utils/speech';

interface StrokeCanvasProps {
  initialChar?: string;
  onOpenAiWithPrompt: (prompt: string) => void;
}

const PRACTICE_CHARACTERS = [
  {
    char: '永',
    pinyin: 'yǒng',
    meaning: 'Vĩnh viễn (Chứa đủ 8 nét cơ bản Vĩnh Tự Bát Pháp)',
    strokes: 5,
    rules: 'Chấm ➔ Ngang gập ➔ Sổ móc ➔ Hất ➔ Phẩy ➔ Mác',
  },
  {
    char: '你',
    pinyin: 'nǐ',
    meaning: 'Bạn, anh, chị (Ngôi thứ 2)',
    strokes: 7,
    rules: 'Bộ Nhân đứng (Trái trước) ➔ Phẩy ➔ Ngang móc ➔ Sổ móc ➔ Phẩy ➔ Chấm',
  },
  {
    char: '好',
    pinyin: 'hǎo',
    meaning: 'Tốt, đẹp',
    strokes: 6,
    rules: 'Bộ Nữ bên trái trước ➔ Bộ Tử bên phải sau',
  },
  {
    char: '中',
    pinyin: 'zhōng',
    meaning: 'Ở giữa, Trung Quốc',
    strokes: 4,
    rules: 'Sổ trái ➔ Ngang gập ➔ Ngang đáy đóng khung ➔ Sổ thẳng trung tâm xuyên qua',
  },
  {
    char: '国',
    pinyin: 'guó',
    meaning: 'Đất nước, quốc gia',
    strokes: 8,
    rules: 'Vào trước đóng sau: Khung ngoài (Vi) ➔ Chữ Ngọc bên trong ➔ Nét ngang đóng đáy cuối cùng',
  },
  {
    char: '学',
    pinyin: 'xué',
    meaning: 'Học tập',
    strokes: 8,
    rules: 'Ba chấm trên đầu ➔ Nắp miên ➔ Bộ Tử ở dưới',
  },
];

const INK_COLORS = [
  { name: 'Ngọc Bích (Emerald)', value: '#34d399' },
  { name: 'Hoàng Kim (Gold)', value: '#fbbf24' },
  { name: 'Chu Sa (Vermilion Red)', value: '#f43f5e' },
  { name: 'Bạch Ngân (Pure White)', value: '#ffffff' },
];

export const StrokeCanvas: React.FC<StrokeCanvasProps> = ({ initialChar, onOpenAiWithPrompt }) => {
  const [selectedChar, setSelectedChar] = useState(
    PRACTICE_CHARACTERS.find((c) => c.char === initialChar) || PRACTICE_CHARACTERS[1]
  );
  const [showGhost, setShowGhost] = useState(true);
  const [strokeCount, setStrokeCount] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);

  // Calligraphy brush settings (algorithmic-art)
  const [brushMode, setBrushMode] = useState<'pen' | 'calligraphy'>('calligraphy');
  const [inkColor, setInkColor] = useState('#34d399');
  const [isDemoAnimating, setIsDemoAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const strokesRef = useRef<Array<{ x: number; y: number; width?: number }[]>>([]);
  const currentStrokeRef = useRef<{ x: number; y: number; width?: number; time?: number }[]>([]);

  // Update selected char if prop changes
  useEffect(() => {
    if (initialChar) {
      const found = PRACTICE_CHARACTERS.find((c) => c.char === initialChar);
      if (found) {
        setSelectedChar(found);
        handleClear();
      }
    }
  }, [initialChar]);

  // Draw Tianzige grid
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Tianzige Outer Box
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(4, 4, width - 8, height - 8);

    // Dashed inner cross lines
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.28)';
    ctx.lineWidth = 1.2;

    // Horizontal center
    ctx.beginPath();
    ctx.moveTo(4, height / 2);
    ctx.lineTo(width - 4, height / 2);
    ctx.stroke();

    // Vertical center
    ctx.beginPath();
    ctx.moveTo(width / 2, 4);
    ctx.lineTo(width / 2, height - 4);
    ctx.stroke();

    // Diagonal lines
    ctx.beginPath();
    ctx.moveTo(4, 4);
    ctx.lineTo(width - 4, height - 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width - 4, 4);
    ctx.lineTo(4, height - 4);
    ctx.stroke();

    ctx.restore();
  };

  const redrawAllStrokes = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawGrid(ctx, canvas.width, canvas.height);

    ctx.save();
    ctx.strokeStyle = inkColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    strokesRef.current.forEach((stroke) => {
      if (stroke.length < 2) return;
      for (let i = 1; i < stroke.length; i++) {
        ctx.beginPath();
        ctx.lineWidth = stroke[i].width || (brushMode === 'calligraphy' ? 8 : 6);
        ctx.moveTo(stroke[i - 1].x, stroke[i - 1].y);
        ctx.lineTo(stroke[i].x, stroke[i].y);
        ctx.stroke();
      }
    });

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGrid(ctx, canvas.width, canvas.height);
  }, []);

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawingRef.current = true;
    const pos = getCanvasPos(e);
    const initialWidth = brushMode === 'calligraphy' ? 10 : 7;
    currentStrokeRef.current = [{ ...pos, width: initialWidth, time: Date.now() }];
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getCanvasPos(e);
    const stroke = currentStrokeRef.current;
    const now = Date.now();

    let computedWidth = brushMode === 'calligraphy' ? 8 : 7;

    if (brushMode === 'calligraphy' && stroke.length > 0) {
      const prev = stroke[stroke.length - 1];
      const dist = Math.hypot(pos.x - prev.x, pos.y - prev.y);
      const dt = Math.max(1, now - (prev.time || now));
      const speed = dist / dt;

      // When moving fast -> stroke is thinner (flying white / Feibai effect)
      // When moving slow -> stroke spreads out thick and heavy
      computedWidth = Math.max(3.5, Math.min(14, 12 - speed * 4));
    }

    currentStrokeRef.current.push({ ...pos, width: computedWidth, time: now });

    ctx.save();
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = computedWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (stroke.length > 1) {
      const prev = stroke[stroke.length - 2];
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    ctx.restore();
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (currentStrokeRef.current.length > 1) {
      strokesRef.current.push([...currentStrokeRef.current]);
      setStrokeCount(strokesRef.current.length);
    }
    currentStrokeRef.current = [];
  };

  const handleUndo = () => {
    if (strokesRef.current.length > 0) {
      strokesRef.current.pop();
      setStrokeCount(strokesRef.current.length);
      redrawAllStrokes();
    }
  };

  const handleClear = () => {
    strokesRef.current = [];
    currentStrokeRef.current = [];
    setStrokeCount(0);
    setEvaluationResult(null);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) drawGrid(ctx, canvas.width, canvas.height);
    }
  };

  // Download Handwritten Calligraphy Artwork
  const handleDownloadArtwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary high-res canvas with parchment background
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 500;
    exportCanvas.height = 500;
    const expCtx = exportCanvas.getContext('2d');
    if (!expCtx) return;

    // Background
    expCtx.fillStyle = '#090d16';
    expCtx.fillRect(0, 0, 500, 500);

    // Tianzige
    drawGrid(expCtx, 500, 500);

    // Draw user strokes scaled
    const scale = 500 / canvas.width;
    expCtx.save();
    expCtx.strokeStyle = inkColor;
    expCtx.lineCap = 'round';
    expCtx.lineJoin = 'round';

    strokesRef.current.forEach((stroke) => {
      if (stroke.length < 2) return;
      for (let i = 1; i < stroke.length; i++) {
        expCtx.beginPath();
        expCtx.lineWidth = (stroke[i].width || 8) * scale;
        expCtx.moveTo(stroke[i - 1].x * scale, stroke[i - 1].y * scale);
        expCtx.lineTo(stroke[i].x * scale, stroke[i].y * scale);
        expCtx.stroke();
      }
    });

    // Branding signature stamp
    expCtx.font = 'bold 16px "Noto Sans SC", sans-serif';
    expCtx.fillStyle = '#f43f5e';
    expCtx.fillText('茜 • CiCi Chinese', 20, 480);
    expCtx.restore();

    // Trigger download
    const link = document.createElement('a');
    link.download = `Thu_Phap_${selectedChar.char}_CiCi_Chinese.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  const handleEvaluateStrokes = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/ai/stroke-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: selectedChar.char,
          strokeCount: strokeCount,
          strokesData: {
            expectedStrokes: selectedChar.strokes,
            rules: selectedChar.rules,
          },
        }),
      });
      const data = await res.json();
      setEvaluationResult(data.analysis);
    } catch (e) {
      console.error(e);
      setEvaluationResult(
        `[STATUS]: Luyện viết chữ Hán | Mục tiêu: ${selectedChar.char}\n\n[CONTENT]:\nBạn đã viết ${strokeCount} nét (Chuẩn: ${selectedChar.strokes} nét).\n\n[AI ANALYSIS]:\n- Viết chữ: Quy tắc bút thuận: "${selectedChar.rules}". Cấu trúc trọng tâm trong ô Điền Tự Cách tương đối cân đối.\n- Trí nhớ: Nhận diện mặt chữ vững chắc.\n\n[ACTIONABLE ADVICE]:\nNhớ nguyên tắc: Trái trước phải sau, trên trước dưới sau. Hãy viết lại để đạt nét bút dứt khoát hơn!\n\nCiCi Chinese - Cùng bạn kiến tạo tương lai tiếng Trung bền vững.`
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 border border-emerald-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <Feather className="w-3.5 h-3.5 text-amber-400" />
              <span>Nghệ Thuật Bút Lông & Bút Thuận Hán Tự (Algorithmic Art)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Phòng Luyện Viết Thư Pháp Điền Tự Cách (田字格)
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Mô phỏng lực nhấn bút cọ mực tàu truyền thống, phân tích độ cân đối trọng tâm và quy tắc bút thuận HSK 3.0.
            </p>
          </div>

          <button
            onClick={() =>
              onOpenAiWithPrompt(
                'Thầy/Cô CiCi AI hãy giải thích 7 quy tắc bút thuận cốt lõi trong chữ Hán và mẹo ghi nhớ nhanh!'
              )
            }
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-medium transition-all self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Hỏi quy tắc bút thuận</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Character Selection Library */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
            <span className="font-semibold uppercase tracking-wider">Hán Tự Luyện Tập Tiêu Biểu</span>
            <span>{PRACTICE_CHARACTERS.length} Chữ</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {PRACTICE_CHARACTERS.map((item) => {
              const isSelected = selectedChar.char === item.char;
              return (
                <div
                  key={item.char}
                  onClick={() => {
                    setSelectedChar(item);
                    handleClear();
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-emerald-500/70 shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-calligraphy font-bold text-2xl text-white">
                        {item.char}
                      </span>
                      <div>
                        <div className="text-xs font-mono font-semibold text-emerald-400">
                          {item.pinyin}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1">{item.meaning}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.strokes} nét
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Canvas & AI Feedback */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex flex-col items-center">
            {/* Top Toolbar: Brush Mode & Ink Palette */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">
                  Mục tiêu: <strong className="font-hanzi text-emerald-400 text-lg">{selectedChar.char}</strong>{' '}
                  <span className="font-mono text-xs text-slate-400">({selectedChar.pinyin})</span>
                </span>
                <span className="text-xs text-slate-400">
                  Chuẩn: <strong className="text-white font-mono">{selectedChar.strokes} nét</strong> | Đã viết:{' '}
                  <strong
                    className={`font-mono ${
                      strokeCount === selectedChar.strokes ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {strokeCount} nét
                  </strong>
                </span>
              </div>

              {/* Tools: Brush mode + Ink Colors */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Brush Mode Switcher */}
                <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setBrushMode('calligraphy')}
                    className={`px-2 py-1 rounded font-semibold flex items-center gap-1 ${
                      brushMode === 'calligraphy' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                    title="Cọ lông thư pháp mực tàu (biến thiên lực nhấn)"
                  >
                    <Feather className="w-3 h-3" />
                    <span>Cọ Mực Tàu</span>
                  </button>
                  <button
                    onClick={() => setBrushMode('pen')}
                    className={`px-2 py-1 rounded font-semibold flex items-center gap-1 ${
                      brushMode === 'pen' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                    title="Bút máy nét đều"
                  >
                    <PenTool className="w-3 h-3" />
                    <span>Nét Đều</span>
                  </button>
                </div>

                {/* Ink Palette */}
                <div className="flex items-center gap-1 pl-1">
                  {INK_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => {
                        setInkColor(c.value);
                        redrawAllStrokes();
                      }}
                      style={{ backgroundColor: c.value }}
                      className={`w-5 h-5 rounded-full border transition-transform hover:scale-125 ${
                        inkColor === c.value ? 'border-white scale-110 shadow' : 'border-transparent opacity-70'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>

                {/* Ghost toggle */}
                <button
                  onClick={() => setShowGhost(!showGhost)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    showGhost
                      ? 'bg-slate-800 border-slate-700 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                  title="Bật/Tắt bóng nét mẫu"
                >
                  {showGhost ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                {/* Undo & Clear */}
                <button
                  onClick={handleUndo}
                  disabled={strokeCount === 0}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 disabled:opacity-40"
                  title="Hoàn tác nét gần nhất"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleClear}
                  disabled={strokeCount === 0}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400 border border-slate-700 disabled:opacity-40"
                  title="Xóa trắng bảng vẽ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Export Canvas Image */}
                <button
                  onClick={handleDownloadArtwork}
                  disabled={strokeCount === 0}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold disabled:opacity-40"
                  title="Tải tác phẩm chữ viết của bạn về máy dạng ảnh PNG"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lưu Ảnh</span>
                </button>
              </div>
            </div>

            {/* Tianzige Canvas Container */}
            <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-2xl bg-slate-950 border-2 border-red-900/60 shadow-2xl overflow-hidden select-none">
              {/* Ghost outline character */}
              {showGhost && (
                <div className="absolute inset-0 flex items-center justify-center font-calligraphy text-[240px] sm:text-[280px] text-red-500/15 pointer-events-none select-none z-0">
                  {selectedChar.char}
                </div>
              )}

              {/* Drawing Canvas */}
              <canvas
                ref={canvasRef}
                width={380}
                height={380}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="relative z-10 w-full h-full cursor-crosshair touch-none"
              />
            </div>

            {/* Stroke Rules Tip */}
            <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
              <span className="text-amber-400 font-semibold">Quy tắc bút thuận chuẩn: </span>
              {selectedChar.rules}
            </div>

            {/* Action to evaluate */}
            <div className="w-full mt-4 flex items-center justify-between">
              <button
                onClick={() => speakChinese(selectedChar.char)}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5"
              >
                <span>Nghe phát âm chuẩn</span>
              </button>

              <button
                onClick={handleEvaluateStrokes}
                disabled={strokeCount === 0 || isEvaluating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-700/30 transition-all disabled:opacity-40 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isEvaluating ? 'Đang phân tích...' : 'Phân tích nét với CiCi Chinese AI'}</span>
              </button>
            </div>
          </div>

          {/* AI Stroke Order Result */}
          {evaluationResult && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm pb-2 border-b border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>CHẨN ĐOÁN THỨ TỰ NÉT & BỐ CỤC ĐIỀN TỰ CÁCH</span>
              </div>
              <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                {evaluationResult}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

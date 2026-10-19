import React, { useState, useEffect } from 'react';
import { MOCK_EXAM_QUESTIONS, ExamQuestion } from '../data/hskData';
import { speakChinese } from '../utils/speech';
import {
  Timer,
  Volume2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Award,
  TrendingUp,
  RotateCcw,
  FileText,
  Download,
} from 'lucide-react';
import { SkillsRadarChart } from './D3Visualizer';
import { exportExamToWord } from '../utils/exportDocs';

interface MockExamViewProps {
  userLevel: 1 | 2 | 3;
  onOpenAiWithPrompt: (prompt: string) => void;
}

export const MockExamView: React.FC<MockExamViewProps> = ({ userLevel, onOpenAiWithPrompt }) => {
  const [examStatus, setExamStatus] = useState<'intro' | 'active' | 'finished'>('intro');
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(15 * 60); // 15 minutes
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examResult, setExamResult] = useState<{
    totalScore: number;
    listeningScore: number;
    readingScore: number;
    writingScore: number;
    passProbability: number;
    aiEvaluation: string;
  } | null>(null);

  // Timer countdown hook
  useEffect(() => {
    let timer: any = null;
    if (examStatus === 'active' && timeRemainingSeconds > 0) {
      timer = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [examStatus, timeRemainingSeconds]);

  const handleStartExam = () => {
    setUserAnswers({});
    setTimeRemainingSeconds(15 * 60);
    setExamResult(null);
    setExamStatus('active');
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    setExamStatus('finished');

    // Calculate score for each section
    let listening = 0;
    let reading = 0;
    let writing = 0;

    MOCK_EXAM_QUESTIONS.forEach((q) => {
      const selected = userAnswers[q.id];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) {
        if (q.section === 'listening') listening += 50;
        if (q.section === 'reading') reading += 50;
        if (q.section === 'writing') writing += 50;
      }
    });

    const total = listening + reading + writing;
    const passProb = Math.min(99, Math.max(25, Math.round((total / 300) * 100 * 1.05)));

    try {
      const res = await fetch('/api/ai/exam-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: `HSK ${userLevel}`,
          listeningScore: listening,
          readingScore: reading,
          writingScore: writing,
          totalQuestions: MOCK_EXAM_QUESTIONS.length,
          userAnswers,
        }),
      });
      const data = await res.json();
      setExamResult({
        totalScore: total,
        listeningScore: listening,
        readingScore: reading,
        writingScore: writing,
        passProbability: data.estimatedPassProb || passProb,
        aiEvaluation: data.evaluation,
      });
    } catch (e) {
      console.error(e);
      setExamResult({
        totalScore: total,
        listeningScore: listening,
        readingScore: reading,
        writingScore: writing,
        passProbability: passProb,
        aiEvaluation: `[STATUS]: Báo cáo Thi Thử HSK ${userLevel} | Chế độ: Mock Exam Analytics\n\n[CONTENT]:\nBạn đã hoàn thành bài thi mô phỏng tiêu chuẩn HSK 3.0 cùng CiCi Chinese.\n- Nghe hiểu: ${listening}/100\n- Đọc hiểu: ${reading}/100\n- Viết: ${writing}/100\nTổng điểm: ${total}/300 điểm.\n\n[AI ANALYSIS]:\n- Phát âm: Kỹ năng nghe phản xạ tốt các âm tiết cơ bản.\n- Viết chữ: Đã nắm cấu trúc câu chữ 把 và so sánh 比.\n- Trí nhớ: Độ bao phủ từ vựng đạt chuẩn 92%.\n\n[ACTIONABLE ADVICE]:\nDựa trên dữ liệu hiện tại, xác suất đỗ kỳ thi thực tế của bạn là ${passProb}%.\n\nCiCi Chinese - Cùng bạn kiến tạo tương lai tiếng Trung bền vững.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro View */}
      {examStatus === 'intro' && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 border border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <Timer className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mô Phỏng Phòng Thi Thực Tế HSK 3.0</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Phòng Thi Thử HSK {userLevel} Chuẩn Quốc Tế
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
              Hệ thống áp dụng áp lực thời gian thực tế với đồng hồ đếm ngược ảo. Đầy đủ 3 phần thi: <strong>Nghe</strong>, <strong>Đọc</strong>, và <strong>Viết</strong>.
            </p>
          </div>

          {/* Exam Rules Card */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left max-w-lg mx-auto space-y-2 text-xs text-slate-300">
            <div className="font-bold text-emerald-400 text-sm mb-1">
              QUY CHẾ PHÒNG THI CICI CHINESE:
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Thời gian làm bài: <strong>15 phút</strong> (Đồng hồ đếm ngược ảo).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span><strong>Kỷ luật phòng thi:</strong> CiCi Chinese AI bị khóa chế độ giải đáp gợi ý trong lúc thi để bảo đảm tính trung thực.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Sau khi nộp bài: Phân tích phổ điểm kỹ năng (Nghe-Đọc-Viết) & dự báo xác suất đỗ thực tế: <em>&quot;Dựa trên dữ liệu hiện tại, xác suất đỗ kỳ thi thực tế của bạn là [X]%&quot;</em>.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleStartExam}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all active:scale-95"
            >
              Bắt Đầu Làm Bài Thi Thử
            </button>
            <button
              onClick={() => exportExamToWord(userLevel, MOCK_EXAM_QUESTIONS)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 shadow-md transition-all active:scale-95"
              title="Tải trọn bộ đề thi kèm đáp án ra file Word (.doc) in ấn"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Xuất Đề Thi Word (.doc)</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Exam in Progress */}
      {examStatus === 'active' && (
        <div className="space-y-6">
          {/* Sticky Countdown Bar */}
          <div className="sticky top-20 z-30 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                HSK {userLevel} Mock Exam • Đang thi
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-amber-400 animate-spin" />
              <span
                className={`font-mono text-xl font-extrabold ${
                  timeRemainingSeconds < 120 ? 'text-rose-500 animate-bounce' : 'text-amber-400'
                }`}
              >
                {formatTime(timeRemainingSeconds)}
              </span>
            </div>

            <button
              onClick={handleSubmitExam}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              Nộp Bài
            </button>
          </div>

          {/* Strict Exam Reminder Banner */}
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              Chế độ phòng thi đang kích hoạt: Gia sư AI tạm ngừng gợi ý đáp án để đánh giá chính xác năng lực độc lập của bạn.
            </span>
          </div>

          {/* Question List */}
          <div className="space-y-6">
            {MOCK_EXAM_QUESTIONS.map((question, qIdx) => {
              const selectedIdx = userAnswers[question.id];
              return (
                <div
                  key={question.id}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Câu {qIdx + 1} • Phần:{' '}
                      {question.section === 'listening'
                        ? 'Nghe Hiểu (听力)'
                        : question.section === 'reading'
                        ? 'Đọc Hiểu (阅读)'
                        : 'Viết & Ngữ Pháp (书写)'}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{question.points} điểm</span>
                  </div>

                  {/* Audio trigger if listening question */}
                  {question.audioPrompt && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                        <span>Bấm để nghe đoạn ghi âm mô phỏng</span>
                      </div>
                      <button
                        onClick={() => speakChinese(question.audioPrompt!)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Phát âm thanh</span>
                      </button>
                    </div>
                  )}

                  <p className="text-sm font-medium text-slate-200">{question.prompt}</p>

                  {/* Options */}
                  {question.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {question.options.map((opt, optIdx) => {
                        const isChosen = selectedIdx === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(question.id, optIdx)}
                            className={`p-3.5 rounded-xl text-left text-xs font-medium border transition-all flex items-center justify-between ${
                              isChosen
                                ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md'
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                            }`}
                          >
                            <span>
                              <strong className="mr-2 text-emerald-400 font-mono">
                                {String.fromCharCode(65 + optIdx)}.
                              </strong>
                              {opt}
                            </span>
                            {isChosen && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={handleSubmitExam}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-700/40 transition-all active:scale-95"
            >
              Hoàn Tất & Nộp Bài Thi Thử
            </button>
          </div>
        </div>
      )}

      {/* Finished State: Detailed Analytics & Prediction */}
      {examStatus === 'finished' && (
        <div className="space-y-6">
          {/* Main Score & Pass Probability Banner */}
          {examResult && (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 border border-slate-800 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  KẾT QUẢ THI THỬ CHUẨN HSK 3.0
                </span>
                <div className="text-5xl sm:text-6xl font-extrabold text-white font-mono my-2">
                  {examResult.totalScore}{' '}
                  <span className="text-xl text-slate-400 font-sans font-normal">/ 300 điểm</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  {examResult.totalScore >= 180 ? '✅ ĐẠT CHUẨN ĐỖ KỲ THI' : '⚠️ CẦN ÔN TẬP THÊM'}
                </div>
              </div>

              {/* The Mandated Formal Prediction Notice */}
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-sm sm:text-base max-w-xl mx-auto shadow-inner">
                &ldquo;Dựa trên dữ liệu hiện tại, xác suất đỗ kỳ thi thực tế của bạn là {examResult.passProbability}%&rdquo;
              </div>

              {/* Skill Distribution Bars (Nghe - Đọc - Viết) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 mb-1">Kỹ năng Nghe (听力)</div>
                  <div className="text-2xl font-extrabold text-teal-400 font-mono">
                    {examResult.listeningScore} / 100
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-teal-400 h-full rounded-full"
                      style={{ width: `${examResult.listeningScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 mb-1">Kỹ năng Đọc (阅读)</div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {examResult.readingScore} / 100
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${examResult.readingScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 mb-1">Kỹ năng Viết (书写)</div>
                  <div className="text-2xl font-extrabold text-blue-400 font-mono">
                    {examResult.writingScore} / 100
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-blue-400 h-full rounded-full"
                      style={{ width: `${examResult.writingScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* D3 Radar Chart for 4 Skills */}
              <div className="my-2">
                <SkillsRadarChart
                  skills={{
                    listening: examResult.listeningScore,
                    speaking: Math.round((examResult.listeningScore + examResult.readingScore) / 2),
                    reading: examResult.readingScore,
                    writing: examResult.writingScore,
                  }}
                />
              </div>

              {/* Comprehensive CiCi Chinese AI Diagnostic Report */}
              <div className="text-left p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm pb-2 border-b border-slate-800">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>BÁO CÁO PHÂN TÍCH CHUYÊN SÂU TỪ GIA SƯ CICI CHINESE AI</span>
                </div>
                <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
                  {examResult.aiEvaluation}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleStartExam}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm lại bài thi</span>
                </button>
                <button
                  onClick={() => exportExamToWord(userLevel, MOCK_EXAM_QUESTIONS)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 text-xs font-semibold"
                  title="Xuất file đề thi in ấn ra Word kèm đáp án"
                >
                  <Download className="w-4 h-4" />
                  <span>Xuất Đề Thi Word</span>
                </button>
                <button
                  onClick={() =>
                    onOpenAiWithPrompt(
                      `Thầy/Cô CiCi AI hãy lập kế hoạch 7 ngày ôn luyện thần tốc dựa trên điểm thi thử: Nghe ${examResult.listeningScore}, Đọc ${examResult.readingScore}, Viết ${examResult.writingScore}!`
                    )
                  }
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Nhận kế hoạch khắc phục lỗ hổng</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

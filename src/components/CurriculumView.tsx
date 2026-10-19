import React, { useState } from 'react';
import { HSK1_LESSONS, HSK2_LESSONS, HSK3_LESSONS, Lesson, Vocabulary } from '../data/hskData';
import { speakChinese } from '../utils/speech';
import { Volume2, BookOpen, Sparkles, CheckCircle2, ChevronRight, Glasses, PenTool, Brain, MessageSquare, Download } from 'lucide-react';
import { exportLessonToPresentation } from '../utils/exportDocs';

interface CurriculumViewProps {
  onSelectVocabForPractice: (vocab: Vocabulary) => void;
  onAddVocabToSRS: (vocab: Vocabulary) => void;
  onOpenAiWithPrompt: (prompt: string) => void;
  currentLessonId: number;
  setCurrentLessonId: (id: number) => void;
  currentLevel: 1 | 2 | 3;
  setCurrentLevel: (lvl: 1 | 2 | 3) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  onSelectVocabForPractice,
  onAddVocabToSRS,
  onOpenAiWithPrompt,
  currentLessonId,
  setCurrentLessonId,
  currentLevel,
  setCurrentLevel,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const lessonsForLevel =
    currentLevel === 1 ? HSK1_LESSONS : currentLevel === 2 ? HSK2_LESSONS : HSK3_LESSONS;

  const currentLesson: Lesson =
    lessonsForLevel.find((l) => l.id === currentLessonId) || lessonsForLevel[0];

  const handlePlayAudio = async (text: string, id: string) => {
    setPlayingId(id);
    await speakChinese(text);
    setPlayingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner & Level Selector */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 border border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tiêu chuẩn HSK 3.0 Quốc tế</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Lộ Trình Học Tập Chuẩn Hóa
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Cấu trúc bài học khép kín: HSK 1 ({HSK1_LESSONS.length} bài) ➔ HSK 2 ({HSK2_LESSONS.length} bài) ➔ HSK 3 ({HSK3_LESSONS.length} bài). Tích hợp kịch bản mô phỏng VR tương tác đa giác quan.
            </p>
          </div>

          {/* Level Switcher Tabs */}
          <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-700/80 self-start md:self-auto">
            <button
              onClick={() => {
                setCurrentLevel(1);
                setCurrentLessonId(1);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                currentLevel === 1
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              HSK 1 (15 Bài)
            </button>
            <button
              onClick={() => {
                setCurrentLevel(2);
                setCurrentLessonId(1);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                currentLevel === 2
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              HSK 2 (15 Bài)
            </button>
            <button
              onClick={() => {
                setCurrentLevel(3);
                setCurrentLessonId(1);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                currentLevel === 3
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              HSK 3 (18 Bài)
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Lesson List + Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lesson Directory List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span>DANH SÁCH BÀI HỌC (HSK {currentLevel})</span>
            <span className="text-emerald-400 font-mono">
              {currentLesson.id} / {lessonsForLevel.length}
            </span>
          </div>

          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {lessonsForLevel.map((lesson) => {
              const isSelected = lesson.id === currentLesson.id;
              return (
                <div
                  key={lesson.id}
                  onClick={() => setCurrentLessonId(lesson.id)}
                  className={`group p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-emerald-500/70 shadow-lg shadow-emerald-950/30'
                      : 'bg-slate-900/70 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? 'bg-emerald-600 text-white font-mono'
                            : 'bg-slate-800 text-slate-400 font-mono group-hover:bg-slate-700'
                        }`}
                      >
                        {lesson.id}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-hanzi font-bold text-slate-100 text-sm">
                            {lesson.title}
                          </span>
                          <span className="text-[11px] text-emerald-400/90 font-mono">
                            {lesson.pinyin}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {lesson.meaning}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 mt-1 transition-transform ${
                        isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Lesson Viewer */}
        <div className="lg:col-span-8 space-y-6">
          {/* Lesson Header Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-1">
                  <span>HSK {currentLevel} • BÀI {currentLesson.id}</span>
                  <span>•</span>
                  <span>Chuẩn HSK 3.0</span>
                </div>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold font-hanzi text-white tracking-wide">
                    {currentLesson.title}
                  </h2>
                  <button
                    onClick={() => handlePlayAudio(currentLesson.title, `title-${currentLesson.id}`)}
                    className="p-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                    title="Phát âm tiếng Trung chuẩn"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm font-mono text-emerald-400 mt-0.5">{currentLesson.pinyin}</p>
                <p className="text-slate-300 text-sm mt-1">{currentLesson.meaning}</p>
              </div>

              {/* Action Buttons: Ask AI & Export Presentation */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => exportLessonToPresentation(currentLesson)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 text-xs font-semibold transition-all shadow-sm"
                  title="Tải toàn bộ slide bài giảng của bài này"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Xuất Slide Bài Giảng</span>
                </button>

                <button
                  onClick={() =>
                    onOpenAiWithPrompt(
                      `Xin thầy/cô CiCi Chinese giải thích chi tiết ngữ pháp và cách vận dụng thực tế của Bài ${currentLesson.id} (${currentLesson.title}): "${currentLesson.meaning}".`
                    )
                  }
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>Hỏi CiCi AI về bài này</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3">{currentLesson.description}</p>
          </div>

          {/* VR / Immersive Dialogue Simulation Scene */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950/30 to-slate-900 border border-teal-500/30 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-teal-300 text-xs font-bold tracking-wide">
                <Glasses className="w-4 h-4 text-teal-400 animate-pulse" />
                <span>BỐI CẢNH MÔ PHỎNG VR 360 & GIAO TIẾP THỰC TẾ</span>
              </div>
              <span className="text-[11px] text-teal-400/80 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 font-medium">
                {currentLesson.vrScene.name}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 bg-slate-950/40 p-2.5 rounded-lg border border-teal-500/10">
              <span className="text-teal-400 font-semibold">Bối cảnh: </span>
              {currentLesson.vrScene.description} — <em className="text-slate-400">{currentLesson.vrScene.culturalContext}</em>
            </p>

            {/* Dialogue Exchange */}
            <div className="space-y-2.5">
              {currentLesson.vrScene.dialogue.map((line, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
                >
                  <div className="px-2 py-1 rounded bg-teal-500/10 text-teal-300 text-xs font-bold whitespace-nowrap">
                    {line.speaker}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-hanzi text-base font-semibold text-white">
                        {line.hanzi}
                      </span>
                      <button
                        onClick={() => handlePlayAudio(line.hanzi, `dlg-${idx}`)}
                        className="text-slate-400 hover:text-emerald-400 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs font-mono text-emerald-400/90">{line.pinyin}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{line.vi}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Vocabulary Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>TỪ VỰNG TRỌNG TÂM HSK 3.0 ({currentLesson.vocabList.length} TỪ)</span>
              </div>
              <span className="text-xs text-slate-400">Âm Hán Việt & Bộ thủ chuẩn</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {currentLesson.vocabList.map((vocab) => (
                <div
                  key={vocab.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    {/* Big Hanzi Box */}
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl font-bold font-hanzi text-white shadow-inner">
                      {vocab.hanzi}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base font-hanzi">
                          {vocab.hanzi}
                        </span>
                        <span className="text-xs font-mono font-semibold text-emerald-400">
                          {vocab.pinyin}
                        </span>
                        <button
                          onClick={() => handlePlayAudio(vocab.hanzi, vocab.id)}
                          className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="text-amber-300 font-medium">
                          Hán-Việt: {vocab.sinoVietnamese}
                        </span>
                        <span>•</span>
                        <span className="text-slate-200">{vocab.meaning}</span>
                        <span>•</span>
                        <span className="text-slate-500 font-mono">
                          {vocab.strokeCount} nét ({vocab.radical})
                        </span>
                      </div>

                      {/* Example sentence */}
                      <div className="text-xs text-slate-400 mt-1 bg-slate-950/40 px-2 py-1 rounded inline-block">
                        <span className="text-slate-300 font-hanzi">{vocab.example}</span>{' '}
                        <span className="text-slate-500 font-mono">({vocab.examplePinyin})</span> :{' '}
                        <span>{vocab.exampleMeaning}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for each vocab */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onSelectVocabForPractice(vocab)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                      title="Luyện viết trên bảng Điền Tự Cách"
                    >
                      <PenTool className="w-3 h-3 text-emerald-400" />
                      <span>Viết nét</span>
                    </button>
                    <button
                      onClick={() => onAddVocabToSRS(vocab)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-medium border border-emerald-500/30 transition-colors"
                      title="Thêm vào danh sách thẻ SRS trí nhớ"
                    >
                      <Brain className="w-3 h-3 text-emerald-400" />
                      <span>Lưu SRS</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grammar Points Card */}
          {currentLesson.grammarPoints.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>NGỮ PHÁP TRỌNG ĐIỂM HSK 3.0</span>
              </div>

              <div className="space-y-4">
                {currentLesson.grammarPoints.map((grammar) => (
                  <div
                    key={grammar.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-emerald-300">{grammar.title}</h4>
                      <code className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                        {grammar.formula}
                      </code>
                    </div>
                    <p className="text-xs text-slate-300">{grammar.explanation}</p>

                    <div className="mt-2 space-y-1.5 pt-2 border-t border-slate-800/80">
                      {grammar.examples.map((ex, exIdx) => (
                        <div key={exIdx} className="flex items-center gap-2 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="font-hanzi text-white font-medium">{ex.hanzi}</span>
                          <span className="font-mono text-slate-400">({ex.pinyin})</span>
                          <span className="text-slate-500">➔</span>
                          <span className="text-slate-300">{ex.vietnamese}</span>
                          <button
                            onClick={() => handlePlayAudio(ex.hanzi, `ex-${grammar.id}-${exIdx}`)}
                            className="text-slate-400 hover:text-emerald-400"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

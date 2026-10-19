import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Trophy,
  Sparkles,
  RotateCcw,
  Volume2,
  CheckCircle2,
  XCircle,
  Timer,
  Zap,
  Star,
  Flame,
  Award,
  ChevronRight,
} from 'lucide-react';
import { speakChinese } from '../utils/speech';

type GameMode = 'match' | 'tone' | 'sentence';

interface MatchCard {
  id: string;
  pairId: number;
  content: string;
  type: 'hanzi' | 'meaning';
  pinyin?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const HSK_MATCH_PAIRS = [
  { id: 1, hanzi: '你好', pinyin: 'Nǐ hǎo', meaning: 'Xin chào' },
  { id: 2, hanzi: '谢谢', pinyin: 'Xièxie', meaning: 'Cảm ơn' },
  { id: 3, hanzi: '再见', pinyin: 'Zàijiàn', meaning: 'Tạm biệt' },
  { id: 4, hanzi: '学习', pinyin: 'Xuéxí', meaning: 'Học tập' },
  { id: 5, hanzi: '汉语', pinyin: 'Hànyǔ', meaning: 'Tiếng Trung' },
  { id: 6, hanzi: '朋友', pinyin: 'Péngyou', meaning: 'Bạn bè' },
];

const TONE_QUESTIONS = [
  { hanzi: '妈', pinyin: 'mā', tone: 1, meaning: 'Mẹ', toneName: 'Thanh 1 (Cao bằng 55)' },
  { hanzi: '麻', pinyin: 'má', tone: 2, meaning: 'Cây gai / tê bì', toneName: 'Thanh 2 (Lên giọng 35)' },
  { hanzi: '马', pinyin: 'mǎ', tone: 3, meaning: 'Con ngựa', toneName: 'Thanh 3 (Uốn lượn 214)' },
  { hanzi: '骂', pinyin: 'mà', tone: 4, meaning: 'Mắng mỏ', toneName: 'Thanh 4 (Dứt khoát 51)' },
  { hanzi: '天', pinyin: 'tiān', tone: 1, meaning: 'Trời / ngày', toneName: 'Thanh 1 (Cao bằng 55)' },
  { hanzi: '国', pinyin: 'guó', tone: 2, meaning: 'Quốc gia', toneName: 'Thanh 2 (Lên giọng 35)' },
  { hanzi: '好', pinyin: 'hǎo', tone: 3, meaning: 'Tốt / khỏe', toneName: 'Thanh 3 (Uốn lượn 214)' },
  { hanzi: '去', pinyin: 'qù', tone: 4, meaning: 'Đi', toneName: 'Thanh 4 (Dứt khoát 51)' },
];

const SENTENCE_CHALLENGES = [
  {
    targetHanzi: '我把作业做完了。',
    pinyin: 'Wǒ bǎ zuòyè zuò wán le.',
    meaning: 'Tôi đã làm xong bài tập rồi.',
    grammar: 'Cấu trúc câu chữ 把 (Chủ ngữ + 把 + Tân ngữ + Động từ + Kết quả)',
    words: ['我', '把', '作业', '做完了。'],
  },
  {
    targetHanzi: '今天比昨天冷。',
    pinyin: 'Jīntiān bǐ zuótiān lěng.',
    meaning: 'Hôm nay lạnh hơn hôm qua.',
    grammar: 'Cấu trúc câu so sánh 比 (A + 比 + B + Tính từ)',
    words: ['今天', '比', '昨天', '冷。'],
  },
  {
    targetHanzi: '他在北京学汉语。',
    pinyin: 'Tā zài Běijīng xué Hànyǔ.',
    meaning: 'Anh ấy học tiếng Trung ở Bắc Kinh.',
    grammar: 'Trạng từ chỉ nơi chốn (Chủ ngữ + 在 + Địa điểm + Động từ)',
    words: ['他', '在', '北京', '学汉语。'],
  },
];

export const EducationalGamesView: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameMode>('match');

  // GAME 1: Match Cards State
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<MatchCard[]>([]);
  const [matchScore, setMatchScore] = useState(0);
  const [matchCombo, setMatchCombo] = useState(0);
  const [matchSeconds, setMatchSeconds] = useState(0);
  const [isMatchFinished, setIsMatchFinished] = useState(false);

  // GAME 2: Tone Pop State
  const [toneIndex, setToneIndex] = useState(0);
  const [toneScore, setToneScore] = useState(0);
  const [toneFeedback, setToneFeedback] = useState<'correct' | 'wrong' | null>(null);

  // GAME 3: Sentence Builder State
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [assembledWords, setAssembledWords] = useState<string[]>([]);
  const [isSentenceCorrect, setIsSentenceCorrect] = useState<boolean | null>(null);

  // Init Match Game
  useEffect(() => {
    initMatchGame();
  }, []);

  // Timer for Match Game
  useEffect(() => {
    let interval: any = null;
    if (activeGame === 'match' && !isMatchFinished) {
      interval = setInterval(() => setMatchSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeGame, isMatchFinished]);

  const initMatchGame = () => {
    const cards: MatchCard[] = [];
    HSK_MATCH_PAIRS.forEach((pair) => {
      cards.push({
        id: `h-${pair.id}`,
        pairId: pair.id,
        content: pair.hanzi,
        pinyin: pair.pinyin,
        type: 'hanzi',
        isFlipped: false,
        isMatched: false,
      });
      cards.push({
        id: `m-${pair.id}`,
        pairId: pair.id,
        content: pair.meaning,
        type: 'meaning',
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    const shuffled = cards.sort(() => Math.random() - 0.5);
    setMatchCards(shuffled);
    setFlippedCards([]);
    setMatchScore(0);
    setMatchCombo(0);
    setMatchSeconds(0);
    setIsMatchFinished(false);
  };

  const handleCardClick = (card: MatchCard) => {
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    if (card.type === 'hanzi') {
      speakChinese(card.content);
    }

    const newCards = matchCards.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c));
    setMatchCards(newCards);

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (first.pairId === second.pairId) {
        // Matched!
        setTimeout(() => {
          setMatchCards((prev) =>
            prev.map((c) => (c.pairId === first.pairId ? { ...c, isMatched: true } : c))
          );
          setMatchScore((s) => s + 100 + matchCombo * 20);
          setMatchCombo((c) => c + 1);
          setFlippedCards([]);

          // Check if all matched
          const remaining = newCards.filter((c) => !c.isMatched && c.pairId !== first.pairId);
          if (remaining.length === 0) {
            setIsMatchFinished(true);
          }
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          setMatchCards((prev) =>
            prev.map((c) => (c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c))
          );
          setMatchCombo(0);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Tone Pop Logic
  const currentToneQ = TONE_QUESTIONS[toneIndex];

  const handleAnswerTone = (selectedTone: number) => {
    if (toneFeedback !== null) return;

    if (selectedTone === currentToneQ.tone) {
      setToneFeedback('correct');
      setToneScore((s) => s + 50);
      speakChinese(currentToneQ.hanzi);
      setTimeout(() => {
        setToneFeedback(null);
        setToneIndex((idx) => (idx + 1) % TONE_QUESTIONS.length);
      }, 1000);
    } else {
      setToneFeedback('wrong');
      setTimeout(() => {
        setToneFeedback(null);
      }, 1200);
    }
  };

  // Sentence Builder Logic
  useEffect(() => {
    initSentence(sentenceIndex);
  }, [sentenceIndex]);

  const initSentence = (idx: number) => {
    const s = SENTENCE_CHALLENGES[idx];
    const shuffled = [...s.words].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffled);
    setAssembledWords([]);
    setIsSentenceCorrect(null);
  };

  const handleSelectWord = (word: string, indexInAvailable: number) => {
    setAssembledWords((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, i) => i !== indexInAvailable));
  };

  const handleRemoveWord = (word: string, indexInAssembled: number) => {
    setAvailableWords((prev) => [...prev, word]);
    setAssembledWords((prev) => prev.filter((_, i) => i !== indexInAssembled));
  };

  const handleCheckSentence = () => {
    const current = SENTENCE_CHALLENGES[sentenceIndex];
    const assembledStr = assembledWords.join('');
    if (assembledStr === current.targetHanzi) {
      setIsSentenceCorrect(true);
      speakChinese(current.targetHanzi);
    } else {
      setIsSentenceCorrect(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Đấu Trường Học Tập Gamification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Minigame Tiếng Trung CiCi Chinese
            </h1>
            <p className="text-xs text-slate-300">
              Vừa học vừa chơi, tăng tốc phản xạ ghi nhớ Hán tự, phân biệt 4 thanh điệu và làm chủ ngữ pháp HSK 3.0.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveGame('match')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeGame === 'match'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Ghép Thẻ Hán Tự
            </button>
            <button
              onClick={() => setActiveGame('tone')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeGame === 'tone'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Bắn Bóng Thanh Điệu
            </button>
            <button
              onClick={() => setActiveGame('sentence')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeGame === 'sentence'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Xếp Câu HSK 3.0
            </button>
          </div>
        </div>
      </div>

      {/* GAME 1: HANZI MATCH RUSH */}
      {activeGame === 'match' && (
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-sm">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Điểm: {matchScore}</span>
              </div>
              {matchCombo > 1 && (
                <div className="flex items-center gap-1 text-rose-400 text-xs font-extrabold animate-bounce">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>Combo x{matchCombo}!</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                <Timer className="w-4 h-4 text-emerald-400" />
                <span>{matchSeconds}s</span>
              </div>
              <button
                onClick={initMatchGame}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chơi lại</span>
              </button>
            </div>
          </div>

          {isMatchFinished ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Xuất Sắc! Hoàn Thành Thử Thách</h3>
              <p className="text-slate-300 text-xs">
                Bạn đạt <strong>{matchScore} điểm</strong> trong thời gian <strong>{matchSeconds} giây</strong>!
              </p>
              <button
                onClick={initMatchGame}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
              >
                Chơi Vòng Mới
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {matchCards.map((card) => {
                const showContent = card.isFlipped || card.isMatched;
                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className={`h-28 rounded-xl flex flex-col items-center justify-center p-3 cursor-pointer select-none transition-all duration-300 ${
                      card.isMatched
                        ? 'bg-emerald-950/40 border border-emerald-500/30 opacity-60'
                        : card.isFlipped
                        ? 'bg-slate-800 border-2 border-amber-400 shadow-lg scale-105'
                        : 'bg-slate-950 border border-slate-800 hover:border-slate-700 hover:scale-102'
                    }`}
                  >
                    {showContent ? (
                      card.type === 'hanzi' ? (
                        <>
                          <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-hanzi">
                            {card.content}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono mt-1">
                            {card.pinyin}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs sm:text-sm font-semibold text-slate-200 text-center">
                          {card.content}
                        </span>
                      )
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-600">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">CiCi</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* GAME 2: TONE BUBBLE POP */}
      {activeGame === 'tone' && (
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl space-y-6 text-center">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400">
              Câu hỏi: <strong>{toneIndex + 1}</strong>/{TONE_QUESTIONS.length}
            </span>
            <div className="flex items-center gap-1 text-amber-300 font-bold text-sm">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Điểm: {toneScore}</span>
            </div>
          </div>

          <div className="py-6 space-y-3">
            <div className="text-6xl sm:text-7xl font-extrabold text-amber-300 font-hanzi">
              {currentToneQ.hanzi}
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl font-mono text-emerald-400">{currentToneQ.pinyin}</span>
              <button
                onClick={() => speakChinese(currentToneQ.hanzi)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200"
                title="Nghe phát âm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">Nghĩa: {currentToneQ.meaning}</p>
            <p className="text-xs font-semibold text-slate-300">
              Chữ Hán trên mang thanh điệu nào? Bấm vào bóng thanh điệu tương ứng:
            </p>
          </div>

          {/* 4 Tone Bubbles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((t) => (
              <button
                key={t}
                onClick={() => handleAnswerTone(t)}
                disabled={toneFeedback !== null}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/80 hover:bg-slate-850 hover:scale-105 active:scale-95 transition-all shadow-md group flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-teal-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-lg text-amber-300 group-hover:scale-110 transition-transform">
                  {t === 1 ? '¯' : t === 2 ? 'ˊ' : t === 3 ? 'ˇ' : 'ˋ'}
                </div>
                <span className="text-xs font-bold text-white">Thanh {t}</span>
                <span className="text-[10px] text-slate-400">
                  {t === 1 ? 'Cao bằng' : t === 2 ? 'Lên giọng' : t === 3 ? 'Uốn lượn' : 'Dứt khoát'}
                </span>
              </button>
            ))}
          </div>

          {/* Feedback Overlay Banner */}
          {toneFeedback && (
            <div
              className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 animate-in fade-in ${
                toneFeedback === 'correct'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
              }`}
            >
              {toneFeedback === 'correct' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Chính xác! {currentToneQ.hanzi} ({currentToneQ.pinyin}) mang {currentToneQ.toneName}.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Chưa đúng rồi! Hãy lắng nghe lại và chú ý cao độ điểm rơi của âm nhé.</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* GAME 3: SENTENCE BUILDER HSK 3.0 */}
      {activeGame === 'sentence' && (
        <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Thử Thách Ngữ Pháp HSK 3.0
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Câu {sentenceIndex + 1}/{SENTENCE_CHALLENGES.length}: Sắp xếp các từ thành câu hoàn chỉnh
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              Nghĩa: {SENTENCE_CHALLENGES[sentenceIndex].meaning}
            </span>
          </div>

          {/* Dropzone for Assembled Words */}
          <div className="min-h-20 p-4 rounded-xl bg-slate-950 border-2 border-dashed border-slate-700 flex flex-wrap items-center gap-2">
            {assembledWords.length === 0 ? (
              <span className="text-xs text-slate-500 italic">
                Chạm vào các từ bên dưới để đưa vào vị trí này...
              </span>
            ) : (
              assembledWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveWord(word, idx)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-hanzi text-lg font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                  title="Bấm để gỡ từ này"
                >
                  <span>{word}</span>
                </button>
              ))
            )}
          </div>

          {/* Available Words Pool */}
          <div>
            <p className="text-xs text-slate-400 mb-2">Các khối từ có sẵn:</p>
            <div className="flex flex-wrap gap-2.5">
              {availableWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectWord(word, idx)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-hanzi text-lg font-bold border border-slate-700 shadow transition-all active:scale-95"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {/* Grammar explanation note */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400">
            <span className="font-bold text-emerald-400">Gợi ý ngữ pháp: </span>
            {SENTENCE_CHALLENGES[sentenceIndex].grammar}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              onClick={() => initSentence(sentenceIndex)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xếp lại</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCheckSentence}
                disabled={assembledWords.length === 0}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-40"
              >
                Kiểm Tra Đáp Án
              </button>

              {isSentenceCorrect && (
                <button
                  onClick={() => setSentenceIndex((s) => (s + 1) % SENTENCE_CHALLENGES.length)}
                  className="flex items-center gap-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
                >
                  <span>Câu kế tiếp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Result Feedback */}
          {isSentenceCorrect !== null && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                isSentenceCorrect
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
              }`}
            >
              {isSentenceCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Chính xác! Câu chuẩn: <strong>{SENTENCE_CHALLENGES[sentenceIndex].targetHanzi}</strong> ({SENTENCE_CHALLENGES[sentenceIndex].pinyin})
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Thứ tự từ chưa chính xác. Hãy nhớ quy tắc ngữ pháp gợi ý ở trên nhé!</span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

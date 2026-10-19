import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { CurriculumView } from './components/CurriculumView';
import { ClassDatabaseView } from './components/ClassDatabaseView';
import { SRSReviewView } from './components/SRSReviewView';
import { PronunciationLab } from './components/PronunciationLab';
import { StrokeCanvas } from './components/StrokeCanvas';
import { MockExamView } from './components/MockExamView';
import { AdminDashboard } from './components/AdminDashboard';
import { AIChatDrawer } from './components/AIChatDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { INITIAL_SRS_CARDS, SRSCard, Vocabulary } from './data/hskData';
import { getStoredApiKey } from './services/aiService';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('curriculum');
  const [userLevel, setUserLevel] = useState<1 | 2 | 3>(1);
  const [currentLessonId, setCurrentLessonId] = useState<number>(1);
  const [selectedCharForStroke, setSelectedCharForStroke] = useState<string>('你');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  // Check stored API key on mount
  useEffect(() => {
    const key = getStoredApiKey();
    setHasApiKey(Boolean(key));
  }, [isApiKeyModalOpen]);

  // Persistent SRS cards state
  const [srsCards, setSrsCards] = useState<SRSCard[]>(() => {
    try {
      const saved = localStorage.getItem('cici_srs_cards') || localStorage.getItem('sinomind_srs_cards');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return INITIAL_SRS_CARDS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('cici_srs_cards', JSON.stringify(srsCards));
    } catch (e) {
      // ignore
    }
  }, [srsCards]);

  // Calculate due cards for header badge
  const now = new Date().toISOString();
  const dueCardsCount = srsCards.filter((c) => c.nextReviewDate <= now).length;

  const handleOpenAiWithPrompt = (prompt: string) => {
    setAiPrompt(prompt);
    setIsAiDrawerOpen(true);
  };

  const handleSelectVocabForPractice = (vocab: Vocabulary) => {
    setSelectedCharForStroke(vocab.hanzi.charAt(0));
    setActiveTab('strokes');
  };

  const handleAddVocabToSRS = (vocab: Vocabulary) => {
    const existing = srsCards.find((c) => c.vocabId === vocab.id);
    if (!existing) {
      const newCard: SRSCard = {
        id: `srs-${Date.now()}`,
        vocabId: vocab.id,
        hanzi: vocab.hanzi,
        pinyin: vocab.pinyin,
        meaning: vocab.meaning,
        hskLevel: vocab.hskLevel,
        lessonId: vocab.lessonId,
        easeFactor: 2.5,
        intervalDays: 1,
        repetitions: 0,
        nextReviewDate: new Date().toISOString(),
        errorCount: 0,
        status: 'new',
      };
      setSrsCards((prev) => [newCard, ...prev]);
      alert(`Đã thêm từ "${vocab.hanzi}" (${vocab.pinyin}) vào danh sách thẻ SRS trí nhớ!`);
    } else {
      alert(`Từ "${vocab.hanzi}" đã có sẵn trong danh sách ôn tập SRS.`);
    }
  };

  // SM-2 Spaced Repetition Algorithm Implementation
  const handleUpdateCardRating = (cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') => {
    setSrsCards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) return card;

        let { easeFactor, intervalDays, repetitions, errorCount } = card;

        if (rating === 'again') {
          repetitions = 0;
          intervalDays = 1;
          easeFactor = Math.max(1.3, easeFactor - 0.2);
          errorCount += 1;
        } else if (rating === 'hard') {
          repetitions = Math.max(1, repetitions);
          intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
          easeFactor = Math.max(1.3, easeFactor - 0.15);
        } else if (rating === 'good') {
          repetitions += 1;
          intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.round(intervalDays * easeFactor);
        } else if (rating === 'easy') {
          repetitions += 1;
          intervalDays = repetitions === 1 ? 2 : repetitions === 2 ? 5 : Math.round(intervalDays * easeFactor * 1.3);
          easeFactor += 0.15;
        }

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + intervalDays);

        return {
          ...card,
          easeFactor,
          intervalDays,
          repetitions,
          errorCount,
          lastReviewedDate: new Date().toISOString(),
          nextReviewDate: nextDate.toISOString(),
          status: repetitions >= 3 ? 'mastered' : 'learning',
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAiChat={() => {
          setAiPrompt('');
          setIsAiDrawerOpen(true);
        }}
        openApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={hasApiKey}
        userLevel={userLevel}
        dueCardsCount={dueCardsCount}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'curriculum' && (
          <CurriculumView
            onSelectVocabForPractice={handleSelectVocabForPractice}
            onAddVocabToSRS={handleAddVocabToSRS}
            onOpenAiWithPrompt={handleOpenAiWithPrompt}
            currentLessonId={currentLessonId}
            setCurrentLessonId={setCurrentLessonId}
            currentLevel={userLevel}
            setCurrentLevel={setUserLevel}
          />
        )}

        {activeTab === 'classes' && (
          <ClassDatabaseView onOpenAiWithPrompt={handleOpenAiWithPrompt} />
        )}

        {activeTab === 'srs' && (
          <SRSReviewView
            cards={srsCards}
            onUpdateCardRating={handleUpdateCardRating}
            onOpenAiWithPrompt={handleOpenAiWithPrompt}
          />
        )}

        {activeTab === 'pronunciation' && (
          <PronunciationLab onOpenAiWithPrompt={handleOpenAiWithPrompt} />
        )}

        {activeTab === 'strokes' && (
          <StrokeCanvas
            initialChar={selectedCharForStroke}
            onOpenAiWithPrompt={handleOpenAiWithPrompt}
          />
        )}

        {activeTab === 'mock-exam' && (
          <MockExamView
            userLevel={userLevel}
            onOpenAiWithPrompt={handleOpenAiWithPrompt}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard onOpenAiWithPrompt={handleOpenAiWithPrompt} />
        )}
      </main>

      {/* CiCi Chinese AI Interactive Tutor Drawer */}
      <AIChatDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        currentLevel={userLevel}
        currentLessonId={currentLessonId}
        activeMode={
          activeTab === 'curriculum'
            ? 'Learning'
            : activeTab === 'classes'
            ? 'Class Consultant'
            : activeTab === 'srs'
            ? 'SRS Review'
            : activeTab === 'pronunciation'
            ? 'AI Pronunciation'
            : activeTab === 'strokes'
            ? 'Stroke Order'
            : activeTab === 'mock-exam'
            ? 'Mock Exam'
            : 'Admin Big Data'
        }
        isAdmin={activeTab === 'admin'}
        initialPrompt={aiPrompt}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Model & Gemini API Key Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* Footer with CiCi Chinese Signature */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-400">
            HỌC TIẾNG TRUNG CÙNG CICI CHINESE • Cùng bạn kiến tạo tương lai tiếng Trung bền vững.
          </p>
          <p className="text-[11px] text-slate-600">
            Hệ sinh thái học tiếng Trung chuyên sâu chuẩn HSK 3.0 • Kết nối Google Sheets Database trực tuyến • Spaced Repetition (SRS)
          </p>
        </div>
      </footer>
    </div>
  );
}

import React from 'react';
import {
  BookOpen,
  Sparkles,
  Brain,
  Mic,
  PenTool,
  Timer,
  ShieldAlert,
  Bot,
  Database,
  Key,
  Calendar,
} from 'lucide-react';

export type ActiveTab =
  | 'curriculum'
  | 'classes'
  | 'srs'
  | 'pronunciation'
  | 'strokes'
  | 'mock-exam'
  | 'admin';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openAiChat: () => void;
  openApiKeyModal: () => void;
  hasApiKey: boolean;
  userLevel: 1 | 2 | 3;
  dueCardsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openAiChat,
  openApiKeyModal,
  hasApiKey,
  userLevel,
  dueCardsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand: HỌC TIẾNG TRUNG CÙNG CICI CHINESE */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('curriculum')}
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 border border-emerald-500/40 shadow-emerald-950/60 shadow-md">
              <span className="font-calligraphy text-2xl text-amber-300 font-bold">茜</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-200 bg-clip-text text-transparent uppercase">
                  Học Tiếng Trung Cùng CiCi Chinese
                </span>
                <span className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded">
                  HSK 3.0 标准
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Trung tâm Tiếng Trung CiCi Chinese • Gia sư bản ngữ ảo & Database Google Sheet
              </p>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'curriculum'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Lộ Trình HSK (15-15-18)</span>
            </button>

            {/* Online Classes Google Sheet Database Tab */}
            <button
              onClick={() => setActiveTab('classes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'classes'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-300" />
              <span>Lớp Học Trực Tuyến</span>
              <span className="px-1 py-0.2 text-[9px] font-bold bg-amber-500 text-slate-950 rounded uppercase tracking-wider">
                Sheet
              </span>
            </button>

            <button
              onClick={() => setActiveTab('srs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'srs'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>SRS Trí Nhớ</span>
              {dueCardsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full animate-bounce">
                  {dueCardsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('pronunciation')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'pronunciation'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Phát Âm AI</span>
            </button>

            <button
              onClick={() => setActiveTab('strokes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'strokes'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Viết Chữ Hán</span>
            </button>

            <button
              onClick={() => setActiveTab('mock-exam')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'mock-exam'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Thi Thử HSK</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'bg-rose-700 text-white shadow-sm shadow-rose-900/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="Chế độ quản trị viên Big Data Heatmap"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right Action Tools: API Key Settings + CiCi AI Chat Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Required Settings Button with Red Text for API Key */}
            <button
              onClick={openApiKeyModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-rose-500/40 hover:border-rose-500 rounded-xl transition-all shadow-sm active:scale-95 group"
              title="Cài đặt API Key Gemini và Model"
            >
              <Key className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-rose-400 group-hover:text-rose-300 leading-tight">
                  Lấy API key để sử dụng app
                </span>
                <span className="text-[9px] text-slate-400 leading-tight">
                  {hasApiKey ? '🟢 Đã cài key' : '⚙️ Nhập Gemini Key'}
                </span>
              </div>
            </button>

            {/* Quick CiCi AI Tutor Chat Trigger */}
            <button
              onClick={openAiChat}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              <Bot className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Gia sư CiCi AI</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-900 fill-amber-900" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 scrollbar-none border-t border-slate-900">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium ${
              activeTab === 'curriculum' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Lộ Trình
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium flex items-center gap-1 ${
              activeTab === 'classes' ? 'bg-emerald-600 text-white' : 'text-amber-300/90'
            }`}
          >
            <Database className="w-3 h-3" />
            <span>Lớp Học (Sheet)</span>
          </button>
          <button
            onClick={() => setActiveTab('srs')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium ${
              activeTab === 'srs' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            SRS ({dueCardsCount})
          </button>
          <button
            onClick={() => setActiveTab('pronunciation')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium ${
              activeTab === 'pronunciation' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Phát Âm AI
          </button>
          <button
            onClick={() => setActiveTab('strokes')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium ${
              activeTab === 'strokes' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Luyện Viết
          </button>
          <button
            onClick={() => setActiveTab('mock-exam')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium ${
              activeTab === 'mock-exam' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Thi Thử
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap font-medium ${
              activeTab === 'admin' ? 'bg-rose-700 text-white' : 'text-slate-400'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};

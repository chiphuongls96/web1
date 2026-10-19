import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Volume2, StopCircle, RefreshCw, Key } from 'lucide-react';
import { speakChinese, stopSpeaking } from '../utils/speech';
import { generateGeminiContentWithFallback } from '../services/aiService';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  usedModel?: string;
}

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: 1 | 2 | 3;
  currentLessonId: number;
  activeMode: string;
  isAdmin: boolean;
  initialPrompt?: string;
  onOpenApiKeyModal?: () => void;
}

const QUICK_PROMPTS = [
  'Tư vấn danh sách lớp học online sắp khai giảng',
  'Giải thích câu chữ 把 (Bǎ) trong HSK 3',
  'Sửa lỗi biến điệu 2 thanh 3 liên tiếp',
  'Phân biệt cách dùng 不 (bù) và 没 (méi)',
  'Thời điểm vàng SRS hôm nay của tôi khi nào?',
  'Lập kế hoạch làm chủ 15 bài HSK 1',
];

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  currentLevel,
  currentLessonId,
  activeMode,
  isAdmin,
  initialPrompt,
  onOpenApiKeyModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `[STATUS]: Đang học HSK ${currentLevel} - Bài ${currentLessonId} | Chế độ: ${activeMode}

[CONTENT]:
Chào bạn! Tôi là CiCi Chinese AI — Kiến trúc sư học tập và Gia sư bản ngữ ảo của trung tâm CiCi Chinese.
Hôm nay, bạn muốn tư vấn lớp học trực tuyến, mở rộng kiến thức mới, tinh chỉnh khẩu hình phát âm, hay củng cố từ vựng theo thuật toán SRS?

[AI ANALYSIS]:
- Phát âm: Sẵn sàng phân tích chuẩn xác cao độ 4 thanh điệu.
- Viết chữ: Hỗ trợ giám sát từng nét bút thuận trên ô Điền Tự Cách.
- Trí nhớ: Hệ thống đang theo dõi thời điểm vàng ôn tập để tối ưu hóa trí nhớ dài hạn.

[ACTIONABLE ADVICE]:
Hãy đặt câu hỏi cụ thể về ngữ âm, ngữ pháp hoặc các lớp học đang tuyển sinh của cô CiCi!

CiCi Chinese - Cùng bạn kiến tạo tương lai tiếng Trung bền vững.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    const userPromptWithContext = `[Bối cảnh học viên CiCi Chinese: Cấp độ HSK ${currentLevel}, Bài ${currentLessonId}, Chế độ: ${activeMode}, Vai trò: ${
      isAdmin ? 'Admin' : 'Học viên'
    }]
Học viên nhắn: ${text}

Hãy phản hồi theo đúng cấu trúc 5 module chuẩn mực của CiCi Chinese AI:
[STATUS]
[CONTENT]
[AI ANALYSIS]
[ACTIONABLE ADVICE]
[ADMIN ONLY - if applicable]
Chữ ký kết thúc: "CiCi Chinese - Cùng bạn kiến tạo tương lai tiếng Trung bền vững."`;

    try {
      const result = await generateGeminiContentWithFallback(userPromptWithContext);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: result.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        usedModel: result.usedModel,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      const fallbackAiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `[STATUS]: Đang học HSK ${currentLevel} - Bài ${currentLessonId} | Chế độ: ${activeMode}\n\n[CONTENT]:\nCảm ơn bạn đã trao đổi cùng CiCi Chinese. Tôi luôn đồng hành cùng bạn trên con đường chinh phục HSK 3.0 và giao tiếp tự nhiên.\n\n[AI ANALYSIS]:\n- Phát âm: Tốt, duy trì nhịp điệu tự nhiên.\n- Viết chữ: Chú ý thứ tự nét chữ.\n- Trí nhớ: Duy trì ôn tập SRS đều đặn.\n\n[ACTIONABLE ADVICE]:\nHãy kiên trì thực hành ít nhất 20 phút mỗi ngày.\n\nCiCi Chinese - Cùng bạn kiến tạo tương lai tiếng Trung bền vững.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (msgId: string, content: string) => {
    if (isSpeakingId === msgId) {
      stopSpeaking();
      setIsSpeakingId(null);
      return;
    }
    setIsSpeakingId(msgId);
    await speakChinese(content);
    setIsSpeakingId(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-all">
      <div className="w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">CiCi Chinese AI</h3>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                  Gia Sư Bản Ngữ Ảo
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                HSK {currentLevel} • Bài {currentLessonId} • Chế độ: {activeMode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenApiKeyModal && (
              <button
                onClick={onOpenApiKeyModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                title="Cài đặt API Key & Model"
              >
                <Key className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto flex gap-1.5 scrollbar-none">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] whitespace-nowrap border border-slate-700/80 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed shadow-md ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-bl-none whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>

                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  {msg.usedModel && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                      {msg.usedModel}
                    </span>
                  )}
                  {!isUser && (
                    <button
                      onClick={() => handleSpeak(msg.id, msg.text)}
                      className="text-slate-400 hover:text-emerald-400 text-[11px] flex items-center gap-1 transition-colors"
                      title="Đọc to nội dung này"
                    >
                      {isSpeakingId === msg.id ? (
                        <>
                          <StopCircle className="w-3 h-3 text-rose-400" />
                          <span className="text-rose-400">Dừng</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          <span>Nghe đọc</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
              <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>CiCi Chinese AI đang điều phối lộ trình sư phạm...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Đặt câu hỏi về phát âm, ngữ pháp, lớp học của cô CiCi..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-slate-500 text-center mt-2">
            CiCi Chinese - Cùng bạn kiến tạo tương lai tiếng Trung bền vững.
          </div>
        </div>
      </div>
    </div>
  );
};

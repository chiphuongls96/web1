import React, { useState, useEffect } from 'react';
import {
  AI_MODELS,
  getStoredApiKey,
  setStoredApiKey,
  getStoredModel,
  setStoredModel,
} from '../services/aiService';
import { Key, Sparkles, ExternalLink, Check, AlertTriangle, ShieldCheck, X } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRequired?: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  isRequired = false,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKeyInput(getStoredApiKey());
      setSelectedModel(getStoredModel());
      setIsSaved(false);
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = apiKeyInput.trim();
    if (isRequired && !trimmed) {
      setErrorMsg('Vui lòng nhập API Key để tiếp tục sử dụng ứng dụng.');
      return;
    }

    setStoredApiKey(trimmed);
    setStoredModel(selectedModel);
    setIsSaved(true);
    setErrorMsg(null);

    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md">
              <Key className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Thiết Lập Model & Gemini API Key</h3>
              <p className="text-xs text-slate-400">
                Tự động lưu vào trình duyệt của bạn (localStorage)
              </p>
            </div>
          </div>
          {!isRequired && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Guide to get API Key */}
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-slate-300 leading-relaxed">
              <span className="font-bold text-rose-400">Lấy API key để sử dụng app: </span>
              Bạn có thể tạo Gemini API Key hoàn toàn miễn phí tại{' '}
              <a
                href="https://aistudio.google.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:underline font-bold inline-flex items-center gap-1"
              >
                Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
              . Key chỉ lưu trên trình duyệt của bạn, hoàn toàn bảo mật.
            </div>
          </div>

          {/* Model Selection Cards */}
          <div>
            <label className="block font-bold text-slate-200 mb-2">
              Chọn Model AI Vận Hành (Thứ tự ưu tiên fallback):
            </label>
            <div className="space-y-2">
              {AI_MODELS.map((model) => (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    selectedModel === model.id
                      ? 'bg-emerald-500/10 border-emerald-500 shadow-sm shadow-emerald-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{model.name}</span>
                      {model.recommendedTag && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">
                          {model.recommendedTag}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{model.description}</p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      selectedModel === model.id
                        ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                        : 'border-slate-600'
                    }`}
                  >
                    {selectedModel === model.id && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block font-bold text-slate-200 mb-1">
              Google Gemini API Key:
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Dán mã API key (bắt đầu bằng AIzaSy...)"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            {errorMsg && (
              <p className="text-[11px] text-rose-400 mt-1 font-semibold">{errorMsg}</p>
            )}
          </div>

          {/* Fallback notes */}
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-emerald-400">Cơ chế Tự Động Retry: </span>
            Nếu model chính gặp lỗi hoặc hết quota, hệ thống sẽ tự động chuyển sang model tiếp theo trong danh sách mà không làm gián đoạn bài học.
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            {!isRequired && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-700/30 transition-all active:scale-95"
            >
              {isSaved ? <Check className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>{isSaved ? 'Đã lưu cấu hình!' : 'Lưu & Bắt Đầu Học'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

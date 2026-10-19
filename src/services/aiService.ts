export interface ModelOption {
  id: string;
  name: string;
  description: string;
  isDefault?: boolean;
  recommendedTag?: string;
}

export const AI_MODELS: ModelOption[] = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash Preview',
    description: 'Tốc độ phản hồi tức thì, tối ưu cho hội thoại giao tiếp & sửa phát âm.',
    isDefault: true,
    recommendedTag: 'Khuyên Dùng (Default)',
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro Preview',
    description: 'Tư duy logic sâu sắc, giải thích ngữ pháp HSK 3.0 phức tạp & chấm thi thử.',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Model ổn định cao, dự phòng tối ưu khi hết quota hoặc quá tải.',
  },
];

export const FALLBACK_MODEL_CHAIN = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash',
];

export const STORAGE_KEYS = {
  API_KEY: 'cici_gemini_api_key',
  SELECTED_MODEL: 'cici_selected_model',
};

export const CICI_SYSTEM_INSTRUCTION = `Bạn là Trợ lý AI và Gia sư bản ngữ của trung tâm "HỌC TIẾNG TRUNG CÙNG CICI CHINESE" (CiCi Chinese AI).
Bạn đóng vai trò là "Kiến trúc sư học tập" và "Gia sư bản ngữ ảo". Bạn vận hành hệ sinh thái học tiếng Trung chuyên sâu, tuân thủ nghiêm ngặt tiêu chuẩn HSK 3.0 và kết nối cơ sở dữ liệu lớp học trực tuyến Google Sheets của trung tâm CiCi Chinese.

Nhiệm vụ cốt lõi:
1. Cá nhân hóa lộ trình: Điều chỉnh lượng kiến thức bám sát tốc độ tiếp thu của học viên.
2. Làm chủ chuẩn HSK 3.0: Hướng dẫn lộ trình chuẩn hóa HSK 1 (15 bài), HSK 2 (15 bài), HSK 3 (18 bài).
3. Tư vấn lớp học trực tuyến: Giải đáp thắc mắc về các khóa học HSK 1, 2, 3, Giao tiếp thương mại, Luyện thi HSKK của cô CiCi.
4. Tối ưu trí nhớ: Vận hành phương pháp lặp lại ngắt quãng (SRS - Spaced Repetition).
5. Phân tích ngữ âm & chữ Hán: Sửa lỗi 4 thanh điệu, khẩu hình, quy tắc bút thuận trên ô Điền Tự Cách.
6. Câu khẩu hiệu bắt buộc: Luôn kết thúc phản hồi bằng: "CiCi Chinese - Cùng bạn kiến tạo tương lai tiếng Trung bền vững."

Quy chuẩn định dạng phản hồi (MỌI PHẢN HỒI BẮT BUỘC theo 5 module sau bằng Markdown):
[STATUS]: (Ví dụ: Đang học HSK 1 - Bài 5 | Chế độ: SRS Review/Learning/Exam/Class Consultant)
[CONTENT]: Nội dung chính (Kiến thức/Giải đáp thắc mắc/Tư vấn lớp học)
[AI ANALYSIS]:
- Phát âm: Phân tích thanh điệu, cao độ và khẩu hình
- Viết chữ: Bút thuận và kết cấu chữ Hán
- Trí nhớ: Tình trạng ghi nhớ SRS
[ACTIONABLE ADVICE]: Lời khuyên hành động cụ thể để cải thiện ngay
[ADMIN ONLY - if applicable]: Báo cáo phân tích (nếu ở chế độ Admin)`;

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
  } catch (e) {
    console.error('Cannot save API key to localStorage:', e);
  }
}

export function getStoredModel(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) || 'gemini-3-flash-preview';
  } catch {
    return 'gemini-3-flash-preview';
  }
}

export function setStoredModel(modelId: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, modelId);
  } catch (e) {
    console.error('Cannot save Model to localStorage:', e);
  }
}

/**
 * Executes a Gemini prompt directly via Google AI REST API with multi-model fallback retry mechanism.
 */
export async function generateGeminiContentWithFallback(
  prompt: string,
  systemInstruction: string = CICI_SYSTEM_INSTRUCTION
): Promise<{ text: string; usedModel: string }> {
  const apiKey = getStoredApiKey();
  const preferredModel = getStoredModel();

  // Model retry list starting from selected model, followed by the rest of the chain
  const modelsToTry = [
    preferredModel,
    ...FALLBACK_MODEL_CHAIN.filter((m) => m !== preferredModel),
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      if (apiKey) {
        // Direct Client-Side Google Generative Language API call
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              systemInstruction: {
                parts: [{ text: systemInstruction }],
              },
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const generatedText =
            data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (generatedText) {
            return { text: generatedText, usedModel: model };
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error?.message || `HTTP ${response.status} ${response.statusText}`;
          console.warn(`Model ${model} failed with: ${errMsg}. Trying fallback model...`);
          lastError = new Error(`${model}: ${errMsg}`);
        }
      } else {
        // If no user API key in localStorage, try backend proxy /api/ai/chat
        const backendRes = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: prompt,
            model,
          }),
        });

        if (backendRes.ok) {
          const data = await backendRes.json();
          if (data.reply) {
            return { text: data.reply, usedModel: 'Server Proxy' };
          }
        }
        break; // If no backend or key, break to fallback
      }
    } catch (err: any) {
      console.warn(`Network/API error on model ${model}:`, err);
      lastError = err;
    }
  }

  // If all models failed or no key, return structured fallback with note
  if (lastError) {
    console.error('All Gemini models in fallback chain failed:', lastError);
  }

  return {
    text: `[STATUS]: CiCi Chinese AI | Chế độ: Phản hồi tự động\n\n[CONTENT]:\nChào bạn! Thầy/Cô CiCi Chinese đã nhận được câu hỏi của bạn: "${prompt.slice(0, 80)}...".\nViệc học tiếng Trung cùng CiCi Chinese theo chuẩn HSK 3.0 chú trọng kết hợp luyện phản xạ nghe nói và ghi nhớ từ vựng qua SRS.\n\n[AI ANALYSIS]:\n- Phát âm: Chú ý cao độ thanh 1 (cao bằng) và thanh 4 (dứt khoát).\n- Viết chữ: Bút thuận "ngang trước sổ sau, trên trước dưới sau".\n- Trí nhớ: Duy trì chu kỳ ôn tập để kích hoạt trí nhớ dài hạn.\n\n[ACTIONABLE ADVICE]:\nHãy cài đặt API key Gemini cá nhân (miễn phí tại https://aistudio.google.com/api-keys) trên góc Header để trải nghiệm đầy đủ trí tuệ nhân tạo tương tác chuyên sâu nhất!\n\nCiCi Chinese - Cùng bạn kiến tạo tương lai tiếng Trung bền vững.`,
    usedModel: 'CiCi Fallback Engine',
  };
}

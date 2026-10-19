import { ExamQuestion, Lesson } from '../data/hskData';
import { ClassRegistration } from '../types/classData';

/**
 * Exports Mock Exam to a professional Microsoft Word (.doc) format with CiCi Chinese branding,
 * question breakdown, and detailed answer key.
 */
export function exportExamToWord(level: number, questions: ExamQuestion[]): void {
  const listeningQuestions = questions.filter((q) => q.section === 'listening');
  const readingQuestions = questions.filter((q) => q.section === 'reading');
  const writingQuestions = questions.filter((q) => q.section === 'writing');

  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Đề Thi Thử HSK ${level} - CiCi Chinese</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; color: #111; }
        .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 20px; }
        .brand { font-size: 16pt; font-weight: bold; color: #059669; text-transform: uppercase; }
        .sub-brand { font-size: 11pt; color: #555; }
        .title { font-size: 18pt; font-weight: bold; margin-top: 10px; color: #1e293b; }
        .info-box { border: 1px dashed #059669; padding: 10px; background-color: #f0fdf4; margin-bottom: 20px; font-size: 11pt; }
        .section-title { font-size: 14pt; font-weight: bold; color: #0f766e; margin-top: 24px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
        .question-item { margin-bottom: 16px; page-break-inside: avoid; }
        .q-prompt { font-weight: bold; margin-bottom: 6px; }
        .options { margin-left: 20px; list-style-type: upper-alpha; }
        .answer-key-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .answer-key-table th, .answer-key-table td { border: 1px solid #999; padding: 8px; text-align: left; font-size: 11pt; }
        .answer-key-table th { background-color: #f1f5f9; }
        .footer { margin-top: 40px; text-align: center; font-size: 10pt; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">TRUNG TÂM TIẾNG TRUNG CICI CHINESE</div>
        <div class="sub-brand">Hệ Sinh Thái Học Tiếng Trung HSK 3.0 & Giao Tiếp Thực Chiến</div>
        <div class="title">ĐỀ THI MÔ PHỎNG CHUẨN HSK ${level} - NĂM HỌC 2026</div>
        <div><em>Thời gian làm bài: 45 phút | Tổng số câu: ${questions.length} câu | Điểm tối đa: 300 điểm</em></div>
      </div>

      <div class="info-box">
        <strong>Họ và tên thí sinh:</strong> ............................................................................
        <strong>Số báo danh:</strong> ....................................<br/>
        <strong>Ngày thi:</strong> .......................................................................................
        <strong>Phòng thi:</strong> ....................................
      </div>

      <div class="section-title">PHẦN 1: KỸ NĂNG NGHE HIỂU (听力) - ${listeningQuestions.length} Câu</div>
      ${listeningQuestions
        .map(
          (q, idx) => `
        <div class="question-item">
          <div class="q-prompt">Câu ${idx + 1}: ${q.prompt}</div>
          ${q.audioPrompt ? `<div style="color: #666; font-style: italic;">[Audio đọc: ${q.audioPrompt}]</div>` : ''}
          ${
            q.options && q.options.length > 0
              ? `<ol class="options">
                  ${q.options.map((opt) => `<li>${opt}</li>`).join('')}
                </ol>`
              : '<div style="margin-top: 8px; border-bottom: 1px dotted #888; height: 30px;"></div>'
          }
        </div>
      `
        )
        .join('')}

      <div class="section-title">PHẦN 2: KỸ NĂNG ĐỌC HIỂU (阅读) - ${readingQuestions.length} Câu</div>
      ${readingQuestions
        .map(
          (q, idx) => `
        <div class="question-item">
          <div class="q-prompt">Câu ${listeningQuestions.length + idx + 1}: ${q.prompt}</div>
          ${
            q.options && q.options.length > 0
              ? `<ol class="options">
                  ${q.options.map((opt) => `<li>${opt}</li>`).join('')}
                </ol>`
              : '<div style="margin-top: 8px; border-bottom: 1px dotted #888; height: 30px;"></div>'
          }
        </div>
      `
        )
        .join('')}

      <div class="section-title">PHẦN 3: KỸ NĂNG VIẾT (书写) - ${writingQuestions.length} Câu</div>
      ${writingQuestions
        .map(
          (q, idx) => `
        <div class="question-item">
          <div class="q-prompt">Câu ${listeningQuestions.length + readingQuestions.length + idx + 1}: ${q.prompt}</div>
          ${
            q.options && q.options.length > 0
              ? `<ol class="options">
                  ${q.options.map((opt) => `<li>${opt}</li>`).join('')}
                </ol>`
              : '<div style="margin-top: 15px; border-bottom: 1px dotted #888; height: 40px;">Trả lời: ....................................................................................................................................</div>'
          }
        </div>
      `
        )
        .join('')}

      <br style="page-break-before: always;" />

      <div class="header">
        <div class="brand">CICI CHINESE - ĐÁP ÁN & GIẢI THÍCH CHI TIẾT</div>
        <div class="sub-brand">Bộ đề thi thử chuẩn hóa HSK ${level}</div>
      </div>

      <table class="answer-key-table">
        <thead>
          <tr>
            <th style="width: 10%;">Câu</th>
            <th style="width: 15%;">Phần thi</th>
            <th style="width: 20%;">Đáp án chuẩn</th>
            <th>Giải thích chi tiết</th>
          </tr>
        </thead>
        <tbody>
          ${questions
            .map(
              (q, idx) => `
            <tr>
              <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
              <td style="text-transform: capitalize;">${q.section}</td>
              <td style="font-weight: bold; color: #059669;">
                ${
                  typeof q.correctAnswer === 'number' && q.options
                    ? `${String.fromCharCode(65 + q.correctAnswer)}. ${q.options[q.correctAnswer]}`
                    : q.correctAnswer
                }
              </td>
              <td>${q.explanation}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="footer">
        <strong>CiCi Chinese - Cùng bạn kiến tạo tương lai tiếng Trung bền vững.</strong><br/>
        Hotline tư vấn: 0987.654.321 • Website: HỌC TIẾNG TRUNG CÙNG CICI CHINESE
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `De_Thi_Thu_HSK_${level}_CiCi_Chinese.doc`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

/**
 * Exports a curriculum Lesson into a stylish HTML Slide Deck presentation (.html)
 * that opens immediately in full-screen presentation mode on any browser or projector.
 */
export function exportLessonToPresentation(lesson: Lesson): void {
  const content = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Bài Giảng: ${lesson.title} (${lesson.pinyin}) - CiCi Chinese</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #020617; color: #f8fafc; overflow-x: hidden; }
    .slide { min-height: 100vh; padding: 60px 80px; display: flex; flex-direction: column; justify-content: center; position: relative; border-bottom: 2px solid #1e293b; }
    .slide-badge { display: inline-block; padding: 6px 14px; background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 9999px; font-weight: 700; font-size: 14px; margin-bottom: 16px; }
    .slide-title { font-size: 48px; font-weight: 800; color: #fff; margin-bottom: 12px; }
    .slide-hanzi { font-size: 72px; font-weight: 900; color: #fbbf24; margin-bottom: 10px; }
    .slide-pinyin { font-size: 28px; color: #34d399; font-family: monospace; margin-bottom: 16px; }
    .slide-meaning { font-size: 24px; color: #cbd5e1; }
    .vocab-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 30px; }
    .vocab-card { background: #0f172a; border: 1px solid #1e293b; padding: 20px; border-radius: 16px; }
    .grammar-box { background: #0f172a; border-left: 4px solid #10b981; padding: 24px; border-radius: 0 16px 16px 0; margin-top: 20px; }
    .dialogue-bubble { background: #1e293b; padding: 18px 24px; border-radius: 20px; margin-bottom: 16px; max-width: 800px; }
    .footer-note { position: absolute; bottom: 20px; left: 80px; right: 80px; display: flex; justify-content: space-between; font-size: 13px; color: #64748b; }
    .print-btn { position: fixed; top: 20px; right: 20px; z-index: 100; padding: 10px 20px; background: #059669; color: #fff; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; }
    @media print { .print-btn { display: none; } .slide { page-break-after: always; height: 100vh; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">In hoặc Lưu PDF (Ctrl+P)</button>

  <!-- Slide 1: Cover -->
  <div class="slide">
    <div class="slide-badge">HSK ${lesson.hskLevel} • BÀI ${lesson.id}</div>
    <div class="slide-hanzi">${lesson.title}</div>
    <div class="slide-pinyin">${lesson.pinyin}</div>
    <div class="slide-meaning">"${lesson.meaning}"</div>
    <p style="color: #94a3b8; font-size: 18px; margin-top: 24px; max-width: 700px;">
      ${lesson.description}
    </p>
    <div class="footer-note">
      <span>HỌC TIẾNG TRUNG CÙNG CICI CHINESE</span>
      <span>Slide 1 / 4</span>
    </div>
  </div>

  <!-- Slide 2: Vocabulary -->
  <div class="slide">
    <div class="slide-badge">TỪ VỰNG TRỌNG ĐIỂM (生词)</div>
    <h2 class="slide-title">Từ Vựng Cốt Lõi HSK ${lesson.hskLevel}</h2>
    <div class="vocab-grid">
      ${lesson.vocabList
        .map(
          (v) => `
        <div class="vocab-card">
          <div style="font-size: 36px; font-weight: bold; color: #fbbf24;">${v.hanzi}</div>
          <div style="color: #34d399; font-family: monospace; font-size: 18px;">${v.pinyin} (Âm Hán Việt: ${v.sinoVietnamese})</div>
          <div style="color: #e2e8f0; font-weight: 600; margin: 6px 0;">${v.meaning}</div>
          <div style="color: #94a3b8; font-size: 14px; margin-top: 8px; border-top: 1px solid #334155; padding-top: 6px;">
            VD: ${v.example} (${v.examplePinyin}) - <em>${v.exampleMeaning}</em>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
    <div class="footer-note">
      <span>CiCi Chinese - Chuẩn HSK 3.0</span>
      <span>Slide 2 / 4</span>
    </div>
  </div>

  <!-- Slide 3: Grammar -->
  <div class="slide">
    <div class="slide-badge">NGỮ PHÁP (语法)</div>
    <h2 class="slide-title">Cấu Trúc Ngữ Pháp Bài ${lesson.id}</h2>
    ${lesson.grammarPoints
      .map(
        (g) => `
      <div class="grammar-box">
        <h3 style="font-size: 22px; color: #fff; margin-bottom: 8px;">${g.title}</h3>
        <div style="display: inline-block; background: #047857; color: #fff; padding: 4px 12px; border-radius: 6px; font-family: monospace; font-size: 16px; margin-bottom: 12px;">
          Công thức: ${g.formula}
        </div>
        <p style="color: #cbd5e1; font-size: 16px; margin-bottom: 12px;">${g.explanation}</p>
        <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px;">
          ${g.examples
            .map(
              (ex) => `
            <div style="margin-bottom: 6px;">
              <span style="color: #fbbf24; font-weight: bold;">${ex.hanzi}</span>
              <span style="color: #34d399; font-family: monospace;">(${ex.pinyin})</span>:
              <span style="color: #e2e8f0;">${ex.vietnamese}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
      )
      .join('')}
    <div class="footer-note">
      <span>CiCi Chinese - Chuẩn HSK 3.0</span>
      <span>Slide 3 / 4</span>
    </div>
  </div>

  <!-- Slide 4: Real-life VR Dialogue -->
  <div class="slide">
    <div class="slide-badge">HỘI THOẠI THỰC TẾ (课文与情景)</div>
    <h2 class="slide-title">${lesson.vrScene.name}</h2>
    <p style="color: #cbd5e1; margin-bottom: 24px; font-size: 16px;">
      <em>Bối cảnh văn hóa: ${lesson.vrScene.culturalContext}</em>
    </p>
    <div>
      ${lesson.vrScene.dialogue
        .map(
          (d) => `
        <div class="dialogue-bubble">
          <strong style="color: #34d399; font-size: 16px;">${d.speaker}:</strong>
          <div style="font-size: 22px; color: #fbbf24; margin: 4px 0;">${d.hanzi}</div>
          <div style="color: #94a3b8; font-family: monospace; font-size: 15px;">${d.pinyin}</div>
          <div style="color: #cbd5e1; font-size: 15px; margin-top: 4px;">➔ ${d.vi}</div>
        </div>
      `
        )
        .join('')}
    </div>
    <div class="footer-note">
      <span>CiCi Chinese - Cùng bạn kiến tạo tương lai tiếng Trung bền vững.</span>
      <span>Slide 4 / 4</span>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `Slide_Bai_Giang_HSK${lesson.hskLevel}_Bai${lesson.id}_CiCi_Chinese.html`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

/**
 * Exports current student registrations into a CSV file.
 */
export function exportRegistrationsToCsv(registrations: ClassRegistration[]): void {
  const headers = ['Mã Đăng Ký', 'Mã Lớp', 'Tên Lớp Học', 'Họ Và Tên', 'Số Điện Thoại', 'Zalo', 'Ghi Chú', 'Thời Gian Đăng Ký', 'Trạng Thái'];
  const rows = registrations.map((r) => [
    r.id,
    r.classId,
    `"${r.className.replace(/"/g, '""')}"`,
    `"${r.fullName.replace(/"/g, '""')}"`,
    r.phoneNumber,
    r.zaloPhone || '',
    `"${(r.notes || '').replace(/"/g, '""')}"`,
    r.registeredAt,
    r.status,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Danh_Sach_Dang_Ky_Lop_CiCi_Chinese_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Returns Google Apps Script ready code to set up a 2-way Webhook on Google Sheets.
 */
export function getGoogleAppsScriptTemplateCode(): string {
  return `/**
 * GOOGLE APPS SCRIPT: TỰ ĐỘNG GHI DANH HỌC VIÊN TỪ WEB CICI CHINESE VÀO GOOGLE SHEET
 * 
 * Hướng dẫn 3 bước:
 * 1. Mở Google Sheet danh sách lớp học của bạn.
 * 2. Vào menu: Tiện ích mở rộng (Extensions) > Apps Script.
 * 3. Dán toàn bộ mã nguồn bên dưới vào và nhấn nút "Triển khai" (Deploy) > "Triển khai mới" (New deployment).
 *    - Chọn loại: Ứng dụng web (Web App).
 *    - Người có quyền truy cập: "Bất kỳ ai" (Anyone).
 * 4. Copy URL ứng dụng web nhận được và dán vào phần "Cài đặt Webhook" trên website CiCi Chinese!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DangKyHocVien");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("DangKyHocVien");
      sheet.appendRow(["Mã ĐK", "Mã Lớp", "Tên Lớp Học", "Họ Tên", "Số ĐT", "Zalo", "Ghi Chú", "Thời Gian ĐK"]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#059669").setFontColor("#ffffff");
    }

    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.id || "REG-" + new Date().getTime(),
      data.classId || "",
      data.className || "",
      data.fullName || "",
      data.phoneNumber || "",
      data.zaloPhone || "",
      data.notes || "",
      new Date().toLocaleString("vi-VN")
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đã ghi nhận đăng ký thành công vào Google Sheet!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;
}

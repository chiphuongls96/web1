# HỌC TIẾNG TRUNG CÙNG CICI CHINESE

Hệ sinh thái học tiếng Trung chuyên sâu chuẩn HSK 3.0 & Giao tiếp thực chiến cùng gia sư bản ngữ ảo **CiCi AI**, tích hợp **kết nối cơ sở dữ liệu trực tuyến danh sách lớp học từ Google Sheets**.

---

## 🌟 Tính Năng Nổi Bật

1. **Cơ Sở Dữ Liệu Lớp Học Trực Tuyến Từ Google Sheets (Live Sync)**:
   - Đồng bộ thời gian thực danh sách khóa học, lịch khai giảng, giảng viên, học phí ưu đãi và số chỗ còn lại trực tiếp từ Google Sheets.
   - Hỗ trợ xem dạng Thẻ trực quan (Cards) và dạng Bảng tính (Spreadsheet Table).
   - Cho phép tùy chỉnh URL Google Sheet riêng của bạn, tự động tải file CSV mẫu hoặc khôi phục dữ liệu mẫu của trung tâm CiCi Chinese.
   - Học viên có thể gửi đăng ký tư vấn trực tiếp trên ứng dụng.

2. **Lộ Trình Chuẩn Hóa HSK 3.0 (15 - 15 - 18 Bài)**:
   - Toàn diện 3 cấp độ: HSK 1 (15 bài), HSK 2 (15 bài), HSK 3 (18 bài).
   - Tích hợp kịch bản mô phỏng giao tiếp thực tế và từ vựng, ngữ pháp cốt lõi.

3. **Spaced Repetition System (SRS Trí Nhớ Dài Hạn)**:
   - Thuật toán lặp lại ngắt quãng SM-2 tối ưu hóa "thời điểm vàng" để ôn tập từ vựng.

4. **Luyện Phát Âm & Khẩu Hình AI**:
   - Nhận diện giọng nói tiếng Trung thực tế và phân tích độ rơi 4 thanh điệu cùng khẩu hình môi/lưỡi.

5. **Luyện Viết Chữ Hán Điền Tự Cách (田字格)**:
   - Nhận diện nét vẽ, giám sát quy tắc bút thuận ("ngang trước sổ sau, trên trước dưới sau").

6. **Phòng Thi Thử HSK Mô Phỏng Áp Lực Thực Tế**:
   - Đếm ngược thời gian thực, đánh giá 3 kỹ năng Nghe - Đọc - Viết và dự báo xác suất đỗ kỳ thi.

7. **Quản Lý API Key & Multi-Model Fallback (Gemini AI)**:
   - Cho phép người dùng tự nhập Google Gemini API Key và lưu an toàn trong `localStorage`.
   - Danh sách model: `gemini-3-flash-preview` (Mặc định), `gemini-3-pro-preview`, `gemini-2.5-flash`.
   - Cơ chế tự động thử lại (Retry) với model dự phòng khi gặp lỗi quota hoặc sự cố mạng.

---

## 🚀 Hướng Dẫn Kết Nối Google Sheets Riêng

1. Tạo một trang tính trên [Google Sheets](https://sheets.google.com).
2. Tạo các cột ở hàng đầu tiên (hàng tiêu đề) theo mẫu:
   ```text
   Mã lớp, Tên lớp học, Cấp độ, Giảng viên, Lịch học, Hình thức, Khai giảng, Thời lượng, Sĩ số, Đã đăng ký, Số chỗ còn, Học phí, Giá gốc, Trạng thái, Link đăng ký, Mô tả khóa học, Tags ưu đãi
   ```
3. Nhấp nút **Chia sẻ (Share)** ở góc phải phía trên Google Sheets:
   - Tại mục *Quyền truy cập chung*, chọn: **"Bất kỳ ai có đường liên kết đều có thể xem"** (Anyone with the link can view).
4. Sao chép liên kết đó, mở mục **"Lớp Học Trực Tuyến"** trên app ➔ bấm nút **"Cài đặt Sheet"** ➔ Dán link và bấm **"Lưu & Đồng Bộ Ngay"**.

---

## 💻 Chạy Ứng Dụng Trên Máy Cục Bộ (Local)

**Yêu cầu:** Node.js (phiên bản 18 trở lên).

1. Cài đặt thư viện:
   ```bash
   npm install
   ```

2. (Tùy chọn) Cấu hình API Key trên server trong file `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```
   *Lưu ý: Người dùng cũng có thể nhập API Key trực tiếp trên giao diện web qua nút màu đỏ "Lấy API key để sử dụng app" trên Header.*

3. Khởi chạy ứng dụng:
   ```bash
   npm run dev
   ```
   Mở trình duyệt tại: `http://localhost:3000`

---

## ☁️ Triển Khai Lên Vercel (Deployment)

Ứng dụng đã được cấu hình sẵn file `vercel.json` để hỗ trợ SPA routing trên Vercel:

```bash
# Build dự án
npm run build
```

Trên Vercel:
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

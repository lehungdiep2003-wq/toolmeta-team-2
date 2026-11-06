# Thu data khách về Google Sheet (Google Apps Script)

Form liên hệ của landing sẽ POST dữ liệu sang một **Google Apps Script Web App**;
script ghi mỗi lần gửi thành 1 dòng trong Google Sheet và trả về `requestId`.

## Các bước cài đặt (làm 1 lần, ~5 phút)

1. **Tạo Google Sheet mới**: vào https://sheets.new — đặt tên ví dụ `Toolmeta Leads`.
2. Trong Sheet, mở menu **Extensions → Apps Script**.
3. Xóa code mẫu, **dán toàn bộ nội dung file [`Code.gs`](./Code.gs)** vào.
4. Bấm **Save** (biểu tượng đĩa).
5. Bấm **Deploy → New deployment**.
   - Bấm bánh răng ⚙ bên cạnh "Select type" → chọn **Web app**.
   - **Description**: `toolmeta contact`
   - **Execute as**: **Me** (chính bạn).
   - **Who has access**: **Anyone** ← bắt buộc, để landing public gọi được.
   - Bấm **Deploy**.
6. Lần đầu sẽ hiện **Authorize access** → chọn tài khoản Google → có thể gặp màn
   "Google hasn't verified this app" → bấm **Advanced → Go to ... (unsafe)** →
   **Allow**. (An toàn vì đây là script của chính bạn.)
7. Copy **Web app URL** (dạng `https://script.google.com/macros/s/AKfy.../exec`).

Dán URL đó lại cho mình — mình sẽ gắn vào form, commit và push.

## Kiểm tra nhanh

- Mở Web app URL bằng trình duyệt: phải thấy `{"ok":true,"service":"toolmeta-contact"}`.
- Sau khi gắn vào form và gửi thử, một dòng mới xuất hiện trong tab **Leads** của Sheet.

## Cột được ghi vào Sheet

`Request ID | Thời gian (Asia/Saigon) | Họ và tên | Telegram | Loại yêu cầu | Nội dung | Đồng ý | Nguồn | Trạng thái`

## Cập nhật code về sau

Nếu sửa `Code.gs`, dán lại vào Apps Script rồi **Deploy → Manage deployments →
(bút chì Edit) → Version: New version → Deploy**. URL giữ nguyên, không phải đổi lại trong form.

## Ghi chú

- URL web app là endpoint công khai (ai biết URL đều POST được). Với form thu lead
  thì chấp nhận được; nếu bị spam nhiều có thể thêm honeypot hoặc Cloudflare Turnstile sau.
- Script validate lại độ dài, enum loại yêu cầu, chuẩn hóa Telegram và yêu cầu `privacyAccepted=true`
  trước khi ghi, nên dòng rác/bot sai định dạng sẽ bị loại.

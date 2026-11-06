# Toolmeta Contact API — bàn giao frontend/backend

## Phạm vi hiện tại

Trang `/contact` đã có UI, validation phía client và API client riêng, chỉ dùng Telegram để liên hệ khách hàng. Không có backend, database hoặc Lark integration trong project này. Dữ liệu form chỉ nằm trong bộ nhớ React, không ghi vào localStorage/sessionStorage và không gửi tới analytics.

Frontend: `src/pages/ContactPage.tsx`, `src/components/contact/contactData.ts`, `src/components/contact/contactApi.ts`.

## Cấu hình kết nối

Endpoint đề xuất: `POST /api/contact`.

Chỉ đặt biến môi trường sau khi backend thực sự sẵn sàng:

```dotenv
VITE_CONTACT_API_URL=/api/contact
```

Vite cần restart khi đổi biến môi trường; deployment cần build lại. Mặc định biến này trống, frontend không gửi request và hiển thị kênh tiếp nhận chưa khả dụng. API client chấp nhận đường dẫn cùng origin bắt đầu bằng `/` hoặc URL HTTPS; ưu tiên cùng origin. Không đưa App ID, App Secret, Lark token hoặc bất kỳ thông tin xác thực nào vào biến `VITE_*`.

Không sử dụng HTML fallback của hosting làm API. Endpoint phải trả JSON. CORS/HTTPS và cấu hình reverse proxy do đội backend/deployment thực hiện.

## Request contract

`ContactRequest` trong `contactData.ts` là interface gửi đi. Tất cả trường bên dưới đều bắt buộc; hiện không có trường tùy chọn.

| Trường | Kiểu | Validation / chuẩn hóa |
| --- | --- | --- |
| fullName | string | Trim hai đầu, 2–100 Unicode code points. Không giới hạn chỉ tên Latin. |
| telegramUsername | string | Username Telegram đã chuẩn hóa về `@username`; quy tắc bên dưới. |
| requestType | enum | `installation`, `usage`, `account`, `technical`, `consultation`, `other`. |
| message | string | Trim hai đầu, 10–3000 Unicode code points; cho phép xuống dòng. |
| privacyAccepted | boolean | Phải đúng `true`; không chấp nhận chuỗi `"true"`. |

Loại yêu cầu hiển thị tương ứng: Hỗ trợ cài đặt; Hỗ trợ sử dụng; Vấn đề tài khoản; Lỗi kỹ thuật; Hợp tác / Tư vấn; Khác.

Quy tắc liên hệ:

- Chỉ sử dụng Telegram; không yêu cầu số điện thoại.
- Chấp nhận `@username`, `username` và `https://t.me/username` (có thể có dấu `/` cuối link).
- Username gồm 5–32 ký tự, bắt đầu bằng chữ cái Latin; tiếp theo là chữ cái Latin, số hoặc `_`.
- Chuẩn hóa về `@username` viết thường, bỏ khoảng trắng hai đầu. Không xác minh tài khoản có tồn tại hay thuộc sở hữu người gửi.
- Link phải là HTTPS với hostname chính xác `t.me` và chỉ một đoạn username; không nhận domain giả mạo, credentials, port, query, fragment, đường dẫn bài viết hoặc invite link. Các đường dẫn hành động như `share`, `joinchat`, `addstickers`, `proxy`, `login` bị từ chối.
- Dữ liệu gửi API chỉ có 5 trường của `ContactRequest`; không gửi các trường kênh/giá trị liên hệ cũ. Backend tự gán source `toolmeta-landing`, Request ID, Created timestamp và Status `Mới`.

Payload minh họa bằng dữ liệu giả:

```json
{
  "fullName": "Nguyễn Văn A",
  "telegramUsername": "@customer_example",
  "requestType": "installation",
  "message": "Tôi cần hỗ trợ cài Chrome Extension cho Toolmeta.",
  "privacyAccepted": true
}
```

Headers: `Content-Type: application/json`, `Accept: application/json`, `Accept-Language: vi|en|ru|th|zh`. Backend nên trả thông báo fieldErrors theo Accept-Language; enum và payload giữ nguyên stable keys. Client dùng credentials cùng origin, không tự gắn token; không theo redirect để tránh nhầm trang đăng nhập với xác nhận tiếp nhận.

## Response contract đề xuất

Chỉ trả success sau khi yêu cầu đã được lưu bền vững hoặc đã vào hàng đợi bền vững mà backend chịu trách nhiệm xử lý. Không trả success chỉ vì nhận được HTTP request.

HTTP `201 Created` (có thể `200`/`202` nếu bảo đảm tiếp nhận bền vững):

```json
{
  "success": true,
  "requestId": "TM-CONTACT-EXAMPLE"
}
```

Frontend chỉ hiển thị thành công nếu HTTP là 2xx, Content-Type chứa `application/json`, `success` đúng boolean `true` và `requestId` là chuỗi không trống, tối đa 128 ký tự. 2xx kèm HTML, thiếu mã hoặc `success: false` đều không được coi là thành công.

HTTP `422 Unprocessable Entity`:

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "fieldErrors": {
    "telegramUsername": "Thông tin liên hệ không hợp lệ."
  }
}
```

`fieldErrors` chỉ dùng các tên trường form: fullName, telegramUsername, requestType, message, privacyAccepted. Thông báo phải phù hợp cho khách hàng, không chứa stack trace hoặc thông tin nhà cung cấp. Frontend nhận diện thông báo có trong catalog và hiển thị theo locale hiện tại; thông báo lạ dùng lời nhắc kiểm tra field đã bản địa hóa. Không render HTML. Khi mở rộng loại lỗi, hãy thống nhất error code và bổ sung bản dịch vào catalog thay vì phụ thuộc hoàn toàn vào câu văn từ backend.

Các mã lỗi đề xuất khác: `400` malformed JSON, `413` payload quá lớn, `429` rate limited, `500`/`503` chưa thể tiếp nhận. Có thể trả `code` và `message` an toàn. Client hiện dùng thông báo tổng quát, xử lý riêng 429; không phụ thuộc vào thông báo nội bộ backend. Backend có thể cung cấp `Retry-After` cho 429; client hiện chưa tự động đếm ngược.

## Trạng thái UI và chống gửi trùng

1. Validate trước khi gọi API; lỗi ở ngay dưới field và focus field lỗi đầu tiên.
2. Dùng ref khóa submit ngay lập tức (không chờ React render), đồng thời disable fieldset/nút gửi và hiển thị loading.
3. Hủy request khi rời trang; timeout client 20 giây. Không tự động retry.
4. Khi lỗi/timeout/chưa cấu hình, giữ nguyên form trong bộ nhớ. Timeout/lỗi mạng có thể xảy ra sau khi backend đã lưu: frontend không tuyên bố chắc chắn request thất bại, đề nghị kiểm tra trước khi gửi lại.
5. Success chỉ theo response contract; hiển thị requestId và cho phép người dùng chủ động tạo yêu cầu khác. Không tự động xóa dữ liệu khi lỗi.

Backend cần chống trùng độc lập: quyết định cơ chế idempotency/deduplication (ví dụ key cho một lần gửi logic hoặc fingerprint trong cửa sổ thời gian ngắn). Client hiện **chưa gửi Idempotency-Key**; nếu backend yêu cầu, thống nhất và bổ sung contract trước khi bật endpoint. Không dùng rate limiting làm thay thế duy nhất cho idempotency.

## Bảo mật và chống spam — trách nhiệm backend

- Validate lại mọi trường, enum, độ dài Unicode, consent và source; không tin client validation.
- Giới hạn request body (ví dụ 32 KiB), chỉ nhận JSON; chỉ lưu các trường được cho phép.
- HTTPS; CORS allowlist đúng origin, kiểm tra Origin phù hợp. Nếu dùng cookie/session, triển khai CSRF protection và thống nhất contract với frontend trước khi kích hoạt.
- Rate limit ở gateway/backend, bảo vệ chống spam và duplicate submissions; nếu cần CAPTCHA/challenge, tích hợp contract riêng, frontend hiện không có CAPTCHA.
- Render nội dung liên hệ như plain text trong mọi giao diện; xử lý injection theo hệ thống đích. Không tự fetch URL người dùng nhập.
- Không ghi PII vào console, URL, analytics hoặc error monitoring không được phép; redaction log, phân quyền truy cập, audit log và retention theo chính sách chính thức.
- Không yêu cầu khách gửi mật khẩu/cookie/access token/thông tin thanh toán. Không dùng consent hỗ trợ làm consent marketing/newsletter.
- Lark credentials chỉ ở backend/secret manager. Least privilege; không trả credential/stack trace/error chi tiết của Lark về browser.

## Các trường lưu vào Lark Base

Đội backend tự thống nhất Base/Table/Field IDs và mapping; project frontend không có Lark SDK/API.

| Trường lưu | Nguồn / ghi chú |
| --- | --- |
| Request ID | Backend sinh duy nhất; trả về frontend sau khi tiếp nhận. |
| Full name | fullName đã được kiểm tra. |
| Telegram Username | telegramUsername chuẩn hóa dạng @username. |
| Request type | Enum hoặc mapping nhãn đã thống nhất. |
| Message | Plain text; giữ xuống dòng. |
| Consent accepted | privacyAccepted = true. |
| Consent timestamp | Backend ghi thời gian tiếp nhận consent; không tin đồng hồ client. |
| Source | Backend gán `toolmeta-landing`. |
| Created timestamp | Backend sinh UTC ISO-8601; có thể hiển thị Asia/Saigon ở giao diện quản trị. |
| Status | Backend gán ban đầu `Mới`. |

Request ID, Created timestamp và Status không phải trường khách hàng tự nhập. Đồng ý cung cấp thông tin để xử lý yêu cầu không đồng nghĩa với đăng ký nhận marketing.

## Nghiệm thu khi backend sẵn sàng

Kiểm tra staging với endpoint thật: ba định dạng nhập Telegram, tất cả loại yêu cầu, Unicode/độ dài, 422/429/5xx, timeout, double-click, hủy khi điều hướng, idempotency và bản ghi Lark thực tế. Chỉ sau khi xác nhận backend đã tiếp nhận bền vững mới bật `VITE_CONTACT_API_URL` trên production. Kiểm tra UI thực tế ở desktop/tablet/mobile và keyboard trước khi phát hành.

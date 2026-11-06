/**
 * Toolmeta — Thu data khách từ form liên hệ về Google Sheet.
 *
 * Nhận POST (JSON trong body) từ landing, ghi 1 dòng vào sheet "Leads",
 * và trả JSON { success: true, requestId } đúng response contract của frontend.
 *
 * Cách dùng: xem apps-script/README.md.
 */

var SHEET_NAME = "Leads";

var REQUEST_TYPE_LABELS = {
  installation: "Hỗ trợ cài đặt",
  usage: "Hỗ trợ sử dụng",
  account: "Vấn đề tài khoản",
  technical: "Lỗi kỹ thuật",
  consultation: "Hợp tác / Tư vấn",
  other: "Khác",
};

var HEADERS = [
  "Request ID",
  "Thời gian (Asia/Saigon)",
  "Họ và tên",
  "Telegram",
  "Loại yêu cầu",
  "Nội dung",
  "Đồng ý",
  "Nguồn",
  "Trạng thái",
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // tránh ghi trùng dòng khi nhiều request cùng lúc

    var data = {};
    try {
      data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    } catch (parseErr) {
      return jsonOut({ success: false, code: "BAD_JSON" });
    }

    var fullName = String(data.fullName == null ? "" : data.fullName).trim();
    var telegram = normalizeTelegram(
      String(data.telegramUsername == null ? "" : data.telegramUsername)
    );
    var requestType = String(data.requestType == null ? "" : data.requestType);
    var message = String(data.message == null ? "" : data.message).trim();
    var consent = data.privacyAccepted === true;

    // Validate lại phía server (không tin client).
    var nameLen = Array.from(fullName).length;
    var msgLen = Array.from(message).length;
    if (
      nameLen < 2 ||
      nameLen > 100 ||
      !telegram ||
      !REQUEST_TYPE_LABELS[requestType] ||
      msgLen < 10 ||
      msgLen > 3000 ||
      !consent
    ) {
      return jsonOut({ success: false, code: "VALIDATION_ERROR" });
    }

    var sheet = getSheet();
    var now = new Date();
    var requestId =
      "TM-" +
      Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "yyyyMMdd-HHmmss") +
      "-" +
      Math.random().toString(36).slice(2, 6).toUpperCase();
    var created = Utilities.formatDate(
      now,
      "Asia/Ho_Chi_Minh",
      "yyyy-MM-dd HH:mm:ss"
    );

    sheet.appendRow([
      requestId,
      created,
      fullName,
      telegram,
      REQUEST_TYPE_LABELS[requestType],
      message,
      consent ? "Có" : "",
      "toolmeta-landing",
      "Mới",
    ]);

    return jsonOut({ success: true, requestId: requestId });
  } catch (err) {
    return jsonOut({ success: false, code: "SERVER_ERROR" });
  } finally {
    try {
      lock.releaseLock();
    } catch (ignore) {}
  }
}

/** Kiểm tra nhanh endpoint còn sống (mở URL bằng trình duyệt sẽ thấy JSON này). */
function doGet() {
  return jsonOut({ ok: true, service: "toolmeta-contact" });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

/** Chuẩn hóa Telegram giống frontend: trả "@username" viết thường hoặc "" nếu sai. */
function normalizeTelegram(value) {
  var text = value.trim();
  var m =
    text.match(/^@?([a-z][a-z0-9_]{4,31})$/i) ||
    text.match(/^https:\/\/t\.me\/([a-z][a-z0-9_]{4,31})\/?$/i);
  if (!m) return "";
  var u = m[1].toLowerCase();
  var blocked = [
    "joinchat",
    "share",
    "addstickers",
    "addemoji",
    "addtheme",
    "setlanguage",
    "proxy",
    "socks",
    "login",
    "confirmphone",
    "boost",
    "giftcode",
    "contact",
  ];
  if (blocked.indexOf(u) !== -1) return "";
  return "@" + u;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

export const requestTypes = [
  { value: "installation", label: "Hỗ trợ cài đặt" },
  { value: "usage", label: "Hỗ trợ sử dụng" },
  { value: "account", label: "Vấn đề tài khoản" },
  { value: "technical", label: "Lỗi kỹ thuật" },
  { value: "consultation", label: "Hợp tác / Tư vấn" },
  { value: "other", label: "Khác" },
] as const

export type RequestType = typeof requestTypes[number]["value"]

export interface ContactRequest {
  fullName: string
  telegramUsername: string
  requestType: RequestType
  message: string
  privacyAccepted: boolean
}

export interface ContactFormValues {
  fullName: string
  telegramUsername: string
  requestType: RequestType | ""
  message: string
  privacyAccepted: boolean
}
export type ContactErrors = Partial<Record<keyof ContactFormValues, string>>

export const emptyContactForm: ContactFormValues = {
  fullName: "",
  telegramUsername: "",
  requestType: "",
  message: "",
  privacyAccepted: false,
}

export function normalizeTelegramUsername(value: string): string {
  const text = value.trim()
  const match =
    text.match(/^@?([a-z][a-z0-9_]{4,31})$/i) ??
    text.match(/^https:\/\/t\.me\/([a-z][a-z0-9_]{4,31})\/?$/i)
  if (!match) return ""
  const username = match[1].toLowerCase()
  // These Telegram paths are actions/services, not a customer's profile.
  if (
    [
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
    ].includes(username)
  )
    return ""
  return "@" + username
}

export function validateContact(values: ContactFormValues): ContactErrors {
  const errors: ContactErrors = {}
  const length = (value: string) => Array.from(value.trim()).length
  if (length(values.fullName) < 2 || length(values.fullName) > 100)
    errors.fullName = "Họ và tên cần có từ 2 đến 100 ký tự."
  if (!values.telegramUsername.trim())
    errors.telegramUsername = "Vui lòng nhập Telegram của bạn."
  else if (!normalizeTelegramUsername(values.telegramUsername))
    errors.telegramUsername =
      "Nhập username Telegram 5–32 ký tự, bắt đầu bằng chữ cái Latin, chỉ gồm chữ, số hoặc dấu gạch dưới; hoặc link https://t.me/username."
  if (!requestTypes.some((type) => type.value === values.requestType))
    errors.requestType = "Vui lòng chọn loại yêu cầu."
  if (length(values.message) < 10 || length(values.message) > 3000)
    errors.message = "Nội dung cần có từ 10 đến 3000 ký tự."
  if (values.privacyAccepted !== true)
    errors.privacyAccepted =
      "Bạn cần đồng ý cung cấp thông tin để xử lý yêu cầu."
  return errors
}

export function toContactPayload(values: ContactFormValues): ContactRequest {
  if (Object.keys(validateContact(values)).length)
    throw new Error("Invalid contact form")
  return {
    fullName: values.fullName.trim(),
    telegramUsername: normalizeTelegramUsername(values.telegramUsername),
    requestType: values.requestType as RequestType,
    message: values.message.trim(),
    privacyAccepted: true,
  }
}

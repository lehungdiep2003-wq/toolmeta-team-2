import {
  toContactPayload,
  type ContactErrors,
  type ContactRequest,
} from "./contactData"
import { siteLanguageStore } from "../../i18n/siteLanguage"

export interface ContactReceipt {
  success: true
  requestId: string
}

export class ContactApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly fieldErrors?: ContactErrors,
  ) {
    super(message)
    this.name = "ContactApiError"
  }
}

/**
 * Endpoint dự phòng khi không đặt biến môi trường VITE_CONTACT_API_URL
 * (vd deploy tĩnh không cấu hình env lúc build). Dán URL Google Apps Script
 * Web App vào đây — đây là endpoint công khai, không phải secret.
 */
const CONTACT_ENDPOINT_FALLBACK =
  "https://script.google.com/macros/s/AKfycbx_zZrt5VVoZGLXrqiciHxli1QwuRuAFMuXE_IYeHPuINXRGbQ5jum4aqfLOxjF3k3g/exec"

export function getContactEndpoint(): string {
  return (
    import.meta.env.VITE_CONTACT_API_URL ?? CONTACT_ENDPOINT_FALLBACK
  ).trim()
}

/** Endpoint khác origin hiện tại (vd Google Apps Script) cần chế độ gửi riêng. */
function isCrossOrigin(endpoint: string): boolean {
  if (!/^https?:\/\//i.test(endpoint)) return false
  try {
    return (
      typeof window !== "undefined" &&
      new URL(endpoint).origin !== window.location.origin
    )
  } catch {
    return false
  }
}

interface SubmitOptions {
  signal?: AbortSignal
  endpoint?: string
  fetcher?: typeof fetch
}

/** No endpoint default: a static host's HTML fallback must never imply success. */
export async function submitContact(
  payload: ContactRequest,
  options: SubmitOptions = {},
): Promise<ContactReceipt> {
  const endpoint = (options.endpoint ?? getContactEndpoint()).trim()
  if (!endpoint)
    throw new ContactApiError(
      "Kênh tiếp nhận hiện chưa khả dụng. Yêu cầu của bạn chưa được gửi.",
      "NOT_CONFIGURED",
    )
  if (!/^\/(?!\/)/.test(endpoint) && !/^https:\/\//i.test(endpoint))
    throw new ContactApiError(
      "Kênh tiếp nhận hiện chưa khả dụng. Yêu cầu của bạn chưa được gửi.",
      "INVALID_CONFIG",
    )
  const controller = new AbortController()
  let timedOut = false
  const cancel = () => controller.abort()
  options.signal?.addEventListener("abort", cancel, { once: true })
  if (options.signal?.aborted) controller.abort()
  const timeout = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, 20000)
  const crossOrigin = isCrossOrigin(endpoint)
  try {
    const response = await (options.fetcher ?? fetch)(endpoint, {
      method: "POST",
      headers: {
        // Cross-origin (vd Google Apps Script): text/plain để tránh CORS
        // preflight; backend vẫn đọc được JSON trong body.
        "Content-Type": crossOrigin
          ? "text/plain;charset=UTF-8"
          : "application/json",
        Accept: "application/json",
        "Accept-Language": siteLanguageStore.getSnapshot().code,
      },
      body: JSON.stringify(toContactPayload(payload)),
      signal: controller.signal,
      credentials: crossOrigin ? "omit" : "same-origin",
      // Apps Script trả 302 tới googleusercontent; cross-origin cần follow.
      redirect: crossOrigin ? "follow" : "error",
      cache: "no-store",
    })
    const json = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : null
    if (!response.ok) {
      const fieldErrors: ContactErrors = {}
      for (const field of [
        "fullName",
        "telegramUsername",
        "requestType",
        "message",
        "privacyAccepted",
      ] as const) {
        const value = json?.fieldErrors?.[field]
        if (typeof value === "string" && value.trim())
          fieldErrors[field] = value.slice(0, 200)
      }
      throw new ContactApiError(
        response.status === 429
          ? "Bạn đã gửi nhiều yêu cầu. Vui lòng chờ rồi thử lại."
          : "Chưa thể tiếp nhận yêu cầu. Vui lòng kiểm tra thông tin và thử lại.",
        "REJECTED",
        fieldErrors,
      )
    }
    if (
      json?.success !== true ||
      typeof json.requestId !== "string" ||
      !json.requestId.trim() ||
      json.requestId.length > 128
    )
      throw new ContactApiError(
        "Chưa nhận được xác nhận tiếp nhận hợp lệ. Vui lòng kiểm tra trước khi gửi lại.",
        "INVALID_RESPONSE",
      )
    return { success: true, requestId: json.requestId }
  } catch (error) {
    if (error instanceof ContactApiError) throw error
    throw new ContactApiError(
      timedOut
        ? "Chưa nhận được xác nhận trong thời gian chờ. Vui lòng kiểm tra trước khi gửi lại để tránh yêu cầu trùng."
        : "Không thể xác nhận việc tiếp nhận yêu cầu. Dữ liệu của bạn vẫn được giữ trong biểu mẫu.",
      timedOut ? "TIMEOUT" : "NETWORK",
    )
  } finally {
    clearTimeout(timeout)
    options.signal?.removeEventListener("abort", cancel)
  }
}

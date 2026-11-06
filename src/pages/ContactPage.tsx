import { useEffect, useRef, useState, type FormEvent } from "react"

import { Header } from "../App"

import SiteFooter from "../components/footer/SiteFooter"

import { APP_URL } from "../config/urls"

import { guideHref, sitePath } from "../route"

import {
  emptyContactForm,
  requestTypes,
  toContactPayload,
  validateContact,
  type ContactErrors,
  type ContactFormValues,
} from "../components/contact/contactData"

import {
  ContactApiError,
  getContactEndpoint,
  submitContact,
} from "../components/contact/contactApi"

import "./contactPage.css"
import { uiMessageSource } from "../i18n/translate"

export default function ContactPage() {
  const [values, setValues] = useState<ContactFormValues>({
    ...emptyContactForm,
  })

  const [errors, setErrors] = useState<ContactErrors>({})

  const [status, setStatus] =
    useState<"idle" | "loading" | "error" | "success">("idle")

  const [notice, setNotice] = useState("")

  const [receipt, setReceipt] = useState("")

  const locked = useRef(false)

  const controller = useRef<AbortController | null>(null)

  const form = useRef<HTMLFormElement>(null)

  const result = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previous = document.title

    document.title = "Liên hệ Toolmeta"

    return () => {
      document.title = previous

      controller.current?.abort()
    }
  }, [])

  useEffect(() => {
    if (status === "success") result.current?.focus()
  }, [status])

  function update<K extends keyof ContactFormValues>(
    key: K,

    value: ContactFormValues[K],
  ) {
    setValues((previous) => ({ ...previous, [key]: value }))

    setErrors((previous) => ({
      ...previous,

      [key]: undefined,
    }))
  }

  const checkField = (key: keyof ContactFormValues) =>
    setErrors((previous) => ({
      ...previous,

      [key]: validateContact(values)[key],
    }))

  const error = (key: keyof ContactFormValues) =>
    errors[key] ? (
      <p className="ct-field-error" id={`ct-${key}-error`}>
        {errors[key]}
      </p>
    ) : null

  const attributes = (key: keyof ContactFormValues, help?: string) => ({
    id: `ct-${key}`,

    name: key,

    required: true,

    "aria-invalid": Boolean(errors[key]),

    "aria-describedby":
      [help, errors[key] ? `ct-${key}-error` : ""].filter(Boolean).join(" ") ||
      undefined,

    onBlur: () => checkField(key),
  })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (locked.current) return

    const nextErrors = validateContact(values)

    setErrors(nextErrors)

    const first = Object.keys(nextErrors)[0]

    if (first) {
      const field = form.current?.elements.namedItem(first)

      if (field instanceof HTMLElement) field.focus()

      setStatus("idle")

      return
    }

    locked.current = true

    controller.current = new AbortController()

    setStatus("loading")

    setNotice("")

    try {
      const response = await submitContact(toContactPayload(values), {
        signal: controller.current.signal,
      })

      if (!controller.current.signal.aborted) {
        setReceipt(response.requestId)

        setStatus("success")

        // Meta Pixel: count a successful contact form submission as a Lead.
        ;(window as unknown as { fbq?: (...args: unknown[]) => void }).fbq?.(
          "track",
          "Lead",
          { content_name: "Contact form" },
        )
      }
    } catch (error) {
      if (!controller.current.signal.aborted) {
        setStatus("error")

        setNotice(
          error instanceof ContactApiError
            ? error.message
            : "Chưa thể gửi yêu cầu. Vui lòng thử lại.",
        )

        if (error instanceof ContactApiError && error.fieldErrors)
          setErrors(Object.fromEntries(Object.entries(error.fieldErrors).map(([field, message]) => [field, uiMessageSource(message) ?? "Vui lòng kiểm tra lại thông tin ở trường này."])))
      }
    } finally {
      locked.current = false
    }
  }

  return (
    <div className="contact-page">
      <a className="ct-skip" href="#contact-content">
        Đến biểu mẫu liên hệ
      </a>
      <Header contactPage />
      <main className="container ct-layout" id="contact-content" tabIndex={-1}>
        <div className="ct-intro">
          <a className="ct-back" href={sitePath("/")}>
            ← Trang chủ
          </a>
          <span className="eyebrow">
            <i />
            LIÊN HỆ TOOLMETA
          </span>
          <h1>
            Bạn cần hỗ trợ?
            <br />
            <span>Bắt đầu từ đây.</span>
          </h1>
          <p>
            Chia sẻ yêu cầu của bạn để Toolmeta có thông tin hỗ trợ cài đặt, sử
            dụng và quản lý tài sản quảng cáo.
          </p>
          <section className="ct-help-card" aria-labelledby="ct-guide-title">
            <span className="ct-help-icon" aria-hidden="true">
              ?
            </span>
            <h2 id="ct-guide-title">Mới sử dụng Toolmeta?</h2>
            <p>
              Xem cách cài Chrome Extension, đăng nhập và bắt đầu quản lý AD,
              BM, PAGE.
            </p>
            <a href={guideHref()}>
              Xem hướng dẫn sử dụng <span aria-hidden="true">↗</span>
            </a>
          </section>
          <div className="ct-support-note">
            <h2>Để hỗ trợ rõ ràng hơn</h2>
            <p>
              Hãy mô tả thao tác bạn đang thực hiện và vấn đề gặp phải. Không
              gửi mật khẩu, cookie, access token hoặc thông tin thanh toán.
            </p>
          </div>
          <a className="ct-app-link" href={APP_URL}>
            Bắt đầu miễn phí <span aria-hidden="true">→</span>
          </a>
        </div>

        <section className="ct-form-card" aria-labelledby="ct-form-title">
          {status === "success" ? (
            <div className="ct-result" ref={result} tabIndex={-1} role="status">
              <span className="ct-success-icon" aria-hidden="true">
                ✓
              </span>
              <h2 id="ct-form-title">Yêu cầu đã được tiếp nhận</h2>
              <p>
                Mã yêu cầu: <strong>{receipt}</strong>
              </p>
              <p>Toolmeta đã nhận thông tin liên hệ bạn cung cấp.</p>
              <button
                className="button button-primary ct-submit"
                type="button"
                onClick={() => {
                  setValues({ ...emptyContactForm })

                  setErrors({})

                  setStatus("idle")

                  setReceipt("")
                }}
              >
                Gửi yêu cầu khác
              </button>
            </div>
          ) : (
            <>
              <span className="ct-form-badge">THÔNG TIN YÊU CẦU</span>
              <h2 id="ct-form-title">Liên hệ với Toolmeta</h2>
              <p className="ct-form-description">
                Các trường có dấu <span aria-hidden="true">*</span> là bắt buộc.
              </p>
              {!getContactEndpoint() && (
                <p className="ct-availability" role="status">
                  Kênh tiếp nhận yêu cầu hiện chưa khả dụng. Bạn có thể{" "}
                  <a href={guideHref()}>xem hướng dẫn sử dụng</a> trong lúc chờ.
                </p>
              )}
              <form
                ref={form}
                noValidate
                onSubmit={handleSubmit}
                aria-busy={status === "loading"}
              >
                <fieldset disabled={status === "loading"}>
                  <legend className="ct-sr">
                    Thông tin liên hệ và yêu cầu hỗ trợ
                  </legend>
                  <div className="ct-field">
                    <label htmlFor="ct-fullName">
                      Họ và tên <span aria-hidden="true">*</span>
                    </label>
                    <input
                      {...attributes("fullName")}
                      autoComplete="name"
                      value={values.fullName}
                      onChange={(event) =>
                        update("fullName", event.target.value)
                      }
                      placeholder="Họ và tên của bạn"
                    />
                    {error("fullName")}
                  </div>
                  <div className="ct-field">
                    <label htmlFor="ct-telegramUsername">
                      Telegram của bạn <span aria-hidden="true">*</span>
                    </label>
                    <div className="ct-telegram-input">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M20.7 3.3 3.4 10c-1.2.5-1.2 1.1-.2 1.4l4.4 1.4 1.7 5.2c.2.6.4.8.8.8.4 0 .6-.2.9-.5l2.4-2.3 4.5 3.3c.8.5 1.4.3 1.6-.7l2.8-13.5c.3-1.2-.4-1.8-1.6-1.3ZM9 12.5l8.6-5.4c.4-.3.8-.1.5.2l-7.1 6.4-.3 3.2L9 12.5Z" />
                      </svg>
                      <input
                        {...attributes("telegramUsername", "ct-telegram-help")}
                        type="text"
                        inputMode="text"
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        value={values.telegramUsername}
                        onChange={(event) =>
                          update("telegramUsername", event.target.value)
                        }
                        placeholder="@username hoặc https://t.me/username"
                      />
                    </div>
                    <p className="ct-field-help" id="ct-telegram-help">
                      Đội ngũ Toolmeta sẽ liên hệ với bạn qua Telegram.
                    </p>
                    {error("telegramUsername")}
                  </div>
                  <div className="ct-field">
                    <label htmlFor="ct-requestType">
                      Loại yêu cầu <span aria-hidden="true">*</span>
                    </label>
                    <select
                      {...attributes("requestType")}
                      value={values.requestType}
                      onChange={(event) =>
                        update(
                          "requestType",

                          event.target
                            .value as ContactFormValues["requestType"],
                        )
                      }
                    >
                      <option value="">Chọn loại yêu cầu</option>
                      {requestTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {error("requestType")}
                  </div>
                  <div className="ct-field">
                    <label htmlFor="ct-message">
                      Nội dung yêu cầu <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      {...attributes("message", "ct-message-help")}
                      rows={6}
                      value={values.message}
                      onChange={(event) =>
                        update("message", event.target.value)
                      }
                      placeholder="Mô tả vấn đề và các thao tác bạn đã thực hiện…"
                    />
                    <p className="ct-field-help ct-count" id="ct-message-help">
                      <span>Từ 10 đến 3000 ký tự.</span>
                      <span>
                        {Array.from(values.message.trim()).length} / 3000
                      </span>
                    </p>
                    {error("message")}
                  </div>
                  <div className="ct-consent">
                    <label htmlFor="ct-privacyAccepted">
                      <input
                        {...attributes("privacyAccepted")}
                        type="checkbox"
                        checked={values.privacyAccepted}
                        onChange={(event) =>
                          update("privacyAccepted", event.target.checked)
                        }
                      />
                      <span>
                        Tôi đồng ý cung cấp thông tin trên để Toolmeta liên hệ
                        và xử lý yêu cầu của tôi.{" "}
                        <span aria-hidden="true">*</span>
                      </span>
                    </label>
                    {error("privacyAccepted")}
                  </div>
                  {status === "error" && (
                    <p className="ct-submit-error" role="alert">
                      {notice}
                    </p>
                  )}
                  <button
                    className="button button-primary ct-submit"
                    type="submit"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <>
                        <span className="ct-spinner" aria-hidden="true" />
                        Đang gửi yêu cầu…
                      </>
                    ) : (
                      <>
                        Gửi yêu cầu <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                </fieldset>
              </form>
            </>
          )}
        </section>
      </main>
      <SiteFooter homeLinks />
    </div>
  )
}

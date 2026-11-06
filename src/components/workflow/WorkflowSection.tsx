import { useEffect, useRef } from "react"
import { APP_URL } from "../../config/urls"
import StepIllustration from "./StepIllustration"
import WorkflowIcon, { type WorkflowIconName } from "./WorkflowIcon"
import "./workflow.css"

const steps: ReadonlyArray<{
  title: string
  description: string
  cta: string
  icon: WorkflowIconName
}> = [
  {
    title: "Cài Chrome Extension",
    description:
      "Thêm tiện ích Toolmeta vào trình duyệt Chrome chỉ với 1 click.",
    cta: "Cài đặt ngay",
    icon: "download",
  },
  {
    title: "Đăng nhập tài khoản",
    description: "Truy cập Toolmeta bằng tài khoản của bạn.",
    cta: "Đăng nhập",
    icon: "user",
  },
  {
    title: "Đồng bộ dữ liệu",
    description: "Kết nối và cập nhật các tài sản quảng cáo vào hệ thống.",
    cta: "Đồng bộ ngay",
    icon: "sync",
  },
  {
    title: "Bắt đầu quản lý",
    description: "Truy cập AD, BM và PAGE trong một không gian trực quan.",
    cta: "Vào hệ thống",
    icon: "grid",
  },
]

export default function WorkflowSection() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const section = ref.current
    if (!section) return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    let revealed = false
    let visible = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const reveal = () => {
      if (revealed) return
      revealed = true
      section.dataset.reveal = media.matches ? "done" : "running"
      timer = setTimeout(() => {
        section.dataset.reveal = "done"
      }, 1250)
    }
    const observer =
      typeof IntersectionObserver === "undefined"
        ? undefined
        : new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting
              section.dataset.active = String(visible && !document.hidden)
              if (entry.isIntersecting) reveal()
            },
            { rootMargin: "0px 0px -24px 0px" },
          )
    const onVisibility = () => {
      section.dataset.active = String(visible && !document.hidden)
    }
    observer?.observe(section)
    if (!observer) {
      visible = true
      onVisibility()
      reveal()
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      clearTimeout(timer)
      observer?.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])
  return (
    <section
      className="section hiw-section"
      id="workflow"
      ref={ref}
      aria-labelledby="hiw-heading"
    >
      <div className="container">
        <header className="hiw-heading">
          <span className="eyebrow">
            <i />
            CÁCH HOẠT ĐỘNG
          </span>
          <h2 id="hiw-heading">
            Bắt đầu với <span>4 bước rõ ràng.</span>
          </h2>
          <p>
            Quy trình thiết lập thiết yếu để đưa các tài sản của bạn vào không
            gian quản lý Toolmeta một cách nhanh chóng và dễ dàng.
          </p>
        </header>
        <ol className="hiw-grid">
          {steps.map((step, i) => (
            <li className="hiw-card" key={step.title} data-step={i}>
              <span className="hiw-number" aria-hidden="true">
                0{i + 1}
              </span>
              <StepIllustration step={i} />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <a
                className="hiw-cta"
                href={APP_URL}
                aria-label={`${step.cta} — mở ứng dụng Toolmeta`}
              >
                <WorkflowIcon name={step.icon} />
                <span>{step.cta}</span>
                <WorkflowIcon name="arrow" size={19} />
              </a>
              {i < 3 && (
                <svg
                  className="hiw-connector"
                  viewBox="0 0 36 18"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M1 9h31"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="2 4"
                  />
                  <path
                    d="m26 3 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

import { useEffect, useRef } from "react"
import { APP_URL } from "../../config/urls"
import FinalCtaBackdrop from "./FinalCtaBackdrop"
import FinalCtaVisual from "./FinalCtaVisual"
import "./finalCta.css"

export default function FinalCta() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const section = ref.current
    if (!section) return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    let visible = false,
      revealed = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const activity = () => {
      section.dataset.motion = String(
        visible && !document.hidden && !media.matches,
      )
    }
    const observer =
      typeof IntersectionObserver === "undefined"
        ? undefined
        : new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting
              activity()
              if (visible && !revealed) {
                revealed = true
                section.dataset.reveal = media.matches ? "done" : "running"
                timer = setTimeout(() => {
                  section.dataset.reveal = "done"
                }, 1800)
              }
            },
            { rootMargin: "0px 0px -24px 0px" },
          )
    observer?.observe(section)
    if (!observer) {
      visible = true
      activity()
    }
    document.addEventListener("visibilitychange", activity)
    media.addEventListener("change", activity)
    return () => {
      observer?.disconnect()
      clearTimeout(timer)
      document.removeEventListener("visibilitychange", activity)
      media.removeEventListener("change", activity)
    }
  }, [])
  return (
    <section
      id="final-cta"
      className="fcta-section"
      ref={ref}
      aria-labelledby="fcta-heading"
    >
      <FinalCtaBackdrop />
      <div className="container fcta-content">
        <div className="fcta-copy">
          <span className="eyebrow">
            <i />
            BẮT ĐẦU NGAY HÔM NAY
          </span>
          <h2 id="fcta-heading">
            <span>Bớt thao tác lặp.</span>
            <span>Quản lý gọn hơn</span>
            <span>
              cùng <em>Toolmeta.</em>
            </span>
          </h2>
          <p>
            Không còn chục tab, không còn làm tay từng tài sản.
            <br />
            Cài Chrome Extension, đăng nhập là dùng được ngay.
          </p>
          <a className="fcta-button" href={APP_URL}>
            <span>Bắt đầu miễn phí</span>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M4 12h16m-6-6 6 6-6 6" />
            </svg>
          </a>
        </div>
        <FinalCtaVisual />
      </div>
    </section>
  )
}

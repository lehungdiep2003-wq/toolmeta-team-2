import { useEffect, useId, useRef, useState } from "react"
import FaqIllustration from "./FaqIllustration"
import FaqIcon from "./FaqIcon"
import { faqItems } from "./faqData"
import "./faq.css"

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)
  const id = useId().replace(/:/g, "")
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
                }, 1550)
              }
            },
            { rootMargin: "0px 0px -24px 0px" },
          )
    observer?.observe(section)
    if (!observer) {
      visible = true
      activity()
    }
    media.addEventListener("change", activity)
    document.addEventListener("visibilitychange", activity)
    return () => {
      observer?.disconnect()
      clearTimeout(timer)
      media.removeEventListener("change", activity)
      document.removeEventListener("visibilitychange", activity)
    }
  }, [])
  return (
    <section
      id="faq"
      className="section fq-section"
      ref={ref}
      aria-labelledby="fq-heading"
    >
      <div className="container fq-layout">
        <header className="fq-intro">
          <span className="eyebrow">
            <i />
            CÂU HỎI THƯỜNG GẶP
          </span>
          <h2 id="fq-heading">
            Thông tin cần biết
            <br />
            <span>trước khi bắt đầu.</span>
          </h2>
          <p>
            Các câu trả lời ngắn gọn về phạm vi sản phẩm và quy trình thiết lập,
            giúp bạn khởi đầu nhanh chóng.
          </p>
        </header>
        <div className="fq-accordion">
          {faqItems.map((item, i) => {
            const expanded = open === i,
              triggerId = `fq-${id}-q-${i}`,
              panelId = `fq-${id}-a-${i}`
            return (
              <article
                className="fq-item"
                key={item.question}
                data-open={expanded}
                data-index={i}
              >
                <h3>
                  <button
                    type="button"
                    id={triggerId}
                    className="fq-trigger"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpen((current) => (current === i ? null : i))
                    }
                  >
                    <span className="fq-number" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <span className="fq-question-icon">
                      <FaqIcon name={item.icon} />
                    </span>
                    <span className="fq-question">{item.question}</span>
                    <span className="fq-toggle" aria-hidden="true">
                      <span />
                      <span />
                    </span>
                  </button>
                </h3>
                <div
                  className="fq-panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  aria-hidden={!expanded}
                  inert={!expanded}
                >
                  <div className="fq-panel-inner">
                    <div className="fq-answer-content">
                      {"steps" in item ? (
                        <ol>
                          {item.steps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                      ) : (
                        <p>{item.answer}</p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        <FaqIllustration />
      </div>
    </section>
  )
}

import { useEffect, useRef } from "react"
import { APP_URL } from "../../config/urls"
import PricingDecoration from "./PricingDecoration"
import { pricingData, pricingCapabilities } from "./pricingData"
import "./pricing.css"

function CheckMark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}
export default function PricingSection() {
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
                }, 1600)
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
      id="pricing"
      className="section pr-section"
      ref={ref}
      aria-labelledby="pr-heading"
    >
      <PricingDecoration />
      <div className="container pr-layout">
        <div className="pr-copy">
          <span className="eyebrow">
            <i />
            BẢNG GIÁ
          </span>
          <h2 id="pr-heading">
            {pricingData.heading}
            <br />
            {pricingData.headingSecond} <span>{pricingData.headingAccent}</span>
          </h2>
          <p className="pr-description">{pricingData.description}</p>
          <aside
            className="pr-additional"
            aria-labelledby="pr-additional-heading"
          >
            <h3 id="pr-additional-heading">{pricingData.futureTitle}</h3>
            <p>{pricingData.futureDescription}</p>
          </aside>
        </div>
        <article className="pr-card" aria-labelledby="pr-plan-name">
          <header className="pr-card-head">
            <div className="pr-plan">
              <span>GÓI</span>
              <h3 id="pr-plan-name">{pricingData.planName}</h3>
            </div>
            <div className="pr-price-group">
              <span className="pr-badge">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="m3 6 5 4 4-7 4 7 5-4-2 14H5Z" />
                </svg>
                {pricingData.message}
              </span>
              <p className="pr-price">
                <strong aria-label="0 đồng">{pricingData.price}</strong>
              </p>
            </div>
          </header>
          <p className="pr-card-description">{pricingData.capabilityIntro}</p>
          <ul
            className="pr-features"
            role="list"
            aria-label="Khả năng sản phẩm Toolmeta"
          >
            {pricingCapabilities.map((feature) => (
              <li key={feature}>
                <span className="pr-check">
                  <CheckMark />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <p className="pr-scope-note">{pricingData.entitlementNote}</p>
          <a className="pr-cta" href={APP_URL}>
            <span>{pricingData.cta}</span>
            <svg
              width="23"
              height="23"
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
        </article>
      </div>
    </section>
  )
}

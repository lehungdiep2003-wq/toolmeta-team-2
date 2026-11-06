import { useEffect, useRef } from "react"

import { Header } from "../App"

import SiteFooter from "../components/footer/SiteFooter"

import { APP_URL } from "../config/urls"

import { guideHref, sitePath } from "../route"

import {
  pricingData,
  pricingCapabilities,
  pricingGroups,
} from "../components/pricing/pricingData"

import "./pricingPage.css"

function Arrow() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  )
}

export default function PricingPage() {
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    const oldTitle = document.title

    document.title = pricingData.pageTitle

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) {
                  ;(entry.target as HTMLElement).dataset.revealed = "true"

                  observer?.unobserve(entry.target)
                }
              }
            },

            { threshold: 0.08 },
          )

    main.current

      ?.querySelectorAll(".pp-reveal")

      .forEach((element) => observer?.observe(element))

    return () => {
      observer?.disconnect()

      document.title = oldTitle
    }
  }, [])

  return (
    <div className="pricing-page">
      <a className="pp-skip" href="#pricing-content">
        Đến nội dung bảng giá
      </a>
      <Header pricingPage />
      <main ref={main} id="pricing-content" tabIndex={-1}>
        <section className="pp-hero" aria-labelledby="pp-title">
          <div className="container pp-hero-layout pp-reveal">
            <div className="pp-intro">
              <a className="pp-back" href={sitePath("/")}>
                <span aria-hidden="true">←</span> Trang chủ
              </a>
              <span className="eyebrow">
                <i />
                BẢNG GIÁ TOOLMETA
              </span>
              <h1 id="pp-title">
                {pricingData.heading}
                <br />
                {pricingData.headingSecond}{" "}
                <span>{pricingData.headingAccent}</span>
              </h1>
              <p>{pricingData.description}</p>
              <a className="pp-text-link" href="#pricing-capabilities">
                Tìm hiểu các công cụ <span aria-hidden="true">↓</span>
              </a>
            </div>
            <article className="pp-plan" aria-labelledby="pp-plan-title">
              <div className="pp-plan-label">
                <span>GÓI TOOLMETA</span>
                <span className="pp-badge">{pricingData.message}</span>
              </div>
              <h2 id="pp-plan-title">{pricingData.planName}</h2>
              <p className="pp-price">
                <strong>{pricingData.price}</strong>
              </p>
              <p className="pp-plan-description">
                {pricingData.capabilityIntro}
              </p>
              <ul className="pp-limits">
                {pricingCapabilities.map((feature) => (
                  <li key={feature}>
                    <span className="pp-check" aria-hidden="true">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="pp-plan-scope">{pricingData.entitlementNote}</p>
              <a className="button button-primary pp-cta" href={APP_URL}>
                {pricingData.cta}
                <Arrow />
              </a>
            </article>
          </div>
        </section>

        <section
          className="container pp-capabilities pp-reveal"
          id="pricing-capabilities"
          aria-labelledby="pp-capabilities-title"
        >
          <div className="pp-section-heading pp-capabilities-heading">
            <span className="eyebrow">
              <i />
              KHẢ NĂNG SẢN PHẨM
            </span>
            <h2 id="pp-capabilities-title">Các nhóm công cụ trong Toolmeta.</h2>
            <p>
              Quản lý AD, BM và Page cùng các công cụ hỗ trợ công việc trong một
              Workspace.
            </p>
          </div>
          <div className="pp-entitlement-note" role="note">
            <strong>Phạm vi sử dụng theo gói</strong>
            <p>{pricingData.entitlementNote}</p>
          </div>
          <div className="pp-capability-grid">
            {pricingGroups.map((feature, index) => (
              <article className="pp-capability" key={feature.tag}>
                <div className="pp-capability-top">
                  <span className="pp-feature-tag">{feature.tag}</span>
                  <span className="pp-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <a href={guideHref(feature.guide)}>
                  Xem hướng dẫn <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
          <div className="pp-workspace-start">
            <div>
              <h3>Bắt đầu trong Workspace của bạn</h3>
              <p>{pricingData.gettingStarted}</p>
            </div>
            <a className="pp-text-link" href={guideHref("overview/toolmeta")}>
              Hướng dẫn bắt đầu <Arrow />
            </a>
          </div>
        </section>

        <aside
          className="container pp-future pp-reveal"
          aria-labelledby="pp-future-title"
        >
          <span className="pp-future-icon" aria-hidden="true">
            ↗
          </span>
          <div>
            <h2 id="pp-future-title">{pricingData.futureTitle}</h2>
            <p>{pricingData.futureDescription}</p>
          </div>
        </aside>

        <section
          className="container pp-closing pp-reveal"
          aria-labelledby="pp-closing-title"
        >
          <div>
            <span className="eyebrow">
              <i />
              BẮT ĐẦU CÙNG TOOLMETA
            </span>
            <h2 id="pp-closing-title">
              Quản lý tập trung.
              <br />
              <span>Bắt đầu miễn phí.</span>
            </h2>
            <p>
              {pricingData.planName} · {pricingData.price} ·{" "}
              {pricingData.message}.
            </p>
          </div>
          <div className="pp-closing-actions">
            <a className="button button-primary pp-cta" href={APP_URL}>
              {pricingData.cta}
              <Arrow />
            </a>
            <a href={guideHref()}>
              Xem hướng dẫn sử dụng <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter homeLinks />
    </div>
  )
}

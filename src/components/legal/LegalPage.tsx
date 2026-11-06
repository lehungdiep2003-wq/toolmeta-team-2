/** @jsxImportSource react */

import { useEffect, useState, useSyncExternalStore } from "react"

import { Header } from "../../App"

import SiteFooter from "../footer/SiteFooter"

import useSiteLanguage from "../../i18n/siteLanguage"

import { t } from "../../i18n/translate"

import { navigate, navigationScroll, sitePath, subscribe } from "../../route"

import { legalDocuments, type LegalKind } from "./legal-content"

import "./legal-page.css"

interface LegalIconProps {
  name: "back" | "arrow" | "file" | "shield"

  size?: number
}

function LegalIcon({ name, size = 19 }: LegalIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "back" && <path d="m12 19-7-7 7-7M5 12h14" />}
      {name === "arrow" && <path d="M7 17 17 7M7 7h10v10" />}
      {name === "file" && (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6M8 13h8M8 17h8" />
        </>
      )}
      {name === "shield" && (
        <>
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
          <path d="m9 12 2 2 4-4" />
        </>
      )}
    </svg>
  )
}

export default function LegalPage({ kind }: { kind: LegalKind }) {
  const { selected } = useSiteLanguage()

  const unsupportedLanguage = selected.code !== "vi" && selected.code !== "en"

  const search = useSyncExternalStore(
    subscribe,

    () => window.location.search,

    () => "",
  )

  const section = new URLSearchParams(search).get("section")

  const documentLanguage = new URLSearchParams(search).get("docLang")

  const index =
    documentLanguage === "en" ||
    (documentLanguage !== "vi" && selected.code === "en")
      ? 1
      : 0

  const doc = legalDocuments[kind]

  const other = kind === "privacy" ? "terms" : "privacy"

  const otherTitle =
    other === "terms"
      ? index
        ? "Terms of Use"
        : "Điều khoản sử dụng"
      : index
        ? "Privacy Policy"
        : "Chính sách bảo mật"

  const [active, setActive] = useState(doc.sections[0].id)

  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const oldTitle = document.title

    document.title =
      doc.title[index] + " · " + (index ? "Draft for review" : "Bản dự thảo")

    return () => {
      document.title = oldTitle
    }
  }, [doc, index])

  useEffect(() => {
    setExpanded(false)

    setActive(
      section && doc.sections.some((item) => item.id === section)
        ? section
        : doc.sections[0].id,
    )

    if (navigationScroll().kind === "pop") return
    const frame = requestAnimationFrame(() => {
      if (section && doc.sections.some((item) => item.id === section)) {
        const target = document.getElementById(`legal-${section}`)

        target?.scrollIntoView({ behavior: "instant", block: "start" })

        target?.focus({ preventScroll: true })
      } else window.scrollTo({ top: 0, behavior: "instant" })
    })

    return () => cancelAnimationFrame(frame)
  }, [kind, section, doc])

  useEffect(() => {
    const update = () => {
      let current = doc.sections[0].id

      for (const item of doc.sections) {
        if (
          (document.getElementById(`legal-${item.id}`)?.getBoundingClientRect()
            .top ?? Infinity) <= 180
        )
          current = item.id
      }

      setActive(current)
    }

    update()

    window.addEventListener("scroll", update, { passive: true })

    window.addEventListener("resize", update)

    return () => {
      window.removeEventListener("scroll", update)

      window.removeEventListener("resize", update)
    }
  }, [doc, index])

  const contents = (
    <nav aria-label={index ? "On this page" : "Mục lục trang"}>
      {doc.sections.map((item, number) => {
        const href = sitePath(`/${kind}`) + `?section=${item.id}`

        return (
          <a
            key={item.id}
            href={href}
            className={active === item.id ? "is-active" : ""}
            aria-current={active === item.id ? "location" : undefined}
            onClick={(event) => {
              if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              )
                return

              event.preventDefault()

              setExpanded(false)

              if (
                new URL(href, window.location.origin).search ===
                window.location.search
              ) {
                const target = document.getElementById(`legal-${item.id}`)

                target?.scrollIntoView({ behavior: "instant", block: "start" })

                target?.focus({ preventScroll: true })
              } else navigate(href)
            }}
          >
            <span>{String(number + 1).padStart(2, "0")}</span>
            {item.title[index]}
          </a>
        )
      })}
    </nav>
  )

  return (
    <div className="legal-site">
      <Header legalPage />
      <main className="legal-page" data-no-translate lang={index ? "en" : "vi"}>
        <aside className="legal-sidebar">
          <a className="legal-back" href={sitePath("/")}>
            <LegalIcon name="back" size={15} />
            {index ? "Back to home" : "Về trang chủ"}
          </a>
          <div className="legal-desktop-toc">
            <p className="legal-label">
              {index ? "ON THIS PAGE" : "NỘI DUNG TRANG"}
            </p>
            {contents}
          </div>
          <details
            className="legal-mobile-toc"
            open={expanded}
            onToggle={(event) => setExpanded(event.currentTarget.open)}
          >
            <summary>{index ? "On this page" : "Mục lục"}</summary>
            {contents}
          </details>
          <div className="legal-other">
            <span>{index ? "LEGAL DOCUMENTS" : "TÀI LIỆU PHÁP LÝ"}</span>
            <a href={sitePath(`/${other}`)}>
              {otherTitle}
              <LegalIcon name="arrow" size={14} />
            </a>
          </div>
        </aside>
        <article className="legal-article">
          <div className="legal-kicker">
            <LegalIcon name={kind === "privacy" ? "shield" : "file"} /> Toolmeta
            · {index ? "LEGAL" : "PHÁP LÝ"}
          </div>
          <h1>{doc.title[index]}</h1>
          <div className="legal-meta">
            <span>{index ? "Draft for review" : "Bản dự thảo"}</span>
            <span>
              {index ? "Updated October 11, 2026" : "Cập nhật ngày 11/10/2026"}
            </span>
          </div>
          <p className="legal-document-language">
            {index
              ? "Document language: English"
              : "Ngôn ngữ tài liệu: Tiếng Việt"}
          </p>
          <label className="legal-document-selector" lang={selected.code}>
            {t("Ngôn ngữ tài liệu")}
            <select
              aria-label={t("Ngôn ngữ tài liệu")}
              value={index ? "en" : "vi"}
              onChange={(event) => {
                const url = new URL(window.location.href)

                url.searchParams.set("docLang", event.target.value)

                navigate(url.pathname + url.search + url.hash)
              }}
            >
              <option value="vi" lang="vi">
                Tiếng Việt
              </option>
              <option value="en" lang="en">
                English
              </option>
            </select>
          </label>
          {unsupportedLanguage && (
            <p
              className="legal-language-notice"
              role="status"
              lang={selected.code}
            >
              {t(
                "Ngôn ngữ này chưa có bản dịch pháp lý. Tài liệu đang hiển thị bằng {0}.",
              ).replace("{0}", index ? "English" : "Tiếng Việt")}
            </p>
          )}
          <p className="legal-intro">{doc.intro[index]}</p>
          <div className="legal-notice">
            {index
              ? "This draft requires confirmation of the operator, official contact details and actual data processing practices before it becomes the published policy or terms."
              : "Bản dự thảo cần xác nhận đơn vị vận hành, thông tin liên hệ chính thức và cách xử lý dữ liệu thực tế trước khi áp dụng làm chính sách hoặc điều khoản chính thức."}
          </div>
          {doc.sections.map((item, number) => (
            <section className="legal-section" key={item.id}>
              <h2 id={`legal-${item.id}`} tabIndex={-1}>
                <span>{String(number + 1).padStart(2, "0")}.</span>
                {item.title[index]}
              </h2>
              {item.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph[index]}</p>
              ))}
            </section>
          ))}
          <div className="legal-end">
            <LegalIcon name="shield" />
            <span>
              {index ? "Read alongside the " : "Đọc cùng "}
              <a href={sitePath(`/${other}`)}>{otherTitle}</a>.
            </span>
          </div>
        </article>
      </main>
      <SiteFooter homeLinks />
    </div>
  )
}

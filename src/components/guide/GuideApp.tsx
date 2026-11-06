/** @jsxImportSource @/i18n/guide */

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import useSiteLanguage from "../../i18n/siteLanguage"

import { t } from "../../i18n/translate"

import { guideLocale } from "../../i18n/guide/language"

import { guideText } from "../../i18n/guide/translate"

import { APP_URL } from "../../config/urls"

import logo from "../../../Media Toolmeta/toolmeta-logo-primary-horizontal.png.png"

import LanguageFlag from "../language/LanguageFlag"

import {
  guideHref as baseGuideHref,
  sitePath,
  navigate,
  navigationScroll,
  subscribe,
} from "../../route"

import {
  articles,
  categories,
  loadArticle,
  guideDocumentHref as guideHref,
} from "./guideContent"

import type { GuideArticle } from "./types"

import GuideSidebar from "./GuideSidebar"

import GuideSearch from "./GuideSearch"

import GuideArticleContent, { articleImages } from "./GuideArticleContent"

import GuideTableOfContents from "./GuideTableOfContents"

import GuideLightbox from "./GuideLightbox"

import "./guide.css"

export default function GuideApp({ path }: { path: string }) {
  const { selected } = useSiteLanguage()

  const query = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  )

  const english = guideLocale(path, query) === "en"

  const slug = path.replace(/^\/guide(?:\/en)?\/?/, "")

  const home = !slug
  const readingPosition = useRef<number | null>(null)

  const [search, setSearch] = useState(false),
    [drawer, setDrawer] = useState(false),
    [article, setArticle] = useState<GuideArticle | null>(null),
    [loading, setLoading] = useState(!home),
    [error, setError] = useState(false),
    [image, setImage] = useState<number | null>(null)

  useEffect(() => {
    let live = true

    setArticle(null)

    setError(false)

    setImage(null)

    setDrawer(false)

    setLoading(!home)

    if (!home)
      loadArticle(slug, english ? "en" : "vi")

        .then((value) => {
          if (live) {
            setArticle(value)

            setLoading(false)

            document.title =
              (value?.title ?? "Không tìm thấy bài") + " · Toolmeta"
          }
        })

        .catch(() => {
          if (live) {
            setError(true)

            setLoading(false)
          }
        })
    else {
      document.title = english
        ? "English documentation · Toolmeta"
        : "Hướng dẫn sử dụng Toolmeta"
    }

    return () => {
      live = false
    }
  }, [slug, home, english])

  useEffect(() => {
    if (loading || (article && (article.slug !== slug || article.locale !== (english ? "en" : "vi")))) return

    const locale = english ? "en" : "vi"

    const title = article?.title
      ? article.title + " · Toolmeta"
      : guideText("Hướng dẫn sử dụng Toolmeta", locale)

    const description =
      article?.description ??
      guideText(
        "Tìm hiểu cách thiết lập và sử dụng các công cụ quản lý tài sản quảng cáo của Toolmeta.",
        locale,
      )

    document.title = title

    for (const [attribute, value, content] of [
      ["name", "description", description],
      ["property", "og:title", title],
      ["property", "og:description", description],
    ]) {
      let node = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${value}"]`,
      )

      if (!node) {
        node = document.createElement("meta")
        node.setAttribute(attribute, value)
        document.head.append(node)
      }

      node.content = content
    }
  }, [article, home, english, loading, slug])

  useEffect(() => {
    if (loading || (article && (article.slug !== slug || article.locale !== (english ? "en" : "vi")))) return

    if (navigationScroll().kind === "pop") return
    const frame = requestAnimationFrame(() => {
      if (window.location.hash)
        document.getElementById(window.location.hash.slice(1))?.scrollIntoView()
      else window.scrollTo(0, readingPosition.current ?? 0)
      readingPosition.current = null
    })

    return () => cancelAnimationFrame(frame)
  }, [article, home, english, loading, slug])

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()

        setSearch(true)
      }
    }

    document.addEventListener("keydown", key)

    return () => document.removeEventListener("keydown", key)
  }, [english])

  return (
    <div className="gd-site" lang={english ? "en" : "vi"}>
      <a className="gd-skip" href="#gd-main">
        Bỏ qua đến nội dung
      </a>
      <header className="gd-topbar">
        <div>
          <a href={sitePath("/")} aria-label="Toolmeta — Trang chủ">
            <img src={logo} alt="Toolmeta" width="2172" height="724" />
          </a>
          <a className="gd-top-home" href={sitePath("/")}>
            Trang chủ
          </a>
          <a className="gd-top-guide" href={guideHref()}>
            Hướng dẫn sử dụng
          </a>
          {
            <button
              type="button"
              className="gd-top-search"
              onClick={() => setSearch(true)}
            >
              Tìm kiếm <kbd>Ctrl K</kbd>
            </button>
          }
          <label className="gd-locale">
            <LanguageFlag code={english ? "en" : "vi"} />
            <span className="gd-sr">Ngôn ngữ hướng dẫn</span>
            <select
              value={english ? "en" : "vi"}
              aria-label="Ngôn ngữ hướng dẫn"
              onChange={(event) => {
                readingPosition.current = window.scrollY
                const target = event.target.value === "en" ? baseGuideHref("en" + (slug ? "/" + slug : "")) : baseGuideHref(slug) + "?docLang=vi"
                navigate(target + window.location.hash, { preserveScroll: true })
              }}
            >
              <option value="vi" lang="vi">
                Tiếng Việt
              </option>
              <option value="en" lang="en">English</option>
            </select>
          </label>
          <a className="gd-app-link" href={APP_URL}>
            Vào ứng dụng ↗
          </a>
        </div>
      </header>
      {!["vi", "en"].includes(selected.code) && (
        <p className="gd-language-notice" lang={selected.code} role="status">
          {t(
            "Hướng dẫn hỗ trợ Tiếng Việt và English. Tài liệu đang hiển thị bằng {0}.",
          ).replace("{0}", english ? "English" : "Tiếng Việt")}
        </p>
      )}
      {
        <div className="gd-mobile-actions">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-haspopup="dialog"
          >
            ☰ Danh mục
          </button>
          <button type="button" onClick={() => setSearch(true)}>
            Tìm hướng dẫn ⌕
          </button>
        </div>
      }
      <div className={"gd-shell" + (home ? " gd-is-home" : "")}>
        {
          <GuideSidebar
            slug={home ? "" : slug}
            drawer={drawer}
            onClose={() => setDrawer(false)}
          />
        }
        <main id="gd-main" tabIndex={-1}>
          {home ? (
            <>
              <section className="gd-hero">
                <span className="gd-kicker">TRUNG TÂM HƯỚNG DẪN</span>
                <h1>
                  {english ? (
                    <>
                      <span>Toolmeta</span> user guide
                    </>
                  ) : (
                    <>
                      Hướng dẫn sử dụng <span>Toolmeta</span>
                    </>
                  )}
                </h1>
                <p>
                  Tìm hiểu cách thiết lập và sử dụng các công cụ quản lý tài sản
                  quảng cáo của Toolmeta.
                </p>
                <button
                  className="gd-hero-search"
                  type="button"
                  onClick={() => setSearch(true)}
                >
                  <span>⌕ Tìm chức năng, thao tác hoặc bài viết…</span>
                  <kbd>Ctrl K</kbd>
                </button>
                <div className="gd-quick-links">
                  <a href={guideHref("getting-started/install-extension")}>
                    Cài Chrome Extension ↗
                  </a>
                  <a href={guideHref("getting-started/sign-in")}>
                    Đăng nhập & đồng bộ ↗
                  </a>
                </div>
              </section>
              <div className="gd-category-grid">
                {categories.map((category) => (
                  <section
                    id={category.id}
                    key={category.id}
                    className="gd-category"
                  >
                    <span>
                      {category.id === "ad"
                        ? "AD"
                        : category.id === "bm"
                          ? "BM"
                          : category.id === "page"
                            ? "PAGE"
                            : "↗"}
                    </span>
                    <h2>{category.label}</h2>
                    <p>
                      {
                        articles.filter((a) => a.category === category.id)
                          .length
                      }{" "}
                      bài hướng dẫn
                    </p>
                    <ul>
                      {articles

                        .filter((a) => a.category === category.id)

                        .map((a) => (
                          <li key={a.slug}>
                            <a href={guideHref(a.slug)}>
                              {a.title}
                              <span aria-hidden="true">→</span>
                            </a>
                          </li>
                        ))}
                    </ul>
                  </section>
                ))}
              </div>
            </>
          ) : loading || (article && (article.slug !== slug || article.locale !== (english ? "en" : "vi"))) ? (
            <p className="gd-loading" role="status">
              Đang tải bài hướng dẫn…
            </p>
          ) : error ? (
            <section className="gd-unavailable">
              <h1>Không tải được bài viết</h1>
              <p>Hãy kiểm tra kết nối và tải lại trang.</p>
              <a href={guideHref()}>Về trang hướng dẫn</a>
            </section>
          ) : article ? (
            <GuideArticleContent article={article} onImage={setImage} />
          ) : (
            <section className="gd-unavailable">
              <h1>Không tìm thấy bài hướng dẫn</h1>
              <p>Đường dẫn không tồn tại trong thư viện tài liệu công khai.</p>
              <a href={guideHref()}>Về trang hướng dẫn</a>
            </section>
          )}
        </main>
        {article && article.slug === slug && article.locale === (english ? "en" : "vi") && (
          <GuideTableOfContents article={article} />
        )}
      </div>
      <footer className="gd-footer">
        Toolmeta · Hướng dẫn sử dụng <a href={sitePath("/")}>Về Landing Page</a>{" "}
        <a href={sitePath("/contact")}>Liên hệ hỗ trợ</a>
      </footer>
      <GuideSearch
        open={search}
        locale={english ? "en" : "vi"}
        onClose={() => setSearch(false)}
      />
      <GuideLightbox
        images={article ? articleImages(article) : []}
        index={image}
        onClose={() => setImage(null)}
        onChange={setImage}
      />
    </div>
  )
}

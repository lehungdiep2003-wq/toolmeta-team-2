import { useEffect, useRef } from "react"
import whiteLogo from "../../../Media Toolmeta/toolmeta-logo-white-horizontal.png.png"
import FooterBackdrop from "./FooterBackdrop"
import FooterIcon from "./FooterIcon"
import FooterLanguage from "./FooterLanguage"
import FooterGuideCard from "./FooterGuideCard"
import { footerConfig } from "./footerConfig"
import { sitePath } from "../../route"
import "./footer.css"

export default function SiteFooter({ homeLinks = false }: { homeLinks?: boolean }) {
  const destination = (href: string) => homeLinks && href.startsWith("#") ? sitePath("/") + href : href
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const footer = ref.current
    if (!footer) return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    let visible = false,
      revealed = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const activity = () => {
      footer.dataset.motion = String(
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
                footer.dataset.reveal = media.matches ? "done" : "running"
                timer = setTimeout(() => {
                  footer.dataset.reveal = "done"
                }, 1300)
              }
            },
            { rootMargin: "0px 0px -16px 0px" },
          )
    observer?.observe(footer)
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
    <footer id="site-footer" ref={ref}>
      <FooterBackdrop />
      <div className="container">
        <div className="ft-upper">
          <div className="ft-brand">
            <a
              href={sitePath("/")}
              className="ft-logo-link"
              aria-label="Toolmeta — về đầu trang"
            >
              <img
                src={whiteLogo}
                alt="Toolmeta"
                width="2172"
                height="724"
                decoding="async"
              />
            </a>
            <p>
              Nền tảng quản lý tài sản quảng cáo tập trung, trực quan và chuyên
              nghiệp.
            </p>
            <div className="ft-social" aria-label="Kênh Toolmeta">
              {footerConfig.social.map((social) => (
                <a
                  href={destination(social.href)}
                  key={social.label}
                  aria-label={social.label}
                >
                  <FooterIcon name={social.icon} size={21} />
                </a>
              ))}
            </div>
          </div>
          <nav className="ft-nav" aria-labelledby="ft-product-heading">
            <h3 id="ft-product-heading">
              <FooterIcon name="cube" />
              Sản phẩm
            </h3>
            {footerConfig.product.map((link) => (
              <a key={link.href} href={destination(link.href)}>
                {link.label}
              </a>
            ))}
          </nav>
          <nav className="ft-nav" aria-labelledby="ft-resource-heading">
            <h3 id="ft-resource-heading">
              <FooterIcon name="book" />
              Tài nguyên
            </h3>
            {footerConfig.resources.map((link) => (
              <a key={link.href} href={destination(link.href)}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="ft-legal ft-nav">
            <h3>
              <FooterIcon name="shield" />
              Pháp lý
            </h3>
            {footerConfig.legal.length ? (
              <nav aria-label="Pháp lý">
                {footerConfig.legal.map((link) => (
                  <a key={link.href} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </nav>
            ) : (
              <p>
                Thông tin bảo mật và điều khoản được cung cấp trong ứng dụng
                Toolmeta.
              </p>
            )}
          </div>
          <FooterGuideCard />
        </div>
        <div className="ft-bottom">
          <div className="ft-copyright">
            <p>© 2026 Toolmeta. Bản quyền được bảo lưu.</p>
            <p>Quản lý tập trung · Vận hành hiệu quả · Phát triển bền vững</p>
          </div>
          <div className="ft-bottom-right">
            {footerConfig.legal.length > 0 && (
              <nav aria-label="Liên kết pháp lý">
                {footerConfig.legal.map((link) => (
                  <a key={link.href} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </nav>
            )}
            <FooterLanguage />
          </div>
        </div>
      </div>
    </footer>
  )
}

import { useEffect, useId, useRef, useState } from "react"
import { APP_URL } from "./config/urls"
import headerLogo from "../Media Toolmeta/toolmeta-logo-primary-horizontal.png.png"
import HeroArtwork from "./HeroArtwork"
import BenefitAssetStack from "./components/benefits/BenefitAssetStack"
import BenefitSearchDemo from "./components/benefits/BenefitSearchDemo"
import BenefitBulkDemo from "./components/benefits/BenefitBulkDemo"
import BenefitWorkflow from "./components/benefits/BenefitWorkflow"
import BenefitsMotionProvider from "./components/benefits/BenefitsMotionProvider"
import BenefitDemoCard from "./components/benefits/BenefitDemoCard"
import "./components/benefits/benefits.css"
import AssetShowcase from "./components/assets/AssetShowcase"
import SiteFooter from "./components/footer/SiteFooter"
import useSiteLanguage, { languages } from "./i18n/siteLanguage"
import LanguageFlag from "./components/language/LanguageFlag"
import {guideHref, sitePath} from "./route"
import FinalCta from "./components/final-cta/FinalCta"
import FaqSection from "./components/faq/FaqSection"
import PricingSection from "./components/pricing/PricingSection"
import ProductExperience from "./components/product-experience/ProductExperience"
import WorkflowSection from "./components/workflow/WorkflowSection"
import FeatureHighlightCard from "./components/highlights/FeatureHighlightCard"
import useHighlightsEntrance from "./components/highlights/useHighlightsEntrance"
import type { HighlightKind } from "./components/highlights/highlightDemoData"

type IconName = "grid" | "search" | "layers" | "bolt" | "ad" | "business" | "page" | "extension" | "login" | "sync" | "check"

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </>
    ),
    bolt: <path d="m13 2-9 12h8l-1 8 9-12h-8l1-8Z" />,
    ad: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M3 9h18M8 4v5M7 14h5M7 17h8" />
      </>
    ),
    business: (
      <>
        <path d="M4 21V7l8-4 8 4v14" />
        <path d="M9 21v-5h6v5M8 9h.01M12 9h.01M16 9h.01M8 12h.01M12 12h.01M16 12h.01" />
      </>
    ),
    page: (
      <>
        <path d="M6 2h9l4 4v16H6z" />
        <path d="M14 2v5h5M9 12h6M9 16h6" />
      </>
    ),
    extension: (
      <>
        <path d="M7 3h4a2 2 0 1 0 4 0h4v5a2 2 0 1 1 0 4v5h-5a2 2 0 1 1-4 0H5v-5a2 2 0 1 1 0-4V3h2Z" />
      </>
    ),
    login: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M15 3h5v18h-5" />
      </>
    ),
    sync: (
      <>
        <path d="M20 7h-5V2" />
        <path d="M20 7a9 9 0 0 0-15-3M4 17h5v5" />
        <path d="M4 17a9 9 0 0 0 15 3" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

const nav = [
  ["Tính năng", "#features"],
  ["Lợi ích", "#benefits"],
  ["Cách hoạt động", "#workflow"],
  ["Bảng giá", sitePath("/pricing")],
  ["Hướng dẫn", guideHref()],
  ["Liên hệ", sitePath("/contact")],
]

const benefits = [
  {
    icon: "grid" as IconName,
    title: "Quản lý tập trung",
    text: "Theo dõi AD, BM và PAGE trong một không gian làm việc nhất quán.",
    className: "benefit-main",
  },
  {
    icon: "search" as IconName,
    title: "Kiểm tra nhanh chóng",
    text: "Tìm kiếm, lọc và xem trạng thái tài sản với cấu trúc rõ ràng.",
    className: "benefit-soft",
  },
  {
    icon: "layers" as IconName,
    title: "Thao tác nhiều tài sản",
    text: "Tiếp cận các công cụ quản lý hàng loạt được hỗ trợ.",
    className: "benefit-dark",
  },
  {
    icon: "bolt" as IconName,
    title: "Vận hành gọn hơn",
    text: "Giảm thao tác lặp lại và giữ luồng công việc luôn mạch lạc.",
    className: "benefit-wide",
  },
]

const groups = [
  {
    code: "AD",
    icon: "ad" as IconName,
    title: "Tài khoản quảng cáo",
    text: "Xem danh sách, trạng thái, thông tin số dư và chi tiêu liên quan. Tìm kiếm, lọc và sử dụng các công cụ quản lý được hỗ trợ.",
    tags: ["Trạng thái", "Số dư", "Bộ lọc"],
  },
  {
    code: "BM",
    icon: "business" as IconName,
    title: "Business Manager",
    text: "Kiểm tra thông tin BM, dữ liệu xác minh, trạng thái doanh nghiệp và các tài sản liên quan.",
    tags: ["Thông tin BM", "Xác minh", "Tài sản"],
  },
  {
    code: "PAGE",
    icon: "page" as IconName,
    title: "Fanpage / Page",
    text: "Theo dõi danh sách, trạng thái Page, quyền quản trị và truy cập các công cụ Page được hỗ trợ.",
    tags: ["Danh sách Page", "Trạng thái", "Quyền"],
  },
]

function Button({
  children,
  href,
  variant = "primary",
}: {
  children: React.ReactNode
  href: string
  variant?: "primary" | "secondary" | "outline"
}) {
  return (
    <a className={`button button-${variant}`} href={href}>
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  )
}

function Heading({
  eyebrow,
  title,
  text,
  align = "left",
}: {
  eyebrow: string
  title: string
  text?: string
  align?: "left" | "center"
}) {
  return (
    <div className={`section-heading ${align === "center" ? "center" : ""}`}>
      <span className="eyebrow">
        <i />
        {eyebrow}
      </span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
}

function MiniTable({ type = "AD" }: { type?: string }) {
  return (
    <div className="mini-ui">
      <div className="mini-toolbar">
        <div className="mini-tabs">
          <b>{type}</b>
          <span>Tất cả tài sản</span>
        </div>
        <span className="mini-search">⌕ &nbsp; Tìm kiếm...</span>
        <span className="mini-filter">Bộ lọc</span>
      </div>
      <div className="mini-head">
        <span>Tài sản</span>
        <span>Trạng thái</span>
        <span>Thông tin</span>
        <span>Cập nhật</span>
      </div>
      {[
        [
          "Northstar Media",
          "Hoạt động",
          type === "AD" ? "•• 4821" : "Quản trị viên",
          "Vừa xong",
        ],
        [
          "Greenway Studio",
          "Đang xem xét",
          type === "AD" ? "•• 7194" : "Biên tập viên",
          "12 phút",
        ],
        [
          "Project Sun",
          "Hoạt động",
          type === "AD" ? "•• 3058" : "Quản trị viên",
          "1 giờ",
        ],
      ].map((row, i) => (
        <div className="mini-row" key={row[0]}>
          <span>
            <i className={`avatar a${i}`} />
            {row[0]}
          </span>
          <span>
            <b className={i === 1 ? "status pending" : "status"}>{row[1]}</b>
          </span>
          <span>{row[2]}</span>
          <span>{row[3]}</span>
        </div>
      ))}
      <small>Dữ liệu mẫu minh hoạ</small>
    </div>
  )
}

function LanguageSelector() {
  const { selected, setSelected } = useSiteLanguage()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    optionRefs.current[languages.indexOf(selected)]?.focus()
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", closeOutside)
    return () => document.removeEventListener("pointerdown", closeOutside)
  }, [open, selected])

  return (
    <div className="language-selector" ref={root}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}
      onKeyDown={(event) => {
        if (event.key === "Escape") { setOpen(false); trigger.current?.focus() }
      }}>
      <button type="button" className="language-trigger" ref={trigger}
        aria-label={`Ngôn ngữ: ${selected.name}`} aria-haspopup="menu"
        aria-expanded={open} aria-controls={open ? menuId : undefined}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true) }
        }}>
        <LanguageFlag code={selected.code} />
        <span className="language-name" lang={selected.code}>{selected.name}</span>
        <span className="language-short" aria-hidden="true">{selected.short}</span>
        <svg className="language-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && <div className="language-panel" id={menuId} role="menu" aria-label="Ngôn ngữ">
        {languages.map((language, index) => (
          <button type="button" key={language.code} role="menuitemradio"
            aria-checked={selected.code === language.code}
            className="language-option" ref={(element) => { optionRefs.current[index] = element }}
            onClick={() => { setSelected(language); setOpen(false); trigger.current?.focus() }}
            onKeyDown={(event) => {
              const next = event.key === "ArrowDown" ? (index + 1) % languages.length
                : event.key === "ArrowUp" ? (index + languages.length - 1) % languages.length
                : event.key === "Home" ? 0 : event.key === "End" ? languages.length - 1 : -1
              if (next >= 0) { event.preventDefault(); optionRefs.current[next]?.focus() }
            }}>
            <LanguageFlag code={language.code} />
            <span lang={language.code}>{language.name}</span>
            {selected.code === language.code && <Icon name="check" size={16} />}
          </button>
        ))}
      </div>}
    </div>
  )
}

export function Header({ pricingPage = false, contactPage = false, legalPage = false }: { pricingPage?: boolean; contactPage?: boolean; legalPage?: boolean }) {
  const innerPage = pricingPage || contactPage || legalPage
  const [open, setOpen] = useState(false)
  const menuTrigger = useRef<HTMLButtonElement>(null)
  const navigationId = useId()
  return (
    <header className="header" onKeyDown={(event) => {
      if (event.key === "Escape" && open &&
          !(event.target as Element).closest(".language-selector")) {
        event.preventDefault()
        setOpen(false)
        menuTrigger.current?.focus({ preventScroll: true })
      }
    }}>
      <div className="container nav-wrap">
        <a href={sitePath("/")} className="logo-link">
          <img
            className="header-logo"
            src={headerLogo}
            alt="Toolmeta"
            width={2172}
            height={724}
          />
        </a>
        <nav
          id={navigationId}
          className={open ? "nav open" : "nav"}
          aria-label="Điều hướng chính"
        >
          {nav.map(([label, href]) => (
            <a key={href} href={innerPage && href.startsWith("#") ? sitePath("/") + href : href}
              aria-current={(pricingPage && href === sitePath("/pricing")) || (contactPage && href === sitePath("/contact")) ? "page" : undefined}
              onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <Button href={APP_URL}>Bắt đầu miễn phí</Button>
          <LanguageSelector />
        </div>
        <button
          type="button"
          ref={menuTrigger}
          className="menu"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={navigationId}
          aria-label="Mở menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

function Hero() {
  const headingId = useId()
  return (
    <section className="hero container" id="top" aria-labelledby={headingId}>
      <div className="hero-copy">
        <span className="eyebrow">
          <i />
          DÀNH CHO NGƯỜI CHẠY QUẢNG CÁO FACEBOOK
        </span>
        <h1 id={headingId}>
          Bớt thao tác lặp.<br className="hero-line-break" /> Quản lý tài sản<br className="hero-line-break" /> quảng cáo <span>gọn hơn</span>.
        </h1>
        <p>
          Hết cảnh mở cả chục tab chỉ để kiểm một tài khoản. Toolmeta gom tài
          khoản quảng cáo, Business Manager và Fanpage về một màn hình: tìm là
          thấy, làm một lần cho nhiều tài sản.
        </p>
        <div className="hero-actions">
          <Button href={APP_URL}>Bắt đầu miễn phí</Button>
          <Button href="#features" variant="outline">
            Khám phá tính năng
          </Button>
        </div>
        <div className="hero-note">
          <span className="hero-note-badge" aria-hidden="true">
            <Icon name="check" size={18} />
          </span>
          <span>
            <b>Miễn phí để bắt đầu</b>
            <small>Thiết lập nhanh với <span className="hero-extension-name">Chrome Extension</span></small>
          </span>
        </div>
      </div>
      <div className="hero-art"><HeroArtwork /></div>
    </section>
  )
}

const pains = [
  {
    no: "01",
    title: "Kiểm 1 tài khoản mà mở cả chục tab",
    text: "Trạng thái, số dư, chi tiêu nằm rải rác ở nhiều màn hình. Kiểm một tài khoản cũng phải chuyển qua lại liên tục.",
    fix: "Xem trạng thái, số dư và chi tiêu ngay trong một bảng.",
  },
  {
    no: "02",
    title: "Tài khoản, BM, Page: mỗi thứ một nơi",
    text: "Không có chỗ nào nhìn được toàn bộ tài sản. Muốn biết tài sản nào đang có vấn đề phải dò thủ công từng nơi.",
    fix: "Gom đủ AD, BM và PAGE về một không gian làm việc.",
  },
  {
    no: "03",
    title: "Trang quản lý tải mãi không xong",
    text: "Mỗi lần mở lại là một lần chờ. Càng nhiều tài sản, càng mất thời gian để tìm đúng thứ mình cần.",
    fix: "Tìm là thấy: lọc theo tên, ID và trạng thái.",
  },
  {
    no: "04",
    title: "Đổi tên, phân quyền: làm tay từng cái",
    text: "Cùng một thao tác lặp lại cho hàng chục tài sản. Vừa tốn thời gian, vừa dễ sót, dễ nhầm.",
    fix: "Chọn nhiều tài sản, làm một lần: đổi tên, phân quyền, mở/đóng TKQC.",
  },
]

function PainPoints() {
  return (
    <section className="section pain-section" id="pain-points" aria-labelledby="pain-heading">
      <div className="container">
        <div className="section-heading center">
          <span className="eyebrow">
            <i />
            NỖI ĐAU QUEN THUỘC
          </span>
          <h2 id="pain-heading">Quản lý tài sản quảng cáo đang lấy mất của bạn bao nhiêu thời gian?</h2>
          <p>Nếu bạn đang vận hành nhiều tài khoản quảng cáo, BM và Page, hẳn bạn đã quá quen với những cảnh này.</p>
        </div>
        <div className="pain-grid">
          {pains.map((x) => (
            <article className="pain-card" key={x.no}>
              <span className="pain-no">{x.no}</span>
              <h3>{x.title}</h3>
              <p>{x.text}</p>
              <div className="pain-fix">
                <Icon name="check" size={16} />
                <span>{x.fix}</span>
              </div>
            </article>
          ))}
        </div>
        <p className="pain-bridge">
          Toolmeta gom tất cả về một nơi. <a href="#benefits">Xem cách Toolmeta giải quyết →</a>
        </p>
      </div>
    </section>
  )
}

function Benefits() {
  const sectionRef = useRef<HTMLElement>(null)
  return (
    <section className="section" id="benefits" ref={sectionRef}>
      <BenefitsMotionProvider sectionRef={sectionRef}>
      <div className="container">
        <Heading
          eyebrow="LỢI ÍCH CỐT LÕI"
          title="Mọi tài sản. Một nơi quản lý."
          text="Không còn nhảy qua lại giữa các tab. Mọi tài khoản, BM và Page nằm gọn trong một không gian làm việc, kiểm tra nhanh hơn và thao tác ít hơn."
          align="center"
        />
        <div className="bento">
          {benefits.map((x, i) => (
            <BenefitDemoCard index={i} className={`benefit ${x.className}`} key={x.title} titleId={`benefit-title-${i + 1}`}>
              <div className="icon-box">
                <Icon name={x.icon} />
              </div>
              <span className="card-no">0{i + 1}</span>
              <h3 id={`benefit-title-${i + 1}`}>{x.title}</h3>
              <p>{x.text}</p>
              {i === 0 && <BenefitAssetStack renderIcon={(name, size) => <Icon name={name} size={size} />} />}
              {i === 1 && <BenefitSearchDemo renderIcon={(name, size) => <Icon name={name} size={size} />} />}
              {i === 2 && <BenefitBulkDemo renderIcon={(name, size) => <Icon name={name} size={size} />} />}
              {i === 3 && <BenefitWorkflow renderIcon={(name, size) => <Icon name={name} size={size} />} />}
            </BenefitDemoCard>
          ))}
        </div>
      </div>
      </BenefitsMotionProvider>
    </section>
  )
}

function FeatureGroups() {
  return (
    <section className="section soft-section" id="features">
      <div className="container">
        <Heading
          eyebrow="QUẢN LÝ TÀI SẢN"
          title="Đúng công cụ cho từng nhóm tài sản."
          text="Thông tin thiết yếu và các tác vụ được hỗ trợ được sắp xếp theo cách rõ ràng, dễ tiếp cận."
        />
        <div className="groups">
          {groups.map((g, i) => (
            <AssetShowcase kind={g.code as "AD" | "BM" | "PAGE"} index={i} key={g.code} renderIcon={(name, size) => <Icon name={name} size={size} />}>
              <div className="group-copy">
                <div className="icon-box">
                  <Icon name={g.icon} />
                </div>
                <span>{g.code}</span>
                <h3>{g.title}</h3>
                <p>{g.text}</p>
                <div className="tags">
                  {g.tags.map((t) => (
                    <b key={t}>{t}</b>
                  ))}
                </div>
              </div>
            </AssetShowcase>
          ))}
        </div>
      </div>
    </section>
  )
}

function Highlights() {
  const sectionRef = useRef<HTMLElement>(null)
  useHighlightsEntrance(sectionRef)
  const items = [
    [
      "search",
      "Tìm kiếm & bộ lọc",
      "Nhanh chóng thu hẹp danh sách theo thông tin cần kiểm tra.",
    ],
    [
      "layers",
      "Thao tác hàng loạt",
      "Làm việc với nhiều tài sản qua các công cụ được hỗ trợ.",
    ],
    [
      "grid",
      "Cột tùy chỉnh",
      "Tổ chức bảng dữ liệu theo nhu cầu theo dõi của bạn.",
    ],
    [
      "bolt",
      "Công cụ quản lý",
      "Truy cập các tiện ích cần thiết từ cùng một không gian.",
    ],
  ] as const
  return (
    <section id="feature-highlights" ref={sectionRef} className="section">
      <div className="container">
        <Heading
          eyebrow="ĐIỂM NỔI BẬT"
          title="Ít phân tán. Nhiều kiểm soát hơn."
          text="Tất cả công cụ cần thiết được tích hợp trong một nền tảng, giúp bạn quản lý tài sản hiệu quả và tập trung hơn."
          align="center"
        />
        <div className="highlight-grid">
          {items.map(([icon, title, text], i) => (
            <FeatureHighlightCard key={title} kind={i as HighlightKind} icon={icon} title={title} text={text} renderIcon={(name, size) => <Icon name={name} size={size} />} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Workflow() {
  return <WorkflowSection />
}

function Showcase() {
  return <ProductExperience />
}

function Pricing() {
  return <PricingSection />
}

function FAQ() {
  return <FaqSection />
}

function Footer() {
  return (
    <>
      <FinalCta />
      <SiteFooter />
    </>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <Benefits />
        <FeatureGroups />
        <Highlights />
        <Workflow />
        <Showcase />
        <Pricing />
        <FAQ />
        <Footer />
      </main>
    </>
  )
}

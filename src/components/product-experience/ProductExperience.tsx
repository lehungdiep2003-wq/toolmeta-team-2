import { useEffect, useRef } from "react"
import ProductExperienceVisual from "./ProductExperienceVisual"
import ProductExperienceIcon, {
  type ExperienceIconName,
} from "./ProductExperienceIcon"
import "./productExperience.css"

interface Feature {
  icon: ExperienceIconName
  title: string
  text: string
  chips: readonly string[]
}
/** Capabilities documented in the supplied Toolmeta manual, PDF pages 20–33,
 * 35, 61–62, 118–119 and 131–136. No export/activity-log claims inferred. */
const features: readonly Feature[] = [
  {
    icon: "search",
    title: "Tìm kiếm & bộ lọc",
    text: "Nhanh chóng thu hẹp danh sách theo thông tin cần kiểm tra.",
    chips: ["Tên tài sản", "ID tài sản", "Trạng thái", "Tiền tệ"],
  },
  {
    icon: "layers",
    title: "Thao tác hàng loạt",
    text: "Làm việc với nhiều tài sản qua các công cụ được hỗ trợ.",
    chips: ["Chọn nhiều", "Đổi tên", "Phân quyền", "Mở/đóng TKQC"],
  },
  {
    icon: "grid",
    title: "Cột tùy chỉnh",
    text: "Tổ chức bảng dữ liệu theo nhu cầu theo dõi của bạn.",
    chips: ["Hiện/ẩn cột", "Sắp xếp", "Áp dụng", "Đặt lại mặc định"],
  },
  {
    icon: "bolt",
    title: "Công cụ quản lý",
    text: "Truy cập các tiện ích cần thiết từ cùng một không gian.",
    chips: ["Quản trị viên", "Nhóm tài sản", "Đối tác", "Thư viện công cụ"],
  },
]

export default function ProductExperience() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const section = ref.current
    if (!section) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    let visible = false,
      revealed = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const activity = () => {
      section.dataset.motion = String(
        visible && !document.hidden && !reduced.matches,
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
                section.dataset.reveal = reduced.matches ? "done" : "running"
                timer = setTimeout(() => {
                  section.dataset.reveal = "done"
                }, 1250)
              }
            },
            { rootMargin: "0px 0px -32px 0px" },
          )
    observer?.observe(section)
    if (!observer) {
      visible = true
      activity()
    }
    document.addEventListener("visibilitychange", activity)
    reduced.addEventListener("change", activity)
    return () => {
      observer?.disconnect()
      clearTimeout(timer)
      document.removeEventListener("visibilitychange", activity)
      reduced.removeEventListener("change", activity)
    }
  }, [])
  return (
    <section
      id="guide"
      className="section pe-section"
      ref={ref}
      aria-labelledby="pe-heading"
    >
      <div className="container">
        <div className="pe-upper">
          <header className="pe-copy">
            <span className="eyebrow">
              <i />
              TRẢI NGHIỆM SẢN PHẨM
            </span>
            <h2 id="pe-heading">
              Thông tin rõ ràng.
              <br />
              <span>Thao tác</span> liền mạch.
            </h2>
            <p>
              Một giao diện nhất quán cho các nhóm tài sản chính, giúp bạn tập
              trung vào công việc cần làm.
            </p>
          </header>
          <ProductExperienceVisual />
        </div>
        <div className="pe-features">
          {features.map((feature, index) => (
            <article
              className="pe-feature"
              key={feature.title}
              data-index={index}
            >
              <div className="pe-feature-top">
                <span className="pe-feature-icon">
                  <ProductExperienceIcon name={feature.icon} size={29} />
                </span>
                <span className="pe-number">0{index + 1}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <ul
                className="pe-chips"
                aria-label={"Tính năng " + feature.title}
              >
                {feature.chips.map((chip, i) => (
                  <li
                    key={chip}
                    style={{ "--pe-chip": i } as React.CSSProperties}
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

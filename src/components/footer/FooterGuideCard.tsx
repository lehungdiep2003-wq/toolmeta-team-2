import { guideHref } from "../../route"
import FooterIcon from "./FooterIcon"

export default function FooterGuideCard() {
  return (
    <section className="ft-guide-card" aria-labelledby="ft-guide-heading">
      <span className="ft-guide-icon">
        <FooterIcon name="book" size={25} />
      </span>
      <h3 id="ft-guide-heading">
        Mới sử dụng <span>Toolmeta?</span>
      </h3>
      <p>
        Tìm hiểu cách cài đặt Chrome Extension, đăng nhập và bắt đầu quản lý AD,
        BM, PAGE trên Toolmeta.
      </p>
      <a className="ft-guide-cta" href={guideHref()}>
        <span>Xem hướng dẫn sử dụng</span>
        <FooterIcon name="arrow" size={20} />
      </a>
    </section>
  )
}

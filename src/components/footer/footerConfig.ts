/** Only destinations present in the current project. Supply official URLs here
 * before adding public social, support, blog or legal links. */
import {guideHref, sitePath} from "../../route"
interface FooterLink {
  label: string
  href: string
}
export const footerConfig = {
  product: [
    { label: "Tính năng", href: "#features" },
    { label: "Lợi ích", href: "#benefits" },
    { label: "Cách hoạt động", href: "#workflow" },
    { label: "Bảng giá", href: sitePath("/pricing") },
  ],
  resources: [
    { label: "Hướng dẫn", href: guideHref() },
    { label: "Câu hỏi thường gặp", href: "#faq" },
    { label: "Liên hệ", href: sitePath("/contact") },
  ],
  social: [{ label: "Website Toolmeta", href: sitePath("/"), icon: "globe" as const }],
  legal: [
    { label: "Điều khoản sử dụng", href: sitePath("/terms") },
    { label: "Chính sách quyền riêng tư", href: sitePath("/privacy") },
  ] as FooterLink[],
}

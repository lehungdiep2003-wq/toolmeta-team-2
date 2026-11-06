import { pricingData } from "../pricing/pricingData"
import { sitePath } from "../../route"
/** Content: supplied Toolmeta manual; plan information comes from shared FB2 pricing data. */
export const faqItems = [
  {
    icon: "product",
    question: "Toolmeta dùng để làm gì?",
    answer:
      "Toolmeta giúp tập trung việc theo dõi, kiểm tra, quản lý và thao tác với các tài sản quảng cáo Facebook được hỗ trợ gồm AD, BM và PAGE trong một không gian làm việc nhất quán.",
  },
  {
    icon: "extension",
    question: "Có cần cài đặt Chrome Extension không?",
    answer:
      "Có. Chrome Extension là thành phần cần thiết để Toolmeta kết nối dữ liệu tài khoản và thực hiện các chức năng AD, BM, PAGE tương ứng. Bạn cần cài extension và đăng nhập trước khi sử dụng.",
  },
  {
    icon: "layers",
    question: "Toolmeta hỗ trợ quản lý những loại tài sản nào?",
    answer:
      "Toolmeta hỗ trợ tài khoản quảng cáo (AD/TKQC), Business Manager (BM) và Fanpage (PAGE). Các thông tin và công cụ được sắp xếp riêng theo từng nhóm tài sản.",
  },
  {
    icon: "play",
    question: "Làm thế nào để bắt đầu sử dụng?",
    steps: [
      "Cài Chrome Extension Toolmeta.",
      "Đăng nhập tài khoản.",
      "Đồng bộ tài khoản trên Dashboard.",
      "Truy cập AD, BM hoặc PAGE để xem và quản lý tài sản.",
    ],
  },
  {
    icon: "gift",
    question: pricingData.policyFaq.question,
    answer: pricingData.policyFaq.answer,
  },
  {
    icon: "shield",
    question: "Dữ liệu của tôi có được bảo mật không?",
    answer:
      "Tài liệu hướng dẫn có mục Bảo mật & Điều khoản để bạn xem phạm vi truy cập và trách nhiệm sử dụng. Cookie và access token cho phép truy cập tài khoản, vì vậy cần giữ kín và không chia sẻ các giá trị này với người khác. Hãy đọc chính sách trong ứng dụng trước khi sử dụng.",
  },
] as const
export const faqSupportUrl: string | null = sitePath("/contact")

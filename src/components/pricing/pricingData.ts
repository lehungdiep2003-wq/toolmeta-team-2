/** FB2 pricing reference: Landing Fb2.aezcheck (2).zip, src/PricingPage.tsx.
 * Public product capabilities are distinct from per-plan entitlements.
 * Quantity limits and duration require a separate official FB2 policy. */
export const pricingData = {
  planName: "Toolmeta Free",
  price: "0₫",
  message: "Miễn phí sử dụng",
  pageTitle: "Bảng giá Toolmeta — Toolmeta Free",
  heading: "Bắt đầu miễn phí.",
  headingSecond: "Quản lý",
  headingAccent: "dễ dàng hơn.",
  description:
    "Khám phá các công cụ quản lý tài sản quảng cáo của Toolmeta với gói sử dụng miễn phí.",
  capabilityIntro: "Các nhóm khả năng của sản phẩm Toolmeta:",
  entitlementNote:
    "Danh sách này giới thiệu khả năng của sản phẩm. Quyền sử dụng từng công cụ trong gói Free cần được xác nhận bằng chính sách chính thức.",
  futureTitle: "Các gói mở rộng",
  futureDescription:
    "Các lựa chọn trả phí sẽ được công bố khi thông tin chính thức được xác nhận.",
  gettingStarted:
    "Cài Chrome Extension, đăng nhập và đồng bộ tài sản để bắt đầu quản lý trong Workspace của bạn.",
  cta: "Bắt đầu miễn phí",
  policyFaq: {
    question: "Thông tin gói Toolmeta Free được xác nhận thế nào?",
    answer:
      "Toolmeta Free có giá 0₫, miễn phí sử dụng. Hạn mức số lượng, thời gian sử dụng và quyền sử dụng từng công cụ cần được xác nhận bằng chính sách chính thức của Toolmeta FB2.",
  },
} as const

export const pricingCapabilities = [
  "Quản lý tài khoản quảng cáo (AD).",
  "Quản lý Business Manager (BM).",
  "Quản lý Fanpage (PAGE).",
  "Tìm kiếm và lọc tài sản.",
  "Các công cụ thao tác hàng loạt được hỗ trợ.",
  "Sử dụng Chrome Extension.",
] as const

export const pricingGroups = [
  {
    tag: "AD",
    title: "Tài khoản quảng cáo",
    description:
      "Theo dõi trạng thái, số dư và chi tiêu của tài khoản quảng cáo.",
    guide: "ad/overview",
  },
  {
    tag: "BM",
    title: "Business Manager",
    description: "Tra cứu thông tin doanh nghiệp và các tài sản liên quan.",
    guide: "bm/overview",
  },
  {
    tag: "PAGE",
    title: "Fanpage",
    description: "Xem danh sách Page, trạng thái và thông tin quyền quản lý.",
    guide: "page/overview",
  },
  {
    tag: "BULK",
    title: "Tác vụ hàng loạt",
    description:
      "Lọc danh sách, chọn nhiều tài sản và truy cập các công cụ thao tác hàng loạt được hỗ trợ.",
    guide: "ad/tools",
  },
  {
    tag: "TOOLS",
    title: "Công cụ hỗ trợ",
    description:
      "Truy cập thư viện công cụ và tùy chỉnh các cột hiển thị theo từng nhóm tài sản.",
    guide: "bm/tools",
  },
] as const

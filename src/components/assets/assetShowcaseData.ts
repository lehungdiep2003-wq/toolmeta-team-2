export type AssetKind = "AD" | "BM" | "PAGE"
export type AssetStatus = "all" | "active" | "review"
export interface SampleAsset {
  name: string
  status: Exclude<AssetStatus, "all">
  role: string
  updated: string
  maskedId?: string
}
/** Existing MiniTable examples only. Missing fields stay unpopulated. */
export const sampleAssets: readonly SampleAsset[] = [
  {
    name: "Northstar Media",
    status: "active",
    role: "Quản trị viên",
    updated: "Vừa xong",
    maskedId: "•• 4821",
  },
  {
    name: "Greenway Studio",
    status: "review",
    role: "Biên tập viên",
    updated: "12 phút",
    maskedId: "•• 7194",
  },
  {
    name: "Project Sun",
    status: "active",
    role: "Quản trị viên",
    updated: "1 giờ",
    maskedId: "•• 3058",
  },
]
export const assetTableConfig = {
  AD: {
    title: "Tất cả tài khoản quảng cáo",
    placeholder: "Tìm tài khoản...",
    name: "Tên tài khoản",
    target: 0,
    keyword: "North",
    period: 10800,
  },
  BM: {
    title: "Tất cả Business Manager",
    placeholder: "Tìm BM...",
    name: "Tên Business Manager",
    target: 2,
    keyword: "Project",
    period: 11200,
  },
  PAGE: {
    title: "Tất cả Page",
    placeholder: "Tìm Page...",
    name: "Tên Page",
    target: 1,
    keyword: "Green",
    period: 11000,
  },
} as const
export interface AssetDemoFrame {
  phase: "idle" | "focus" | "typing" | "search" | "highlight" | "select" | "filter" | "status" | "details" | "hold" | "reset"
  characters?: number
  dim?: boolean
  highlight?: boolean
  selected?: boolean
  filter?: boolean
  status?: boolean
  details?: boolean
}
export interface AssetDemoStep {
  at: number
  value: AssetDemoFrame
}
const step = (at: number, value: AssetDemoFrame): AssetDemoStep => ({
  at,
  value,
})
export const assetDemoSteps: Record<AssetKind, readonly AssetDemoStep[]> = {
  AD: [
    step(0, { phase: "idle" }),
    step(1000, { phase: "focus" }),
    ...[1, 2, 3, 4, 5].map((characters, i) =>
      step(1500 + i * 150, { phase: "typing", characters }),
    ),
    step(2500, { phase: "search", characters: 5, dim: true }),
    step(3500, {
      phase: "highlight",
      characters: 5,
      dim: true,
      highlight: true,
    }),
    step(4500, {
      phase: "select",
      characters: 5,
      dim: true,
      highlight: true,
      selected: true,
    }),
    step(5500, {
      phase: "filter",
      characters: 5,
      dim: true,
      highlight: true,
      selected: true,
      filter: true,
    }),
    step(6500, {
      phase: "status",
      characters: 5,
      dim: true,
      highlight: true,
      selected: true,
      filter: true,
      status: true,
    }),
    step(8000, {
      phase: "hold",
      characters: 5,
      dim: true,
      highlight: true,
      selected: true,
      filter: true,
      status: true,
    }),
    step(9500, { phase: "reset" }),
  ],
  BM: [
    step(0, { phase: "idle" }),
    step(1000, { phase: "focus" }),
    ...[1, 2, 3, 4, 5, 6, 7].map((characters, i) =>
      step(1500 + i * 150, { phase: "typing", characters }),
    ),
    step(3000, {
      phase: "highlight",
      characters: 7,
      dim: true,
      highlight: true,
    }),
    step(4000, { phase: "filter", characters: 7, dim: true, highlight: true }),
    step(5000, {
      phase: "filter",
      characters: 7,
      dim: true,
      highlight: true,
      filter: true,
    }),
    step(6000, {
      phase: "select",
      characters: 7,
      dim: true,
      highlight: true,
      filter: true,
      selected: true,
    }),
    step(7000, {
      phase: "details",
      characters: 7,
      dim: true,
      highlight: true,
      filter: true,
      selected: true,
      status: true,
      details: true,
    }),
    step(8500, {
      phase: "hold",
      characters: 7,
      dim: true,
      highlight: true,
      filter: true,
      selected: true,
      status: true,
      details: true,
    }),
    step(10000, { phase: "reset" }),
  ],
  PAGE: [
    step(0, { phase: "idle" }),
    step(1000, { phase: "focus" }),
    ...[1, 2, 3, 4, 5].map((characters, i) =>
      step(1500 + i * 150, { phase: "typing", characters }),
    ),
    step(2500, { phase: "search", characters: 5, dim: true }),
    step(3500, {
      phase: "highlight",
      characters: 5,
      dim: true,
      highlight: true,
    }),
    step(4500, {
      phase: "select",
      characters: 5,
      dim: true,
      highlight: true,
      selected: true,
    }),
    step(5500, {
      phase: "details",
      characters: 5,
      dim: true,
      highlight: true,
      selected: true,
      details: true,
    }),
    step(7000, {
      phase: "status",
      characters: 5,
      dim: true,
      highlight: true,
      selected: true,
      details: true,
      status: true,
    }),
    step(8500, {
      phase: "hold",
      characters: 5,
      dim: true,
      highlight: true,
      selected: true,
      details: true,
      status: true,
    }),
    step(10000, { phase: "reset" }),
  ],
}

export function assetDemoPresentation(kind: AssetKind, frame: AssetDemoFrame) {
  const config = assetTableConfig[kind]
  return {
    query: config.keyword.slice(0, frame.characters ?? 0),
    status: (frame.filter ? "active" : "all") as AssetStatus,
    selected: frame.selected ? [config.target] : [],
  }
}

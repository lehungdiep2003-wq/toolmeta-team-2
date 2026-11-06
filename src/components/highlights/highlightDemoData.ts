import { sampleAssets } from "../assets/assetShowcaseData"

export type HighlightKind = 0 | 1 | 2 | 3
export interface HighlightFrame {
  phase: string
  characters?: number
  typeActive?: boolean
  filters?: number
  count?: number
  manager?: boolean
  notes?: boolean
  reorder?: boolean
  moving?: boolean
  active?: number
  complete?: boolean
}
export interface HighlightStep {
  at: number
  value: HighlightFrame
}
const step = (at: number, value: HighlightFrame): HighlightStep => ({
  at,
  value,
})
export const highlightPeriods = [8800, 9000, 10800, 9200] as const
export const highlightSteps: ReadonlyArray<ReadonlyArray<HighlightStep>> = [
  [
    step(0, { phase: "idle" }),
    step(800, { phase: "focus" }),
    step(1300, { phase: "typing", characters: 1 }),
    step(1600, { phase: "typing", characters: 2 }),
    step(2200, { phase: "filter", characters: 2, typeActive: true }),
    step(3000, { phase: "filter", characters: 2, typeActive: true }),
    step(4000, {
      phase: "conditions",
      characters: 2,
      typeActive: true,
      filters: 1,
    }),
    step(4500, {
      phase: "conditions",
      characters: 2,
      typeActive: true,
      filters: 2,
    }),
    step(5200, {
      phase: "result",
      characters: 2,
      typeActive: true,
      filters: 2,
    }),
    step(6500, {
      phase: "result",
      characters: 2,
      typeActive: true,
      filters: 2,
    }),
    step(8000, { phase: "reset" }),
  ],
  [
    step(0, { phase: "idle", count: 0 }),
    step(800, { phase: "select", count: 1 }),
    step(1600, { phase: "select", count: 2 }),
    step(2400, { phase: "select", count: 3 }),
    step(3200, { phase: "selected", count: 3 }),
    step(4000, { phase: "hint", count: 3 }),
    step(4800, { phase: "pressed", count: 3 }),
    step(5050, { phase: "selected", count: 3 }),
    step(5300, { phase: "complete", count: 3, complete: true }),
    step(6500, { phase: "complete", count: 3, complete: true }),
    step(8000, { phase: "reset", count: 0 }),
  ],
  [
    step(0, { phase: "idle" }),
    step(1000, { phase: "manager" }),
    step(1800, { phase: "manager", manager: true }),
    step(3000, { phase: "notes", manager: true }),
    step(3800, { phase: "notes", manager: true, notes: true }),
    step(5000, { phase: "reorder", manager: true, notes: true, moving: true }),
    step(5200, {
      phase: "reorder",
      manager: true,
      notes: true,
      moving: true,
      reorder: true,
    }),
    step(5500, { phase: "reorder", manager: true, notes: true, reorder: true }),
    step(6500, {
      phase: "complete",
      manager: true,
      notes: true,
      reorder: true,
      complete: true,
    }),
    step(8000, {
      phase: "complete",
      manager: true,
      notes: true,
      reorder: true,
      complete: true,
    }),
    step(9500, {
      phase: "reset",
      manager: true,
      notes: true,
      reorder: true,
      moving: true,
    }),
    step(9700, { phase: "reset", moving: true }),
    step(10000, { phase: "reset" }),
  ],
  [
    step(0, { phase: "idle", active: -1 }),
    step(1000, { phase: "hint", active: 0 }),
    step(2000, { phase: "hint", active: 1 }),
    step(3000, { phase: "hint", active: 2 }),
    step(4000, { phase: "hint", active: 3 }),
    step(5000, { phase: "pressed", active: 2 }),
    step(5250, { phase: "hint", active: 2 }),
    step(5700, { phase: "complete", active: 2, complete: true }),
    step(7000, { phase: "complete", active: 2, complete: true }),
    step(8000, { phase: "reset", active: -1 }),
  ],
]
const kinds = ["AD", "BM", "PAGE"] as const
export const highlightSamples = sampleAssets.map((row, index) => ({
  name: row.name,
  status: row.status,
  kind: kinds[index],
}))
export const highlightColumns = [
  "Tài sản",
  "Trạng thái",
  "Thông tin",
  "Cập nhật",
  "Người quản lý",
  "Ghi chú",
] as const
/** Only capabilities already present in approved landing-page copy. */
export const verifiedTools = [
  { label: "Tìm kiếm tài sản", icon: "search" },
  { label: "Lọc trạng thái", icon: "layers" },
  { label: "Hiển thị cột", icon: "grid" },
  { label: "Kiểm tra quyền", icon: "business" },
] as const

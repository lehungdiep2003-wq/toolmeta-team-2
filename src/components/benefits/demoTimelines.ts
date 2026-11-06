export interface DemoStep<T> {
  at: number
  value: T
}
export interface SearchFrame {
  phase: "focus" | "typing" | "filter" | "status" | "result" | "clear" | "reset"
  characters: number
  filtered: boolean
}
export const searchKeywords = ["BM", "PAGE", "AD"] as const
export const demoPeriods = {
  assets: 6200,
  search: 6600,
  bulk: 7200,
  workflow: 6600,
} as const
export interface AssetFrame {
  phase: "ad" | "bm" | "page" | "highlight" | "glow" | "reset"
}
export const assetSteps: readonly DemoStep<AssetFrame>[] = [
  { at: 0, value: { phase: "ad" } },
  { at: 1000, value: { phase: "bm" } },
  { at: 2000, value: { phase: "page" } },
  { at: 3000, value: { phase: "highlight" } },
  { at: 4000, value: { phase: "glow" } },
  { at: 5000, value: { phase: "reset" } },
]
export const searchSteps: readonly DemoStep<SearchFrame>[] = [
  { at: 0, value: { phase: "focus", characters: 0, filtered: false } },
  { at: 500, value: { phase: "typing", characters: 1, filtered: false } },
  { at: 800, value: { phase: "typing", characters: 2, filtered: false } },
  { at: 1100, value: { phase: "typing", characters: 3, filtered: false } },
  { at: 1350, value: { phase: "typing", characters: 4, filtered: false } },
  { at: 1500, value: { phase: "filter", characters: 4, filtered: true } },
  { at: 2000, value: { phase: "status", characters: 4, filtered: true } },
  { at: 3000, value: { phase: "result", characters: 4, filtered: true } },
  { at: 4500, value: { phase: "clear", characters: 0, filtered: true } },
  { at: 5000, value: { phase: "reset", characters: 0, filtered: false } },
  { at: 6000, value: { phase: "reset", characters: 0, filtered: false } },
]
export interface BulkFrame {
  count: number
  phase: "selecting" | "selected" | "hint" | "pressed" | "complete" | "reset"
}
export const bulkSteps: readonly DemoStep<BulkFrame>[] = [
  { at: 0, value: { count: 0, phase: "selecting" } },
  { at: 500, value: { count: 1, phase: "selecting" } },
  { at: 1000, value: { count: 2, phase: "selecting" } },
  { at: 1500, value: { count: 3, phase: "selecting" } },
  { at: 2000, value: { count: 3, phase: "selected" } },
  { at: 2800, value: { count: 3, phase: "hint" } },
  { at: 3500, value: { count: 3, phase: "pressed" } },
  { at: 3750, value: { count: 3, phase: "selected" } },
  { at: 4000, value: { count: 3, phase: "complete" } },
  { at: 6500, value: { count: 0, phase: "reset" } },
]
export interface WorkflowFrame {
  step: number
  link: number
  complete: boolean
  reset?: boolean
}
export const workflowSteps: readonly DemoStep<WorkflowFrame>[] = [
  { at: 0, value: { step: 0, link: -1, complete: false } },
  { at: 1000, value: { step: 0, link: 0, complete: false } },
  { at: 1800, value: { step: 1, link: -1, complete: false } },
  { at: 2800, value: { step: 1, link: 1, complete: false } },
  { at: 3500, value: { step: 2, link: -1, complete: false } },
  { at: 4000, value: { step: 2, link: -1, complete: true } },
  { at: 6000, value: { step: 0, link: -1, complete: false, reset: true } },
]

export function demoStepIndex<T>(
  steps: readonly DemoStep<T>[],
  elapsed: number,
  period: number,
) {
  const time = ((elapsed % period) + period) % period
  let index = 0
  for (let i = 1; i < steps.length && steps[i].at <= time; i++) index = i
  return index
}

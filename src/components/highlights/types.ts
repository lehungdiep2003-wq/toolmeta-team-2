import type { ReactNode } from "react"
import type useHighlightAutoplay from "./useHighlightAutoplay"
export type HighlightIcon = "search" | "layers" | "grid" | "bolt" | "check" | "ad" | "business" | "page" | "sync"
export type RenderHighlightIcon = (
  name: HighlightIcon,
  size?: number,
) => ReactNode
export interface HighlightDemoProps {
  demo: ReturnType<typeof useHighlightAutoplay>
  renderIcon: RenderHighlightIcon
}

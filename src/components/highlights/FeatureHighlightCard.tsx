import { useRef } from "react"
import useHighlightAutoplay from "./useHighlightAutoplay"
import HighlightSearchDemo from "./HighlightSearchDemo"
import HighlightBulkDemo from "./HighlightBulkDemo"
import HighlightColumnsDemo from "./HighlightColumnsDemo"
import HighlightToolsDemo from "./HighlightToolsDemo"
import type { HighlightKind } from "./highlightDemoData"
import type { HighlightIcon, RenderHighlightIcon } from "./types"
import "./highlights.css"

interface Props {
  kind: HighlightKind
  icon: HighlightIcon
  title: string
  text: string
  renderIcon: RenderHighlightIcon
}
const demos = [
  HighlightSearchDemo,
  HighlightBulkDemo,
  HighlightColumnsDemo,
  HighlightToolsDemo,
]
export default function FeatureHighlightCard({
  kind,
  icon,
  title,
  text,
  renderIcon,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const demo = useHighlightAutoplay(ref, kind)
  const Demo = demos[kind]
  return (
    <article
      ref={ref}
      className="highlight fl-card"
      data-kind={kind}
      data-motion-state={
        demo.reduced ? "reduced" : demo.running ? "running" : "paused"
      }
      onFocusCapture={demo.focusIn}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) demo.focusOut()
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") demo.pointerEnter()
      }}
      onPointerLeave={demo.pointerLeave}
    >
      <span className="highlight-icon">{renderIcon(icon, 24)}</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <Demo demo={demo} renderIcon={renderIcon} />
    </article>
  )
}

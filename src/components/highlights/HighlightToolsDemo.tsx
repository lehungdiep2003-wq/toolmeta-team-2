import { useEffect, useState } from "react"
import { verifiedTools } from "./highlightDemoData"
import type { HighlightDemoProps } from "./types"

export default function HighlightToolsDemo({
  demo,
  renderIcon,
}: HighlightDemoProps) {
  const [active, setActive] = useState(0)
  const [complete, setComplete] = useState(false)
  useEffect(() => {
    setActive(0)
    setComplete(false)
  }, [demo.resetKey])
  const index = demo.automatic ? (demo.frame.active ?? -1) : active
  const done = demo.automatic ? Boolean(demo.frame.complete) : complete
  const take = () => {
    if (!demo.manual) {
      setActive(index)
      setComplete(done)
    }
    demo.takeControl()
  }
  return (
    <div
      className="fl-demo fl-tools"
      onFocusCapture={take}
      onPointerDownCapture={take}
    >
      <div className="fl-panel-label">
        <strong>Công cụ nhanh</strong>
        <small>Minh họa</small>
      </div>
      <div className="fl-tool-grid">
        {verifiedTools.map((tool, i) => (
          <button
            type="button"
            key={tool.label}
            aria-pressed={index === i}
            aria-label={`${tool.label} (minh họa)`}
            data-pressed={
              demo.automatic && index === i && demo.frame.phase === "pressed"
            }
            onClick={() => {
              setActive(i)
              setComplete(true)
            }}
          >
            {renderIcon(tool.icon, 27)}
            <span>{tool.label}</span>
          </button>
        ))}
      </div>
      <div className="fl-tool-feedback">
        <span className="fl-feedback" data-visible={done} aria-hidden={!done}>
          {renderIcon("check", 14)}Đã chọn công cụ · Minh họa
        </span>
      </div>
    </div>
  )
}

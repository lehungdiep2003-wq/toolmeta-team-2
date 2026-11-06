import { t } from "../../i18n/translate"
import { useEffect, useRef, useState } from "react"
import { highlightSamples } from "./highlightDemoData"
import type { HighlightDemoProps } from "./types"

export default function HighlightBulkDemo({
  demo,
  renderIcon,
}: HighlightDemoProps) {
  const [selected, setSelected] = useState([0, 1, 2])
  const [complete, setComplete] = useState(false)
  const [pressed, setPressed] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    setSelected([0, 1, 2])
    setComplete(false)
    setPressed(false)
    clearTimeout(timer.current)
  }, [demo.resetKey])
  useEffect(() => () => clearTimeout(timer.current), [])
  const chosen = demo.automatic
    ? [0, 1, 2].slice(0, demo.frame.count ?? 0)
    : selected
  const done = demo.automatic ? demo.frame.complete : complete
  const take = () => {
    if (!demo.manual) {
      setSelected(chosen)
      setComplete(Boolean(done))
      setPressed(false)
    }
    demo.takeControl()
  }
  const act = () => {
    if (!chosen.length) return
    setPressed(true)
    setComplete(false)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setPressed(false)
      setComplete(true)
    }, 250)
  }
  return (
    <div
      className="fl-demo fl-bulk"
      onFocusCapture={take}
      onPointerDownCapture={take}
    >
      <div className="fl-panel-label">
        <span>Tài sản mẫu</span>
        <small>AD / BM / PAGE</small>
      </div>
      <div className="fl-asset-list">
        {highlightSamples.map((row, i) => (
          <label
            className="fl-asset-row"
            data-selected={chosen.includes(i)}
            key={row.name}
          >
            <input
              type="checkbox"
              checked={chosen.includes(i)}
              onChange={() => {
                setComplete(false)
                setSelected(
                  chosen.includes(i)
                    ? chosen.filter((n) => n !== i)
                    : [...chosen, i],
                )
              }}
            />
            <span className={`fl-avatar fl-avatar-${i}`} aria-hidden="true" />
            <span className="fl-asset-name">
              <strong>{row.name}</strong>
              <small>{row.kind}</small>
            </span>
          </label>
        ))}
      </div>
      <div className="fl-bulk-bar">
        <div className="fl-panel-label">
          <span>{t(`Đã chọn ${chosen.length} tài sản`)}</span>
          <span
            className="fl-feedback"
            data-visible={Boolean(done)}
            aria-hidden={!done}
          >
            {renderIcon("check", 14)} Minh họa
          </span>
        </div>
        <button
          type="button"
          className="fl-primary"
          aria-disabled={!chosen.length}
          data-hint={demo.automatic && demo.frame.phase === "hint"}
          data-pressed={
            pressed || (demo.automatic && demo.frame.phase === "pressed")
          }
          onClick={act}
        >
          {renderIcon(done ? "check" : "layers", 17)}Thao tác hàng loạt
        </button>
      </div>
    </div>
  )
}

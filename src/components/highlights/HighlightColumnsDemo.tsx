import { useEffect, useRef, useState } from "react"
import { highlightColumns } from "./highlightDemoData"
import type { HighlightDemoProps } from "./types"

export default function HighlightColumnsDemo({
  demo,
  renderIcon,
}: HighlightDemoProps) {
  const [checked, setChecked] = useState([0, 1, 2, 3])
  const [reordered, setReordered] = useState(false)
  const [moving, setMoving] = useState(false)
  const [complete, setComplete] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => {
    clear()
    setChecked([0, 1, 2, 3])
    setReordered(false)
    setMoving(false)
    setComplete(false)
  }, [demo.resetKey])
  useEffect(() => clear, [])
  const chosen = demo.automatic
    ? [
        0,
        1,
        2,
        3,
        ...(demo.frame.manager ? [4] : []),
        ...(demo.frame.notes ? [5] : []),
      ]
    : checked
  const order = demo.automatic ? Boolean(demo.frame.reorder) : reordered
  const changing = demo.automatic ? Boolean(demo.frame.moving) : moving
  const done = demo.automatic ? Boolean(demo.frame.complete) : complete
  const take = () => {
    if (!demo.manual) {
      setChecked(chosen)
      setReordered(order)
      setMoving(false)
      setComplete(done)
    }
    demo.takeControl()
  }
  const move = () => {
    clear()
    if (demo.reduced) {
      setReordered(!order)
      setMoving(false)
      setComplete(true)
      return
    }
    setMoving(true)
    setComplete(false)
    timers.current = [
      setTimeout(() => setReordered(!order), 180),
      setTimeout(() => {
        setMoving(false)
        setComplete(true)
      }, 430),
    ]
  }
  return (
    <div
      className="fl-demo fl-columns"
      onFocusCapture={take}
      onPointerDownCapture={take}
      data-reordered={order}
      data-moving={changing}
    >
      <div className="fl-column-heading">
        <strong>Hiển thị cột</strong>
        {renderIcon("grid", 17)}
      </div>
      <div className="fl-column-list">
        {highlightColumns.map((label, i) => (
          <div
            className={`fl-column-row fl-column-${i}`}
            key={label}
            data-highlight={
              demo.automatic &&
              ((i === 4 && demo.frame.phase === "manager") ||
                (i === 5 && demo.frame.phase === "notes") ||
                (i === 3 && demo.frame.phase === "reorder"))
            }
          >
            <span className="fl-grip" aria-hidden="true">
              ⠿
            </span>
            <label>
              <input
                type="checkbox"
                checked={chosen.includes(i)}
                onChange={() => {
                  setChecked(
                    chosen.includes(i)
                      ? chosen.filter((n) => n !== i)
                      : [...chosen, i],
                  )
                  setComplete(true)
                }}
              />
              {label}
            </label>
            {i === 3 ? (
              <button
                type="button"
                className="fl-move"
                aria-label={
                  order
                    ? "Chuyển Cập nhật xuống một vị trí (minh họa)"
                    : "Chuyển Cập nhật lên một vị trí (minh họa)"
                }
                onClick={move}
              >
                {order ? "↓" : "↑"}
              </button>
            ) : (
              <span className="fl-row-end" aria-hidden="true">
                ≡
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="fl-column-feedback">
        <span className="fl-feedback" data-visible={done} aria-hidden={!done}>
          {renderIcon("check", 14)}Đã cập nhật hiển thị
        </span>
      </div>
    </div>
  )
}

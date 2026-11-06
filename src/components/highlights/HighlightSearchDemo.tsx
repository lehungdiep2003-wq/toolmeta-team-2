import { t } from "../../i18n/translate"
import { useEffect, useState } from "react"
import { highlightSamples } from "./highlightDemoData"
import type { HighlightDemoProps } from "./types"

export default function HighlightSearchDemo({
  demo,
  renderIcon,
}: HighlightDemoProps) {
  const [query, setQuery] = useState("")
  const [kind, setKind] = useState("ALL")
  const [filters, setFilters] = useState<string[]>(["active", "review"])
  useEffect(() => {
    setQuery("")
    setKind("ALL")
    setFilters(["active", "review"])
  }, [demo.resetKey])
  const q = demo.automatic ? "BM".slice(0, demo.frame.characters ?? 0) : query
  const type = demo.automatic ? (demo.frame.typeActive ? "BM" : "ALL") : kind
  const selected = demo.automatic
    ? ["active", "review"].slice(0, demo.frame.filters ?? 0)
    : filters
  const take = () => {
    if (!demo.manual) {
      setQuery(q)
      setKind(type)
      setFilters(selected)
    }
    demo.takeControl()
  }
  const matches = highlightSamples.filter(
    (row) =>
      (type === "ALL" || row.kind === type) &&
      `${row.name} ${row.kind}`.toLowerCase().includes(q.toLowerCase()) &&
      (!selected.length || selected.includes(row.status)),
  ).length
  return (
    <div
      className="fl-demo fl-search"
      data-phase={demo.automatic ? demo.frame.phase : "manual"}
      onFocusCapture={take}
      onPointerDownCapture={take}
    >
      <label className="fl-search-field">
        {renderIcon("search", 17)}
        <input
          aria-label="Tìm kiếm tài sản mẫu"
          placeholder="Tìm kiếm tài sản…"
          value={q}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span aria-hidden="true">⌕</span>
      </label>
      <div className="fl-filters">
        <button
          type="button"
          aria-pressed={selected.length > 0}
          onClick={() =>
            setFilters(selected.length ? [] : ["active", "review"])
          }
        >
          Trạng thái <span aria-hidden="true">⌄</span>
        </button>
        <label data-selected={type !== "ALL"}>
          <span className="fl-sr">Loại tài sản</span>
          <select
            aria-label="Loại tài sản mẫu"
            value={type}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="ALL">Loại tài sản</option>
            <option>AD</option>
            <option>BM</option>
            <option>PAGE</option>
          </select>
        </label>
      </div>
      <div className="fl-panel-label">
        <span>Điều kiện lọc</span>
        <span className="fl-count">Đã chọn ({selected.length})</span>
      </div>
      <div className="fl-condition-list">
        {(["active", "review"] as const).map((status, i) => (
          <label
            className="fl-condition"
            key={status}
            data-selected={selected.includes(status)}
          >
            <input
              type="checkbox"
              checked={selected.includes(status)}
              onChange={() =>
                setFilters(
                  selected.includes(status)
                    ? selected.filter((s) => s !== status)
                    : [...selected, status],
                )
              }
            />
            <span>{i === 0 ? "Hoạt động" : "Đang xem xét"}</span>
            <small>
              {highlightSamples.filter((row) => row.status === status).length}
            </small>
          </label>
        ))}
      </div>
      <div
        className="fl-result"
        data-complete={demo.automatic && demo.frame.phase === "result"}
      >
        <span>{t(`${matches} mẫu phù hợp`)}</span>
        <small>Dữ liệu mẫu</small>
      </div>
    </div>
  )
}

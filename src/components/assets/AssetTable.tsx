import { useId, useEffect, useRef, type ReactNode } from "react"
import {
  assetTableConfig,
  sampleAssets,
  type AssetDemoFrame,
  type AssetKind,
  type AssetStatus,
} from "./assetShowcaseData"

export type AssetTableIcon = "search" | "check"
export type RenderAssetIcon = (name: AssetTableIcon, size?: number) => ReactNode
interface Props {
  kind: AssetKind
  frame: AssetDemoFrame
  automatic: boolean
  manual?: boolean
  query: string
  status: AssetStatus
  selected: readonly number[]
  onQuery: (query: string) => void
  onStatus: (status: AssetStatus) => void
  onSelect: (selected: number[]) => void
  renderIcon: RenderAssetIcon
}
function Missing() {
  return (
    <span className="as-missing" aria-label="Chưa có dữ liệu mẫu">
      —
    </span>
  )
}

export default function AssetTable({
  kind,
  frame,
  automatic,
  manual = false,
  query,
  status,
  selected,
  onQuery,
  onStatus,
  onSelect,
  renderIcon,
}: Props) {
  const id = useId()
  const all = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (all.current)
      all.current.indeterminate =
        selected.length > 0 && selected.length < sampleAssets.length
  }, [selected.length])
  const config = assetTableConfig[kind]
  return (
    <div
      className="as-table-panel"
      data-kind={kind}
      data-phase={automatic ? frame.phase : manual ? "manual" : "idle"}
    >
      <div className="as-table-toolbar">
        <div className="as-table-title">
          <span className="as-code">{kind}</span>
          <div>
            <h4 id={id}>{config.title}</h4>
            <small>Dữ liệu mẫu minh hoạ</small>
          </div>
        </div>
        <div className="as-table-tools">
          <label
            className="as-search"
            data-focused={
              automatic && (frame.phase === "focus" || frame.phase === "typing")
            }
          >
            {renderIcon("search", 16)}
            <input
              type="search"
              aria-label={`Tìm kiếm ${kind} trong dữ liệu minh họa`}
              placeholder={config.placeholder}
              value={query}
              onChange={(e) => onQuery(e.target.value)}
            />
          </label>
          <label
            className="as-filter"
            data-active={
              status !== "all" || (automatic && frame.phase === "filter")
            }
          >
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M4 4h16l-6 7v8l-4-2v-6Z" />
            </svg>
            <select
              aria-label={`Bộ lọc trạng thái ${kind}`}
              value={status}
              onChange={(e) => onStatus(e.target.value as AssetStatus)}
            >
              <option value="all">Bộ lọc</option>
              <option value="active">Hoạt động</option>
              <option value="review">Đang xem xét</option>
            </select>
          </label>
        </div>
      </div>
      <div
        className="as-table-scroll"
        role="region"
        aria-label={`Bảng ${kind} minh họa, có thể cuộn ngang`}
        tabIndex={0}
      >
        <table aria-labelledby={id}>
          <colgroup>
            <col className="as-col-check" />
            <col className="as-col-name" />
            <col className="as-col-status" />
            {kind === "AD" ? (
              <>
                <col className="as-col-detail" />
                <col className="as-col-detail" />
              </>
            ) : (
              <>
                <col className="as-col-role" />
                {kind === "BM" && <col className="as-col-company" />}
              </>
            )}
            <col className="as-col-update" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">
                <label className="as-checkbox-hit">
                  <input
                    ref={all}
                    type="checkbox"
                    checked={selected.length === sampleAssets.length}
                    aria-label={`Chọn tất cả ${kind} minh họa`}
                    onChange={() =>
                      onSelect(
                        selected.length === sampleAssets.length
                          ? []
                          : [0, 1, 2],
                      )
                    }
                  />
                </label>
              </th>
              <th scope="col">{config.name}</th>
              <th scope="col">Trạng thái</th>
              {kind === "AD" ? (
                <>
                  <th scope="col">Số dư</th>
                  <th scope="col">Chi tiêu</th>
                </>
              ) : (
                <>
                  <th scope="col">{kind === "BM" ? "Vai trò" : "Quyền"}</th>
                  {kind === "BM" && <th scope="col">Công ty</th>}
                </>
              )}
              <th scope="col">Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {sampleAssets.map((row, i) => {
              const searchMatch =
                row.name.toLowerCase().includes(query.trim().toLowerCase()) ||
                (kind === "AD" && (row.maskedId ?? "").includes(query.trim()))
              const match =
                searchMatch && (status === "all" || status === row.status)
              const muted = !match && (!automatic || !!frame.dim)
              const target = i === config.target
              return (
                <tr
                  key={row.name}
                  data-muted={muted}
                  data-highlight={automatic && target && frame.highlight}
                  data-selected={selected.includes(i)}
                >
                  <td>
                    <label className="as-checkbox-hit">
                      <input
                        type="checkbox"
                        checked={selected.includes(i)}
                        aria-label={`Chọn ${row.name} (${kind}) minh họa`}
                        onChange={() =>
                          onSelect(
                            selected.includes(i)
                              ? selected.filter((item) => item !== i)
                              : [...selected, i],
                          )
                        }
                      />
                    </label>
                  </td>
                  <th scope="row">
                    <div className="as-identity">
                      <i
                        className={`as-avatar as-avatar-${i}`}
                        aria-hidden="true"
                      />
                      <span>
                        <b>{row.name}</b>
                        <small>
                          {kind === "AD" ? (
                            <>ID: {row.maskedId}</>
                          ) : (
                            <>
                              {kind === "BM" ? "BM ID" : "ID"}: <Missing />
                            </>
                          )}
                        </small>
                      </span>
                    </div>
                  </th>
                  <td data-emphasis={automatic && target && frame.status}>
                    <span className={`as-status as-status-${row.status}`}>
                      <i aria-hidden="true" />
                      {row.status === "active" ? "Hoạt động" : "Đang xem xét"}
                    </span>
                  </td>
                  {kind === "AD" ? (
                    <>
                      <td>
                        <Missing />
                      </td>
                      <td>
                        <Missing />
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        className="as-role-cell"
                        data-emphasis={automatic && target && frame.details}
                      >
                        {row.role}
                      </td>
                      {kind === "BM" && (
                        <td>
                          <Missing />
                        </td>
                      )}
                    </>
                  )}
                  <td className="as-updated">{row.updated}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="as-table-note">
        <span>Dữ liệu mẫu minh hoạ · Ô “—” chưa có dữ liệu mẫu.</span>
        <span className="as-scroll-hint">Cuộn ngang trong bảng →</span>
      </div>
    </div>
  )
}

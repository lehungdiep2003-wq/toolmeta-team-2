import { useEffect, useId, useState } from "react"
import useDemoTimeline from "./useDemoTimeline"
import { demoPeriods, searchKeywords, searchSteps } from "./demoTimelines"
import { useBenefitCard } from "./BenefitDemoCard"
import {
  benefitAssets,
  benefitAssetIcons,
  type BenefitAsset,
  type RenderBenefitIcon,
} from "./types"

type AssetFilter = "ALL" | BenefitAsset
type StatusFilter = "all" | "active" | "review"
interface Props {
  renderIcon: RenderBenefitIcon
  query?: string
  assetType?: AssetFilter
  status?: StatusFilter
  onQueryChange?: (value: string) => void
  onAssetTypeChange?: (value: AssetFilter) => void
  onStatusChange?: (value: StatusFilter) => void
}

/** Local control states only; Round 2 can drive the same props with a demo timeline. */
export default function BenefitSearchDemo(props: Props) {
  const id = useId()
  const [localQuery, setQuery] = useState("")
  const [localType, setType] = useState<AssetFilter>("ALL")
  const [localStatus, setStatus] = useState<StatusFilter>("active")
  const [manual, setManual] = useState(false)
  const card = useBenefitCard()
  useEffect(() => {
    setManual(false)
    setQuery("")
    setType("ALL")
    setStatus("active")
  }, [card.resetKey])
  const controlled =
    props.query !== undefined ||
    props.assetType !== undefined ||
    props.status !== undefined
  const { frame, reduced, started, cycle } = useDemoTimeline(
    searchSteps,
    demoPeriods.search,
    0,
    manual || controlled,
  )
  const automatic = !manual && !controlled && !reduced && started
  const keyword = searchKeywords[cycle % searchKeywords.length]
  const selected =
    props.assetType ??
    (automatic ? (frame.filtered ? keyword : "ALL") : localType)
  const query =
    props.query ?? (automatic ? keyword.slice(0, frame.characters) : localQuery)
  const takeControl = () => {
    if (!manual) {
      setQuery(query)
      setType(selected)
      setManual(true)
    }
  }
  return (
    <div
      className="bnf-search-demo"
      role="group"
      aria-label="Minh họa tìm kiếm và lọc tài sản"
      data-asset-type={selected}
      data-phase={automatic ? frame.phase : manual ? "manual" : "idle"}
      data-demo-state={
        manual
          ? "manual"
          : automatic
            ? frame.phase === "reset" || frame.phase === "clear"
              ? "reset"
              : frame.phase === "result"
                ? "completed"
                : "demo"
            : "idle"
      }
      onFocusCapture={takeControl}
    >
      <label className="bnf-search-field">
        {props.renderIcon("search", 19)}
        <input
          type="search"
          aria-label="Tìm kiếm tài sản"
          placeholder="Tìm kiếm tài sản"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            props.onQueryChange?.(e.target.value)
          }}
        />
      </label>
      <div className="bnf-search-controls">
        <div
          className="bnf-filter-options"
          role="group"
          aria-label="Loại tài sản"
        >
          {(["ALL", ...benefitAssets] as AssetFilter[]).map((asset) => (
            <button
              type="button"
              key={asset}
              aria-pressed={selected === asset}
              onClick={() => {
                setType(asset)
                props.onAssetTypeChange?.(asset)
              }}
            >
              {asset !== "ALL" &&
                props.renderIcon(benefitAssetIcons[asset], 15)}
              {asset === "ALL" ? "Tất cả" : asset}
            </button>
          ))}
        </div>
        <label className="bnf-status-control" htmlFor={id}>
          <i aria-hidden="true" />
          <select
            id={id}
            aria-label="Trạng thái tài sản"
            value={props.status ?? localStatus}
            onChange={(e) => {
              const value = e.target.value as StatusFilter
              setStatus(value)
              props.onStatusChange?.(value)
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="review">Đang xem xét</option>
          </select>
          <svg
            viewBox="0 0 16 16"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </label>
      </div>
      <div
        className="bnf-search-result"
        data-visible={automatic && frame.phase === "result"}
        aria-hidden="true"
      >
        {props.renderIcon(benefitAssetIcons[keyword], 13)}
        <b>{keyword}</b>
        <span>Hoạt động · Minh họa</span>
        {props.renderIcon("check", 12)}
      </div>
    </div>
  )
}

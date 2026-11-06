import { useEffect, useRef, useState, type ReactNode } from "react"
import AssetTable, { type RenderAssetIcon } from "./AssetTable"
import useAssetAutoplay from "./useAssetAutoplay"
import {
  assetDemoPresentation,
  type AssetKind,
  type AssetStatus,
} from "./assetShowcaseData"
import "./assetShowcase.css"

export default function AssetShowcase({
  kind,
  index,
  children,
  renderIcon,
}: {
  kind: AssetKind
  index: number
  children: ReactNode
  renderIcon: RenderAssetIcon
}) {
  const ref = useRef<HTMLElement>(null)
  const demo = useAssetAutoplay(ref, kind, index)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<AssetStatus>("all")
  const [selected, setSelected] = useState<number[]>([])
  useEffect(() => {
    setQuery("")
    setStatus("all")
    setSelected([])
  }, [demo.resetKey])
  const presentation = assetDemoPresentation(kind, demo.frame)
  const visibleQuery = demo.automatic ? presentation.query : query
  const visibleStatus = demo.automatic ? presentation.status : status
  const visibleSelection = demo.automatic ? presentation.selected : selected
  const takeControl = () => {
    if (!demo.manual) {
      setQuery(visibleQuery)
      setStatus(visibleStatus)
      setSelected([...visibleSelection])
    }
    demo.takeControl()
  }
  return (
    <article
      ref={ref}
      className="group-card as-card"
      data-asset-kind={kind}
      data-motion-state={
        demo.reduced ? "reduced" : demo.running ? "running" : "paused"
      }
      onFocusCapture={() => {
        takeControl()
        demo.focusIn()
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) demo.focusOut()
      }}
      onPointerDownCapture={takeControl}
      onInputCapture={takeControl}
      onKeyDownCapture={takeControl}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") demo.pointerEnter()
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") demo.pointerLeave()
      }}
    >
      <div className="as-decoration" aria-hidden="true">
        <div className="as-decor-glow" />
        <svg
          className="as-orbit"
          viewBox="0 0 1000 400"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M390 -45C180 90 255 235 740 390S1110 240 980 80" />
          <path
            className="as-orbit-flow"
            d="M310 -20C180 170 650 100 1070 340"
          />
        </svg>
        <i className="as-particle as-particle-a" />
        <i className="as-particle as-particle-b" />
        <i className="as-particle as-particle-c" />
      </div>
      {children}
      <div className="group-visual as-visual">
        <AssetTable
          kind={kind}
          frame={demo.frame}
          automatic={demo.automatic}
          manual={demo.manual}
          query={visibleQuery}
          status={visibleStatus}
          selected={visibleSelection}
          onQuery={setQuery}
          onStatus={setStatus}
          onSelect={setSelected}
          renderIcon={renderIcon}
        />
      </div>
      <span className="group-index">0{index + 1}</span>
    </article>
  )
}

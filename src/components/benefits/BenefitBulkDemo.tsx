import { t } from "../../i18n/translate"
import { useEffect, useRef, useState } from "react"
import useDemoTimeline from "./useDemoTimeline"
import { bulkSteps, demoPeriods, type BulkFrame } from "./demoTimelines"
import { useBenefitCard } from "./BenefitDemoCard"
import {
  benefitAssets,
  benefitAssetIcons,
  type BenefitAsset,
  type RenderBenefitIcon,
} from "./types"

interface Props {
  renderIcon: RenderBenefitIcon
  selected?: readonly BenefitAsset[]
  phase?: BulkFrame["phase"]
  onAction?: () => void
}

/** Controlled selection/phase are ready for a later simulation; no business operation. */
export default function BenefitBulkDemo({
  renderIcon,
  selected,
  phase,
  onAction,
}: Props) {
  const [manual, setManual] = useState(false)
  const [manualSelection, setManualSelection] =
    useState<readonly BenefitAsset[]>(benefitAssets)
  const [manualPhase, setManualPhase] = useState<BulkFrame["phase"]>("selected")
  const completion = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )
  useEffect(() => () => clearTimeout(completion.current), [])
  const card = useBenefitCard()
  useEffect(() => {
    clearTimeout(completion.current)
    setManual(false)
    setManualSelection(benefitAssets)
    setManualPhase("selected")
  }, [card.resetKey])
  const controlled = selected !== undefined || phase !== undefined
  const { frame, started, reduced } = useDemoTimeline(
    bulkSteps,
    demoPeriods.bulk,
    0,
    manual || controlled,
  )
  const automatic = !manual && !controlled && !reduced && started
  const chosen =
    selected ??
    (automatic
      ? benefitAssets.slice(0, frame.count)
      : manual
        ? manualSelection
        : benefitAssets)
  const currentPhase =
    phase ?? (automatic ? frame.phase : manual ? manualPhase : "selected")
  const takeControl = () => {
    if (!manual) {
      setManualSelection(chosen)
      setManualPhase("selected")
      setManual(true)
    }
  }
  const act = () => {
    if (chosen.length === 0) return
    takeControl()
    onAction?.()
    setManualPhase("pressed")
    clearTimeout(completion.current)
    completion.current = setTimeout(
      () => setManualPhase("complete"),
      reduced ? 0 : 250,
    )
  }
  return (
    <div
      className="bnf-bulk-demo"
      data-phase={currentPhase}
      data-demo-state={
        manual
          ? "manual"
          : automatic
            ? currentPhase === "complete"
              ? "completed"
              : currentPhase === "reset"
                ? "reset"
                : "demo"
            : "idle"
      }
      onFocusCapture={takeControl}
    >
      <div
        className="bnf-selection"
        aria-label={`${chosen.length} tài sản đã chọn`}
      >
        {benefitAssets.map((asset) => (
          <button
            type="button"
            key={asset}
            className="bnf-selected-asset"
            data-selected={chosen.includes(asset)}
            aria-label={`Chọn ${asset} trong minh họa`}
            aria-pressed={chosen.includes(asset)}
            onClick={() => {
              clearTimeout(completion.current)
              takeControl()
              setManualSelection(
                chosen.includes(asset)
                  ? chosen.filter((item) => item !== asset)
                  : benefitAssets.filter(
                      (item) => item === asset || chosen.includes(item),
                    ),
              )
              setManualPhase("selected")
            }}
            disabled={controlled}
            title={asset}
          >
            {renderIcon(benefitAssetIcons[asset], 20)}
            <i aria-hidden="true">{renderIcon("check", 10)}</i>
          </button>
        ))}
      </div>
      <div className="bnf-bulk-bar">
        <span>
          <b>{t(`Đã chọn ${chosen.length} tài sản`)}</b>
          <small>AD · BM · PAGE</small>
        </span>
        <button
          type="button"
          onClick={act}
          aria-disabled={chosen.length === 0}
          aria-label="Thao tác hàng loạt — minh họa"
        >
          {renderIcon(currentPhase === "complete" ? "check" : "layers", 16)}Thao
          tác<span aria-hidden="true">⌄</span>
        </button>
      </div>
    </div>
  )
}

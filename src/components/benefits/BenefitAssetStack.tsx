import {
  benefitAssets,
  benefitAssetIcons,
  type RenderBenefitIcon,
} from "./types"
import useDemoTimeline from "./useDemoTimeline"
import { assetSteps, demoPeriods } from "./demoTimelines"

export default function BenefitAssetStack({
  renderIcon,
}: {
  renderIcon: RenderBenefitIcon
}) {
  const { frame, started, reduced } = useDemoTimeline(
    assetSteps,
    demoPeriods.assets,
    0,
  )
  const phase = started && !reduced ? frame.phase : "idle"
  const completed = phase === "highlight" || phase === "glow"
  return (
    <div
      className="bnf-asset-scene"
      role="img"
      aria-label="AD, BM và PAGE được tập trung trong cùng một không gian quản lý"
      data-autoplay="true"
      data-phase={phase}
      data-demo-state={
        phase === "idle"
          ? "idle"
          : phase === "reset"
            ? "reset"
            : completed
              ? "completed"
              : "demo"
      }
    >
      <div className="bnf-asset-glow" />
      <div className="bnf-asset-orbit" />
      {benefitAssets.map((asset) => (
        <div
          className={`bnf-asset-motion bnf-float-${asset.toLowerCase()}`}
          key={asset}
          data-active={phase === asset.toLowerCase()}
          data-highlight={completed}
        >
          <div
            className={`bnf-asset-card bnf-asset-${asset.toLowerCase()}`}
            data-asset={asset}
          >
            <span className="bnf-asset-symbol">
              {renderIcon(benefitAssetIcons[asset], 27)}
            </span>
            <span className="bnf-asset-label">
              <b>{asset}</b>
              <small>
                {asset === "AD"
                  ? "Tài khoản quảng cáo"
                  : asset === "BM"
                    ? "Business Manager"
                    : "Fanpage / Page"}
              </small>
            </span>
            <div className="bnf-asset-track">
              <span />
            </div>
          </div>
        </div>
      ))}
      <i className="bnf-scene-orb" />
      <i className="bnf-scene-spark" />
    </div>
  )
}

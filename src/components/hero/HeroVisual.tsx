import { useId, useRef } from "react"
import HeroSvgResources from "./HeroSvgResources"
import HeroDefinitions from "./HeroDefinitions"
import HeroBackground from "./HeroBackground"
import AssetCard from "./AssetCard"
import NotificationCard from "./NotificationCard"
import HeroCore from "./HeroCore"
import ShieldIcon from "./ShieldIcon"
import AnalyticsPanel from "./AnalyticsPanel"
import NeonCursor from "./NeonCursor"
import HeroForeground from "./HeroForeground"
import HeroCaption from "./HeroCaption"
import {
  heroMobileLayers,
  heroViewBoxes,
  heroVisualAssets,
} from "./heroVisual.config"
import useHeroMobileLayout from "./useHeroMobileLayout"
import useHeroMotionActivity from "./useHeroMotionActivity"
import useHeroInteraction from "./useHeroInteraction"
import type { HeroLayerName, HeroPresentation, HeroVisualAssets } from "./types"
import "./heroVisual.css"

export interface HeroVisualProps {
  layers?: Partial<Record<HeroLayerName, HeroPresentation>>
  assets?: Partial<HeroVisualAssets>
  decorative?: boolean
  title?: string
  description?: string
  caption?: string
}

export default function HeroVisual({
  layers,
  assets,
  decorative = false,
  title = "Hệ sinh thái quản lý tài sản Toolmeta",
  description = "Logo T chính thức trên khối xanh nổi, các thẻ tài khoản quảng cáo, Business Manager, Fanpage và bảng biểu đồ. Dữ liệu minh họa.",
  caption,
}: HeroVisualProps) {
  const id = useId()
  const mobile = useHeroMobileLayout()
  const ref = useRef<SVGSVGElement>(null)
  useHeroMotionActivity(ref, mobile ? 560 : 900)
  useHeroInteraction(ref, mobile)
  const layer = (name: HeroLayerName) => ({
    presentation: {
      ...(mobile ? heroMobileLayers[name] : {}),
      ...layers?.[name],
    },
    image: assets?.layers?.[name] ?? heroVisualAssets.layers[name],
  })
  return (
    <svg
      className="hero-scene"
      ref={ref}
      width={mobile ? 560 : 900}
      height={mobile ? 760 : 650}
      focusable="false"
      viewBox={mobile ? heroViewBoxes.mobile : heroViewBoxes.desktop}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-labelledby={decorative ? undefined : `${id}-title`}
      aria-describedby={decorative ? undefined : `${id}-description`}
    >
      {!decorative && (
        <>
          <title id={`${id}-title`}>{title}</title>
          <desc id={`${id}-description`}>{description}</desc>
        </>
      )}
      <HeroSvgResources>
        <HeroDefinitions />
        {/* Preserve SVG painter order: rear layers first, foreground last. */}
        <HeroBackground {...layer("background")} />
        <AssetCard variant="AD" {...layer("ad")} />
        <AssetCard variant="BM" {...layer("bm")} />
        <AssetCard variant="PAGE" {...layer("page")} />
        <NotificationCard {...layer("notification")} />
        <HeroCore
          {...layer("core")}
          logoSrc={assets?.logo ?? heroVisualAssets.logo}
        />
        <ShieldIcon {...layer("shield")} />
        <AnalyticsPanel {...layer("analytics")} />
        <g className="hero-cursor-travel" pointerEvents="none">
          <circle
            className="hero-cursor-ring"
            r="6"
            fill="none"
            stroke="#4391f5"
            strokeWidth="2"
            opacity="0"
          />
          <g className="hero-cursor-press">
            <NeonCursor {...layer("cursor")} />
          </g>
        </g>
        <HeroForeground {...layer("foreground")} />
        <HeroCaption {...layer("caption")} text={caption} />
      </HeroSvgResources>
    </svg>
  )
}

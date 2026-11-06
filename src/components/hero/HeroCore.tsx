import HeroLayer from "./HeroLayer"
import { heroVisualLayers, heroVisualAssets } from "./heroVisual.config"
import { useHeroSvgIds } from "./HeroSvgResources"
import type { HeroLayerProps } from "./types"

export interface HeroCoreProps extends HeroLayerProps {
  logoSrc?: string
}

export default function HeroCore({
  presentation,
  image = heroVisualAssets.layers.core,
  logoSrc = heroVisualAssets.logo,
}: HeroCoreProps) {
  const ids = useHeroSvgIds()

  return (
    <HeroLayer
      name="core"
      defaults={heroVisualLayers.core}
      presentation={presentation}
      image={image}
      bounds={[0, 0, 217, 214]}
      filter={`url(#${ids.coreShadow})`}
    >
      <rect
        x="18"
        y="12"
        width="199"
        height="202"
        rx="49"
        fill={`url(#${ids.coreSide})`}
        stroke="#17284e"
        strokeWidth=".8"
      />
      <rect
        width="195"
        height="200"
        rx="48"
        fill={`url(#${ids.coreFace})`}
        data-hero-surface="core"
        stroke={`url(#${ids.coreRim})`}
        strokeWidth="1.4"
      />
      <rect
        x="6"
        y="6"
        width="183"
        height="188"
        rx="44"
        fill={`url(#${ids.coreShine})`}
      />
      <rect
        x="2"
        y="2"
        width="191"
        height="196"
        rx="47"
        fill={`url(#${ids.coreInnerShade})`}
      />
      <path
        d="M22 35C31 12 55 8 87 8h47"
        stroke="#bdccec"
        strokeOpacity=".26"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M66 196h77c26 0 43-15 46-39"
        stroke="#00081d"
        strokeOpacity=".35"
        strokeWidth="1.4"
        fill="none"
      />
      <image
        href={logoSrc}
        x="13"
        y="6"
        width="164"
        height="180"
        preserveAspectRatio="xMidYMid meet"
      />
    </HeroLayer>
  )
}

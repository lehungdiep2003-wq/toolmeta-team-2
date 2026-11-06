import HeroLayer from "./HeroLayer"
import { heroVisualLayers, heroVisualAssets } from "./heroVisual.config"
import { useHeroSvgIds } from "./HeroSvgResources"
import type { HeroLayerProps } from "./types"

export interface ShieldIconProps extends HeroLayerProps {}

export default function ShieldIcon({
  presentation,
  image = heroVisualAssets.layers.shield,
}: ShieldIconProps) {
  const ids = useHeroSvgIds()

  return (
    <HeroLayer
      name="shield"
      defaults={heroVisualLayers.shield}
      presentation={presentation}
      image={image}
      bounds={[0, 0, 77, 77]}
    >
      <rect
        width="77"
        height="77"
        rx="17"
        fill="white"
        fillOpacity=".98"
        stroke="#e2e5ec"
        strokeWidth=".8"
        filter={`url(#${ids.shieldShadow})`}
      />
      <path d="M17 1h43" stroke="white" strokeWidth="1.2" />
      <path
        d="m38 14 21 9-3 23c-2 10-12 18-18 20-8-4-16-10-18-20l-3-23Z"
        fill="#235bc8"
      />
      <path
        d="m28 39 7 7 15-18"
        fill="none"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </HeroLayer>
  )
}

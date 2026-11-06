import HeroLayer from "./HeroLayer"
import { heroVisualLayers, heroVisualAssets } from "./heroVisual.config"
import { useHeroSvgIds } from "./HeroSvgResources"
import type { HeroLayerProps } from "./types"

export interface NeonCursorProps extends HeroLayerProps {}

export default function NeonCursor({
  presentation,
  image = heroVisualAssets.layers.cursor,
}: NeonCursorProps) {
  const ids = useHeroSvgIds()

  return (
    <HeroLayer
      name="cursor"
      defaults={heroVisualLayers.cursor}
      presentation={presentation}
      image={image}
      bounds={[-5, 3, 82, 82]}
      filter={`url(#${ids.smallShadow})`}
    >
      <path
        d="m-5 3 78 40-32 7-14 29Z"
        fill="#0d479e"
        transform="translate(4 6)"
      />
      <path
        d="m-5 3 78 40-34 5-12 31Z"
        fill={`url(#${ids.cursorFace})`}
        stroke="#61a3f7"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m1 9 61 31"
        fill="none"
        stroke="#c0dbfc"
        strokeOpacity=".6"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path d="m-4 4 43 44-12 31" fill="#0d61d5" />
      <path
        d="m39 48 12 20"
        stroke="#0d3e8a"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </HeroLayer>
  )
}

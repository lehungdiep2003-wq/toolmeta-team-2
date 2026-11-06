import HeroLayer from "./HeroLayer"
import { heroVisualLayers, heroVisualAssets } from "./heroVisual.config"
import type { HeroLayerProps } from "./types"

export default function HeroCaption({
  presentation,
  image = heroVisualAssets.layers.caption,
  text = "GIAO DIỆN & DỮ LIỆU MINH HỌA",
}: HeroLayerProps & { text?: string }) {
  return (
    <HeroLayer
      name="caption"
      defaults={heroVisualLayers.caption}
      presentation={presentation}
      image={image}
      bounds={[250, 610, 400, 18]}
    >
      <text
        x="450"
        y="622"
        textAnchor="middle"
        fontSize="10"
        fill="#697285"
        letterSpacing=".5"
      >
        {text}
      </text>
    </HeroLayer>
  )
}

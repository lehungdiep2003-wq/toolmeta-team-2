import HeroLayer from "./HeroLayer"
import { heroVisualLayers, heroVisualAssets } from "./heroVisual.config"
import type { HeroLayerProps } from "./types"

export interface HeroForegroundProps extends HeroLayerProps {}

export default function HeroForeground({
  presentation,
  image = heroVisualAssets.layers.foreground,
}: HeroForegroundProps) {
  return (
    <HeroLayer
      name="foreground"
      defaults={heroVisualLayers.foreground}
      presentation={presentation}
      image={image}
      bounds={[0, 0, 900, 650]}
    >
      <g fill="white" opacity=".45">
        <circle cx="612" cy="612" r="10" />
        <circle cx="590" cy="564" r="4" />
        <circle cx="262" cy="207" r="3" />
        <circle cx="510" cy="150" r="3" />
      </g>
    </HeroLayer>
  )
}

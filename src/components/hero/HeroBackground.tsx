import HeroLayer from "./HeroLayer"
import type { CSSProperties } from "react"
import { heroVisualLayers, heroVisualAssets } from "./heroVisual.config"
import { useHeroSvgIds } from "./HeroSvgResources"
import type { HeroLayerProps } from "./types"

export interface HeroBackgroundProps extends HeroLayerProps {}

export default function HeroBackground({
  presentation,
  image = heroVisualAssets.layers.background,
}: HeroBackgroundProps) {
  const ids = useHeroSvgIds()

  return (
    <HeroLayer
      name="background"
      defaults={heroVisualLayers.background}
      presentation={presentation}
      image={image}
      bounds={[0, 0, 900, 650]}
    >
      <g className="hero-glow-motion">
        <ellipse
          cx="453"
          cy="330"
          rx="320"
          ry="265"
          fill={`url(#${ids.ambient})`}
          filter={`url(#${ids.ambientBlur})`}
        />
        <ellipse
          cx="435"
          cy="348"
          rx="160"
          ry="180"
          fill={`url(#${ids.ambient})`}
          opacity=".26"
        />
      </g>
      <g fill="none" strokeWidth="1">
        <ellipse
          cx="424"
          cy="328"
          rx="202"
          ry="285"
          transform="rotate(28 424 328)"
          fill="#92bcf9"
          fillOpacity=".045"
          stroke="#adc7ef"
          strokeOpacity=".44"
        />
        <ellipse
          cx="425"
          cy="328"
          rx="151"
          ry="283"
          transform="rotate(-29 425 328)"
          fill="#a5bfee"
          fillOpacity=".025"
          stroke="white"
          strokeOpacity=".58"
        />
        <ellipse
          cx="422"
          cy="330"
          rx="274"
          ry="183"
          transform="rotate(-26 422 330)"
          stroke="white"
          strokeOpacity=".55"
        />
        <path
          className="hero-orbit-flow"
          d="M176 355C265 230 495 237 637 461S835 618 827 575"
          stroke="white"
          strokeDasharray="3 9"
          strokeLinecap="round"
          opacity=".45"
        />
        <path
          d="M235 182C307 83 489 16 574 108M235 505c59 85 180 137 294 82"
          stroke="#92b4e8"
          strokeOpacity=".4"
        />
      </g>
      <g
        fill="#c2dcfc"
        opacity=".6"
        style={
          {
            "--hero-dot-parent-compensation": 1 / (presentation?.scale ?? 1),
          } as CSSProperties
        }
      >
        <g className="hero-dot-motion hero-dot-soft hero-dot-soft-top">
          <circle data-hero-particle="soft-top" cx="473" cy="133" r="5" />
        </g>
        <g className="hero-dot-motion hero-dot-soft hero-dot-soft-right">
          <circle data-hero-particle="soft-right" cx="564" cy="402" r="9" />
        </g>
        <g className="hero-dot-motion hero-dot-soft hero-dot-soft-lower">
          <circle data-hero-particle="soft-lower" cx="506" cy="455" r="7" />
        </g>
        <g className="hero-dot-motion hero-dot-soft hero-dot-soft-tail">
          <circle data-hero-particle="soft-tail" cx="605" cy="515" r="4" />
        </g>
      </g>
      <g fill={`url(#${ids.orbLight})`} opacity=".9">
        <g className="hero-dot-motion hero-dot-top">
          <circle data-hero-particle="lime-top" cx="391" cy="49" r="10" />
        </g>
        <g className="hero-particle-motion hero-particle-mid">
          <circle data-hero-particle="lime-mid" cx="259" cy="202" r="8" />
        </g>
        <g className="hero-dot-motion hero-dot-left">
          <circle data-hero-particle="lime-left" cx="168" cy="365" r="9" />
        </g>
        <g className="hero-particle-motion hero-particle-near">
          <circle data-hero-particle="lime-near" cx="347" cy="543" r="14" />
        </g>
      </g>
    </HeroLayer>
  )
}

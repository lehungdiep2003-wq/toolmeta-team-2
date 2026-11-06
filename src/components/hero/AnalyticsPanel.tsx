import HeroLayer from "./HeroLayer"
import { heroVisualLayers, heroVisualAssets } from "./heroVisual.config"
import { useHeroSvgIds } from "./HeroSvgResources"
import type { HeroLayerProps } from "./types"

export interface AnalyticsPanelProps extends HeroLayerProps {}

export default function AnalyticsPanel({
  presentation,
  image = heroVisualAssets.layers.analytics,
}: AnalyticsPanelProps) {
  const ids = useHeroSvgIds()

  return (
    <HeroLayer
      name="analytics"
      defaults={heroVisualLayers.analytics}
      presentation={presentation}
      image={image}
      bounds={[0, 0, 258, 336]}
    >
      <rect
        width="250"
        height="326"
        rx="19"
        fill="#dce0e9"
        fillOpacity=".85"
        transform="translate(8 10)"
      />
      <rect
        width="250"
        height="326"
        rx="18"
        data-hero-surface="panel"
        fill={`url(#${ids.panelSurface})`}
        stroke="#e0e4eb"
        strokeWidth="1"
        filter={`url(#${ids.panelShadow})`}
      />
      <path d="M19 1h212" stroke="white" strokeWidth="1.5" />
      <circle cx="20" cy="19" r="5" fill="#ff6259" />
      <circle cx="37" cy="19" r="5" fill="#ffcf28" />
      <circle cx="54" cy="19" r="5" fill="#3269cf" />
      <rect
        x="17"
        y="42"
        width="216"
        height="131"
        rx="9"
        fill="white"
        fillOpacity=".95"
      />
      {[69, 99, 129, 158].map((y) => (
        <path key={y} d={`M26 ${y}h198`} stroke="#e4e7ee" />
      ))}
      <path
        d="M27 111 46 103 66 109 91 96 121 107 156 82 184 83 207 65 225 64V163H27Z"
        fill={`url(#${ids.chartFill})`}
      />
      <path
        d="m27 111 19-8 20 6 25-13 30 11 35-25 28 1 23-18 18-1"
        fill="none"
        stroke="#2f60be"
        strokeWidth="2"
      />
      {[
        [27, 111],
        [46, 103],
        [66, 109],
        [91, 96],
        [121, 107],
        [156, 82],
        [184, 83],
        [207, 65],
        [225, 64],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2.8" fill="#2960c6" />
      ))}
      {[194, 232, 270].map((y, i) => (
        <g key={y}>
          <rect
            x="20"
            y={y}
            width="25"
            height="26"
            rx="5"
            fill={i === 2 ? "#ff9e19" : i === 0 ? "#087aff" : "transparent"}
          />
          <text
            x={i === 1 ? 18 : 28}
            y={y + 21}
            fill={i === 1 ? "#087aff" : "white"}
            fontSize={i === 1 ? 30 : 25}
            fontWeight="700"
            fontFamily="Arial"
          >
            {i === 0 ? "f" : i === 1 ? "∞" : "⚑"}
          </text>
          <rect
            x="55"
            y={y + 3}
            width={106 - i * 9}
            height="7"
            rx="3.5"
            fill="#cfd3dd"
          />
          <rect
            x="55"
            y={y + 17}
            width="77"
            height="5"
            rx="2.5"
            fill="#e0e3ea"
          />
          <rect
            x="192"
            y={y + 8}
            width="29"
            height="9"
            rx="4.5"
            fill="#b0c1df"
          />
        </g>
      ))}
    </HeroLayer>
  )
}

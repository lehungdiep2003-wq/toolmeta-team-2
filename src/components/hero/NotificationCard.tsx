import HeroLayer from "./HeroLayer"
import { heroVisualLayers, heroVisualAssets } from "./heroVisual.config"
import { useHeroSvgIds } from "./HeroSvgResources"
import type { HeroLayerProps } from "./types"

export interface NotificationCardProps extends HeroLayerProps {
  title?: string
  lines?: readonly [string, string]
}

export default function NotificationCard({
  presentation,
  image = heroVisualAssets.layers.notification,
  title = "Cảnh báo kịp thời",
  lines = ["Theo dõi trạng thái", "tài sản trong một nơi"],
}: NotificationCardProps) {
  const ids = useHeroSvgIds()

  return (
    <HeroLayer
      name="notification"
      defaults={heroVisualLayers.notification}
      presentation={presentation}
      image={image}
      bounds={[0, 0, 257, 105]}
    >
      <rect
        width="257"
        height="105"
        rx="22"
        data-hero-surface="card"
        fill={`url(#${ids.cardSurface})`}
        stroke="#e7e9ee"
        strokeWidth=".8"
        filter={`url(#${ids.notificationShadow})`}
      />
      <path d="M22 1h213" stroke="white" strokeOpacity=".9" />
      <rect x="18" y="23" width="52" height="56" rx="13" fill="#1c6fe5" />
      <g fill="white" className="hero-notification-bell">
        <path d="M32 60h25l-4-7V42a9 9 0 0 0-18 0v11Z" />
        <rect x="41" y="29" width="6" height="8" rx="3" />
        <path d="M40 64a5 5 0 0 0 9 0Z" />
      </g>
      <text x="85" y="34" fill="#141f38" fontSize="14" fontWeight="650">
        {title}
      </text>
      <text x="85" y="55" fill="#3a4255" fontSize="12">
        <tspan x="85">{lines[0]}</tspan>
        <tspan x="85" dy="18">
          {lines[1]}
        </tspan>
      </text>
    </HeroLayer>
  )
}

import HeroLayer from "./HeroLayer"
import {
  heroVisualLayers,
  heroVisualAssets,
  assetCardContent,
} from "./heroVisual.config"
import { useHeroSvgIds } from "./HeroSvgResources"
import type { AssetVariant, HeroLayerProps } from "./types"

export interface AssetCardProps extends HeroLayerProps {
  variant: AssetVariant
  title?: string
  value?: string
}

export default function AssetCard({
  variant,
  title = assetCardContent[variant].title,
  value = assetCardContent[variant].value,
  presentation,
  image,
}: AssetCardProps) {
  const ids = useHeroSvgIds()
  const name = variant === "AD" ? "ad" : variant === "BM" ? "bm" : "page"
  const color = variant === "PAGE" ? "#ff9b10" : "#087bff"
  return (
    <HeroLayer
      name={name}
      defaults={heroVisualLayers[name]}
      presentation={presentation}
      image={image ?? heroVisualAssets.layers[name]}
      bounds={[0, 0, 282, 100]}
    >
      <rect
        width="282"
        height="100"
        rx="21"
        data-hero-surface="card"
        fill={`url(#${ids.cardSurface})`}
        stroke="#e3e6ec"
        strokeWidth=".9"
        filter={`url(#${
          variant === "AD" ? ids.cardNearShadow : ids.cardShadow
        })`}
      />
      <path
        d="M21 99h240"
        stroke="#a8b1c4"
        strokeOpacity=".22"
        strokeWidth="1"
      />
      <rect
        className="hero-asset-icon"
        x="19"
        y="22"
        width="51"
        height="54"
        rx="12"
        fill={color}
      />
      {variant === "AD" ? (
        <text
          x="34"
          y="66"
          fill="white"
          fontSize="49"
          fontWeight="700"
          fontFamily="Arial"
          fontStyle="italic"
        >
          f
        </text>
      ) : variant === "BM" ? (
        <text x="24" y="63" fill="white" fontSize="47" fontFamily="Arial">
          ∞
        </text>
      ) : (
        <g stroke="white" strokeWidth="3" fill="white">
          <path d="M33 68V33" />
          <path d="M34 34c10-9 15 8 26 0v21c-11 8-16-9-26 0Z" strokeWidth="1" />
        </g>
      )}
      <text x="83" y="35" fill="#152039" fontSize="13" fontWeight="500">
        {title}
      </text>
      <text x="83" y="72" fill="#071331" fontSize="32" fontWeight="750">
        {value}
      </text>
      <path
        d="m140 64 5-5 5 5m-5-5v15"
        fill="none"
        stroke="#2057be"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {[15, 23, 30, 40, 49].map((height, i) => (
        <rect
          key={i}
          x={181 + i * 15}
          y={77 - height}
          width="9"
          height={height}
          rx="4.5"
          fill="#83a8e8"
          opacity={0.55 + i * 0.08}
        />
      ))}
      <path
        d="M21 1h240"
        stroke="white"
        strokeOpacity=".95"
        strokeWidth="1.2"
      />
    </HeroLayer>
  )
}

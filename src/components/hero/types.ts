export type HeroLayerName = "background" | "ad" | "bm" | "page" | "notification" | "core" | "shield" | "analytics" | "cursor" | "foreground" | "caption"

export interface HeroAnimation {
  kind?: "float" | "core" | "cursor"
  duration?: number
  delay?: number
  distanceX?: number
  /** Vertical travel in rendered CSS pixels before returning; responsive factors apply. */
  distance?: number
}

export interface HeroPresentation {
  x?: number
  y?: number
  scale?: number
  angle?: number
  origin?: readonly [number, number]
  skewX?: number
  opacity?: number
  animation?: HeroAnimation | false
}

export interface HeroImageAsset {
  /** An imported PNG, WebP, or SVG URL; never a base64 payload. */
  src: string
  /** Optional local SVG bounds, for assets with different transparent padding. */
  bounds?: readonly [number, number, number, number]
  preserveAspectRatio?: string
}

export interface HeroLayerProps {
  presentation?: HeroPresentation
  image?: HeroImageAsset
}

export type AssetVariant = "AD" | "BM" | "PAGE"

export interface HeroVisualAssets {
  logo: string
  layers: Partial<Record<HeroLayerName, HeroImageAsset>>
}

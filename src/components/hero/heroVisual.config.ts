import logo from "../../../Media Toolmeta/toolmeta-logo-icon-gradient.png.png"
import type {
  AssetVariant,
  HeroLayerName,
  HeroPresentation,
  HeroVisualAssets,
} from "./types"

/** All image imports and future layer replacements belong here. */
export const heroVisualAssets: HeroVisualAssets = { logo, layers: {} }

/** Desktop assembly in the original 900 × 650 coordinates. */
export const heroVisualLayers = {
  background: { x: 10, y: -2 },
  ad: {
    x: 100,
    y: 65,
    scale: 1.02,
    angle: 6,
    origin: [140, 50],
  },
  bm: {
    x: 20,
    y: 252,
    scale: 0.93,
    angle: -5,
    origin: [140, 50],
  },
  page: {
    x: 65,
    y: 478,
    scale: 0.93,
    angle: 5,
    origin: [140, 50],
  },
  notification: { x: 568, y: 66, angle: 6, scale: 0.96, origin: [128, 50] },
  core: {
    x: 340,
    y: 215,
    scale: 1.08,
    angle: 7,
    origin: [100, 100],
    skewX: -4,
  },
  shield: { x: 563, y: 218, angle: 12, scale: 0.9 },
  analytics: { x: 650, y: 235, angle: 12, skewX: -4, scale: 0.94 },
  cursor: { x: 580, y: 548, angle: -9 },
  foreground: {},
  caption: {},
} satisfies Record<HeroLayerName, HeroPresentation>

/** Compact mobile assembly: preserve asset sizes, close vertical gaps between rows. */
export const heroMobileLayers = {
  background: { x: 185, y: 120, scale: 0.44 },
  ad: { x: 22, y: 30, scale: 0.95, angle: 5 },
  bm: { x: 22, y: 185, scale: 0.82, angle: -5 },
  page: { x: 24, y: 345, scale: 0.84, angle: 5 },
  notification: { x: 325, y: 30, scale: 0.8, angle: 5 },
  core: { x: 295, y: 155, scale: 1.05 },
  shield: { x: 490, y: 145, scale: 0.7 },
  analytics: { x: 300, y: 400, scale: 0.88, angle: 12 },
  cursor: { x: 215, y: 668, scale: 0.85 },
  foreground: { x: 89, y: 52, scale: 0.65 },
  caption: { x: -170, y: 125 },
} satisfies Record<HeroLayerName, HeroPresentation>

export const heroViewBoxes = {
  desktop: "0 0 900 650",
  mobile: "0 0 560 760",
} as const

// Existing illustration values, unchanged by the refactor.
export const assetCardContent: Record<AssetVariant, {
  title: string
  value: string
}> = {
  AD: { title: "Tài khoản quảng cáo", value: "24" },
  BM: { title: "Business Manager", value: "08" },
  PAGE: { title: "Fanpage", value: "12" },
}

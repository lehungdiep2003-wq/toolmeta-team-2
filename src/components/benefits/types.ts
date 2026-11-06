import type { ReactNode } from "react"

export type BenefitAsset = "AD" | "BM" | "PAGE"
export type BenefitIcon = "ad" | "business" | "page" | "search" | "layers" | "check" | "sync"
export type RenderBenefitIcon = (name: BenefitIcon, size?: number) => ReactNode
export const benefitAssets: BenefitAsset[] = ["AD", "BM", "PAGE"]
export const benefitAssetIcons = {
  AD: "ad",
  BM: "business",
  PAGE: "page",
} as const

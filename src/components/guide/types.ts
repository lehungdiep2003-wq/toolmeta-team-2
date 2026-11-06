export interface GuideImageBlock {
  type: "image"
  src: string
  alt: string
  caption: string
  width: number
  height: number
  page: number
  afterStep?: string
}
export interface GuideTextBlock {
  type: "paragraph" | "step" | "note"
  text: string
  page?: number
  number?: string
}
export interface GuideTableBlock {
  type: "table"
  headers: string[]
  rows: string[][]
}
export type GuideBlock = GuideImageBlock | GuideTextBlock | GuideTableBlock
export interface GuideSection {
  id: string
  title: string
  blocks: GuideBlock[]
}
export interface GuideSummary {
  slug: string
  category: string
  title: string
  description: string
  status: "PUBLIC"
  locale: "vi" | "en"
  sourcePages: number[]
}
export interface GuideArticle extends GuideSummary {
  sections: GuideSection[]
}

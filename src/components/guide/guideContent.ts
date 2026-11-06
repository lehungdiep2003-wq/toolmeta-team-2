import manifest from "../../content/guide/manifest.json"
import type { GuideArticle, GuideSummary } from "./types"
import { sitePath } from "../../route"
import { guideText } from "../../i18n/guide/translate"
import { guideLocale, type GuideLocale } from "../../i18n/guide/language"
import { siteLanguageStore } from "../../i18n/siteLanguage"
export const categories = manifest.categories
export const articles = (manifest.articles as GuideSummary[]).sort(
  (a, b) =>
    categories.findIndex((c) => c.id === a.category) -
    categories.findIndex((c) => c.id === b.category),
)
const loaders = import.meta.glob<{ default: GuideArticle }>(
  "../../content/guide/vi/*.json",
)
export const guideDocumentHref = (slug = "") => {
  const locale = guideLocale()
  const override =
    locale === "vi" && siteLanguageStore.getSnapshot().code === "en"
      ? "?docLang=vi"
      : ""
  return (
    sitePath(
      "/guide" + (locale === "en" ? "/en" : "") + (slug ? "/" + slug : ""),
    ) + override
  )
}
export async function loadArticle(slug: string, locale: GuideLocale = "vi") {
  // Exact public manifest membership is required before loading any module.
  if (!articles.some((article) => article.slug === slug)) return null
  const loader =
    loaders["../../content/guide/vi/" + slug.replace(/\//g, "--") + ".json"]
  if (!loader) return null
  const original = (await loader()).default
  const localize = (value: unknown): unknown => {
    if (typeof value === "string") return guideText(value, locale)
    if (Array.isArray(value)) return value.map(localize)
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, localize(item)]),
      )
    return value
  }
  const article =
    locale === "en" ? localize(original) as GuideArticle : original
  return {
    ...article,
    locale,
    sections: article.sections.map((section) => ({
      ...section,
      blocks: section.blocks.map((block) =>
        block.type === "image" ? { ...block, src: sitePath(block.src) } : block,
      ),
    })),
  }
}
export function normalizeSearch(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
}
export interface SearchRecord {
  article: GuideSummary
  body: string
}
const indexes: Partial<Record<GuideLocale, Promise<SearchRecord[]>>> = {}
export function getSearchIndex(locale: GuideLocale = guideLocale()) {
  return (indexes[locale] ??= Promise.all(
    articles.map(async (summary) => {
      const article = await loadArticle(summary.slug, locale)
      const category =
        categories.find((item) => item.id === summary.category)?.label ?? ""
      const body = [
        summary.title,
        category,
        summary.description,
        ...(article?.sections.flatMap((section) => [
          section.title,
          ...section.blocks.map((block) =>
            block.type === "image"
              ? block.caption
              : block.type === "table"
                ? block.rows.flat().join(" ")
                : block.text,
          ),
        ]) ?? []),
      ]
        .map((text) => guideText(text, locale))
        .join(" ")
      return {
        article: {
          ...summary,
          locale,
          title: guideText(summary.title, locale),
          description: guideText(summary.description, locale),
        },
        body,
      }
    }),
  ).catch((error) => {
    indexes[locale] = undefined
    throw error
  }))
}
export function searchRecords(records: SearchRecord[], query: string) {
  const terms = normalizeSearch(query).trim().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  return records
    .filter((record) =>
      terms.every((term) => normalizeSearch(record.body).includes(term)),
    )
    .map((record) => ({
      ...record,
      score: terms.reduce(
        (score, term) =>
          score +
          (normalizeSearch(record.article.title).includes(term) ? 10 : 1),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score)
}

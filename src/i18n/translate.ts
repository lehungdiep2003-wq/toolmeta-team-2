import vi from "./locales/vi.json"

import en from "./locales/en.json"

import ru from "./locales/ru.json"

import th from "./locales/th.json"

import zh from "./locales/zh.json"

import lookup from "./locales/lookup.json"

import { siteLanguageStore, type LocaleCode } from "./siteLanguage"

export const catalogs: Record<LocaleCode, Record<string, string>> = {
  vi,
  en,
  ru,
  th,
  zh,
}

const keys: Record<string, string> = lookup

const fragments = Object.keys(keys)
  .filter((source) => !source.includes("{"))
  .sort((a, b) => b.length - a.length)

const normalize = (text: string) =>
  text.normalize("NFC").trim().replace(/\s+/g, " ")

/** Convert recognized API messages to their stable source before rendering. */
export function uiMessageSource(text: string): string | null {
  const source = normalize(text)
  const key = keys[source] ?? Object.values(catalogs).map(catalog => Object.keys(catalog).find(key => normalize(catalog[key]) === source)).find(Boolean)
  return key ? catalogs.vi[key] : null
}
const patterns = Object.entries(keys)
  .filter(([source]) => /\{\d+\}/.test(source))
  .sort(([a], [b]) => b.length - a.length)
  .map(([source, key]) => {
    const slots: string[] = []

    const expression = source
      .split(/(\{\d+\})/)
      .map((part) => {
        if (/^\{\d+\}$/.test(part)) {
          slots.push(part)
          return "(.+?)"
        }

        return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      })
      .join("")

    return { key, slots, regex: new RegExp("^" + expression + "$") }
  })

/** Translate UI text before React reconciliation; never mutate the DOM or form values. */

export function t(
  text: string,
  locale: LocaleCode = siteLanguageStore.getSnapshot().code,
  depth = 0,
): string {
  if (locale === "vi" || !text || depth > 3) return text

  const normalized = normalize(text)

  const key = keys[normalized]

  let translation = key
    ? (catalogs[locale][key] ?? catalogs.vi[key])
    : undefined

  if (!translation) {
    for (const pattern of patterns) {
      const match = normalized.match(pattern.regex)

      if (!match) continue

      translation = catalogs[locale][pattern.key] ?? catalogs.vi[pattern.key]

      pattern.slots.forEach((slot, i) => {
        translation = translation!
          .split(slot)
          .join(t(match[i + 1], locale, depth + 1))
      })

      break
    }
  }

  if (!translation) {
    const prefix = Object.keys(keys).find(
      (source) => source.endsWith(":") && normalized.startsWith(source + " "),
    )

    if (prefix)
      translation =
        (catalogs[locale][keys[prefix]] ?? prefix) +
        " " +
        t(normalized.slice(prefix.length + 1), locale, depth + 1)
  }

  if (!translation) {
    const prefix = fragments.find((source) =>
      normalized.startsWith(source + " "),
    )

    if (prefix)
      translation =
        (catalogs[locale][keys[prefix]] ?? prefix) +
        " " +
        t(normalized.slice(prefix.length + 1), locale, depth + 1)
    else {
      const suffix = fragments.find((source) =>
        normalized.endsWith(" " + source),
      )

      if (suffix)
        translation =
          t(normalized.slice(0, -suffix.length - 1), locale, depth + 1) +
          " " +
          (catalogs[locale][keys[suffix]] ?? suffix)
    }
  }

  if (!translation) return text

  return (
    (text.match(/^\s*/)?.[0] ?? "") +
    translation +
    (text.match(/\s*$/)?.[0] ?? "")
  )
}

const children = (value: unknown): unknown =>
  typeof value === "string"
    ? t(value)
    : Array.isArray(value)
      ? value.map(children)
      : value

export function translateDOMProps(type: unknown, props: unknown) {
  if (
    (typeof type !== "string" && type !== Symbol.for("react.fragment")) ||
    !props ||
    typeof props !== "object"
  )
    return props

  const original = props as Record<string, unknown>

  if (
    original["data-no-translate"] ||
    original.translate === "no" ||
    original.lang
  )
    return props

  const next = { ...original }

  for (const key of [
    "title",
    "placeholder",
    "alt",
    "aria-label",
    "aria-description",
  ])
    if (typeof next[key] === "string") next[key] = t(next[key])

  if ("children" in next) next.children = children(next.children)

  // Preserve the existing SVG label footprint when a translated title expands.

  if (
    type === "text" &&
    typeof original.children === "string" &&
    typeof next.children === "string" &&
    !original.textLength
  ) {
    const fontSize = Number(original.fontSize)

    const sourceLength = Array.from(original.children.trim()).length

    if (
      fontSize > 0 &&
      sourceLength > 5 &&
      Array.from(next.children.trim()).length > sourceLength * 1.25
    ) {
      next.textLength = sourceLength * fontSize * 0.6

      next.lengthAdjust = "spacingAndGlyphs"
    }
  }

  return next
}

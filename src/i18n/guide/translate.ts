import en from "./en.json"
import { guideLocale, type GuideLocale } from "./language"
import { t } from "../translate"
const english: Record<string, string> = en
const fragments = Object.keys(english).sort((a, b) => b.length - a.length)
const normalize = (text: string) => text.trim().replace(/\s+/g, " ")
export function guideText(
  text: string,
  locale: GuideLocale = guideLocale(),
  depth = 0,
): string {
  if (locale === "vi" || depth > 3) return text
  const source = normalize(text)
  let target = english[source]
  if (!target) {
    const prefix = fragments.find((key) => source.startsWith(key + " "))
    if (prefix)
      target =
        english[prefix] +
        " " +
        guideText(source.slice(prefix.length + 1), locale, depth + 1)
  }
  return target
    ? (text.match(/^\s*/)?.[0] ?? "") + target + (text.match(/\s*$/)?.[0] ?? "")
    : t(text, "en")
}
export function guideProps(type: unknown, props: unknown) {
  if (
    (typeof type !== "string" && type !== Symbol.for("react.fragment")) ||
    !props ||
    typeof props !== "object"
  )
    return props
  const original = props as Record<string, unknown>
  if (
    original.lang ||
    original.translate === "no" ||
    original["data-no-translate"]
  )
    return props
  const next = { ...original }
  const children = (value: unknown): unknown =>
    typeof value === "string"
      ? guideText(value)
      : Array.isArray(value)
        ? value.map(children)
        : value
  for (const key of ["title", "alt", "placeholder", "aria-label"])
    if (typeof next[key] === "string") next[key] = guideText(next[key])
  if ("children" in next) next.children = children(next.children)
  return next
}

import { siteLanguageStore } from "../siteLanguage"
export type GuideLocale = "vi" | "en"
/** Document language derives from route/explicit document override, never a second store. */
export function guideLocale(
  path = typeof window === "undefined" ? "/guide" : window.location.pathname,
  search = typeof window === "undefined" ? "" : window.location.search,
): GuideLocale {
  if (/\/guide\/en(?:\/|$)/.test(path)) return "en"
  const explicit = new URLSearchParams(search).get("docLang")
  if (explicit === "vi" || explicit === "en") return explicit
  return siteLanguageStore.getSnapshot().code === "en" ? "en" : "vi"
}

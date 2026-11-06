import { useSyncExternalStore } from "react"

export const languages = [
  { code: "vi", name: "Tiếng Việt", short: "VI", flag: "🇻🇳" },
  { code: "en", name: "English", short: "EN", flag: "🇬🇧" },
  { code: "ru", name: "Русский", short: "RU", flag: "🇷🇺" },
  { code: "th", name: "ไทย", short: "TH", flag: "🇹🇭" },
  { code: "zh", name: "中文", short: "ZH", flag: "🇨🇳" },
] as const
export type SiteLanguage = typeof languages[number]
export type LocaleCode = SiteLanguage["code"]
export const LANGUAGE_STORAGE_KEY = "toolmeta-language"
const find = (code: string | null) =>
  languages.find((language) => language.code === code)
const listeners = new Set<() => void>()
let selected: SiteLanguage = languages[0]
if (typeof window !== "undefined") {
  try {
    selected =
      find(new URLSearchParams(window.location.search).get("lang")) ??
      find(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)) ??
      languages[0]
  } catch {
    selected =
      find(new URLSearchParams(window.location.search).get("lang")) ??
      languages[0]
  }
}
export const siteLanguageStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getSnapshot: () => selected,
  getServerSnapshot: () => languages[0],
  select(language: SiteLanguage) {
    const next = languages.find((item) => item.code === language.code)
    if (!next) return
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next.code)
      } catch {
        /* Memory remains usable when storage is blocked. */
      }
      const url = new URL(window.location.href)
      if (
        url.searchParams.has("lang") &&
        url.searchParams.get("lang") !== next.code
      ) {
        url.searchParams.set("lang", next.code)
        window.history.replaceState(
          window.history.state,
          "",
          url.pathname + url.search + url.hash,
        )
      }
      document.documentElement.lang = next.code
    }
    if (selected === next) return
    selected = next
    listeners.forEach((listener) => listener())
  },
}
if (typeof window !== "undefined") {
  const fromUrl = () => {
    const language = find(
      new URLSearchParams(window.location.search).get("lang"),
    )
    if (language) siteLanguageStore.select(language)
  }
  window.addEventListener("popstate", fromUrl)
  window.addEventListener("toolmeta:navigate", fromUrl)
  window.addEventListener("storage", (event) => {
    if (
      event.key === LANGUAGE_STORAGE_KEY &&
      !find(new URLSearchParams(window.location.search).get("lang"))
    ) {
      const language = find(event.newValue)
      if (language) siteLanguageStore.select(language)
    }
  })
  siteLanguageStore.select(selected)
}
/** The sole language store for selectors, UI translation and document fallbacks. */
export default function useSiteLanguage() {
  return {
    selected: useSyncExternalStore(
      siteLanguageStore.subscribe,
      siteLanguageStore.getSnapshot,
      siteLanguageStore.getServerSnapshot,
    ),
    setSelected: siteLanguageStore.select,
  }
}

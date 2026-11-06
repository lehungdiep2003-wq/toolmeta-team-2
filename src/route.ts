import { useSyncExternalStore } from "react"

const base = new URL(
  import.meta.env.BASE_URL,
  "https://local.invalid",
).pathname.replace(/\/$/, "")
export const sitePath = (path: string) => base + path
export const guideHref = (slug = "") =>
  sitePath("/guide" + (slug ? "/" + slug : ""))
export function routePath(pathname: string) {
  const path =
    base && (pathname === base || pathname.startsWith(base + "/"))
      ? pathname.slice(base.length) : pathname
  return path.replace(/\/$/, "") || "/"
}
const positions = new Map<string, { left: number; top: number }>()
let sequence = 0
let currentEntry = ""
let navigationKind: "initial" | "push" | "pop" = "initial"
let preserveScroll = false
const entryKey = () => {
  const existing = window.history.state?.toolmetaEntry
  if (typeof existing === "string") return existing
  const key = `toolmeta-${Date.now()}-${++sequence}`
  window.history.replaceState({ ...window.history.state, toolmetaEntry: key }, "")
  return key
}
export function trackNavigationScroll() {
  currentEntry = entryKey()
  const previousRestoration = window.history.scrollRestoration
  window.history.scrollRestoration = "manual"
  const remember = () => {
    positions.set(currentEntry, { left: window.scrollX, top: window.scrollY })
  }
  const pop = () => {
    navigationKind = "pop"
    preserveScroll = false
    currentEntry = entryKey()
  }
  window.addEventListener("scroll", remember, { passive: true })
  window.addEventListener("popstate", pop, true)
  return () => {
    window.removeEventListener("scroll", remember)
    window.removeEventListener("popstate", pop, true)
    window.history.scrollRestoration = previousRestoration
  }
}
export const navigationSnapshot = () =>
  window.location.href + "|" + (window.history.state?.toolmetaEntry ?? "")
export const navigationScroll = () => ({
  kind: navigationKind,
  preserve: preserveScroll,
  position: positions.get(currentEntry) ?? { left: 0, top: 0 },
})
export const subscribe = (listener: () => void) => {
  window.addEventListener("popstate", listener)
  window.addEventListener("toolmeta:navigate", listener)
  return () => {
    window.removeEventListener("popstate", listener)
    window.removeEventListener("toolmeta:navigate", listener)
  }
}
export function navigate(href: string, options: { preserveScroll?: boolean } = {}) {
  const url = new URL(href, window.location.href)
  if (url.origin !== window.location.origin) {
    window.location.assign(url.href)
    return
  }
  currentEntry ||= entryKey()
  positions.set(currentEntry, { left: window.scrollX, top: window.scrollY })
  currentEntry = `toolmeta-${Date.now()}-${++sequence}`
  navigationKind = "push"
  preserveScroll = options.preserveScroll ?? false
  window.history.pushState({ toolmetaEntry: currentEntry }, "", url.pathname + url.search + url.hash)
  window.dispatchEvent(new Event("toolmeta:navigate"))
}
export default function useRoute() {
  return useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => "/",
  )
}

import { useEffect, useRef, useSyncExternalStore } from "react"
import { navigationScroll, navigationSnapshot, subscribe } from "./route"

/** Runs inside Suspense, after the destination's lazy component has committed. */
export default function NavigationScroll() {
  const location = useSyncExternalStore(subscribe, navigationSnapshot, () => "/")
  const previous = useRef<URL | null>(null)
  useEffect(() => {
    const url = new URL(window.location.href)
    const prior = previous.current
    previous.current = url
    const request = navigationScroll()
    if (request.preserve) return
    if (request.kind !== "pop" && url.searchParams.has("section") &&
        /\/(terms|privacy)\/?$/.test(url.pathname)) return
    // Document-language and legal-section query changes retain their own behavior.
    if (request.kind !== "pop" && prior?.pathname === url.pathname &&
        prior.hash === url.hash && prior.search !== url.search &&
        /\/(guide|terms|privacy)(\/|$)/.test(url.pathname)) return
    let observer: MutationObserver | undefined
    let timeout: ReturnType<typeof setTimeout> | undefined
    const place = () => {
      if (document.querySelector(".gd-loading")) return false
      if (request.kind === "pop") {
        window.scrollTo({ ...request.position, behavior: "instant" })
      } else if (url.hash) {
        let id = url.hash.slice(1)
        try { id = decodeURIComponent(id) } catch { /* Retain a malformed literal ID. */ }
        const target = document.getElementById(id)
        if (!target) return false
        target.scrollIntoView({ block: "start", behavior: "auto" })
        if (target.hasAttribute("tabindex")) target.focus({ preventScroll: true })
      } else {
        window.scrollTo({ left: 0, top: 0, behavior: "instant" })
      }
      return true
    }
    const frame = requestAnimationFrame(() => {
      if (!place()) {
        observer = new MutationObserver(() => {
          if (place()) observer?.disconnect()
        })
        observer.observe(document.getElementById("root") ?? document.body, { childList: true, subtree: true })
        timeout = setTimeout(() => observer?.disconnect(), 5000)
      }
    })
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      clearTimeout(timeout)
    }
  }, [location])
  return null
}

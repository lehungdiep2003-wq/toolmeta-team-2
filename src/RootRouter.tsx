import { lazy, Suspense, useEffect } from "react"
import useRoute, { routePath, navigate, trackNavigationScroll } from "./route"
import useSiteLanguage from "./i18n/siteLanguage"
import LocalizedMetadata from "./i18n/LocalizedMetadata"
import NavigationScroll from "./NavigationScroll"
import FloatingTelegramSupport from "./components/support/FloatingTelegramSupport"

const Landing = lazy(() => import("./App"))
const Guide = lazy(() => import("./components/guide/GuideApp"))
const Pricing = lazy(() => import("./pages/PricingPage"))
const Contact = lazy(() => import("./pages/ContactPage"))
const Legal = lazy(() => import("./components/legal/LegalPage"))
export default function RootRouter() {
  useSiteLanguage()
  const pathname = useRoute()
  const route = routePath(pathname)
  useEffect(trackNavigationScroll, [])
  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return
      const link = (event.target as Element)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null
      if (!link || link.target || link.hasAttribute("download")) return
      const url = new URL(link.href)
      if (url.origin !== window.location.origin) return
      const target = routePath(url.pathname)
      if (
        target === "/guide" ||
        target === "/pricing" ||
        target === "/contact" ||
        target === "/terms" || target === "/privacy" ||
        target.startsWith("/guide/") ||
        target === "/"
      ) {
        event.preventDefault()
        navigate(url.pathname + url.search + url.hash)
      }
    }
    document.addEventListener("click", click)
    return () => document.removeEventListener("click", click)
  }, [route])
  return (
    <>
    <Suspense
      fallback={
        <p role="status" style={{ padding: 32 }}>
          Đang tải nội dung…
        </p>
      }
    >
      {route === "/guide" || route.startsWith("/guide/") ? (
        <Guide path={route} />
      ) : route === "/pricing" ? (
        <Pricing />
      ) : route === "/contact" ? (
        <Contact />
      ) : route === "/terms" || route === "/privacy" ? (
        <Legal kind={route === "/terms" ? "terms" : "privacy"} />
      ) : (
        <Landing />
      )}
      <LocalizedMetadata route={route} />
      <NavigationScroll />
    </Suspense>
    <FloatingTelegramSupport />
    </>
  )
}

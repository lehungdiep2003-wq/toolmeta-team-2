import { useEffect, useSyncExternalStore } from "react"
import useSiteLanguage from "./siteLanguage"
import { t } from "./translate"
import { subscribe } from "../route"
import { pricingData } from "../components/pricing/pricingData"
import { legalDocuments } from "../components/legal/legal-content"

export default function LocalizedMetadata({ route }: { route: string }) {
  const { selected } = useSiteLanguage()
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  )
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      document.documentElement.lang = selected.code
      let title = t("Toolmeta — Quản lý tài sản quảng cáo tập trung")
      let description = t(
        "Toolmeta giúp bạn theo dõi, quản lý và thao tác với tài khoản quảng cáo, Business Manager và Fanpage trên một nền tảng trực quan, chuyên nghiệp.",
      )
      if (route === "/pricing") {
        title = t(pricingData.pageTitle)
        description = t(pricingData.description)
      }
      if (route === "/contact") {
        title = t("Liên hệ Toolmeta")
        description = t(
          "Chia sẻ yêu cầu của bạn để Toolmeta có thông tin hỗ trợ cài đặt, sử dụng và quản lý tài sản quảng cáo.",
        )
      }
      if (route === "/terms" || route === "/privacy") {
        const override = new URLSearchParams(search).get("docLang")
        const index =
          override === "en" || (override !== "vi" && selected.code === "en")
            ? 1
            : 0
        const doc = legalDocuments[route === "/terms" ? "terms" : "privacy"]
        title =
          doc.title[index] +
          " · " +
          (index ? "Draft for review" : "Bản dự thảo")
        description = doc.intro[index]
      }
      if (route.startsWith("/guide")) {
        return // Guide owns asynchronous article metadata in its document language.
      } else document.title = title
      const set = (
        attribute: "name" | "property",
        value: string,
        content: string,
      ) => {
        let node = document.head.querySelector<HTMLMetaElement>(
          `meta[${attribute}="${value}"]`,
        )
        if (!node) {
          node = document.createElement("meta")
          node.setAttribute(attribute, value)
          document.head.append(node)
        }
        node.content = content
      }
      set("name", "description", description)
      set("property", "og:title", title)
      set("property", "og:description", description)
    })
    return () => cancelAnimationFrame(frame)
  }, [route, selected.code, search])
  return null
}

import type { Plugin } from "vite"
import fs from "node:fs"
import path from "node:path"
import manifest from "../src/content/guide/manifest.json"
import { guideText } from "../src/i18n/guide/translate"
import localizedStaticMeta from "./localizedStaticMeta"

/** Emit physical HTML entrypoints so clean deep links work on static hosts
 * without relying on an undocumented deployment rewrite. Assets retain Vite's base. */
export default function guideStaticRoutes(): Plugin {
  return {
    name: "toolmeta-guide-static-routes",
    buildStart() {
      const folder = path.resolve("src/content/guide/vi")
      const permitted = new Set(
        manifest.articles.map(
          (article) => article.slug.replace(/\//g, "--") + ".json",
        ),
      )
      for (const item of manifest.articles) {
        if (
          item.status !== "PUBLIC" ||
          !/^[-a-z0-9]+\/[-a-z0-9]+$/.test(item.slug)
        )
          throw new Error("Invalid public guide manifest entry")
        const article = JSON.parse(
          fs.readFileSync(
            path.join(folder, item.slug.replace(/\//g, "--") + ".json"),
            "utf8",
          ),
        )
        if (article.status !== "PUBLIC" || article.slug !== item.slug)
          throw new Error(
            "Guide content classification does not match public manifest",
          )
      }
      for (const file of fs.readdirSync(folder)) {
        if (file.endsWith(".json") && !permitted.has(file))
          throw new Error(
            "Unlisted content must not be placed in the public guide corpus",
          )
      }
    },
    writeBundle(options) {
      const dir = path.resolve(options.dir ?? "dist")
      const html = fs.readFileSync(path.join(dir, "index.html"), "utf8")
      const entries = [
        { slug: "", title: "Hướng dẫn sử dụng Toolmeta", description: "Tìm hiểu cách thiết lập và sử dụng các công cụ quản lý tài sản quảng cáo của Toolmeta." },
        { slug: "en", title: "Toolmeta user guide", description: guideText("Tìm hiểu cách thiết lập và sử dụng các công cụ quản lý tài sản quảng cáo của Toolmeta.", "en") },
        ...manifest.articles
          .filter((article) => article.status === "PUBLIC")
          .map((article) => ({
            slug: article.slug,
            title: article.title + " · Toolmeta",
            description: article.description,
          })),
        ...manifest.articles
          .filter((article) => article.status === "PUBLIC")
          .map((article) => ({
            slug: "en/" + article.slug,
            title: guideText(article.title, "en") + " · Toolmeta",
            description: guideText(article.description, "en"),
          })),
      ]
      for (const entry of entries) {
        const target = path.join(dir, "guide", entry.slug)
        fs.mkdirSync(target, { recursive: true })
        fs.writeFileSync(
          path.join(target, "index.html"),
          localizedStaticMeta(html, { title: entry.title, description: entry.description, language: entry.slug === "en" || entry.slug.startsWith("en/") ? "en" : "vi" }),
        )
      }
    },
  }
}

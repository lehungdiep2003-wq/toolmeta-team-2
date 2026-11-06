import type { Plugin } from "vite"
import fs from "node:fs"
import path from "node:path"
import { legalDocuments } from "../src/components/legal/legal-content"
import localizedStaticMeta from "./localizedStaticMeta"

export default function legalStaticRoutes(): Plugin {
  return {
    name: "toolmeta-legal-static-routes",
    writeBundle(options) {
      const dir = path.resolve(options.dir ?? "dist")
      const html = fs.readFileSync(path.join(dir, "index.html"), "utf8")
      for (const kind of ["terms", "privacy"] as const) {
        const target = path.join(dir, kind)
        fs.mkdirSync(target, { recursive: true })
        fs.writeFileSync(
          path.join(target, "index.html"),
          localizedStaticMeta(html, { title: legalDocuments[kind].title[0] + " · Bản dự thảo", description: legalDocuments[kind].intro[0] }),
        )
      }
    },
  }
}

import type { Plugin } from "vite"
import fs from "node:fs"
import path from "node:path"
import { pricingData } from "../src/components/pricing/pricingData"
import localizedStaticMeta from "./localizedStaticMeta"

/** Physical entrypoint for direct /pricing refresh on static hosts. */
export default function pricingStaticRoute(): Plugin {
  return {
    name: "toolmeta-pricing-static-route",
    writeBundle(options) {
      const dir = path.resolve(options.dir ?? "dist")
      const html = fs.readFileSync(path.join(dir, "index.html"), "utf8")
      const target = path.join(dir, "pricing")
      fs.mkdirSync(target, { recursive: true })
      fs.writeFileSync(
        path.join(target, "index.html"),
        localizedStaticMeta(html, { title: pricingData.pageTitle, description: pricingData.description }),
      )
    },
  }
}

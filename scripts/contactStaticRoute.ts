import type { Plugin } from "vite"
import fs from "node:fs"
import path from "node:path"
import localizedStaticMeta from "./localizedStaticMeta"

export default function contactStaticRoute(): Plugin {
  return {
    name: "toolmeta-contact-static-route",
    writeBundle(options) {
      const dir = path.resolve(options.dir ?? "dist")
      const html = fs.readFileSync(path.join(dir, "index.html"), "utf8")
      const target = path.join(dir, "contact")
      fs.mkdirSync(target, { recursive: true })
      fs.writeFileSync(
        path.join(target, "index.html"),
        localizedStaticMeta(html, { title: "Liên hệ Toolmeta", description: "Chia sẻ yêu cầu của bạn để Toolmeta có thông tin hỗ trợ cài đặt, sử dụng và quản lý tài sản quảng cáo." }),
      )
    },
  }
}

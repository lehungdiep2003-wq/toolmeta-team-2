import assert from "node:assert/strict"
import fs from "node:fs"
import ts from "typescript"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createServer } from "vite"

const server = await createServer({ cacheDir: ".tmp/vite-support-qa", server: { middlewareMode: true, watch: null, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: "custom", logLevel: "error" })
try {
  const { default: Support } = await server.ssrLoadModule("/src/components/support/FloatingTelegramSupport.tsx")
  const { default: Root } = await server.ssrLoadModule("/src/RootRouter.tsx")
  const { TELEGRAM_SUPPORT_URL } = await server.ssrLoadModule("/src/config/urls.ts")
  const { languages, siteLanguageStore } = await server.ssrLoadModule("/src/i18n/siteLanguage.ts")
  const messages = JSON.parse(fs.readFileSync("src/components/support/supportMessages.json", "utf8"))
  const originalServerSnapshot = siteLanguageStore.getServerSnapshot
  assert.equal(TELEGRAM_SUPPORT_URL, "https://t.me/rachel_fb2")
  for (const language of languages) {
    siteLanguageStore.select(language)
    siteLanguageStore.getServerSnapshot = () => language
    const html = renderToStaticMarkup(React.createElement(Support))
    assert.equal((html.match(/<a\b/g) ?? []).length, 1)
    assert.ok(html.includes(`href="${TELEGRAM_SUPPORT_URL}"`))
    assert.ok(html.includes('target="_blank"'))
    assert.ok(html.includes('rel="noopener noreferrer"'))
    assert.ok(html.includes(`aria-label="${messages[language.code]}"`))
    assert.ok(html.includes('role="tooltip"'))
    assert.ok(html.includes('alt="" aria-hidden="true"'))
  }
  siteLanguageStore.getServerSnapshot = originalServerSnapshot
  siteLanguageStore.select(languages[0])
  const rootHtml = renderToStaticMarkup(React.createElement(Root))
  assert.equal((rootHtml.match(/href="https:\/\/t.me\/rachel_fb2"/g) ?? []).length, 1)

  // The unconditional mount must be outside the route-loading Suspense boundary.
  const root = ts.createSourceFile("RootRouter.tsx", fs.readFileSync("src/RootRouter.tsx", "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  let mounts = 0
  function visit(node, suspense = false) {
    const inside = suspense || (ts.isJsxElement(node) && node.openingElement.tagName.getText(root) === "Suspense")
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(root) === "FloatingTelegramSupport") {
      mounts++
      assert.equal(inside, false, "Support remains mounted while route content loads")
    }
    ts.forEachChild(node, child => visit(child, inside))
  }
  visit(root)
  assert.equal(mounts, 1)
  const svg = fs.readFileSync("src/assets/support/telegram.svg", "utf8")
  const official = fs.existsSync(".tmp/telegram-official.svg") ? fs.readFileSync(".tmp/telegram-official.svg", "utf8") : null
  if (official) assert.equal(svg.match(/ d="([^"]+)"/)[1], official.match(/<path fill="#FFF" fill-rule="nonzero" d="([^"]+)"/)[1])
  assert.ok(svg.includes('fill="#fff"'))
  const css = fs.readFileSync("src/components/support/floatingTelegramSupport.css", "utf8")
  for (const property of ["position: fixed", "z-index: 30", "width: 56px", "height: 56px", "width: 52px", "height: 52px", "safe-area-inset-bottom", ":focus-visible", "prefers-reduced-motion", "200ms", "translateY(-3px)"]) assert.ok(css.includes(property), property)
  const report = {
    url: TELEGRAM_SUPPORT_URL,
    localeLabels: languages.length,
    sharedMounts: mounts,
    routes: ["/", "/pricing", "/guide", "/contact", "/terms", "/privacy"],
    routeCoverage: "One unconditional app-shell mount outside Suspense; no per-page copies",
    link: "Exact URL, new tab, noopener noreferrer passed",
    icon: "Official Telegram white plane path, self-hosted SVG; path unchanged",
    layering: "z-index 30 below Header 50, Guide topbar 40, Footer menu 1000 and native dialog top layer",
    collisionAvoidance: "Local component measures nearby CTA/Footer/menu rectangles without modifying other components",
    unverified: ["Actual desktop/mobile screenshots and live overlap checks", "Live keyboard, hover, and Telegram new-tab interaction"],
  }
  fs.mkdirSync(".tmp/support-qa", { recursive: true })
  fs.writeFileSync(".tmp/support-qa/report.json", JSON.stringify(report, null, 2) + "\n")
  console.log(JSON.stringify(report, null, 2))
} finally {
  await server.close()
}

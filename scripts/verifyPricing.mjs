import assert from "node:assert/strict"
import fs from "node:fs"
import { createServer, preview } from "vite"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

// Do not share the live development server's dependency optimizer cache.
const server = await createServer({ cacheDir: ".tmp/vite-pricing-qa", server: { middlewareMode: true, watch: null, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: "custom", logLevel: "error" })
let production
try {
  const { default: Pricing } = await server.ssrLoadModule("/src/pages/PricingPage.tsx")
  const { default: App } = await server.ssrLoadModule("/src/App.tsx")
  const { pricingData, pricingGroups } = await server.ssrLoadModule("/src/components/pricing/pricingData.ts")
  const page = renderToStaticMarkup(React.createElement(Pricing))
  const home = renderToStaticMarkup(React.createElement(App))
  const removed = /1\s*Workspace|2\s*thành viên|3\s*VIA|5\s*BM|75\s*TKQC|50\s*Page|vô thời hạn|không giới hạn\s*(?:thời gian|tài sản|thành viên|Workspace)|0đ/i
  for (const html of [page, home]) {
    const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")
    assert.ok(!removed.test(text), "Unverified legacy pricing claim rendered")
    assert.ok(text.includes(pricingData.planName))
    assert.ok(text.includes("0₫"))
    assert.ok(text.includes(pricingData.message))
    assert.ok(text.includes(pricingData.description))
    assert.ok(text.includes(pricingData.entitlementNote))
    assert.ok(!/AezCheck|Telegram|Auto Bot/i.test(text))
    for (const anchor of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
      if (anchor[2].includes(pricingData.cta)) assert.ok(anchor[1].includes('href="https://app.toolmeta.io"'))
    }
    const header = html.match(/<header class="header"[\s\S]*?<\/header>/)[0]
    const footer = html.match(/<footer id="site-footer"[\s\S]*?<\/footer>/)[0]
    assert.ok(header.includes('href="/pricing"') && footer.includes('href="/pricing"'))
  }
  assert.equal((page.match(/<details/g) ?? []).length, 0)
  assert.ok(!page.includes("pp-faq") && !page.includes("pp-question"))
  assert.ok(home.includes('id="faq"'), "Homepage FAQ remains available")
  assert.equal((page.match(/class="pp-capability"/g) ?? []).length, 5)
  assert.deepEqual(pricingGroups.map(group => group.tag), ["AD", "BM", "PAGE", "BULK", "TOOLS"])
  assert.ok(home.includes('id="pricing"'))
  assert.ok(page.includes('aria-current="page"'))
  const manifest = JSON.parse(fs.readFileSync("src/content/guide/manifest.json", "utf8"))
  for (const [,slug] of page.matchAll(/href="\/guide\/([^"]+)"/g)) assert.ok(manifest.articles.some(article => article.slug === slug), slug)
  const entry = fs.readFileSync("dist/pricing/index.html", "utf8")
  assert.ok(entry.includes(pricingData.pageTitle) && !removed.test(entry))
  production = await preview({ preview: { host: "127.0.0.1", port: 0 }, logLevel: "silent" })
  const origin = "http://127.0.0.1:" + production.httpServer.address().port
  for (const path of ["/", "/pricing", "/pricing/"]) assert.equal((await fetch(origin + path)).status, 200, path)
  console.log("PASS: shared FB2 plan content, 0₫, no legacy limits/duration, 5 public groups, no Pricing FAQ, Homepage FAQ preserved, CTA links, navigation and production routes.")
} finally {
  if (production) await new Promise(resolve => production.httpServer.close(resolve))
  await server.close()
}

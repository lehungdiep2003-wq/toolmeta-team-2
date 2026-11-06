import assert from "node:assert/strict"
import fs from "node:fs"
import vm from "node:vm"
import ts from "typescript"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { createServer, preview } from "vite"

const output = ".tmp/navigation-qa"
fs.mkdirSync(output, { recursive: true })
const server = await createServer({ cacheDir: ".tmp/vite-navigation-qa", server: { middlewareMode: true, watch: null, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: "custom", logLevel: "error" })
let production
try {
  const pages = new Map()
  const render = (Component, props = {}) => renderToStaticMarkup(React.createElement(Component, props))
  for (const [route, module] of [["/", "/src/App.tsx"], ["/pricing", "/src/pages/PricingPage.tsx"], ["/contact", "/src/pages/ContactPage.tsx"]]) {
    pages.set(route, render((await server.ssrLoadModule(module)).default))
  }
  const { default: Legal } = await server.ssrLoadModule("/src/components/legal/LegalPage.tsx")
  for (const kind of ["terms", "privacy"]) pages.set("/" + kind, render(Legal, { kind }))
  const { default: Guide } = await server.ssrLoadModule("/src/components/guide/GuideApp.tsx")
  const { default: Article } = await server.ssrLoadModule("/src/components/guide/GuideArticleContent.tsx")
  const { default: Toc } = await server.ssrLoadModule("/src/components/guide/GuideTableOfContents.tsx")
  const { articles, loadArticle } = await server.ssrLoadModule("/src/components/guide/guideContent.ts")
  const { siteLanguageStore, languages } = await server.ssrLoadModule("/src/i18n/siteLanguage.ts")
  for (const locale of ["vi", "en"]) {
    siteLanguageStore.select(languages.find(item => item.code === locale))
    const home = "/guide" + (locale === "en" ? "/en" : "")
    pages.set(home, render(Guide, { path: home }))
    for (const summary of articles) {
      const path = home + "/" + summary.slug
      const article = await loadArticle(summary.slug, locale)
      pages.set(path, render(Guide, { path }) + render(Article, { article, onImage() {} }) + render(Toc, { article }))
    }
  }
  const ids = new Map([...pages].map(([path, html]) => [path, new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]))]))
  const links = []
  const destinations = new Set()
  const errors = []
  for (const [page, html] of pages) {
    for (const match of html.matchAll(/<a\b([^>]*?)href="([^"]*)"([^>]*)>([\s\S]*?)<\/a>/g)) {
      const href = match[2].replaceAll("&amp;", "&")
      const label = match[4].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
      const url = new URL(href, "https://toolmeta.test" + page)
      links.push({ page, href, label })
      destinations.add(url.pathname + url.search + url.hash + (url.origin === "https://toolmeta.test" ? "" : " @ " + url.origin))
      if (!href || href === "#" || /aezcheck|fb2\.aez|javascript:/i.test(href)) errors.push({ page, href, reason: "placeholder/legacy URL" })
      if (url.origin === "https://toolmeta.test") {
        const target = url.pathname.replace(/\/$/, "") || "/"
        if (!pages.has(target)) errors.push({ page, href, reason: "missing route" })
        else if (url.hash && !ids.get(target).has(decodeURIComponent(url.hash.slice(1)))) errors.push({ page, href, reason: "missing anchor" })
      } else assert.equal(url.href, "https://app.toolmeta.io/", "Unconfirmed external URL: " + href)
    }
  }
  assert.deepEqual(errors, [])
  for (const path of ["/", "/pricing", "/contact", "/terms", "/privacy"]) {
    const html = pages.get(path)
    assert.match(html, /<a href="\/" class="logo-link"/)
    assert.match(html, /href="\/"\s+class="ft-logo-link"/)
  }
  for (const id of ["features", "benefits", "workflow", "faq"]) assert.ok(ids.get("/").has(id))

  // A history/location harness, not a real browser: verify push/back/forward and
  // scroll-entry bookkeeping without replacing the project's router.
  const code = ts.transpileModule(fs.readFileSync("src/route.ts", "utf8").replace("import.meta.env.BASE_URL", '"/"'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  const window = new EventTarget()
  window.location = new URL("https://toolmeta.test/?lang=ru")
  window.scrollX = 0; window.scrollY = 320
  const entries = [{ href: window.location.href, state: null }]
  let index = 0
  const visit = () => { window.location = new URL(entries[index].href); window.dispatchEvent(new Event("popstate")) }
  window.history = {
    get state() { return entries[index].state },
    scrollRestoration: "auto",
    replaceState(state, _title, href) { entries[index] = { state, href: href ? new URL(href, window.location).href : window.location.href }; window.location = new URL(entries[index].href) },
    pushState(state, _title, href) { entries.splice(index + 1); entries.push({ state, href: new URL(href, window.location).href }); index++; window.location = new URL(entries[index].href) },
    back() { if (index) { index--; visit() } },
    forward() { if (index + 1 < entries.length) { index++; visit() } },
  }
  const context = { exports: {}, require: () => ({ useSyncExternalStore() {} }), window, URL, Event, Date, Map }
  vm.runInNewContext(code, context)
  const router = context.exports
  const stop = router.trackNavigationScroll()
  const initialKey = window.history.state.toolmetaEntry
  router.navigate("/pricing")
  assert.equal(window.location.pathname, "/pricing")
  assert.equal(router.navigationScroll().kind, "push")
  window.scrollY = 180
  window.dispatchEvent(new Event("scroll"))
  router.navigate("/#faq")
  assert.equal(window.location.hash, "#faq")
  window.history.back()
  assert.equal(window.location.pathname, "/pricing")
  assert.equal(router.navigationScroll().kind, "pop")
  assert.equal(router.navigationScroll().position.top, 180)
  window.history.back()
  assert.equal(window.location.search, "?lang=ru")
  assert.equal(window.history.state.toolmetaEntry, initialKey)
  assert.equal(router.navigationScroll().position.top, 320)
  window.history.forward()
  assert.equal(window.location.pathname, "/pricing")
  router.navigate("/guide/en", { preserveScroll: true })
  assert.equal(router.navigationScroll().preserve, true)
  stop()
  assert.equal(window.history.scrollRestoration, "auto")

  production = await preview({ preview: { host: "127.0.0.1", port: 0 }, logLevel: "silent" })
  const origin = "http://127.0.0.1:" + production.httpServer.address().port
  let deepLinks = 0
  for (const path of pages.keys()) {
    const response = await fetch(origin + path)
    assert.equal(response.status, 200, path)
    assert.match(await response.text(), /id="root"/)
    const file = "dist" + (path === "/" ? "" : path) + "/index.html"
    assert.ok(fs.existsSync(file), "Physical route entry: " + file)
    deepLinks++
  }
  const report = {
    renderedPages: pages.size, checkedLinkOccurrences: links.length,
    uniqueDestinations: destinations.size, brokenLinks: errors,
    missingOfficialUrls: [],
    note: "No unconfirmed social URL was invented; the existing Website Toolmeta icon points to /.",
    historyHarness: "push/back/forward and per-entry scroll positions passed (simulated, not browser)",
    directProductionBuildRoutes: deepLinks,
    viewportCoverage: "Desktop/mobile share the same Header/Footer link DOM; visual viewport and interaction QA not performed.",
    browserQA: "Not performed; no screenshots or live browser interaction claimed.",
    externalDestinations: [...new Set(links.filter(link => /^https?:/.test(link.href)).map(link => link.href))],
  }
  fs.writeFileSync(output + "/report.json", JSON.stringify(report, null, 2) + "\n")
  fs.writeFileSync(output + "/links.json", JSON.stringify(links, null, 2) + "\n")
  console.log(JSON.stringify(report, null, 2))
} finally {
  if (production) await new Promise(resolve => production.httpServer.close(resolve))
  await server.close()
}

import assert from "node:assert/strict"
import fs from "node:fs"
import vm from "node:vm"
import ts from "typescript"
import { createServer, preview } from "vite"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

const codes = ["vi", "en", "ru", "th", "zh"]
const catalogs = Object.fromEntries(codes.map(code => [code, JSON.parse(fs.readFileSync(`src/i18n/locales/${code}.json`, "utf8"))]))
const lookup = JSON.parse(fs.readFileSync("src/i18n/locales/lookup.json", "utf8"))
const sourceKeys = Object.keys(catalogs.vi).sort()
for (const code of codes) {
  assert.deepEqual(Object.keys(catalogs[code]).sort(), sourceKeys)
  for (const key of sourceKeys) {
    assert.ok(catalogs[code][key].trim(), key)
    assert.deepEqual((catalogs[code][key].match(/\{\d+\}/g) ?? []).sort(), (catalogs.vi[key].match(/\{\d+\}/g) ?? []).sort(), key)
    assert.ok(!/Telegram Bot|Auto Bot|polling/i.test(catalogs[code][key]))
  }
}

// Verify persistence/URL precedence without browser storage or any network calls.
const storeSource = ts.transpileModule(fs.readFileSync("src/i18n/siteLanguage.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
function createStore(url, saved, blocked = false) {
  const storage = new Map(saved ? [["toolmeta-language", saved]] : [])
  const window = new EventTarget()
  window.location = new URL(url, "https://toolmeta.test")
  window.localStorage = { getItem(key) { if (blocked) throw Error("blocked"); return storage.get(key) ?? null }, setItem(key, value) { if (blocked) throw Error("blocked"); storage.set(key, value) } }
  window.history = { state: null, replaceState(_state, _title, href) { window.location = new URL(href, window.location) } }
  const document = { documentElement: { lang: "" } }
  const context = { exports: {}, require: () => ({ useSyncExternalStore: () => null }), window, document, URL, URLSearchParams }
  vm.runInNewContext(storeSource, context)
  return { ...context.exports, storage, window, document }
}
for (const [url, stored, blocked, expected] of [["/?lang=en", "ru", false, "en"], ["/?lang=invalid", "th", false, "th"], ["/", null, false, "vi"], ["/?lang=zh", "ru", true, "zh"], ["/", null, true, "vi"]]) assert.equal(createStore(url, stored, blocked).siteLanguageStore.getSnapshot().code, expected)
const persistent = createStore("/", "en")
persistent.siteLanguageStore.select(persistent.languages.find(language => language.code === "ru"))
assert.equal(persistent.storage.get("toolmeta-language"), "ru")
assert.equal(createStore("/pricing", persistent.storage.get("toolmeta-language")).siteLanguageStore.getSnapshot().code, "ru")
persistent.window.location = new URL("https://toolmeta.test/contact")
persistent.window.dispatchEvent(new Event("toolmeta:navigate"))
assert.equal(persistent.siteLanguageStore.getSnapshot().code, "ru")
persistent.window.location = new URL("https://toolmeta.test/?lang=th")
persistent.window.dispatchEvent(new Event("popstate"))
assert.equal(persistent.siteLanguageStore.getSnapshot().code, "th")
assert.equal(persistent.document.documentElement.lang, "th")

const server = await createServer({ cacheDir: ".tmp/vite-i18n-qa", server: { middlewareMode: true, watch: null, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: "custom", logLevel: "error" })
let production
try {
  const { siteLanguageStore, languages } = await server.ssrLoadModule("/src/i18n/siteLanguage.ts")
  siteLanguageStore.getServerSnapshot = siteLanguageStore.getSnapshot
  assert.equal(languages[1].flag, "🇬🇧")
  const { t, translateDOMProps, uiMessageSource } = await server.ssrLoadModule("/src/i18n/translate.ts")
  assert.equal(uiMessageSource("Please select a request type."), "Vui lòng chọn loại yêu cầu.")
  assert.equal(uiMessageSource("Unknown upstream detail"), null)
  assert.equal(t("⌕ \u00a0 Tìm kiếm...", "en"), "⌕ Search...")
  const components = []
  for (const file of ["/src/App.tsx", "/src/pages/PricingPage.tsx", "/src/pages/ContactPage.tsx"]) components.push((await server.ssrLoadModule(file)).default)
  const { default: Guide } = await server.ssrLoadModule("/src/components/guide/GuideApp.tsx")
  const { default: Legal } = await server.ssrLoadModule("/src/components/legal/LegalPage.tsx")
  const { legalDocuments } = await server.ssrLoadModule("/src/components/legal/legal-content.ts")
  const content = await server.ssrLoadModule("/src/components/guide/guideContent.ts")
  const { guideText } = await server.ssrLoadModule("/src/i18n/guide/translate.ts")
  const { default: GuideArticle } = await server.ssrLoadModule("/src/components/guide/GuideArticleContent.tsx")
  const guideDictionary = JSON.parse(fs.readFileSync("src/i18n/guide/en.json", "utf8"))
  for (const file of ["guideEnglishSource.json", "guideEnglishTables.json", "guideEnglishUi.json"]) {
    for (const source of JSON.parse(fs.readFileSync("scripts/" + file, "utf8"))) if (source.trim()) { const key = source.trim().replace(/\s+/g, " "); assert.ok(guideDictionary[key] || lookup[key], source) }
  }
  let renders = 0
  for (const language of languages) {
    siteLanguageStore.select(language)
    const localizedInput = translateDOMProps("input", { value: "Nguyễn Văn A", placeholder: "Họ và tên của bạn" })
    assert.equal(localizedInput.value, "Nguyễn Văn A", "Never translate user input")
    assert.equal(translateDOMProps("option", { value: "technical", children: "Lỗi kỹ thuật" }).value, "technical")
    for (const [source, key] of Object.entries(lookup)) assert.equal(t(source), catalogs[language.code][key])
    assert.ok(t("Ngôn ngữ Footer: English").includes("English"))
    for (const Component of components) {
      const html = renderToStaticMarkup(React.createElement(Component))
      if (language.code !== "vi") {
        const remaining = [...html.matchAll(/>([^<>]+)</g)].map(match => match[1]).filter(text => /[ăâđêôơưĂÂĐÊÔƠƯ\u1ea0-\u1ef9]/u.test(text) && !text.includes("Tiếng Việt"))
        assert.deepEqual(remaining, [], language.code + " unlocalized visible text")
        for (const [,value] of html.matchAll(/(?:aria-label|placeholder|title|alt)="([^"]*)"/g)) assert.ok(!/[ăâđêôơưĂÂĐÊÔƠƯ\u1ea0-\u1ef9]/u.test(value.replace("Tiếng Việt", "")), value)
      }
      assert.ok(html.includes(language.name))
      assert.ok(html.includes(t("Bắt đầu miễn phí")), "CTA uses the selected locale")
      assert.ok(!/Telegram Bot|Auto Bot|polling/.test(html))
      renders++
    }
    const guide = renderToStaticMarkup(React.createElement(Guide, { path: "/guide" }))
    assert.ok(guide.includes('lang="' + (language.code === "en" ? "en" : "vi") + '"'))
    assert.ok(!guide.includes("not yet published"))
    if (language.code === "en") {
      const remaining = [...guide.matchAll(/>([^<>]+)</g)].map(match => match[1]).filter(text => /[ăâđêôơưĂÂĐÊÔƠƯ\u1ea0-\u1ef9]/u.test(text) && !text.includes("Tiếng Việt"))
      assert.deepEqual(remaining, [], "English guide home UI")
    }
    if (["ru", "th", "zh"].includes(language.code)) assert.ok(guide.includes('class="gd-language-notice"'))
    assert.equal(siteLanguageStore.getSnapshot().code, language.code, "Guide fallback must not change global locale")
    for (const kind of ["terms", "privacy"]) {
      const html = renderToStaticMarkup(React.createElement(Legal, { kind }))
      const index = language.code === "en" ? 1 : 0
      for (const section of legalDocuments[kind].sections) for (const paragraph of section.paragraphs) assert.ok(html.includes(renderToStaticMarkup(React.createElement("p", null, paragraph[index]))))
      assert.ok(html.includes('class="legal-document-selector"'))
    }
  }
  let englishGuides = 0
  siteLanguageStore.select(languages[1])
  for (const summary of content.articles) {
    const viArticle = await content.loadArticle(summary.slug, "vi")
    const enArticle = await content.loadArticle(summary.slug, "en")
    assert.equal(enArticle.locale, "en")
    assert.equal(enArticle.title, guideText(viArticle.title, "en"))
    assert.deepEqual(enArticle.sourcePages, viArticle.sourcePages)
    assert.equal(enArticle.sections.length, viArticle.sections.length)
    enArticle.sections.forEach((section, i) => {
      const original = viArticle.sections[i]
      assert.equal(section.id, original.id)
      assert.equal(section.blocks.length, original.blocks.length)
      section.blocks.forEach((block, j) => {
        assert.equal(block.type, original.blocks[j].type)
        if (block.type === "image") { assert.equal(block.src, original.blocks[j].src); assert.equal(block.afterStep, original.blocks[j].afterStep) }
        if (block.type === "step") assert.equal(block.number, original.blocks[j].number)
      })
    })
    const html = renderToStaticMarkup(React.createElement(GuideArticle, { article: enArticle, onImage: () => {} }))
    assert.ok(html.includes(enArticle.title.replaceAll("&", "&amp;")))
    assert.ok(!html.includes("Người dùng"))
    englishGuides++
  }
  const englishIndex = await content.getSearchIndex("en")
  assert.ok(content.searchRecords(englishIndex, "install extension").some(record => record.article.slug === "getting-started/install-extension"))
  siteLanguageStore.select(languages[0])
  production = await preview({ preview: { host: "127.0.0.1", port: 0 }, logLevel: "silent" })
  const origin = "http://127.0.0.1:" + production.httpServer.address().port
  for (const route of ["/", "/pricing", "/contact", "/guide", "/terms", "/privacy"]) for (const code of codes) assert.equal((await fetch(origin + route + "?lang=" + code)).status, 200)
  const report = {
    sourceKeys: sourceKeys.length, keysPerLocale: Object.fromEntries(codes.map(code => [code, sourceKeys.length])), missingKeys: 0,
    namespaces: [...new Set(sourceKeys.map(key => key.split(".")[0]))], homepagePricingContactRenders: renders,
    unlocalizedVisibleVietnameseInTargetMainPages: 0, inputValuesAndBackendEnums: "preserved", persistenceAndUrlPrecedence: "passed",
    legalContent: "Original VI/EN strings unchanged; no RU/TH/ZH legal translation", guide: "48 English public articles translated with screenshots, source pages and step numbering preserved; RU/TH/ZH use a disclosed document-language fallback", englishGuides, englishGuideTextBindings: Object.keys(guideDictionary).length,
    productionLocaleRoutesTested: 30,
    sourceTextBindings: "Vietnamese UI source literals remain as catalog identifiers bound through the shared JSX runtime. Guide uses its VI/EN document namespace with the same global store. Original legal source opts out of automatic translation.",
    seo: "HTML lang/title/description/OG metadata update client-side. Static defaults are Vietnamese; real /guide/en paths have English static metadata. No invented hreflang routes; existing noindex setting is unchanged.",
    incomplete: [],
    changedFiles: [
      ...fs.readdirSync("src/i18n", { recursive: true }).map(file => "src/i18n/" + file.replaceAll("\\", "/")).filter(file => fs.statSync(file).isFile()),
      ...fs.readdirSync("src/components/guide").filter(file => /\.tsx$/.test(file)).map(file => "src/components/guide/" + file),
      "src/components/guide/guideContent.ts", "src/components/guide/types.ts", "src/components/guide/guide.css", "src/content/guide/en/status.json",
      "src/main.tsx", "src/RootRouter.tsx", "src/components/language/LanguageFlag.tsx", "src/components/footer/SiteFooter.tsx",
      "src/components/legal/LegalPage.tsx", "src/components/legal/legal-page.css", "src/components/contact/contactApi.ts", "src/pages/ContactPage.tsx",
      "src/components/benefits/BenefitBulkDemo.tsx", "src/components/highlights/HighlightBulkDemo.tsx", "src/components/highlights/HighlightSearchDemo.tsx",
      "tsconfig.json", "vite.config.ts", ".figma/make/site.json", "CONTACT_API_HANDOFF.md",
      "scripts/buildI18n.mjs", "scripts/i18nTranslations.mjs", "scripts/i18nSource.json", "scripts/auditI18n.mjs", "scripts/verifyI18n.mjs",
      "scripts/buildGuideEnglish.mjs", "scripts/guideEnglishTranslations.mjs", "scripts/guideEnglishSource.json", "scripts/guideEnglishTables.json", "scripts/guideEnglishUi.json",
      "scripts/localizedStaticMeta.ts", "scripts/guideStaticRoutes.ts", "scripts/pricingStaticRoute.ts", "scripts/contactStaticRoute.ts", "scripts/legalStaticRoutes.ts", "scripts/verifyGuide.mjs", "scripts/verifyLegal.mjs",
    ],
    developerWorkflow: ["Add/update source messages in scripts/i18nTranslations.mjs; generate catalogs with node scripts/buildI18n.mjs.", "Guide English lives in scripts/guideEnglishTranslations.mjs; node scripts/buildGuideEnglish.mjs reuses matching shared translations.", "Run node scripts/auditI18n.mjs for missing source bindings, TypeScript, production build and node scripts/verifyI18n.mjs.", "Do not run legal text through automatic UI translation; preserve its original VI/EN draft."],
    sourceContentNotes: ["Actual legacy extension/menu names in guide procedures are retained and explained in English; screenshots are not translated.", "The original support article says no public support link was configured. The current Contact page exists, but its backend is still unconfigured by default.", "Legal wording still requires owner approval and retains the original draft date."],
    browserUnverified: ["Visual layout at 1440, 768, 390 and 360px across locales", "Live dropdown keyboard/pointer and contact form state during locale changes", "Rendered SVG label fit and motion in a real browser"],
  }
  fs.mkdirSync(".tmp/i18n", { recursive: true })
  fs.writeFileSync(".tmp/i18n/validation.json", JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
} finally {
  if (production) await new Promise(resolve => production.httpServer.close(resolve))
  await server.close()
}

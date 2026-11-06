import assert from "node:assert/strict"
import fs from "node:fs"
import crypto from "node:crypto"
import vm from "node:vm"
import ts from "typescript"
import { createServer, preview } from "vite"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

const sourcePath = ".tmp/legal-original/legal-content.ts"
assert.ok(fs.existsSync(sourcePath), "Extract the original FB2 legal files to .tmp/legal-original before this source comparison")
const source = fs.readFileSync(sourcePath, "utf8")
const reference = { exports: {} }
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, reference)
const original = JSON.parse(JSON.stringify(reference.exports.legalDocuments))
const server = await createServer({ cacheDir: ".tmp/vite-legal-qa", server: { middlewareMode: true, watch: null, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: "custom", logLevel: "error" })
let production
try {
  const { legalDocuments } = await server.ssrLoadModule("/src/components/legal/legal-content.ts")
  const changes = []
  function compare(before, after, path = "legalDocuments") {
    if (typeof before === "string") {
      assert.equal(after, before.replaceAll("FB2 Aezcheck", "Toolmeta"), path)
      if (before !== after) changes.push({ path, before, after })
    } else {
      assert.deepEqual(Object.keys(after), Object.keys(before), path)
      for (const key of Object.keys(before)) compare(before[key], after[key], path + "." + key)
    }
  }
  compare(original, legalDocuments)
  const { default: Legal } = await server.ssrLoadModule("/src/components/legal/LegalPage.tsx")
  const { siteLanguageStore, languages } = await server.ssrLoadModule("/src/i18n/siteLanguage.ts")
  const originalSnapshot = siteLanguageStore.getServerSnapshot
  siteLanguageStore.getServerSnapshot = siteLanguageStore.getSnapshot
  let documentsRendered = 0
  try {
    for (const kind of ["terms", "privacy"]) {
      for (const language of languages) {
        siteLanguageStore.select(language)
        const index = language.code === "en" ? 1 : 0
        const html = renderToStaticMarkup(React.createElement(Legal, { kind }))
        const doc = legalDocuments[kind]
        assert.ok(html.includes(renderToStaticMarkup(React.createElement("h1", null, doc.title[index]))))
        assert.ok(html.includes(index ? "Draft for review" : "Bản dự thảo"))
        assert.ok(html.includes(index ? "Updated October 11, 2026" : "Cập nhật ngày 11/10/2026"))
        assert.ok(html.includes('lang="' + (index ? "en" : "vi") + '"'))
        assert.ok(html.includes(renderToStaticMarkup(React.createElement("p", { className: "legal-intro" }, doc.intro[index]))))
        assert.equal((html.match(/class="legal-section"/g) ?? []).length, doc.sections.length)
        for (const section of doc.sections) {
          assert.ok(html.includes('id="legal-' + section.id + '"'))
          assert.ok(html.includes('href="/' + kind + '?section=' + section.id + '"'))
          for (const paragraph of section.paragraphs) assert.ok(html.includes(renderToStaticMarkup(React.createElement("p", null, paragraph[index]))))
        }
        const notice = html.includes('class="legal-language-notice"')
        assert.equal(notice, !["vi", "en"].includes(language.code))
        assert.ok(html.includes('href="/terms"') && html.includes('href="/privacy"'))
        assert.ok(html.includes('href="/#features"'))
        assert.ok(!/Aezcheck|AEZCHECK|Telegram|Auto Bot|fb2\.aezcheck/i.test(html))
        documentsRendered++
      }
    }
  } finally { siteLanguageStore.select(languages[0]); siteLanguageStore.getServerSnapshot = originalSnapshot }

  const reviewSpecs = [
    ["privacy", "scope", 0, "Confirm scheduled synchronization and actual service scope."],
    ["privacy", "data", 0, "The current selector persists five languages under toolmeta-language; the original legal wording names VI/EN only. Confirm the preference scope before approval."],
    ["privacy", "data", 1, "Confirm actual asset fields, access scope and software data flows."],
    ["privacy", "data", 2, "Confirm operational/support data and retention. Contact form is Telegram-only, has no attachments and no configured backend by default."],
    ["privacy", "purpose", 0, "Confirm actual synchronization, task execution and support processing."],
    ["privacy", "local-storage", 0, "Confirm the local-first implementation and sensitive session processing; this is not established by landing-page source."],
    ["privacy", "local-storage", 1, "Confirm actual Meta/third-party flows and extension permissions."],
    ["privacy", "local-storage", 2, "Confirm deletion effects for extension data and third-party copies. The landing now persists language selection in localStorage."],
    ["privacy", "sharing", 1, "Confirm infrastructure/support processors and contractual obligations."],
    ["privacy", "sharing", 2, "Operator must confirm deployment location, processors and cross-border transfers."],
    ["privacy", "retention", 0, "The language preference now persists in localStorage; contact form data remains in memory. Confirm extension storage behavior and policy scope."],
    ["privacy", "retention", 1, "Official data retention/deletion schedule is still unconfirmed."],
    ["privacy", "rights", 0, "Confirm operator workflow and official contact for data-subject requests."],
    ["privacy", "security", 1, "Confirm incident response workflow and official receiving contact."],
    ["privacy", "contact", 0, "Operator identity and privacy-request contact remain unconfirmed. /contact is not proof of an operational receiving backend."],
    ["terms", "access", 0, "Review references to administrator/partner operations; preserve legal risk disclosure without presenting internal tools as marketing benefits."],
    ["terms", "bulk", 0, "Confirm automation/threading/access/payment-operation scope and public disclosure approval."],
    ["terms", "bulk", 1, "Confirm scheduled sync and backup behavior; do not infer current plan entitlements."],
    ["terms", "plan", 0, "Preserve the source's explicit statement that demo figures do not establish limits or lifetime access."],
    ["terms", "termination", 0, "Confirm stopping automated tasks, revocation and extension removal behavior."],
    ["terms", "disputes", 2, "Operator, complaint contact, governing language and law require owner confirmation."],
  ]
  const review = reviewSpecs.map(([kind, id, paragraph, reason]) => {
    const section = legalDocuments[kind].sections.find(item => item.id === id)
    return { document: kind, sectionId: id, heading: section.title, paragraphNumber: paragraph + 1, exactText: section.paragraphs[paragraph], reason, status: "REQUIRES_OWNER_REVIEW" }
  })
  const sectionCounts = Object.fromEntries(Object.entries(legalDocuments).map(([kind, doc]) => [kind, { sections: doc.sections.length, paragraphsPerLanguage: doc.sections.reduce((sum, section) => sum + section.paragraphs.length, 0) }]))
  fs.mkdirSync(".tmp/legal-review", { recursive: true })
  fs.writeFileSync(".tmp/legal-review/report.json", JSON.stringify({
    source: "C:/Code/Landing Fb2.aezcheck (2).zip", sourceContentSha256: crypto.createHash("sha256").update(source).digest("hex"),
    status: "DRAFT_NOT_APPROVED", originalUpdatedDate: "2026-10-11", sectionCounts, rebrandFields: changes,
    contentChanges: "Only the reviewed literal product reference FB2 Aezcheck became Toolmeta; every other string, section ID and array order matches the reference.",
    oldDomainReferencesInLegalContent: source.match(/https?:\/\/[^\s\"<>]+/g) ?? [],
    internalFeatureScan: "No named Telegram/Bot feature occurs in the original legal content; generic automation/sync and sensitive operation disclosures are preserved and flagged below.",
    integrationDifferences: ["Original hash routes adapted to existing pathname router /terms and /privacy; ?section links retained.", "Current official Toolmeta Header/Footer and shared language store reused; no old logo or separate language persistence imported.", "Legal-only Forest Green wrapper and Neon Lime accents; original two-column/sidebar/numbering/mobile-details layout preserved.", "Top padding reduced by 78/68px to account for the current sticky header occupying document flow.", "Lucide icons replaced by equivalent inline SVGs because this project has no lucide dependency.", "Actual document language label and explicit Vietnamese fallback notice added for RU/TH/ZH; no legal translation invented."],
    ownerReview: review,
  }, null, 2))
  production = await preview({ preview: { host: "127.0.0.1", port: 0 }, logLevel: "silent" })
  const origin = "http://127.0.0.1:" + production.httpServer.address().port
  for (const kind of ["terms", "privacy"]) {
    assert.ok(fs.existsSync(`dist/${kind}/index.html`))
    for (const route of [`/${kind}`, `/${kind}/`, `/${kind}?section=scope`]) assert.equal((await fetch(origin + route)).status, 200, route)
  }
  const result = { sectionCounts, rebrandedFields: changes.length, ownerReviewParagraphs: review.length, documentsRenderedAcrossLanguages: documentsRendered, exactContentComparison: "passed", anchorsAndLanguageFallback: "passed", productionRoutes: "passed", unverified: ["Browser scroll-active behavior and Back/Forward", "Mobile visual layout and keyboard interaction"] }
  fs.writeFileSync(".tmp/legal-review/validation.json", JSON.stringify(result, null, 2))
  console.log(JSON.stringify(result, null, 2))
} finally {
  if (production) await new Promise(resolve => production.httpServer.close(resolve))
  await server.close()
}

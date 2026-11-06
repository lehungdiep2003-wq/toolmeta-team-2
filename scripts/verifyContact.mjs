import assert from "node:assert/strict"
import fs from "node:fs"
import { createServer, preview } from "vite"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

// Isolated QA only; injected responses below never run in the production UI.
const server = await createServer({ cacheDir: ".tmp/vite-contact-qa", server: { middlewareMode: true, watch: null, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: "custom", logLevel: "error" })
let production
try {
  const data = await server.ssrLoadModule("/src/components/contact/contactData.ts")
  const api = await server.ssrLoadModule("/src/components/contact/contactApi.ts")
  const valid = { fullName: "Nguyễn Văn A", telegramUsername: "@valid_name", requestType: "usage", message: "Tôi cần hỗ trợ cài đặt tiện ích.", privacyAccepted: true }
  assert.deepEqual(data.validateContact(valid), {})
  assert.equal(Object.keys(data.validateContact(data.emptyContactForm)).length, 5)
  for (const [field, value] of [["fullName", "A"], ["fullName", "a".repeat(101)], ["telegramUsername", ""], ["requestType", "invalid"], ["message", "short"], ["message", "a".repeat(3001)], ["privacyAccepted", false]]) assert.ok(data.validateContact({ ...valid, [field]: value })[field], field)
  for (const size of [10, 3000]) assert.deepEqual(data.validateContact({ ...valid, message: "a".repeat(size) }), {})
  assert.deepEqual(data.validateContact({ ...valid, fullName: "😀".repeat(100) }), {})
  for (const telegramUsername of ["@valid_name", "https://t.me/valid_name", "valid_name", "  @Valid_Name  ", "https://t.me/valid_name/", "a".repeat(5), "a".repeat(32)]) assert.deepEqual(data.validateContact({ ...valid, telegramUsername }), {})
  for (const telegramUsername of ["abcd", "a".repeat(33), "@1invalid", "https://t.me/+invite", "@bad name", "https://t.me/valid_name?start=1", "https://t.me/valid_name#hash", "https://t.me/valid_name/123", "https://t.me.evil.test/valid_name", "https://evil.test@t.me/valid_name", "https://t.me/share", "http://t.me/valid_name", "0912345678", "a@example.com", "@tên_khách"]) assert.ok(data.validateContact({ ...valid, telegramUsername }).telegramUsername, telegramUsername)
  const copy = JSON.stringify(valid)
  const payload = data.toContactPayload(valid)
  assert.deepEqual(Object.keys(payload).sort(), ["fullName", "telegramUsername", "requestType", "message", "privacyAccepted"].sort())
  assert.equal(JSON.stringify(valid), copy)
  assert.equal(data.toContactPayload({ ...valid, telegramUsername: "https://t.me/VALID_Name" }).telegramUsername, "@valid_name")
  let calls = 0
  await assert.rejects(api.submitContact(payload, { endpoint: "", fetcher: async () => { calls++; throw Error() } }), error => error.code === "NOT_CONFIGURED")
  assert.equal(calls, 0)
  const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } })
  const options = body => ({ endpoint: "/api/contact", fetcher: async () => json(body) })
  await assert.rejects(api.submitContact(payload, options({ success: true })), error => error.code === "INVALID_RESPONSE")
  await assert.rejects(api.submitContact(payload, options({ success: false, requestId: "test" })), error => error.code === "INVALID_RESPONSE")
  await assert.rejects(api.submitContact(payload, { endpoint: "/api/contact", fetcher: async () => new Response("<html>fallback</html>", { headers: { "Content-Type": "text/html" } }) }), error => error.code === "INVALID_RESPONSE")
  await assert.rejects(api.submitContact(payload, { endpoint: "/api/contact", fetcher: async () => { throw new Error("network") } }), error => error.code === "NETWORK")
  await assert.rejects(api.submitContact(payload, { endpoint: "/api/contact", fetcher: async () => json({ success: false, fieldErrors: { telegramUsername: "Invalid username", secret: "ignore" } }, 422) }), error => error.code === "REJECTED" && error.fieldErrors.telegramUsername === "Invalid username" && !error.fieldErrors.secret)
  await assert.rejects(api.submitContact(payload, { endpoint: "/api/contact", fetcher: async () => json({ success: false }, 429) }), error => error.code === "REJECTED")
  let release
  let settled = false
  const pending = api.submitContact({ ...payload, contactChannel: "legacy", contactValue: "legacy" }, { endpoint: "/api/contact", fetcher: async (_url, init) => { assert.equal(init.method, "POST"); assert.deepEqual(JSON.parse(init.body), payload); return new Promise(resolve => { release = resolve }) } }).then(receipt => { settled = true; return receipt })
  assert.equal(settled, false, "No success while request is pending")
  release(json({ success: true, requestId: "TEST-ONLY-RECEIPT" }, 201))
  assert.equal((await pending).requestId, "TEST-ONLY-RECEIPT")
  const { default: Contact } = await server.ssrLoadModule("/src/pages/ContactPage.tsx")
  const { default: App } = await server.ssrLoadModule("/src/App.tsx")
  const html = renderToStaticMarkup(React.createElement(Contact))
  const home = renderToStaticMarkup(React.createElement(App))
  const form = html.match(/<form[\s\S]*?<\/form>/)[0]
  assert.ok(!/contactChannel|contactValue|Email|Zalo|type="tel"/.test(form))
  assert.equal((form.match(/<select/g) ?? []).length, 1)
  assert.ok(form.includes('class="ct-telegram-input"'))
  assert.ok(form.includes('placeholder="@username hoặc https://t.me/username"'))
  for (const field of Object.keys(data.emptyContactForm)) { assert.ok(html.includes('id="ct-' + field + '"')); assert.ok(html.includes('for="ct-' + field + '"')) }
  assert.ok(html.includes('href="/guide"'))
  assert.ok(html.includes('href="https://app.toolmeta.io"'))
  assert.ok(html.includes('aria-current="page"'))
  assert.ok(home.includes('href="/contact"') && home.includes('id="pricing"') && home.includes('id="faq"'))
  assert.ok(!/localStorage|sessionStorage/.test(fs.readFileSync("src/pages/ContactPage.tsx", "utf8")))
  production = await preview({ preview: { host: "127.0.0.1", port: 0 }, logLevel: "silent" })
  const origin = "http://127.0.0.1:" + production.httpServer.address().port
  assert.ok(fs.existsSync("dist/contact/index.html"))
  for (const path of ["/", "/contact", "/contact/", "/pricing", "/guide"]) assert.equal((await fetch(origin + path)).status, 200, path)
  console.log("PASS: Telegram formats/boundaries/profile-link validation, exact five-field normalized payload, legacy fields excluded, no channel selector, errors/HTML rejection, pending/confirmed responses, labels and production routes; no real backend submitted.")
} finally {
  if (production) await new Promise(resolve => production.httpServer.close(resolve))
  await server.close()
}

import fs from "node:fs"
import crypto from "node:crypto"
import { rows, extra } from "./i18nTranslations.mjs"
const source = JSON.parse(fs.readFileSync("scripts/i18nSource.json", "utf8"))
const namespaces = [[5,"header"],[13,"benefits"],[37,"assets"],[42,"header"],[51,"hero"],[54,"benefits"],[57,"assets"],[68,"features"],[88,"assets"],[107,"benefits"],[125,"errors"],[145,"faq"],[152,"experience"],[168,"footer"],[176,"hero"],[194,"features"],[224,"pricing"],[244,"experience"],[261,"workflow"],[298,"contact"],[312,"pricing"],[999,"common"]]
const locales = { vi: {}, en: {}, ru: {}, th: {}, zh: {} }
const lookup = {}
function add(entry, translations, namespace) {
  if (!translations || translations.length !== 4 || translations.some(text => !text)) throw new Error("Missing translations: " + entry.text)
  const key = namespace + "." + crypto.createHash("sha256").update(entry.text).digest("hex").slice(0, 10)
  if (locales.vi[key]) throw new Error("Duplicate key")
  locales.vi[key] = entry.text
  lookup[entry.text] = key
  ;["en", "ru", "th", "zh"].forEach((locale, i) => { locales[locale][key] = translations[i] })
}
source.forEach((entry, index) => add(entry, rows[index], namespaces.find(([limit]) => index <= limit)[1]))
extra.forEach(([text, ...translations]) => add({ text }, translations, "common"))
fs.mkdirSync("src/i18n/locales", { recursive: true })
for (const [locale, values] of Object.entries(locales)) fs.writeFileSync(`src/i18n/locales/${locale}.json`, JSON.stringify(values, null, 2) + "\n")
fs.writeFileSync("src/i18n/locales/lookup.json", JSON.stringify(lookup, null, 2) + "\n")
console.log(source.length + " source keys; four complete target catalogs generated.")

import fs from "node:fs"
import { articles, tables, ui } from "./guideEnglishTranslations.mjs"
const catalog = {}
for (const [file, targets] of [["guideEnglishSource.json", articles], ["guideEnglishTables.json", tables], ["guideEnglishUi.json", ui]]) {
  const sources = JSON.parse(fs.readFileSync("scripts/" + file, "utf8"))
  if (sources.length !== targets.length) throw Error(file + ": " + sources.length + " sources vs " + targets.length + " translations")
  sources.forEach((source, index) => {
    if (typeof targets[index] !== "string") throw Error("Missing translation " + source)
    const key = source.trim().replace(/\s+/g, " ")
    if (!key) return
    if (catalog[key] && catalog[key] !== targets[index]) throw Error("Conflicting translation " + key)
    catalog[key] = targets[index]
  })
}
catalog["· Trang"] = "· Page"
const commonLookup = JSON.parse(fs.readFileSync("src/i18n/locales/lookup.json", "utf8"))
const commonEnglish = JSON.parse(fs.readFileSync("src/i18n/locales/en.json", "utf8"))
for (const [source, target] of Object.entries(catalog)) {
  if (commonLookup[source] && commonEnglish[commonLookup[source]] === target) delete catalog[source]
}
fs.mkdirSync("src/i18n/guide", { recursive: true })
fs.writeFileSync("src/i18n/guide/en.json", JSON.stringify(catalog, null, 2) + "\n")
console.log(Object.keys(catalog).length + " English Guide text bindings generated.")

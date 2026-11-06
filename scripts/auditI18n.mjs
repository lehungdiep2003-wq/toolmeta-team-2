import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
export function auditStrings() {
  const entries = new Map()
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name).replaceAll("\\", "/")
      if (entry.isDirectory()) { if (!["guide", "legal", "content", "i18n"].includes(entry.name)) walk(file) }
      else if (/\.[tj]sx?$/.test(file)) {
        const tree = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true)
        function visit(node) {
          let text
          if (ts.isJsxText(node) || ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) text = node.text
          else if (ts.isTemplateExpression(node)) text = node.head.text + node.templateSpans.map((span, i) => "{" + i + "}" + span.literal.text).join("")
          if (text && /[À-ỹĐđ]/u.test(text)) {
            text = text.trim().replace(/\s+/g, " ")
            if (text) entries.set(text, [...new Set([...(entries.get(text) ?? []), file])])
          }
          ts.forEachChild(node, visit)
        }
        visit(tree)
      }
    }
  }
  walk("src")
  return [...entries].map(([text, files]) => ({ text, files }))
}
const list = auditStrings()
fs.mkdirSync(".tmp/i18n", { recursive: true })
fs.writeFileSync(".tmp/i18n/source.json", JSON.stringify(list, null, 2))
console.log("Source strings:", list.length)
const lookup = JSON.parse(fs.readFileSync("src/i18n/locales/lookup.json", "utf8"))
const missing = list.filter(entry => !lookup[entry.text])
fs.writeFileSync(".tmp/i18n/source-audit.json", JSON.stringify({ sourceMessages: list.length, missingKeys: missing, bindings: "Shared React/SVG JSX text runtime; Guide has its VI/EN document namespace; legal source opts out." }, null, 2))
console.log("Missing source keys:", missing.length)
if (missing.length) { missing.forEach(entry => console.log(entry.text, entry.files)); process.exitCode = 1 }

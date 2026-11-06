interface Metadata {
  title: string
  description: string
  language?: "vi" | "en"
}
const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
export default function localizedStaticMeta(html: string, metadata: Metadata) {
  return html
    .replace(/<html lang="[^"]*"/, `<html lang="${metadata.language ?? "vi"}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(metadata.title)}</title>`)
    .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*(")/g, (_match, start, end) => start + escape(metadata.description) + end)
    .replace(/(<meta property="og:title" content=")[^"]*(")/g, (_match, start, end) => start + escape(metadata.title) + end)
}

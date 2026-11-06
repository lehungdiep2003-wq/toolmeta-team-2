import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import {createServer,preview} from "vite"
import React from "react"
import {renderToStaticMarkup} from "react-dom/server"
const read=p=>fs.readFileSync(p,"utf8").replace(/^\uFEFF/,"")
const manifest=JSON.parse(read("src/content/guide/manifest.json"))
const audit=JSON.parse(read("dev/guide-review/coverage.json"))
const pageMap=JSON.parse(read("dev/guide-review/source-map.json"))
const imageAudit=JSON.parse(read("dev/guide-review/image-audit.json"))
assert.equal(audit.pdfPagesRead,201)
assert.equal(pageMap.length,201)
assert.equal(imageAudit.length,457)
assert.equal(audit.extractedImageCount,457)
assert.equal(manifest.articles.length,48)
assert.equal(new Set(manifest.articles.map(a=>a.slug)).size,48)
assert.ok(manifest.articles.every(a=>a.status==="PUBLIC"))
const all=manifest.articles.map(summary=>JSON.parse(read("src/content/guide/vi/"+summary.slug.replace(/\//g,"--")+".json")))
const text=JSON.stringify(all)
for(const term of [/telegram/i,/polling/i,/EAAB/,/EAAG/,/\d{10,}/,/Hoàng Nguyễn/,/Hoàng Nguyên/])assert.ok(!term.test(text),String(term))
let pictureCount=0,stepCount=0
for(const article of all){
 assert.ok(article.title&&article.description&&article.sections.length)
 assert.ok(!/AEZ|aezcheck/i.test(article.title))
 const ids=article.sections.map(s=>s.id)
 assert.equal(ids.length,new Set(ids).size)
 const steps=article.sections.flatMap(s=>s.blocks.filter(b=>b.type==="step"))
 stepCount+=steps.length
 for(const section of article.sections)for(const block of section.blocks){
  if(block.type!=="image")continue
  pictureCount++
  assert.ok(fs.existsSync("public"+block.src),block.src)
  assert.ok(imageAudit.some(i=>i.publicDerivatives.some(d=>d.asset===path.basename(block.src)&&d.article===article.slug&&d.page===block.page)))
  if(block.afterStep)assert.ok(steps.some(step=>step.number===block.afterStep))
 }
 assert.ok(fs.existsSync("dist/guide/"+article.slug+"/index.html"),article.slug)
}
assert.equal(pictureCount,32)
const install=all.find(a=>a.slug==="getting-started/install-extension")
assert.deepEqual(install.sections.flatMap(s=>s.blocks.filter(b=>b.type==="step").map(b=>b.number)),Array.from({length:10},(_,i)=>String(i+1)))
assert.ok(!fs.existsSync("dist/dev"))
assert.ok(!fs.existsSync("dist/.tmp"))
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)])}
const distFiles=walk("dist")
assert.ok(!distFiles.some(file=>file.endsWith(".pdf")))
assert.equal(distFiles.filter(file=>file.includes("guide-media")&&file.endsWith(".webp")).length,32)
const bundle=distFiles.filter(file=>/\.(?:js|html|json)$/.test(file)).map(read).join("\n")
for(const term of [/Auto Bot/i,/Bot Telegram/i,/polling/i,/REVIEW_REQUIRED/,/image-audit\.json/,/sections\.json/])assert.ok(!term.test(bundle),"Bundle filter: "+term)
// Historical landing snapshot predates the authorized Pricing, Contact and i18n changes.
// Current checks below verify live navigation and the unchanged public guide corpus.
const server=await createServer({cacheDir:".tmp/vite-guide-qa",server:{middlewareMode:true,watch:null},optimizeDeps:{noDiscovery:true,include:[]},appType:"custom"})
let staticPreview
try{
 const content=await server.ssrLoadModule("/src/components/guide/guideContent.ts")
 for(const a of all){const loaded=await content.loadArticle(a.slug);assert.ok(loaded);assert.equal(loaded.status,"PUBLIC")}
 for(const slug of ["automation/telegram","settings/token","../../dev/guide-review/sections","bm/backup"])assert.equal(await content.loadArticle(slug),null)
 const index=await content.getSearchIndex()
 assert.equal(index.length,48)
 for(const [query,expected] of [["cai dat chrome","getting-started/install-extension"],["loc du lieu","ad/filter"],["xác minh doanh nghiệp","bm/filter"],["Mặc định","page/display-columns"]]){
   assert.ok(content.searchRecords(index,query).some(result=>result.article.slug===expected),query)
 }
 for(const query of ["Telegram","EAAB","polling","mật khẩu Via"])assert.equal(content.searchRecords(index,query).length,0,query)
 assert.equal(content.searchRecords(index,"xyzmissingtoolmeta").length,0)
 const {default:Article}=await server.ssrLoadModule("/src/components/guide/GuideArticleContent.tsx")
 const {default:Toc}=await server.ssrLoadModule("/src/components/guide/GuideTableOfContents.tsx")
 let rendered=0
 for(const a of all){
   const html=renderToStaticMarkup(React.createElement(Article,{article:a,onImage:()=>{}}))
   assert.ok(html.includes("<h1>"))
   const toc=renderToStaticMarkup(React.createElement(Toc,{article:a}))
   for(const [,anchor] of toc.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes('id="'+anchor+'"'))
   rendered++
 }
 const {default:Guide}=await server.ssrLoadModule("/src/components/guide/GuideApp.tsx")
 const home=renderToStaticMarkup(React.createElement(Guide,{path:"/guide"}))
 for(const a of all)assert.ok(home.includes("/guide/"+a.slug))
 const en=renderToStaticMarkup(React.createElement(Guide,{path:"/guide/en"}))
 assert.ok(en.includes('lang="en"') && !en.includes("not yet published"))
 assert.ok(!en.includes("gd-article-header"))
 const {default:App}=await server.ssrLoadModule("/src/App.tsx")
 const landing=renderToStaticMarkup(React.createElement(App))
 const header=landing.match(/<header class="header"[\s\S]*?<\/header>/)[0]
 const footer=landing.match(/<footer id="site-footer"[\s\S]*?<\/footer>/)[0]
 assert.ok(header.includes('href="/guide"')&&footer.includes('href="/guide"'))
 staticPreview=await preview({preview:{host:"127.0.0.1",port:0,strictPort:false},logLevel:"silent"})
 const address=staticPreview.httpServer.address()
 assert.ok(address&&typeof address!=="string")
 const origin="http://127.0.0.1:"+address.port
 for(const route of ["/guide","/guide/en",...all.flatMap(a=>["/guide/"+a.slug+"/","/guide/en/"+a.slug+"/"])]){
   const response=await fetch(origin+route)
   assert.equal(response.status,200,route)
   assert.ok((await response.text()).includes('<div id="root"></div>'))
 }
 const attempts=["/dev/guide-review/sections.json","/.tmp/guide-import/pages.json"]
 for(const route of attempts){const response=await fetch(origin+route);const body=await response.text();assert.ok(body.includes('<html')||response.status===404)}
 const result={pagesInventoried:201,sourceHeadings:audit.sourceHeadingsDetected,publicArticles:48,stepsRendered:stepCount,publicImages:32,sourceImagesExtracted:457,privateClassification:audit.classificationCounts,articlesRendered:rendered,searchAndExclusion:"passed",tocAnchorPairs:"passed",guideLinks:"passed",productionDeepLinksTested:98,privateBundleLeakScan:"passed",landingScope:"navigation preserved; authorized i18n bindings applied",browserInteractionQA:"Unavailable; native browser URL policy previously blocked Computer Use",unverified:["actual desktop/tablet/mobile screenshots","keyboard and dialogs in a real browser","lightbox touch pinch and pan","browser Back/Forward scrolling"]}
 fs.writeFileSync("dev/guide-review/validation.json",JSON.stringify(result,null,2))
 console.log(JSON.stringify(result,null,2))
}finally{
 if(staticPreview)await new Promise(resolve=>staticPreview.httpServer.close(resolve))
 await server.close()
}

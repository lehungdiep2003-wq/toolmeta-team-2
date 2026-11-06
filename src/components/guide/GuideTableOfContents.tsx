/** @jsxImportSource @/i18n/guide */
import { useEffect, useState } from "react"
import type { GuideArticle } from "./types"
export default function GuideTableOfContents({
  article,
}: {
  article: GuideArticle
}) {
  const sections = article.sections.filter((section) =>
    section.blocks.some((item) => item.type !== "image" || !item.afterStep),
  )
  const [active, setActive] = useState(article.sections[0]?.id)
  useEffect(() => {
    setActive(article.sections[0]?.id)
    if (typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries
          .filter((item) => item.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0]
        if (entry) setActive(entry.target.id)
      },
      { rootMargin: "-115px 0px -55% 0px", threshold: 0 },
    )
    article.sections.forEach((section) => {
      const node = document.getElementById(section.id)
      if (node) observer.observe(node)
    })
    return () => observer.disconnect()
  }, [article])
  if (sections.length < 2) return null
  return (
    <aside className="gd-toc">
      <nav aria-label="Mục lục bài viết">
        <strong>Trong bài viết này</strong>
        {sections.map((section) => (
          <a
            key={section.id}
            href={"#" + section.id}
            aria-current={active === section.id ? "location" : undefined}
          >
            {section.title}
          </a>
        ))}
      </nav>
    </aside>
  )
}

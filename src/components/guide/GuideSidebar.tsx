/** @jsxImportSource @/i18n/guide */
import { useEffect, useRef } from "react"
import { articles, categories } from "./guideContent"
import { guideDocumentHref as guideHref } from "./guideContent"
interface LinksProps {
  slug: string
  onNavigate?: () => void
}
interface SidebarProps {
  slug: string
  drawer: boolean
  onClose: () => void
}
function SidebarLinks({ slug, onNavigate }: LinksProps) {
  return (
    <nav aria-label="Danh mục hướng dẫn">
      <a className="gd-home-link" href={guideHref()} onClick={onNavigate}>
        Tất cả hướng dẫn
      </a>
      {categories.map((category) => (
        <details
          key={category.id}
          open={slug.startsWith(category.id + "/") || !slug}
        >
          <summary>
            {category.label}
            <small>
              {
                articles.filter((article) => article.category === category.id)
                  .length
              }
            </small>
          </summary>
          <div>
            {articles
              .filter((article) => article.category === category.id)
              .map((article) => (
                <a
                  href={guideHref(article.slug)}
                  key={article.slug}
                  aria-current={slug === article.slug ? "page" : undefined}
                  onClick={onNavigate}
                >
                  {article.title}
                </a>
              ))}
          </div>
        </details>
      ))}
    </nav>
  )
}
export default function GuideSidebar({ slug, drawer, onClose }: SidebarProps) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!drawer) return
    const previous = document.activeElement as HTMLElement | null
    ref.current?.showModal()
    return () => {
      ref.current?.close()
      previous?.focus()
    }
  }, [drawer])
  return (
    <>
      <aside className="gd-sidebar">
        <SidebarLinks slug={slug} />
      </aside>
      <dialog
        className="gd-drawer"
        ref={ref}
        aria-label="Danh mục hướng dẫn"
        onCancel={(event) => {
          event.preventDefault()
          onClose()
        }}
      >
        <div className="gd-dialog-title">
          <strong>Hướng dẫn Toolmeta</strong>
          <button type="button" aria-label="Đóng danh mục" onClick={onClose}>
            ×
          </button>
        </div>
        <SidebarLinks slug={slug} onNavigate={onClose} />
      </dialog>
    </>
  )
}

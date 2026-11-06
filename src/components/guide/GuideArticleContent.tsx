/** @jsxImportSource @/i18n/guide */
import type { GuideArticle, GuideImageBlock, GuideBlock } from "./types"
import { articles, categories } from "./guideContent"
import { guideDocumentHref as guideHref } from "./guideContent"

export function articleImages(article: GuideArticle) {
  return article.sections.flatMap((section) =>
    section.blocks.filter(
      (block): block is GuideImageBlock => block.type === "image",
    ),
  )
}
interface Props {
  article: GuideArticle
  onImage: (index: number) => void
}
export default function GuideArticleContent({ article, onImage }: Props) {
  const images = articleImages(article)
  const figure = (image: GuideImageBlock) => (
    <figure key={image.src} className="gd-figure">
      <button
        type="button"
        className="gd-image-button"
        onClick={() =>
          onImage(images.findIndex((item) => item.src === image.src))
        }
        aria-label={"Phóng to: " + image.caption}
      >
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          style={{ maxWidth: Math.min(image.width, 1400) }}
        />
        <span>Phóng to ↗</span>
      </button>
      <figcaption>
        {image.caption} · Trang {image.page}
      </figcaption>
    </figure>
  )
  const block = (item: GuideBlock, index: number) => {
    if (item.type === "image") return item.afterStep ? null : figure(item)
    if (item.type === "table")
      return (
        <div
          className="gd-table-scroll"
          key={index}
          role="region"
          aria-label="Bảng tra cứu"
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                {item.headers.map((header) => (
                  <th key={header} scope="col">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {item.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    if (item.type === "step")
      return (
        <div key={index} className="gd-step">
          <span className="gd-step-number">{item.number}</span>
          <div>
            <p>{item.text}</p>
            {images
              .filter((image) => image.afterStep === item.number)
              .map(figure)}
          </div>
        </div>
      )
    if (item.type === "note" || item.text.startsWith("•"))
      return (
        <aside key={index} className="gd-callout">
          <strong>Lưu ý</strong>
          <p>{item.text.replace(/^•\s*/, "")}</p>
        </aside>
      )
    return <p key={index}>{item.text}</p>
  }
  const category = categories.find((c) => c.id === article.category)
  const i = articles.findIndex((a) => a.slug === article.slug),
    previous = articles[i - 1],
    next = articles[i + 1]
  return (
    <article className="gd-article">
      <nav className="gd-breadcrumb" aria-label="Điều hướng bài viết">
        <a href={guideHref()}>Hướng dẫn</a>
        <span>/</span>
        <a href={guideHref() + "#" + article.category}>{category?.label}</a>
      </nav>
      <header className="gd-article-header">
        <span>{category?.label}</span>
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        {article.sourcePages.length > 0 && (
          <small>
            Nguồn: tài liệu hướng dẫn, trang {article.sourcePages.join(", ")}.
          </small>
        )}
      </header>
      {images.length > 0 && (
        <aside className="gd-legacy-note">
          Ảnh được trích từ tài liệu thực tế. Giao diện có thể sử dụng tên
          thương hiệu trước đây. Một số ảnh chỉ giữ vùng thao tác để bảo vệ dữ
          liệu tài khoản.
        </aside>
      )}
      {article.sections
        .filter((section) =>
          section.blocks.some(
            (item) => item.type !== "image" || !item.afterStep,
          ),
        )
        .map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="gd-article-section"
          >
            <h2>{section.title}</h2>
            {section.blocks.map(block)}
          </section>
        ))}
      <nav className="gd-pagination" aria-label="Điều hướng bài viết">
        {previous ? (
          <a href={guideHref(previous.slug)}>
            <small>← Bài trước</small>
            <strong>{previous.title}</strong>
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a href={guideHref(next.slug)}>
            <small>Bài tiếp theo →</small>
            <strong>{next.title}</strong>
          </a>
        )}
      </nav>
      <section className="gd-related">
        <h2>Cùng nhóm {category?.label}</h2>
        <ul>
          {articles
            .filter(
              (a) => a.category === article.category && a.slug !== article.slug,
            )
            .map((a) => (
              <li key={a.slug}>
                <a href={guideHref(a.slug)}>{a.title}</a>
              </li>
            ))}
        </ul>
      </section>
    </article>
  )
}

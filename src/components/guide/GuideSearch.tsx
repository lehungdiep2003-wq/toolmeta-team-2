/** @jsxImportSource @/i18n/guide */

import { useEffect, useRef, useState, type ReactNode } from "react"

import { guideDocumentHref as guideHref } from "./guideContent"

import {
  getSearchIndex,
  searchRecords,
  normalizeSearch,
  categories,
  type SearchRecord,
} from "./guideContent"

interface HighlightProps {
  text: string

  query: string
}

interface SearchProps {
  open: boolean

  onClose: () => void

  locale?: "vi" | "en"
}

function Highlight({ text, query }: HighlightProps) {
  const display = text.normalize("NFC"),
    folded = normalizeSearch(display)

  const terms = normalizeSearch(query).trim().split(/\s+/).filter(Boolean)

  const ranges: Array<[number, number]> = []

  for (const term of terms) {
    let start = folded.indexOf(term)

    while (start >= 0) {
      ranges.push([start, start + term.length])

      start = folded.indexOf(term, start + term.length)
    }
  }

  ranges.sort((a, b) => a[0] - b[0])

  const merged: Array<[number, number]> = []

  for (const range of ranges) {
    const previous = merged[merged.length - 1]

    if (previous && range[0] <= previous[1])
      previous[1] = Math.max(previous[1], range[1])
    else merged.push([...range])
  }

  const output: ReactNode[] = []

  let cursor = 0

  for (const [start, end] of merged) {
    output.push(
      display.slice(cursor, start),

      <mark key={start}>{display.slice(start, end)}</mark>,
    )

    cursor = end
  }

  output.push(display.slice(cursor))

  return <>{output}</>
}

function excerpt(body: string, query: string) {
  body = body.normalize("NFC")

  const term = normalizeSearch(query).trim().split(/\s+/)[0]

  const index = normalizeSearch(body).indexOf(term)

  const start = Math.max(0, index - 50)

  return (
    (start ? "…" : "") +
    body.slice(start, start + 210) +
    (body.length > start + 210 ? "…" : "")
  )
}

export default function GuideSearch({
  open,
  onClose,
  locale = "vi",
}: SearchProps) {
  const ref = useRef<HTMLDialogElement>(null),
    input = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState(""),
    [debounced, setDebounced] = useState(""),
    [index, setIndex] = useState<SearchRecord[] | null>(null),
    [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!open) return

    const previous = document.activeElement as HTMLElement | null

    ref.current?.showModal()

    input.current?.focus()

    setFailed(false)

    let active = true

    getSearchIndex(locale)

      .then((value) => {
        if (active) setIndex(value)
      })

      .catch(() => {
        if (active) setFailed(true)
      })

    return () => {
      active = false

      ref.current?.close()

      previous?.focus()
    }
  }, [open, locale])

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 200)

    return () => clearTimeout(timer)
  }, [query])

  const results = index ? searchRecords(index, debounced) : []

  return (
    <dialog
      className="gd-search-dialog"
      ref={ref}
      aria-labelledby="gd-search-heading"
      onCancel={(event) => {
        event.preventDefault()

        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const r = event.currentTarget.getBoundingClientRect()

          if (
            event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom
          )
            onClose()
        }
      }}
    >
      <div className="gd-dialog-title">
        <h2 id="gd-search-heading">Tìm kiếm hướng dẫn</h2>
        <button type="button" onClick={onClose} aria-label="Đóng tìm kiếm">
          ×
        </button>
      </div>
      <label className="gd-sr" htmlFor="gd-search-input">
        Tên chức năng, bài viết hoặc nội dung cần tìm
      </label>
      <input
        ref={input}
        id="gd-search-input"
        type="search"
        placeholder="Ví dụ: tải dữ liệu, cột, extension…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="gd-search-results" aria-live="polite">
        {failed ? (
          <p role="alert">
            Không tải được chỉ mục tìm kiếm. Hãy kiểm tra kết nối và mở lại tìm
            kiếm.
          </p>
        ) : !index ? (
          <p>Đang tải chỉ mục…</p>
        ) : !debounced.trim() ? (
          <p>Tìm theo tên chức năng hoặc nội dung hướng dẫn.</p>
        ) : results.length === 0 ? (
          <p>Không tìm thấy kết quả. Hãy thử từ khóa khác.</p>
        ) : (
          <>
            <p>{results.length} bài phù hợp</p>
            {results.map((result) => (
              <a
                key={result.article.slug}
                href={guideHref(result.article.slug)}
                onClick={onClose}
              >
                <small>
                  {
                    categories.find((c) => c.id === result.article.category)
                      ?.label
                  }
                </small>
                <strong>
                  <Highlight text={result.article.title} query={debounced} />
                </strong>
                <span>
                  <Highlight
                    text={excerpt(result.body, debounced)}
                    query={debounced}
                  />
                </span>
              </a>
            ))}
          </>
        )}
      </div>
    </dialog>
  )
}

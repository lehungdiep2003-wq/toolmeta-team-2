/** @jsxImportSource @/i18n/guide */
import { useEffect, useRef, useState } from "react"
import type { GuideImageBlock } from "./types"

interface Props {
  images: GuideImageBlock[]
  index: number | null
  onClose: () => void
  onChange: (index: number) => void
}
interface Point {
  x: number
  y: number
}
export default function GuideLightbox({
  images,
  index,
  onClose,
  onChange,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null),
    viewport = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1),
    [available, setAvailable] = useState(800)
  const pointers = useRef(new Map<number, Point>())
  const visible = index !== null
  useEffect(() => {
    if (!visible) return
    const previous = document.activeElement as HTMLElement | null
    dialog.current?.showModal()
    const update = () =>
      setAvailable(
        Math.max(
          150,
          (viewport.current?.clientWidth ?? window.innerWidth) - 32,
        ),
      )
    update()
    window.addEventListener("resize", update)
    return () => {
      dialog.current?.close()
      previous?.focus()
      window.removeEventListener("resize", update)
      pointers.current.clear()
    }
  }, [visible])
  useEffect(() => {
    setZoom(1)
    if (viewport.current) {
      viewport.current.scrollLeft = 0
      viewport.current.scrollTop = 0
    }
  }, [index])
  const image = index === null ? null : images[index]
  const scale = (n: number) => Math.min(4, Math.max(0.5, n))
  const width = image ? Math.min(available, image.width) * zoom : 0
  return (
    <dialog
      className="gd-lightbox"
      ref={dialog}
      aria-label="Xem ảnh hướng dẫn"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onKeyDown={(event) => {
        if (
          event.key === "ArrowRight" &&
          index !== null &&
          index < images.length - 1
        ) {
          event.preventDefault()
          onChange(index + 1)
        }
        if (event.key === "ArrowLeft" && index !== null && index > 0) {
          event.preventDefault()
          onChange(index - 1)
        }
      }}
    >
      <div className="gd-lightbox-toolbar">
        <button
          type="button"
          onClick={() => index !== null && onChange(index - 1)}
          disabled={index === null || index === 0}
          aria-label="Ảnh trước"
        >
          ←
        </button>
        <span>
          {index === null ? 0 : index + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={() => index !== null && onChange(index + 1)}
          disabled={index === null || index === images.length - 1}
          aria-label="Ảnh tiếp theo"
        >
          →
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => scale(z - 0.25))}
          aria-label="Thu nhỏ"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => setZoom(1)}
          aria-label="Đặt lại thu phóng"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => scale(z + 0.25))}
          aria-label="Phóng to"
        >
          +
        </button>
        <button
          className="gd-lightbox-close"
          type="button"
          onClick={onClose}
          aria-label="Đóng ảnh"
        >
          ×
        </button>
      </div>
      <div
        className="gd-lightbox-viewport"
        ref={viewport}
        onPointerDown={(event) => {
          if (event.button !== 0) return
          event.currentTarget.setPointerCapture(event.pointerId)
          pointers.current.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
          })
        }}
        onPointerMove={(event) => {
          const previous = pointers.current.get(event.pointerId)
          if (!previous) return
          const old = [...pointers.current.values()]
          pointers.current.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
          })
          if (pointers.current.size === 2) {
            const next = [...pointers.current.values()]
            const a = Math.hypot(old[0].x - old[1].x, old[0].y - old[1].y),
              b = Math.hypot(next[0].x - next[1].x, next[0].y - next[1].y)
            if (a > 0) setZoom((z) => scale((z * b) / a))
          } else {
            event.currentTarget.scrollLeft -= event.clientX - previous.x
            event.currentTarget.scrollTop -= event.clientY - previous.y
          }
        }}
        onPointerUp={(event) => pointers.current.delete(event.pointerId)}
        onPointerCancel={(event) => pointers.current.delete(event.pointerId)}
      >
        {image && (
          <img
            src={image.src}
            alt={image.alt}
            draggable={false}
            style={{
              width,
              height: (width * image.height) / image.width,
              maxWidth: "none",
            }}
          />
        )}
      </div>
      <p className="gd-lightbox-caption">{image?.caption}</p>
    </dialog>
  )
}

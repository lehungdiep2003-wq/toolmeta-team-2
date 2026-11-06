import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"
import { createPortal } from "react-dom"
import useSiteLanguage, { languages } from "../../i18n/siteLanguage"
import LanguageFlag from "../language/LanguageFlag"

interface MenuPosition {
  left: number
  bottom: number
  width: number
  maxHeight: number
}
/** Portal coordinates bypass the footer's decorative overflow context. */
export function footerLanguagePosition(
  rect: Pick<DOMRect, "left" | "right" | "top" | "width">,
  viewportWidth: number,
  viewportHeight: number,
): MenuPosition {
  const gutter = 12
  const width = Math.min(
    Math.max(rect.width, 188),
    Math.max(0, viewportWidth - gutter * 2),
    Math.max(rect.width, rect.right - gutter),
  )
  return {
    left: Math.max(
      gutter,
      Math.min(rect.right - width, viewportWidth - gutter - width),
    ),
    bottom: viewportHeight - rect.top + 8,
    width,
    maxHeight: Math.max(0, rect.top - 8 - gutter),
  }
}

export default function FooterLanguage() {
  const { selected, setSelected } = useSiteLanguage()
  const [position, setPosition] = useState<MenuPosition | null>(null)
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const options = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId()
  const open = position !== null
  const close = (restoreFocus = false) => {
    setPosition(null)
    if (restoreFocus) trigger.current?.focus({ preventScroll: true })
  }
  const measure = () =>
    trigger.current
      ? footerLanguagePosition(
          trigger.current.getBoundingClientRect(),
          window.innerWidth,
          window.innerHeight,
        )
      : null
  const show = () => {
    setActive(languages.indexOf(selected))
    setPosition(measure())
  }
  useLayoutEffect(() => {
    const option = options.current[active]
    const menu = panel.current
    if (!open || !option || !menu) return
    option.focus({ preventScroll: true })
    // Scroll only the constrained menu, never the page.
    if (option.offsetTop < menu.scrollTop) menu.scrollTop = option.offsetTop
    else if (
      option.offsetTop + option.offsetHeight >
      menu.scrollTop + menu.clientHeight
    )
      menu.scrollTop =
        option.offsetTop + option.offsetHeight - menu.clientHeight
  }, [open, active, position?.maxHeight])
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      const target = event.target as Node
      if (!root.current?.contains(target) && !panel.current?.contains(target))
        close()
    }
    const reposition = (event: Event) => {
      if (event.target instanceof Node && panel.current?.contains(event.target))
        return
      const next = measure()
      if (!next) return
      setPosition((old) =>
        old &&
        Object.keys(next).every(
          (key) =>
            old[(key as keyof MenuPosition)] ===
            next[(key as keyof MenuPosition)],
        )
          ? old
          : next,
      )
    }
    document.addEventListener("pointerdown", outside)
    window.addEventListener("resize", reposition)
    window.addEventListener("scroll", reposition, true)
    return () => {
      document.removeEventListener("pointerdown", outside)
      window.removeEventListener("resize", reposition)
      window.removeEventListener("scroll", reposition, true)
    }
  }, [open])
  const keyboard = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault()
      event.stopPropagation()
      close(true)
    }
    if (event.key === "Tab" && open) close(true)
    if (!open) return
    const next =
      event.key === "ArrowDown"
        ? (active + 1) % languages.length
        : event.key === "ArrowUp"
          ? (active + languages.length - 1) % languages.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? languages.length - 1
              : -1
    if (next >= 0) {
      event.preventDefault()
      setActive(next)
    }
  }
  return (
    <div
      className="ft-language"
      ref={root}
      onBlur={(event) => {
        const target = event.relatedTarget as Node | null
        if (
          target &&
          !root.current?.contains(target) &&
          !panel.current?.contains(target)
        )
          close()
      }}
    >
      <button
        type="button"
        className="language-trigger ft-language-trigger"
        ref={trigger}
        id={id + "-trigger"}
        aria-label={"Ngôn ngữ Footer: " + selected.name}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id + "-menu" : undefined}
        onClick={() => (open ? close() : show())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault()
            if (!open) show()
          }
          if (event.key === "Escape") close()
        }}
      >
        <LanguageFlag code={selected.code} />
        <span className="ft-language-name" lang={selected.code}>
          {selected.name}
        </span>
        <svg
          className="ft-language-chevron"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {position &&
        createPortal(
          <div
            className="ft-language-menu"
            ref={panel}
            id={id + "-menu"}
            role="menu"
            aria-labelledby={id + "-trigger"}
            onKeyDown={keyboard}
            style={position}
            onBlur={(event) => {
              const target = event.relatedTarget as Node | null
              if (
                target &&
                !panel.current?.contains(target) &&
                !root.current?.contains(target)
              )
                close()
            }}
          >
            {languages.map((language, index) => (
              <button
                type="button"
                className="language-option"
                role="menuitemradio"
                aria-checked={selected.code === language.code}
                key={language.code}
                tabIndex={active === index ? 0 : -1}
                ref={(element) => {
                  options.current[index] = element
                }}
                onFocus={() => setActive(index)}
                onClick={() => {
                  setSelected(language)
                  close(true)
                }}
              >
                <LanguageFlag code={language.code} />
                <span lang={language.code}>{language.name}</span>
                {selected.code === language.code && (
                  <svg
                    className="ft-language-check"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                )}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  )
}

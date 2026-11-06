import { useEffect, useId, useRef, useState } from "react"
import { TELEGRAM_SUPPORT_URL } from "../../config/urls"
import useSiteLanguage from "../../i18n/siteLanguage"
import telegramIcon from "../../assets/support/telegram.svg"
import messages from "./supportMessages.json"
import "./floatingTelegramSupport.css"

/** One persistent app-shell link, below menus and modal/top-layer UI. */
export default function FloatingTelegramSupport() {
  const { selected } = useSiteLanguage()
  const label = messages[selected.code]
  const tooltipId = useId()
  const host = useRef<HTMLDivElement>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const element = host.current
    if (!element) return
    let frame = 0
    let lift = 0
    const update = () => {
      frame = 0
      const style = getComputedStyle(element)
      const baseBottom = parseFloat(style.bottom) - lift
      const right = parseFloat(style.right)
      const width = element.offsetWidth
      const height = element.offsetHeight
      const left = window.innerWidth - right - width
      let bottom = baseBottom
      const obstacles = [...document.querySelectorAll<HTMLElement>(
        "a[href], button, input, select, textarea, summary, [role='menu'], [role='listbox'], [role='dialog'], #site-footer .ft-guide-card, #site-footer .ft-copyright",
      )].filter(node => {
        if (element.contains(node) || node.closest("[inert], [aria-hidden='true']") || node.matches(":disabled")) return false
        const computed = getComputedStyle(node)
        return computed.visibility !== "hidden" && computed.pointerEvents !== "none"
      }).map(node => node.getBoundingClientRect())
        .filter(rect => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight)
      // Always calculate from the normal corner position, avoiding scroll jitter.
      for (let pass = 0; pass < obstacles.length; pass++) {
        const top = window.innerHeight - bottom - height
        const collision = obstacles.find(rect =>
          left < rect.right + 8 && left + width > rect.left - 8 &&
          top < rect.bottom + 8 && top + height > rect.top - 8,
        )
        if (!collision) break
        const next = window.innerHeight - collision.top + 12
        const maximum = Math.max(baseBottom, window.innerHeight - height - 96)
        if (next > maximum) break
        bottom = Math.max(bottom, next)
      }
      lift = Math.max(0, bottom - baseBottom)
      element.style.setProperty("--telegram-support-lift", `${lift}px`)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule)
    resize?.observe(document.body)
    const mutations = new MutationObserver(schedule)
    mutations.observe(document.body, { childList: true, subtree: true })
    schedule()
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      resize?.disconnect()
      mutations.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="telegram-support" ref={host} lang={selected.code} data-tooltip-dismissed={dismissed}>
      <a
        className="telegram-support-link"
        href={TELEGRAM_SUPPORT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        aria-describedby={tooltipId}
        onFocus={() => setDismissed(false)}
        onPointerEnter={() => setDismissed(false)}
        onKeyDown={event => { if (event.key === "Escape") setDismissed(true) }}
      >
        <img src={telegramIcon} width="32" height="32" alt="" aria-hidden="true" draggable={false} />
      </a>
      <span className="telegram-support-tooltip" id={tooltipId} role="tooltip" lang={selected.code}>
        {label}
      </span>
    </div>
  )
}

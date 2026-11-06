import { useEffect, type RefObject } from "react"

export default function useHighlightsEntrance(
  ref: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const section = ref.current
    if (!section) return
    let done = false
    let finish: ReturnType<typeof setTimeout> | undefined
    const reveal = () => {
      if (done) return
      done = true
      section.dataset.reveal = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
        ? "done"
        : "running"
      finish = setTimeout(() => {
        section.dataset.reveal = "done"
      }, 1300)
    }
    const observer =
      typeof IntersectionObserver === "undefined"
        ? undefined
        : new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                reveal()
                observer?.disconnect()
              }
            },
            { rootMargin: "0px 0px -24px 0px" },
          )
    observer?.observe(section)
    if (!observer) reveal()
    return () => {
      observer?.disconnect()
      clearTimeout(finish)
    }
  }, [ref])
}

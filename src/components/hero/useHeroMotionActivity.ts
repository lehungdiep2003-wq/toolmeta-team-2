import { useEffect, type RefObject } from "react"

/** Pause offscreen/background loops and normalize travel to rendered pixels.
 * Observers update only on visibility/size changes, never on animation frames. */
export default function useHeroMotionActivity(
  ref: RefObject<SVGSVGElement | null>,
  viewBoxWidth: number,
) {
  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const measure = () => {
      const width = svg.getBoundingClientRect().width
      if (width > 0) {
        svg.style.setProperty(
          "--hero-motion-unit-scale",
          String(viewBoxWidth / width),
        )
      }
    }
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure)
    resizeObserver?.observe(svg)
    // Fallback also covers hosts without ResizeObserver.
    window.addEventListener("resize", measure)
    measure()
    let intersecting = true
    const update = () => {
      const paused = String(!intersecting || document.hidden)
      if (svg.dataset.motionPaused !== paused) svg.dataset.motionPaused = paused
    }
    const observer =
      typeof IntersectionObserver === "undefined"
        ? undefined
        : new IntersectionObserver(([entry]) => {
            intersecting = entry.isIntersecting
            update()
          })
    observer?.observe(svg)
    document.addEventListener("visibilitychange", update)
    update()
    return () => {
      observer?.disconnect()
      resizeObserver?.disconnect()
      window.removeEventListener("resize", measure)
      document.removeEventListener("visibilitychange", update)
    }
  }, [ref, viewBoxWidth])
}

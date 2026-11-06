import { useEffect, type RefObject } from "react"

type Point = {
  x: number
  y: number
}
type Target = "page" | "bm" | "ad" | "notification" | "analytics"
type Phase = "idle" | "hovered" | "clicked"
type Event = {
  time: number
  target: Target | ""
  phase: Phase
}
type Frame = {
  transform: string
  time: number
}

/** One WAAPI travel timeline plus boundary timers; no per-frame React updates.
 * All interaction states are decorative, never actual clicks/navigation. */
export default function useHeroInteraction(
  ref: RefObject<SVGSVGElement | null>,
  mobile: boolean,
) {
  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const travel = svg.querySelector<SVGGElement>(".hero-cursor-travel")
    if (!travel) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const targets = new Map<Target, SVGGElement>()
    const order: Target[] = mobile
      ? ["page", "ad", "analytics"]
      : ["page", "bm", "ad", "notification", "analytics"]
    for (const name of order) {
      const node = svg.querySelector<SVGGElement>(
        `[data-hero-layer="${name}"] .hero-target-interaction`,
      )
      if (node) targets.set(name, node)
    }
    let animation: Animation | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    let events: Event[] = []
    let duration = 0

    // Only the approved placement matrix is used. Float/interaction transforms
    // remain on independent ancestors, and anchors stay clear of title/value text.
    const anchor = (name: string, x: number, y: number): Point => {
      const node = svg.querySelector<SVGGElement>(
        `[data-hero-layer="${name}"] .hero-static-placement`,
      )
      const matrix = node?.transform.baseVal.consolidate()?.matrix
      return matrix ? new DOMPoint(x, y).matrixTransform(matrix) : { x, y }
    }
    const clear = () => {
      for (const node of targets.values()) node.dataset.state = "idle"
      svg.dataset.activeTarget = ""
      svg.dataset.interactionPhase = "idle"
    }
    const sync = () => {
      clearTimeout(timer)
      if (!animation || animation.playState !== "running") return
      const time = Number(animation.currentTime ?? 0) % duration
      const event =
        [...events].reverse().find((e) => e.time <= time) ?? events[0]
      for (const [name, node] of targets) {
        node.dataset.state = name === event.target ? event.phase : "idle"
      }
      svg.dataset.activeTarget = event.target
      svg.dataset.interactionPhase = event.phase
      const next = events.find((e) => e.time > time)?.time ?? duration
      timer = setTimeout(sync, Math.max(8, next - time + 4))
    }
    const activity = () => {
      if (!animation) return
      if (document.hidden || svg.dataset.motionPaused === "true") {
        animation.pause()
        clearTimeout(timer)
      } else {
        animation.play()
        sync()
      }
    }
    const build = () => {
      clearTimeout(timer)
      animation?.cancel()
      animation = undefined
      clear()
      svg.dataset.interactionReady = "false"
      if (reduced.matches || !travel.animate || targets.size !== order.length)
        return
      const home = anchor("cursor", -5, 3)
      const ring = svg.querySelector<SVGCircleElement>(".hero-cursor-ring")
      ring?.setAttribute("cx", String(home.x))
      ring?.setAttribute("cy", String(home.y))
      const frames: Frame[] = []
      const frame = (p: Point, time: number) =>
        frames.push({
          transform: `translate(${p.x - home.x}px, ${p.y - home.y}px)`,
          time,
        })
      let current = home
      let clock = 0
      events = [{ time: 0, target: "", phase: "idle" }]
      frame(home, 0)
      const move = (to: Point, milliseconds: number) => {
        const from = current
        const dx = to.x - from.x,
          dy = to.y - from.y
        const length = Math.hypot(dx, dy) || 1
        const bend = Math.min(36, length * 0.14)
        const ox = (-dy / length) * bend,
          oy = (dx / length) * bend
        // Sample a cubic curve with eased progress, rendered by WAAPI off-thread.
        for (let i = 1; i <= 24; i++) {
          const progress = i / 24
          const t = progress * progress * (3 - 2 * progress),
            u = 1 - t
          const c1 = { x: from.x + dx / 3 + ox, y: from.y + dy / 3 + oy }
          const c2 = {
            x: from.x + (dx * 2) / 3 + ox,
            y: from.y + (dy * 2) / 3 + oy,
          }
          frame(
            {
              x:
                u * u * u * from.x +
                3 * u * u * t * c1.x +
                3 * u * t * t * c2.x +
                t * t * t * to.x,
              y:
                u * u * u * from.y +
                3 * u * u * t * c1.y +
                3 * u * t * t * c2.y +
                t * t * t * to.y,
            },
            clock + progress * milliseconds,
          )
        }
        clock += milliseconds
        current = to
      }
      const points: Record<Target, [number, number]> = {
        page: [210, 76],
        bm: [210, 76],
        ad: [210, 76],
        notification: [195, 84],
        analytics: [140, 240],
      }
      const travelTimes: Record<Target, number> = {
        page: 1500,
        bm: 1200,
        ad: mobile ? 1800 : 1400,
        notification: 1800,
        analytics: mobile ? 1800 : 1500,
      }
      for (const name of order) {
        move(anchor(name, ...points[name]), travelTimes[name])
        events.push({ time: clock, target: name, phase: "hovered" })
        clock += 650
        frame(current, clock)
        events.push({ time: clock, target: name, phase: "clicked" })
        clock += 250
        frame(current, clock)
        events.push({ time: clock, target: name, phase: "hovered" })
        clock += 200
        frame(current, clock)
        events.push({ time: clock, target: "", phase: "idle" })
      }
      move(home, 1500)
      duration = clock
      svg.dataset.interactionSequence = order.join(",")
      svg.dataset.interactionDuration = String(duration)
      svg.dataset.interactionReady = "true"
      animation = travel.animate(
        frames.map((f) => ({
          transform: f.transform,
          offset: f.time / duration,
        })),
        { duration, iterations: Infinity, easing: "linear" },
      )
      activity()
    }
    const observer = new MutationObserver(activity)
    observer.observe(svg, {
      attributes: true,
      attributeFilter: ["data-motion-paused"],
    })
    reduced.addEventListener("change", build)
    document.addEventListener("visibilitychange", activity)
    build()
    return () => {
      clearTimeout(timer)
      animation?.cancel()
      observer.disconnect()
      reduced.removeEventListener("change", build)
      document.removeEventListener("visibilitychange", activity)
      clear()
      delete svg.dataset.interactionReady
    }
  }, [ref, mobile])
}

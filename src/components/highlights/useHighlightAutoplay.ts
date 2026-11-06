import { useEffect, useMemo, useRef, useState, type RefObject } from "react"
import DemoPlayback from "../benefits/DemoPlayback"
import {
  highlightPeriods,
  highlightSteps,
  type HighlightKind,
} from "./highlightDemoData"

export default function useHighlightAutoplay(
  ref: RefObject<HTMLElement | null>,
  kind: HighlightKind,
) {
  const [activity, setActivity] = useState({ active: false, reduced: false })
  const [snapshot, setSnapshot] = useState({
    index: 0,
    cycle: 0,
    started: false,
  })
  const [manual, setManual] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const manualRef = useRef(false),
    focus = useRef(false),
    hover = useRef(false)
  const quiet = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const playback = useMemo(
    () =>
      new DemoPlayback(
        highlightSteps[kind],
        highlightPeriods[kind],
        kind * 400,
        setSnapshot,
      ),
    [kind],
  )
  const previousReset = useRef(resetKey)
  useEffect(() => {
    const card = ref.current
    if (!card) return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    let intersects = false,
      eligible = false
    const update = () =>
      setActivity((old) => {
        const reduced = media.matches,
          active = intersects && eligible && !document.hidden && !reduced
        return old.active === active && old.reduced === reduced
          ? old
          : { active, reduced }
      })
    const observer =
      typeof IntersectionObserver === "undefined"
        ? undefined
        : new IntersectionObserver(
            ([entry]) => {
              intersects = entry.isIntersecting
              if (!intersects) eligible = false
              else if (
                entry.intersectionRect.height >=
                Math.min(
                  entry.boundingClientRect.height,
                  entry.rootBounds?.height ?? window.innerHeight,
                ) *
                  0.4
              )
                eligible = true
              update()
            },
            {
              threshold: Array.from({ length: 51 }, (_, i) => i / 50),
              rootMargin: "-80px 0px -24px 0px",
            },
          )
    observer?.observe(card.querySelector(".fl-demo") ?? card)
    if (!observer) {
      intersects = true
      eligible = true
    }
    media.addEventListener("change", update)
    document.addEventListener("visibilitychange", update)
    update()
    return () => {
      observer?.disconnect()
      media.removeEventListener("change", update)
      document.removeEventListener("visibilitychange", update)
    }
  }, [ref])
  useEffect(() => {
    if (previousReset.current !== resetKey) {
      previousReset.current = resetKey
      playback.reset()
    }
    if (activity.active && !activity.reduced && !manual) playback.resume()
    else playback.pause()
    return () => playback.pause()
  }, [playback, activity, manual, resetKey])
  useEffect(() => () => clearTimeout(quiet.current), [])
  const release = () => {
    clearTimeout(quiet.current)
    if (manualRef.current && !focus.current && !hover.current)
      quiet.current = setTimeout(() => {
        manualRef.current = false
        setManual(false)
        setResetKey((key) => key + 1)
      }, 1400)
  }
  const takeControl = () => {
    manualRef.current = true
    setManual(true)
    release()
  }
  return {
    frame: highlightSteps[kind][snapshot.index].value,
    automatic: snapshot.started && !activity.reduced && !manual,
    reduced: activity.reduced,
    running: activity.active && !manual,
    manual,
    resetKey,
    takeControl,
    focusIn: () => {
      focus.current = true
      takeControl()
    },
    focusOut: () => {
      focus.current = false
      release()
    },
    pointerEnter: () => {
      hover.current = true
      clearTimeout(quiet.current)
    },
    pointerLeave: () => {
      hover.current = false
      release()
    },
  }
}

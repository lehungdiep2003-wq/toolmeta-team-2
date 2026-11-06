import { useEffect, useMemo, useRef, useState, type RefObject } from "react"
import DemoPlayback from "../benefits/DemoPlayback"
import {
  assetDemoSteps,
  assetTableConfig,
  type AssetKind,
} from "./assetShowcaseData"

/** Independent visibility + clock for each table; no frame-by-frame React work. */
export default function useAssetAutoplay(
  ref: RefObject<HTMLElement | null>,
  kind: AssetKind,
  index: number,
) {
  const [activity, setActivity] = useState({ active: false, reduced: false })
  const [snapshot, setSnapshot] = useState({
    index: 0,
    cycle: 0,
    started: false,
  })
  const [manual, setManual] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const manualRef = useRef(false)
  const focus = useRef(false)
  const hover = useRef(false)
  const quiet = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const steps = assetDemoSteps[kind]
  const playback = useMemo(
    () =>
      new DemoPlayback(
        steps,
        assetTableConfig[kind].period,
        index * 300,
        setSnapshot,
      ),
    [steps, kind, index],
  )
  const previousReset = useRef(resetKey)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    let intersects = false
    let eligible = false
    const update = () =>
      setActivity((old) => {
        const reduced = media.matches
        const active = intersects && eligible && !document.hidden && !reduced
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
              else {
                node.dataset.entered = "true"
                if (
                  entry.intersectionRect.height >=
                  Math.min(
                    entry.boundingClientRect.height,
                    entry.rootBounds?.height ?? window.innerHeight,
                  ) *
                    0.45
                )
                  eligible = true
              }
              update()
            },
            {
              threshold: Array.from({ length: 51 }, (_, i) => i / 50),
              rootMargin: "-80px 0px -24px 0px",
            },
          )
    // Visible copy alone must not start a table still below the mobile fold.
    observer?.observe(node.querySelector(".as-table-panel") ?? node)
    if (!observer) {
      intersects = true
      eligible = true
      node.dataset.entered = "true"
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
    frame: steps[snapshot.index].value,
    automatic: snapshot.started && !activity.reduced && !manual,
    running: activity.active && !manual,
    reduced: activity.reduced,
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

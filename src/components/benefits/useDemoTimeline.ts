import { useEffect, useMemo, useRef, useState } from "react"
import { useBenefitsActivity } from "./BenefitsMotionProvider"
import type { DemoStep } from "./demoTimelines"
import { useBenefitCard } from "./BenefitDemoCard"
import DemoPlayback from "./DemoPlayback"

/** Sparse phase timers only. Preserve elapsed time while offscreen or user-owned. */
export default function useDemoTimeline<T>(
  steps: readonly DemoStep<T>[],
  period: number,
  offset: number,
  paused = false,
) {
  const { active, reduced } = useBenefitsActivity()
  const card = useBenefitCard()
  const reset = useRef(card.resetKey)
  const [state, setState] = useState({ index: 0, cycle: 0, started: false })
  const playback = useMemo(
    () => new DemoPlayback(steps, period, card.delay - offset, setState),
    [steps, period, card.delay, offset],
  )
  useEffect(() => {
    if (reset.current !== card.resetKey) {
      reset.current = card.resetKey
      playback.reset()
    }
    if (active && !reduced && !paused && !card.paused) playback.resume()
    else playback.pause()
    return () => playback.pause()
  }, [active, reduced, paused, card.paused, card.resetKey, playback])
  return {
    frame: steps[state.index].value,
    cycle: state.cycle,
    started: state.started,
    active,
    reduced,
  }
}

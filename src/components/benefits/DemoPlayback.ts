import { demoStepIndex, type DemoStep } from "./demoTimelines"

export interface PlaybackSnapshot {
  index: number
  cycle: number
  started: boolean
}
export interface DemoScheduler {
  now: () => number
  set: (callback: () => void, milliseconds: number) => unknown
  clear: (handle: unknown) => void
}
const scheduler: DemoScheduler = {
  now: () => performance.now(),
  set: (callback, milliseconds) => setTimeout(callback, milliseconds),
  clear: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
}

/** One sparse boundary timer per card. Injectable clock makes lifecycle testable. */
export default class DemoPlayback<T> {
  private elapsed: number
  private startedAt: number | null = null
  private timer: unknown
  private last: PlaybackSnapshot = { index: 0, cycle: 0, started: false }
  constructor(
    private steps: readonly DemoStep<T>[],
    private period: number,
    private delay: number,
    private emit: (snapshot: PlaybackSnapshot) => void,
    private clock: DemoScheduler = scheduler,
  ) {
    this.elapsed = -delay
  }

  resume() {
    if (this.startedAt !== null) return
    this.startedAt = this.clock.now()
    this.tick()
  }
  pause() {
    if (this.startedAt !== null)
      this.elapsed += this.clock.now() - this.startedAt
    this.startedAt = null
    this.clock.clear(this.timer)
    this.timer = undefined
  }
  reset() {
    this.pause()
    this.elapsed = -this.delay
    this.last = { index: 0, cycle: 0, started: false }
    this.emit(this.last)
  }
  private tick = () => {
    if (this.startedAt === null) return
    const elapsed = this.elapsed + this.clock.now() - this.startedAt
    if (elapsed < 0) {
      this.timer = this.clock.set(this.tick, -elapsed)
      return
    }
    const index = demoStepIndex(this.steps, elapsed, this.period)
    const cycle = Math.floor(elapsed / this.period)
    if (
      !this.last.started ||
      this.last.index !== index ||
      this.last.cycle !== cycle
    ) {
      this.last = { index, cycle, started: true }
      this.emit(this.last)
    }
    const next = this.steps[index + 1]?.at ?? this.period
    this.timer = this.clock.set(
      this.tick,
      Math.max(1, next - (elapsed % this.period)),
    )
  }
}

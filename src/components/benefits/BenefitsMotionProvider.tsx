import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type RefObject,
} from "react"
import { hasMajorityVisible } from "./demoVisibility"

const MotionContext = createContext({ active: false, reduced: false })
export const useBenefitsActivity = () => useContext(MotionContext)

export default function BenefitsMotionProvider({
  sectionRef,
  children,
}: {
  sectionRef: RefObject<HTMLElement | null>
  children: ReactNode
}) {
  const [activity, setActivity] = useState({ active: false, reduced: false })
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    let visible = false
    let entered = false
    let revealed = false
    let revealTimer: ReturnType<typeof setTimeout> | undefined
    const update = () => {
      const reduced = preference.matches
      const active = visible && entered && !document.hidden && !reduced
      section.dataset.motionState = reduced
        ? "reduced"
        : active
          ? "running"
          : "paused"
      if (visible && !revealed) {
        revealed = true
        section.dataset.reveal = reduced ? "done" : "running"
        revealTimer = setTimeout(() => {
          section.dataset.reveal = "done"
        }, 1300)
      }
      if (reduced && revealed) section.dataset.reveal = "done"
      setActivity((old) =>
        old.active === active && old.reduced === reduced
          ? old
          : { active, reduced },
      )
    }
    const observer =
      typeof IntersectionObserver === "undefined"
        ? undefined
        : new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting
              if (!visible) entered = false
              else if (
                hasMajorityVisible(
                  entry.boundingClientRect.height,
                  entry.rootBounds?.height ?? window.innerHeight,
                  entry.intersectionRect.height,
                  entry.boundingClientRect.width,
                  entry.rootBounds?.width ?? window.innerWidth,
                  entry.intersectionRect.width,
                )
              )
                entered = true
              update()
            },
            {
              threshold: Array.from({ length: 101 }, (_, i) => i / 100),
              rootMargin: "-80px 0px -24px 0px",
            },
          )
    observer?.observe(section)
    if (!observer) {
      visible = true
      entered = true
    }
    preference.addEventListener("change", update)
    document.addEventListener("visibilitychange", update)
    update()
    return () => {
      observer?.disconnect()
      clearTimeout(revealTimer)
      preference.removeEventListener("change", update)
      document.removeEventListener("visibilitychange", update)
    }
  }, [sectionRef])
  return (
    <MotionContext.Provider value={activity}>{children}</MotionContext.Provider>
  )
}

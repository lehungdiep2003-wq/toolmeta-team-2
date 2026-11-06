import { useSyncExternalStore } from "react"

const query = "(max-width: 767px)"
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(query)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}
const getSnapshot = () => window.matchMedia(query).matches
const getServerSnapshot = () => false

/** Subscribe to the same breakpoint as the landing page, including live resizing. */
export default function useHeroMobileLayout() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

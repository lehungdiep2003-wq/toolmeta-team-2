import type { HeroAnimation, HeroLayerName } from "./types"

/** Distances are rendered CSS pixels; the SVG wrapper compensates for viewBox
 * scaling. Responsive motion factors then reduce travel deliberately. */
export const heroLayerMotion: Partial<Record<HeroLayerName, HeroAnimation>> = {
  core: { kind: "core", duration: 6, distance: -10, distanceX: 2 },
  ad: { duration: 5.5, delay: -1.1, distance: -7 },
  bm: { duration: 6.8, delay: -3.3, distance: -9, distanceX: 2 },
  page: { duration: 6.2, delay: -2.2, distance: -8, distanceX: 3 },
  notification: { duration: 7.5, delay: -4, distance: -6 },
  analytics: { duration: 8.5, delay: -4.6, distance: -5.5 },
  shield: { duration: 8, delay: -2.8, distance: -4.5 },
  cursor: { kind: "cursor", duration: 6.8 },
}

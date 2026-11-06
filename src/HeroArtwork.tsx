import HeroVisual, { type HeroVisualProps } from "./components/hero/HeroVisual"

/** Compatibility entry point for the existing landing page. */
export default function HeroArtwork(props: HeroVisualProps) {
  return <HeroVisual {...props} />
}

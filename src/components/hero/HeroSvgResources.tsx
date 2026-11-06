import {
  createContext,
  useContext,
  useId,
  useMemo,
  type ReactNode,
} from "react"

const resourceNames = [
  "ambient",
  "orbLight",
  "cardSurface",
  "panelSurface",
  "coreRim",
  "coreInnerShade",
  "coreFace",
  "coreSide",
  "coreShine",
  "chartFill",
  "cursorFace",
  "ambientBlur",
  "cardShadow",
  "cardNearShadow",
  "notificationShadow",
  "panelShadow",
  "shieldShadow",
  "coreShadow",
  "smallShadow",
] as const
type HeroSvgIds = Record<typeof resourceNames[number], string>
const Resources = createContext<HeroSvgIds | null>(null)

/** Mount inside an SVG with HeroDefinitions when composing layers independently. */
export default function HeroSvgResources({
  children,
}: {
  children: ReactNode
}) {
  const prefix = useId()
  const ids = useMemo(
    () =>
      Object.fromEntries(
        resourceNames.map((name) => [name, `hero-${prefix}-${name}`]),
      ) as HeroSvgIds,
    [prefix],
  )
  return <Resources.Provider value={ids}>{children}</Resources.Provider>
}

export function useHeroSvgIds() {
  const ids = useContext(Resources)
  if (!ids)
    throw new Error("Hero layers must be rendered inside HeroSvgResources.")
  return ids
}

import { useHeroSvgIds } from "./HeroSvgResources"
import { heroShadowTokens } from "./heroPolish"

export default function HeroDefinitions() {
  const ids = useHeroSvgIds()
  return (
    <defs>
      <radialGradient id={ids.ambient}>
        <stop stopColor="#6588cd" stopOpacity=".36" />
        <stop offset=".5" stopColor="#87b1eb" stopOpacity=".17" />
        <stop offset="1" stopColor="#cee0fc" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={ids.orbLight} cx="28%" cy="20%">
        <stop stopColor="#5ca1f6" />
        <stop offset=".5" stopColor="#1875ee" />
        <stop offset="1" stopColor="#0953bd" />
      </radialGradient>
      <linearGradient id={ids.cardSurface} x2=".8" y2="1">
        <stop stopColor="white" stopOpacity=".99" />
        <stop offset="1" stopColor="#f5f7fa" stopOpacity=".97" />
      </linearGradient>
      <linearGradient id={ids.panelSurface} x2=".65" y2="1">
        <stop stopColor="white" />
        <stop offset="1" stopColor="#f1f3f8" stopOpacity=".97" />
      </linearGradient>
      <linearGradient id={ids.coreFace} x2=".7" y2="1">
        <stop stopColor="#0c2d79" />
        <stop offset=".32" stopColor="#071d50" />
        <stop offset="1" stopColor="#03102f" />
      </linearGradient>
      <linearGradient id={ids.coreSide} x2=".8" y2="1">
        <stop stopColor="#0c2b70" />
        <stop offset=".5" stopColor="#071e51" />
        <stop offset="1" stopColor="#05102c" />
      </linearGradient>
      <linearGradient id={ids.coreRim} x2=".8" y2="1">
        <stop stopColor="#b3c7ed" stopOpacity=".6" />
        <stop offset=".4" stopColor="#5675b4" stopOpacity=".18" />
        <stop offset="1" stopColor="#3559a7" stopOpacity=".4" />
      </linearGradient>
      <radialGradient id={ids.coreInnerShade} cx="40%" cy="30%" r="80%">
        <stop offset=".35" stopColor="#020d27" stopOpacity="0" />
        <stop offset="1" stopColor="#020d27" stopOpacity=".32" />
      </radialGradient>
      <linearGradient id={ids.coreShine} x2="1" y2="1">
        <stop stopColor="#a0b8e9" stopOpacity=".18" />
        <stop offset=".45" stopColor="#366fdb" stopOpacity="0" />
        <stop offset="1" stopColor="#6683bf" stopOpacity=".08" />
      </linearGradient>
      <linearGradient id={ids.chartFill} x2="0" y2="1">
        <stop stopColor="#7295d7" stopOpacity=".48" />
        <stop offset="1" stopColor="#b1caf3" stopOpacity=".08" />
      </linearGradient>
      <linearGradient id={ids.cursorFace} x2=".6" y2="1">
        <stop stopColor="#6baaf7" />
        <stop offset=".45" stopColor="#1e7cf3" />
        <stop offset="1" stopColor="#0051c4" />
      </linearGradient>
      <filter id={ids.ambientBlur} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="20" />
      </filter>
      {Object.entries(heroShadowTokens).map(([name, shadows]) => (
        <filter
          key={name}
          id={ids[(name as keyof typeof heroShadowTokens)]}
          x="-60%"
          y="-60%"
          width="240%"
          height="260%"
          colorInterpolationFilters="sRGB"
        >
          {shadows.map((shadow, index) => (
            <feDropShadow
              key={index}
              dx={shadow.dx}
              dy={shadow.dy}
              stdDeviation={shadow.blur}
              floodColor={shadow.color}
              floodOpacity={shadow.opacity}
            />
          ))}
        </filter>
      ))}
    </defs>
  )
}

import type { CSSProperties, ReactNode } from "react"
import type { HeroLayerName, HeroLayerProps, HeroPresentation } from "./types"
import { heroLayerMotion } from "./heroMotion"

interface Props extends HeroLayerProps {
  name: HeroLayerName
  defaults: HeroPresentation
  bounds: readonly [number, number, number, number]
  filter?: string
  children: ReactNode
}

/** Animation lives outside the placement transform, preserving the original scene-space motion. */
export default function HeroLayer({
  name,
  defaults,
  presentation,
  image,
  bounds,
  filter,
  children,
}: Props) {
  const {
    x = 0,
    y = 0,
    angle = 0,
    origin = [0, 0],
    skewX = 0,
    scale = 1,
    opacity,
  } = { ...defaults, ...presentation }
  const animation =
    presentation?.animation ?? heroLayerMotion[name] ?? defaults.animation
  const transform =
    [
      x || y ? `translate(${x} ${y})` : "",
      angle ? `rotate(${angle} ${origin[0]} ${origin[1]})` : "",
      skewX ? `skewX(${skewX})` : "",
      scale !== 1 ? `scale(${scale})` : "",
    ]
      .filter(Boolean)
      .join(" ") || undefined
  const style = animation
    ? {
        "--hero-motion-duration": `${animation.duration ?? 7}s`,
        "--hero-motion-delay": `${animation.delay ?? 0}s`,
        "--hero-motion-distance": `${animation.distance ?? -6}px`,
        "--hero-motion-x": `${animation.distanceX ?? 0}px`,
      } as CSSProperties
    : undefined
  const [imageX, imageY, width, height] = image?.bounds ?? bounds
  const interactive = [
    "ad",
    "bm",
    "page",
    "notification",
    "analytics",
  ].includes(name)

  return (
    <g
      data-hero-layer={name}
      className={
        animation
          ? `hero-visual-motion hero-motion-${animation.kind ?? "float"}`
          : undefined
      }
      style={style}
      opacity={opacity}
    >
      <g
        className={interactive ? "hero-target-interaction" : undefined}
        data-state={interactive ? "idle" : undefined}
      >
        <g
          className="hero-static-placement"
          transform={transform}
          filter={filter}
        >
          {image ? (
            <image
              href={image.src}
              x={imageX}
              y={imageY}
              width={width}
              height={height}
              preserveAspectRatio={image.preserveAspectRatio ?? "xMidYMid meet"}
            />
          ) : (
            children
          )}
        </g>
      </g>
    </g>
  )
}

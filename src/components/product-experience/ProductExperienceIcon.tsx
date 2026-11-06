export type ExperienceIconName = "search" | "layers" | "grid" | "bolt" | "people" | "briefcase" | "flag"
interface Props {
  name: ExperienceIconName
  size?: number
}
export default function ProductExperienceIcon({ name, size = 24 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "search" && (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 5 5" />
        </>
      )}
      {name === "layers" && (
        <>
          <path d="m12 3 10 5-10 5L2 8Z" />
          <path d="m2 12 10 5 10-5M2 16l10 5 10-5" />
        </>
      )}
      {name === "grid" && (
        <>
          {[3, 14].flatMap((x) =>
            [3, 14].map((y) => (
              <rect key={`${x}-${y}`} x={x} y={y} width="7" height="7" rx="2" />
            )),
          )}
        </>
      )}
      {name === "bolt" && <path d="m13 2-9 12h7l-1 8L21 9h-8Z" />}
      {name === "people" && (
        <>
          <circle cx="12" cy="7" r="3.3" />
          <path d="M6 21v-3a6 6 0 0 1 12 0v3ZM3 10a3 3 0 0 1 3-5m15 5a3 3 0 0 0-3-5M2 19v-2a5 5 0 0 1 2-4m18 6v-2a5 5 0 0 0-2-4" />
        </>
      )}
      {name === "briefcase" && (
        <>
          <rect
            x="2"
            y="7"
            width="20"
            height="14"
            rx="3"
            fill="currentColor"
            stroke="none"
          />
          <path d="M8 7V4h8v3M2 12h20" stroke="currentColor" />
          <path d="M3 12h18" stroke="white" strokeOpacity=".6" />
        </>
      )}
      {name === "flag" && (
        <>
          <path d="M5 22V3" strokeWidth="2.2" />
          <path
            d="M6 4c5-3 8 3 15 0v12c-7 3-10-3-15 0Z"
            fill="currentColor"
            stroke="none"
          />
        </>
      )}
    </svg>
  )
}

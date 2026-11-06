import { useId } from "react"

interface Props {
  step: number
}
function AssetMark({ kind }: { kind: "AD" | "BM" | "PAGE" }) {
  if (kind === "PAGE")
    return (
      <g fill="#ff9a16">
        <path d="M8 29V5h3v24Z" />
        <path d="M11 6c7-5 11 5 19 0v15c-8 5-12-5-19 0Z" />
      </g>
    )
  if (kind === "BM")
    return (
      <path
        d="M3 23C4 9 10 6 17 18c6 11 11 12 14 4 4-12-4-21-10-11L9 28C3 34-2 23 3 13"
        fill="none"
        stroke="#087bff"
        strokeWidth="3"
        strokeLinecap="round"
      />
    )
  return (
    <>
      <rect width="32" height="32" rx="7" fill="#087bff" />
      <path
        d="M19 30V18h5l1-5h-6V9c0-2 1-3 3-3h3V1h-5c-5 0-7 3-7 8v4H9v5h4v12Z"
        fill="white"
        transform="translate(1 1) scale(.9)"
      />
    </>
  )
}
export default function StepIllustration({ step }: Props) {
  const prefix = `hiw-${useId().replace(/:/g, "")}`
  const ids = {
    dark: `${prefix}-dark`,
    soft: `${prefix}-soft`,
    white: `${prefix}-white`,
    shadow: `${prefix}-shadow`,
    chrome: `${prefix}-chrome`,
    blue: `${prefix}-blue`,
    lime: `${prefix}-lime`,
  }
  return (
    <div
      className={`hiw-illustration hiw-illustration-${step}`}
      aria-hidden="true"
    >
      <span className="hiw-glow" />
      <svg viewBox="0 0 300 178" fill="none" focusable="false">
        <defs>
          <linearGradient id={ids.dark} x1=".2" y1="0" x2=".7" y2="1">
            <stop stopColor="#2957ba" />
            <stop offset=".46" stopColor="#001f65" />
            <stop offset="1" stopColor="#000c29" />
          </linearGradient>
          <linearGradient id={ids.soft} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#d3e1f6" />
          </linearGradient>
          <linearGradient id={ids.white} x1="0" y1="0" x2=".6" y2="1">
            <stop stopColor="#fff" />
            <stop offset=".7" stopColor="#fff" />
            <stop offset="1" stopColor="#e8ebf0" />
          </linearGradient>
          <linearGradient id={ids.blue} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#68aaff" />
            <stop offset="1" stopColor="#1262e8" />
          </linearGradient>
          <linearGradient id={ids.lime} x1="0" y1="1" x2=".3" y2="0">
            <stop stopColor="#082973" />
            <stop offset=".6" stopColor="#2058cb" />
            <stop offset="1" stopColor="#7caff8" />
          </linearGradient>
          <filter id={ids.shadow} x="-45%" y="-40%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="9"
              stdDeviation="8"
              floodColor="#283f6b"
              floodOpacity=".16"
            />
          </filter>
          <clipPath id={ids.chrome}>
            <circle cx="92" cy="91" r="47" />
          </clipPath>
        </defs>
        {step === 0 && (
          <>
            <circle cx="93" cy="93" r="65" fill="#cde0fa" opacity=".65" />
            <g className="hiw-float" filter={`url(#${ids.shadow})`}>
              <g clipPath={`url(#${ids.chrome})`}>
                <circle cx="92" cy="91" r="47" fill="#f8d149" />
                <path d="M45 44h95v28H92L72 106Z" fill="#ee5b57" />
                <path d="m45 58 47 81H44Z" fill="#5179bf" />
                <path d="m140 71-48 68 24-43-13-24Z" fill="#f8d149" />
                <path
                  d="M44 93c4-26 30-47 58-48"
                  stroke="white"
                  strokeOpacity=".2"
                  strokeWidth="3"
                />
              </g>
              <circle
                cx="92"
                cy="91"
                r="22"
                fill={`url(#${ids.blue})`}
                stroke="white"
                strokeWidth="4"
              />
              <g transform="translate(142 31) rotate(7 52 53)">
                <rect y="5" width="104" height="108" rx="26" fill="#e2e6ee" />
                <rect
                  width="104"
                  height="106"
                  rx="26"
                  fill={`url(#${ids.white})`}
                  stroke="white"
                />
                <path
                  d="M29 43h13c-9-17 15-22 15-9v9h13c9 0 9 13 0 13h-5v17H50c7 14-15 18-15 6v-6H24V57c14 7 17-14 5-14Z"
                  fill={`url(#${ids.dark})`}
                />
              </g>
              <circle
                cx="231"
                cy="122"
                r="18"
                fill={`url(#${ids.dark})`}
                stroke="#dfe8f8"
                strokeWidth="3"
              />
              <path
                d="M231 113v18m-9-9h18"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
            <path
              className="hiw-spark"
              d="m251 30 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"
              fill="#c9dffc"
            />
          </>
        )}
        {step === 1 && (
          <>
            <g className="hiw-float" filter={`url(#${ids.shadow})`}>
              <rect
                x="84"
                y="31"
                width="173"
                height="119"
                rx="22"
                fill={`url(#${ids.white})`}
                stroke="white"
              />
              <rect
                x="113"
                y="48"
                width="125"
                height="26"
                rx="12"
                fill="#edeff3"
              />
              <rect
                x="113"
                y="82"
                width="125"
                height="26"
                rx="12"
                fill="#edeff3"
              />
              {[0, 1, 2, 3].map((i) => (
                <circle
                  key={`a${i}`}
                  cx={127 + i * 9}
                  cy="61"
                  r="2.6"
                  fill="#082873"
                />
              ))}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <circle
                  key={`b${i}`}
                  cx={127 + i * 9}
                  cy="95"
                  r="2.6"
                  fill="#082873"
                />
              ))}
              <rect
                x="113"
                y="115"
                width="125"
                height="29"
                rx="14.5"
                fill={`url(#${ids.dark})`}
              />
              <path
                d="M165 130h19m-6-6 6 6-6 6"
                stroke="white"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="84" cy="62" r="23" fill={`url(#${ids.lime})`} />
              <circle cx="84" cy="56" r="6" fill="white" />
              <path d="M72 73c0-12 24-12 24 0" fill="white" />
            </g>
            <path d="M29 130c20-8 31 5 33 19-17 1-29-4-33-19Z" fill="#cfddf6" />
            <path
              className="hiw-spark"
              d="m45 43 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z"
              fill="#c9dffc"
            />
          </>
        )}
        {step === 2 && (
          <>
            <g className="hiw-float" filter={`url(#${ids.shadow})`}>
              <rect
                x="93"
                y="34"
                width="116"
                height="118"
                rx="26"
                fill={`url(#${ids.white})`}
                stroke="white"
              />
              <g
                stroke={`url(#${ids.dark})`}
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M126 83a29 29 0 0 1 51-8l4 8m0-14v14h-14M177 105a29 29 0 0 1-51 8l-4-8m0 14v-14h14" />
              </g>
            </g>
            <g filter={`url(#${ids.shadow})`}>
              <g transform="translate(35 30) rotate(-13 25 25)">
                <rect width="50" height="53" rx="13" fill="white" />
                <g transform="translate(9 10)">
                  <AssetMark kind="AD" />
                </g>
              </g>
              <g transform="translate(229 54) rotate(12 25 25)">
                <rect width="52" height="55" rx="13" fill="white" />
                <g transform="translate(11 12)">
                  <AssetMark kind="BM" />
                </g>
              </g>
              <g transform="translate(26 106) rotate(-10 25 25)">
                <rect width="51" height="51" rx="12" fill="white" />
                <g transform="translate(8 8)">
                  <AssetMark kind="PAGE" />
                </g>
              </g>
            </g>
          </>
        )}
        {step === 3 && (
          <>
            <g className="hiw-float" filter={`url(#${ids.shadow})`}>
              {(["BM", "AD", "PAGE"] as const).map((kind, i) => (
                <g key={kind} transform={`translate(35 ${30 + i * 41})`}>
                  <rect
                    width="111"
                    height="35"
                    rx="12"
                    fill={`url(#${ids.white})`}
                  />
                  <g transform="translate(10 5) scale(.75)">
                    <AssetMark kind={kind} />
                  </g>
                  <circle cx="83" cy="17" r="10" fill="#dbe6f8" />
                  <path
                    d="m78 17 4 4 7-8"
                    stroke="#073395"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              ))}
              <rect
                x="174"
                y="40"
                width="93"
                height="108"
                rx="19"
                fill={`url(#${ids.white})`}
                stroke="white"
              />
              {[18, 29, 43, 57].map((height, i) => (
                <rect
                  key={height}
                  x={188 + i * 17}
                  y={116 - height}
                  width="11"
                  height={height}
                  rx="4"
                  fill={`url(#${ids.lime})`}
                  opacity={0.55 + i * 0.15}
                />
              ))}
              <circle
                cx="263"
                cy="126"
                r="20"
                fill={`url(#${ids.dark})`}
                stroke="#dee8f8"
                strokeWidth="2"
              />
              <path
                d="m254 126 6 6 11-13"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </>
        )}
      </svg>
    </div>
  )
}

import { useId } from "react"

export default function FinalCtaBackdrop() {
  const id = "fcta-flow-" + useId().replace(/:/g, "")
  return (
    <div className="fcta-backdrop" aria-hidden="true">
      <span className="fcta-glow" />
      <svg
        viewBox="0 0 1280 480"
        preserveAspectRatio="none"
        fill="none"
        focusable="false"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2=".6">
            <stop stopColor="#deebfd" stopOpacity=".15" />
            <stop offset=".6" stopColor="#b5d3fb" stopOpacity=".55" />
            <stop offset="1" stopColor="#3964ba" stopOpacity=".65" />
          </linearGradient>
          <linearGradient id={id + "-soft"} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fff" stopOpacity=".9" />
            <stop offset="1" stopColor="#4391f5" stopOpacity=".13" />
          </linearGradient>
        </defs>
        <path
          d="M390 480c90-125 199-119 348-164S1158 240 1280 115v114c-187 127-365 129-478 178S618 471 595 480Z"
          fill={`url(#${id})`}
        />
        <path
          d="M560 480c110-99 110-175 298-209s287-92 422-121v107c-185 39-210 145-395 155S729 460 690 480Z"
          fill={`url(#${id}-soft)`}
        />
        <path
          d="M640 0c-31 97-139 109-109 155s230-24 322-45S1061 60 1077 0Z"
          fill="#e6f0fe"
          fillOpacity=".56"
        />
        <path
          d="M590 480c120-94 129-144 330-192s289-100 360-132"
          stroke="white"
          strokeOpacity=".55"
          strokeWidth="2"
        />
        <path
          d="M585 194c105-111 229-50 426-194"
          stroke="#fff"
          strokeOpacity=".6"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  )
}

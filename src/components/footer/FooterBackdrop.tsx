import { useId } from "react"
export default function FooterBackdrop() {
  const id = "ft-wave-" + useId().replace(/:/g, "")
  return (
    <div className="ft-backdrop" aria-hidden="true">
      <span className="ft-ambient" />
      <span className="ft-shape ft-shape-one" />
      <span className="ft-shape ft-shape-two" />
      <svg
        viewBox="0 0 1440 480"
        preserveAspectRatio="none"
        fill="none"
        focusable="false"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#3372c6" stopOpacity=".45" />
            <stop offset=".4" stopColor="#143170" stopOpacity=".38" />
            <stop offset="1" stopColor="#00113a" stopOpacity=".08" />
          </linearGradient>
        </defs>
        <path
          d="M-70 192c168 30 139 146 292 203s230-53 380-1 172 100 270 111H-70Z"
          fill={`url(#${id})`}
        />
        <path
          d="M-70 192c168 30 139 146 292 203s230-53 380-1 172 100 270 111"
          stroke="#3973c3"
          strokeOpacity=".55"
          strokeWidth="1"
        />
        <path
          d="M-55 327c133 67 193 133 304 129s207-59 301-23 130 57 171 72H-55Z"
          fill={`url(#${id})`}
        />
        <path
          d="M1215 111c73-58 154-87 225-138m-76 252 76-82"
          stroke="#3c72c1"
          strokeOpacity=".35"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}

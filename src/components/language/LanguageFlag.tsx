export default function LanguageFlag({ code }: { code: string }) {
  const star =
    "0,-1 .2245,-.309 .9511,-.309 .3633,.118 .5878,.809 0,.382 -.5878,.809 -.3633,.118 -.9511,-.309 -.2245,-.309"

  return (
    <svg className="language-flag" viewBox="0 0 30 20" aria-hidden="true">
      {code === "vi" && (
        <>
          <path fill="#da251d" d="M0 0h30v20H0z" />
          <polygon
            points={star}
            fill="#ffdf00"
            transform="translate(15 10) scale(6)"
          />
        </>
      )}
      {code === "en" && (
        <>
          <path fill="#012169" d="M0 0h30v20H0z" />
          <path stroke="#fff" strokeWidth="4" d="m0 0 30 20M30 0 0 20" />
          <path stroke="#c8102e" strokeWidth="1.5" d="m0 0 30 20M30 0 0 20" />
          <path stroke="#fff" strokeWidth="7" d="M15 0v20M0 10h30" />
          <path stroke="#c8102e" strokeWidth="4" d="M15 0v20M0 10h30" />
        </>
      )}
      {code === "ru" && (
        <>
          <path fill="#fff" d="M0 0h30v20H0z" />
          <path fill="#0039a6" d="M0 6.667h30v6.666H0z" />
          <path fill="#d52b1e" d="M0 13.333h30V20H0z" />
        </>
      )}
      {code === "th" && (
        <>
          <path fill="#a51931" d="M0 0h30v20H0z" />
          <path fill="#f4f5f8" d="M0 3.333h30v13.334H0z" />
          <path fill="#2d2a4a" d="M0 6.667h30v6.666H0z" />
        </>
      )}
      {code === "zh" && (
        <>
          <path fill="#de2910" d="M0 0h30v20H0z" />
          <polygon
            points={star}
            fill="#ffde00"
            transform="translate(5 5) scale(3)"
          />
          {[
            [10, 2, 23],
            [12, 4, 45],
            [12, 7, 70],
            [10, 9, 20],
          ].map(([x, y, angle]) => (
            <polygon
              key={y}
              points={star}
              fill="#ffde00"
              transform={`translate(${x} ${y}) rotate(${angle})`}
            />
          ))}
        </>
      )}
    </svg>
  )
}

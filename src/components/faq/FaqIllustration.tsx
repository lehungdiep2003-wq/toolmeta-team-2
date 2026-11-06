import { useId } from "react"
import FaqIcon from "./FaqIcon"
import { faqSupportUrl } from "./faqData"

export default function FaqIllustration() {
  const id = `fq-${useId().replace(/:/g, "")}`
  const pillContent = (
    <>
      <span className="fq-support-bulb">
        <FaqIcon name="bulb" size={24} />
      </span>
      <span>
        <strong>Không tìm thấy câu trả lời?</strong>
        <span>Liên hệ hỗ trợ của chúng tôi</span>
      </span>
      <span className="fq-support-arrow" aria-hidden="true">
        →
      </span>
    </>
  )
  return (
    <div className="fq-art-column">
      <div className="fq-illustration" aria-hidden="true">
        <span className="fq-glow" />
        <svg viewBox="0 0 550 365" fill="none" focusable="false">
          <defs>
            <linearGradient id={id + "-bubble"} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#dfecfd" />
              <stop offset=".5" stopColor="#d0e0f8" />
              <stop offset="1" stopColor="#abc5ef" />
            </linearGradient>
            <linearGradient id={id + "-dark"} x1="0" y1="0" x2=".7" y2="1">
              <stop stopColor="#39538b" />
              <stop offset=".5" stopColor="#071e53" />
              <stop offset="1" stopColor="#0b1a3e" />
            </linearGradient>
            <linearGradient id={id + "-white"} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#fff" />
              <stop offset="1" stopColor="#f1f6fe" />
            </linearGradient>
            <linearGradient id={id + "-lime"} x1="0" y1="0" x2=".5" y2="1">
              <stop stopColor="#6ca6f7" />
              <stop offset="1" stopColor="#153f92" />
            </linearGradient>
            <filter
              id={id + "-shadow"}
              x="-40%"
              y="-35%"
              width="180%"
              height="195%"
            >
              <feDropShadow
                dx="0"
                dy="10"
                stdDeviation="10"
                floodColor="#547dbd"
                floodOpacity=".15"
              />
            </filter>
          </defs>
          <g className="fq-art-orbit">
            <ellipse
              cx="267"
              cy="233"
              rx="246"
              ry="63"
              transform="rotate(9 267 233)"
              stroke="#9cbded"
              strokeWidth="1"
            />
          </g>
          <g className="fq-bubble-float">
            <g
              transform="translate(219 81) rotate(10 85 92)"
              filter={`url(#${id}-shadow)`}
            >
              <path
                d="M32 5h112a31 31 0 0 1 31 31v113a30 30 0 0 1-31 31H69l-35 24 1-24h-3A31 31 0 0 1 1 149V36A31 31 0 0 1 32 5Z"
                fill="#9ab7e5"
                opacity=".55"
                transform="translate(7 5)"
              />
              <path
                d="M32 0h112a31 31 0 0 1 31 31v113a30 30 0 0 1-31 31H69l-35 24 1-24h-3A31 31 0 0 1 1 144V31A31 31 0 0 1 32 0Z"
                fill={`url(#${id}-bubble)`}
                stroke="#d8e6fb"
                strokeWidth="3"
              />
              <path
                d="M36 5h99c24 0 33 8 35 29"
                stroke="white"
                strokeOpacity=".6"
                strokeWidth="2"
              />
              <text
                x="86"
                y="136"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
                fontWeight="700"
                fontSize="146"
                fill={`url(#${id}-dark)`}
              >
                ?
              </text>
            </g>
          </g>
          <g className="fq-chat-float">
            <g
              transform="translate(68 160) rotate(-11 56 47)"
              filter={`url(#${id}-shadow)`}
            >
              <path
                d="M20 0h77a20 20 0 0 1 20 20v50a20 20 0 0 1-20 20H37L19 107l-2-17A20 20 0 0 1 0 70V20A20 20 0 0 1 20 0Z"
                fill={`url(#${id}-dark)`}
                stroke="#5b709c"
                strokeWidth="1.5"
              />
              {[36, 58, 80].map((x) => (
                <circle key={x} cx={x} cy="43" r="6.5" fill="#ebf3fe" />
              ))}
            </g>
          </g>
          <g className="fq-tile-float fq-tile-chart">
            <g
              transform="translate(108 24) rotate(-12 45 43)"
              filter={`url(#${id}-shadow)`}
            >
              <rect
                width="88"
                height="85"
                rx="16"
                fill={`url(#${id}-white)`}
                stroke="#d8e4f6"
                strokeWidth="2"
              />
              {[16, 25, 35, 45].map((h, i) => (
                <rect
                  key={h}
                  x={20 + i * 13}
                  y={64 - h}
                  width="9"
                  height={h}
                  rx="3"
                  fill={`url(#${id}-lime)`}
                />
              ))}
            </g>
          </g>
          <g className="fq-tile-float fq-tile-folder">
            <g
              transform="translate(413 68) rotate(16 41 42)"
              filter={`url(#${id}-shadow)`}
            >
              <rect
                width="86"
                height="84"
                rx="17"
                fill={`url(#${id}-white)`}
                stroke="#d8e4f5"
                strokeWidth="2"
              />
              <path d="M22 29V23h19l6 6h18v35H22Z" fill={`url(#${id}-lime)`} />
              <path d="M22 34h43" stroke="#deebfd" strokeOpacity=".7" />
            </g>
          </g>
          <g className="fq-tile-float fq-tile-people">
            <g
              transform="translate(397 222) rotate(13 41 40)"
              filter={`url(#${id}-shadow)`}
            >
              <rect
                width="84"
                height="82"
                rx="17"
                fill={`url(#${id}-white)`}
                stroke="#d8e4f5"
              />
              <g fill={`url(#${id}-lime)`}>
                <circle cx="42" cy="31" r="9" />
                <circle cx="25" cy="35" r="6" />
                <circle cx="59" cy="35" r="6" />
                <path d="M29 61v-9c0-16 26-16 26 0v9Zm-14-3v-8c0-9 10-13 14-7-4 4-5 10-5 15Zm45 0c0-5-1-11-5-15 7-6 15-2 15 7v8Z" />
              </g>
            </g>
          </g>
          <g className="fq-tile-float fq-tile-flag">
            <g
              transform="translate(75 282) rotate(-14 40 39)"
              filter={`url(#${id}-shadow)`}
            >
              <rect
                width="77"
                height="73"
                rx="16"
                fill={`url(#${id}-white)`}
                stroke="#dee8f7"
              />
              <path d="M28 56V20" stroke="#4e7ac0" strokeWidth="3" />
              <path
                d="M29 22c10-10 15 6 28-1v20c-13 7-18-9-28 1Z"
                fill="#3588ef"
              />
            </g>
          </g>
          <path
            className="fq-art-spark"
            d="M387 13c0 18-3 23-16 24 13 1 16 6 16 24 0-18 3-23 16-24-13-1-16-6-16-24Z"
            fill="#4590ef"
          />
          <circle
            className="fq-art-particle"
            cx="59"
            cy="88"
            r="5"
            fill="#5284d4"
          />
        </svg>
      </div>
      {faqSupportUrl ? (
        <a className="fq-support" href={faqSupportUrl}>
          {pillContent}
        </a>
      ) : (
        <div className="fq-support" aria-describedby="fq-support-status">
          {pillContent}
        </div>
      )}
      {!faqSupportUrl && (
        <p id="fq-support-status" className="fq-support-status">
          Kênh liên hệ hỗ trợ sẽ được cập nhật.
        </p>
      )}
    </div>
  )
}

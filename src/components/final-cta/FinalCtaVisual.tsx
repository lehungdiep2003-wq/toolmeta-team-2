import monogram from "../../../Media Toolmeta/toolmeta-logo-icon-gradient.png.png"
import ProductExperienceIcon from "../product-experience/ProductExperienceIcon"

export default function FinalCtaVisual() {
  return (
    <div
      className="fcta-visual"
      role="img"
      aria-label="Toolmeta tập trung tài sản AD, BM và PAGE quanh biểu tượng Toolmeta chính thức."
    >
      <div className="fcta-scene" aria-hidden="true">
        <span className="fcta-core-glow" />
        <svg
          className="fcta-orbits"
          viewBox="0 0 740 490"
          fill="none"
          focusable="false"
        >
          <ellipse
            cx="365"
            cy="270"
            rx="225"
            ry="119"
            transform="rotate(-21 365 270)"
            stroke="#84b0ef"
            strokeWidth="1.5"
          />
          <ellipse
            cx="365"
            cy="270"
            rx="211"
            ry="105"
            transform="rotate(21 365 270)"
            stroke="#e5f0fe"
            strokeOpacity=".8"
            strokeWidth="1.2"
          />
          <g transform="translate(365 270) rotate(-21) scale(1 .529)">
            <g className="fcta-orbit-traveler">
              <circle cx="225" cy="0" r="5" fill="#7bb1f8" />
            </g>
          </g>
        </svg>
        <div className="fcta-core-position fcta-reveal-core">
          <span className="fcta-ground-shadow" />
          <div className="fcta-core-float">
            <div className="fcta-core">
              <img
                src={monogram}
                alt=""
                width="1254"
                height="1254"
                decoding="async"
              />
            </div>
          </div>
        </div>
        <div className="fcta-node-position fcta-ad fcta-reveal-ad">
          <div className="fcta-node-float">
            <div className="fcta-node">
              <span className="fcta-node-icon">
                <ProductExperienceIcon name="people" size={42} />
              </span>
              <strong>AD</strong>
            </div>
          </div>
        </div>
        <div className="fcta-node-position fcta-bm fcta-reveal-bm">
          <div className="fcta-node-float">
            <div className="fcta-node">
              <span className="fcta-node-icon">
                <ProductExperienceIcon name="briefcase" size={42} />
              </span>
              <strong>BM</strong>
            </div>
          </div>
        </div>
        <div className="fcta-node-position fcta-page fcta-reveal-page">
          <div className="fcta-node-float">
            <div className="fcta-node">
              <span className="fcta-node-icon">
                <ProductExperienceIcon name="flag" size={40} />
              </span>
              <strong>PAGE</strong>
            </div>
          </div>
        </div>
        <div className="fcta-pill-position fcta-reveal-pill">
          <div className="fcta-pill">
            <span>
              <ProductExperienceIcon name="bolt" size={23} />
            </span>
            <div>
              <strong>Quản lý tập trung</strong>
              <small>AD · BM · PAGE</small>
            </div>
          </div>
        </div>
        <span className="fcta-particle fcta-particle-one" />
        <span className="fcta-particle fcta-particle-two" />
        <span className="fcta-particle fcta-particle-three" />
        <span className="fcta-particle fcta-particle-four" />
        <svg
          className="fcta-cursor"
          viewBox="0 0 66 62"
          fill="none"
          focusable="false"
        >
          <path d="m4 4 54 13-23 10-12 25Z" fill="#447ad2" />
          <path d="m4 4 31 23 23-10Z" fill="#5298f6" />
          <path d="m4 4 19 48 6-23Z" fill="#2650a3" />
          <path d="m29 29 13 15 8-8-15-9Z" fill="#3968bd" />
        </svg>
      </div>
    </div>
  )
}

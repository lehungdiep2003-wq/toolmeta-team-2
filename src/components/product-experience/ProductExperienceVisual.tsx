import monogram from "../../../Media Toolmeta/toolmeta-logo-icon-gradient.png.png"
import ProductExperienceIcon from "./ProductExperienceIcon"

export default function ProductExperienceVisual() {
  return (
    <div
      className="pe-visual"
      role="img"
      aria-label="Toolmeta kết nối tài khoản quảng cáo AD, Business Manager và Page trong một nơi quản lý tập trung."
    >
      <div className="pe-visual-scene" aria-hidden="true">
        <div className="pe-halo" />
        <svg
          className="pe-orbits"
          viewBox="0 0 740 430"
          fill="none"
          focusable="false"
        >
          <g className="pe-orbit-turn">
            <ellipse
              cx="365"
              cy="220"
              rx="250"
              ry="103"
              transform="rotate(-22 365 220)"
              stroke="#84aeed"
              strokeWidth="1.2"
            />
            <ellipse
              cx="365"
              cy="220"
              rx="160"
              ry="152"
              transform="rotate(25 365 220)"
              stroke="#ceddf4"
              strokeWidth="1.2"
            />
            <ellipse
              cx="365"
              cy="220"
              rx="245"
              ry="116"
              transform="rotate(15 365 220)"
              stroke="#b8ceef"
              strokeWidth=".8"
            />
          </g>
        </svg>
        <div className="pe-core-position">
          <div className="pe-core-float">
            <div className="pe-core">
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
        <div className="pe-node-position pe-ad">
          <div className="pe-node-float">
            <div className="pe-node">
              <span className="pe-node-icon">
                <ProductExperienceIcon name="people" size={42} />
              </span>
              <strong>AD</strong>
            </div>
          </div>
        </div>
        <div className="pe-node-position pe-bm">
          <div className="pe-node-float">
            <div className="pe-node">
              <span className="pe-node-icon">
                <ProductExperienceIcon name="briefcase" size={42} />
              </span>
              <strong>BM</strong>
            </div>
          </div>
        </div>
        <div className="pe-node-position pe-page">
          <div className="pe-node-float">
            <div className="pe-node">
              <span className="pe-node-icon">
                <ProductExperienceIcon name="flag" size={39} />
              </span>
              <strong>Page</strong>
            </div>
          </div>
        </div>
        <div className="pe-pill">
          <span>
            <ProductExperienceIcon name="bolt" size={22} />
          </span>
          <div>
            <strong>Quản lý tập trung</strong>
            <small>Mọi tài sản trong một nơi</small>
          </div>
        </div>
        <span className="pe-particle pe-particle-one" />
        <span className="pe-particle pe-particle-two" />
        <span className="pe-particle pe-particle-three" />
        <svg className="pe-spark" viewBox="0 0 30 40" focusable="false">
          <path
            d="M15 0C15 15 12 19 0 20c12 1 15 5 15 20 0-15 3-19 15-20C18 19 15 15 15 0Z"
            fill="#8cbaf9"
          />
        </svg>
      </div>
    </div>
  )
}

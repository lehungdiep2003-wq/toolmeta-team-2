export default function PricingDecoration() {
  return (
    <div className="pr-decoration" aria-hidden="true">
      <span className="pr-ambient-glow" />
      <span className="pr-corner-shape" />
      <span className="pr-ring" />
      <span className="pr-dot-pattern" />
      <span className="pr-orb pr-orb-large" />
      <span className="pr-orb pr-orb-small" />
      <svg
        className="pr-orbit"
        viewBox="0 0 1440 650"
        preserveAspectRatio="none"
        fill="none"
        focusable="false"
      >
        <path
          d="M420 640C845 680 1230 530 1450 170"
          stroke="#c7d5e9"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}

export type WorkflowIconName = "download" | "user" | "sync" | "grid" | "arrow"

interface Props {
  name: WorkflowIconName
  size?: number
}
export default function WorkflowIcon({ name, size = 20 }: Props) {
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
      {name === "download" && (
        <>
          <path d="M12 3v12m-5-5 5 5 5-5M4 14v6h16v-6" />
        </>
      )}
      {name === "user" && (
        <>
          <circle cx="12" cy="7" r="4" />
          <path d="M4 21v-3a8 6 0 0 1 16 0v3Z" />
        </>
      )}
      {name === "sync" && (
        <>
          <path d="M3 9a9 9 0 0 1 15-4l3 3m0-5v5h-5M21 15a9 9 0 0 1-15 4l-3-3m0 5v-5h5" />
        </>
      )}
      {name === "grid" && (
        <>
          {[3, 14].flatMap((x) =>
            [3, 14].map((y) => (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="7"
                height="7"
                rx="1.5"
              />
            )),
          )}
        </>
      )}
      {name === "arrow" && <path d="M4 12h16m-6-6 6 6-6 6" />}
    </svg>
  )
}

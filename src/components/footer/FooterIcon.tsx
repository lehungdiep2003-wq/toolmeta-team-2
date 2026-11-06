export type FooterIconName = "cube" | "book" | "shield" | "mail" | "arrow" | "globe"
interface Props {
  name: FooterIconName
  size?: number
}
export default function FooterIcon({ name, size = 22 }: Props) {
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
      {name === "cube" && (
        <>
          <path d="m12 2 10 5.5v10L12 23 2 17.5v-10ZM2 7.5 12 13l10-5.5M12 13v10M7 4.75l10 5.5" />
        </>
      )}
      {name === "book" && (
        <>
          <path d="M12 5c-4-3-8-3-10-2v17c3-1 6-1 10 2 4-3 7-3 10-2V3c-2-1-6-1-10 2Zm0 0v17" />
        </>
      )}
      {name === "shield" && (
        <>
          <path d="m12 2 9 4v6c0 5-5 9-9 10-4-1-9-5-9-10V6Z" />
          <path d="m8 12 3 3 5-6" />
        </>
      )}
      {name === "mail" && (
        <>
          <rect x="2" y="4" width="20" height="16" rx="3" />
          <path d="m3 6 9 7 9-7" />
        </>
      )}
      {name === "arrow" && <path d="M4 12h16m-6-6 6 6-6 6" />}
      {name === "globe" && (
        <>
          <circle cx="12" cy="12" r="10" />
          <ellipse cx="12" cy="12" rx="4.5" ry="10" />
          <path d="M2 12h20M4 6.5h16M4 17.5h16" />
        </>
      )}
    </svg>
  )
}

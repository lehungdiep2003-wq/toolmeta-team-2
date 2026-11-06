export type FaqIconName = "product" | "extension" | "layers" | "play" | "gift" | "shield" | "bulb"
interface Props {
  name: FaqIconName
  size?: number
}
export default function FaqIcon({ name, size = 24 }: Props) {
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
      {name === "product" && (
        <>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M8 8h8M8 12h5m-5 4h8" />
        </>
      )}
      {name === "extension" && (
        <path d="M8 3h3V2a3 3 0 0 1 6 0v1h4v6h1a3 3 0 0 1 0 6h-1v6h-6v-1a3 3 0 0 0-6 0v1H3v-6h1a3 3 0 0 0 0-6H3V3Z" />
      )}
      {name === "layers" && (
        <>
          <path d="m12 3 10 5-10 5L2 8Z" />
          <path d="m2 12 10 5 10-5M2 16l10 5 10-5" />
        </>
      )}
      {name === "play" && <path d="m5 2 17 10L5 22Z" />}
      {name === "gift" && (
        <>
          <rect x="3" y="8" width="18" height="4" rx="1" />
          <path d="M5 12v10h14V12M12 8v14" />
          <path d="M12 8H8a3 3 0 1 1 3-3Zm0 0h4a3 3 0 1 0-3-3Z" />
        </>
      )}
      {name === "shield" && (
        <>
          <path d="M12 2 3 6v6c0 5 5 9 9 10 4-1 9-5 9-10V6Z" />
          <path d="m8 12 3 3 5-6" />
        </>
      )}
      {name === "bulb" && (
        <>
          <path d="M8 16c0-4-3-4-3-8a7 7 0 0 1 14 0c0 4-3 4-3 8ZM9 20h6m-5 3h4M12 6v5m-2-3h4" />
        </>
      )}
    </svg>
  )
}

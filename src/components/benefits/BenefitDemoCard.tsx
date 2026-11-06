import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

const CardContext = createContext({ paused: false, resetKey: 0, delay: 0 })
export const useBenefitCard = () => useContext(CardContext)

/** Hover/focus owns only this card. Release resets it after a short quiet period. */
export default function BenefitDemoCard({
  index,
  className,
  titleId,
  children,
}: {
  index: number
  className: string
  titleId: string
  children: ReactNode
}) {
  const [paused, setPaused] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const flags = useRef({ hover: false, focus: false })
  const resume = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(resume.current), [])
  const update = () => {
    clearTimeout(resume.current)
    setPaused(true)
    if (!flags.current.hover && !flags.current.focus) {
      resume.current = setTimeout(() => {
        setResetKey((key) => key + 1)
        setPaused(false)
      }, 1400)
    }
  }
  return (
    <article
      className={className}
      data-benefit={`0${index + 1}`}
      aria-labelledby={titleId}
      data-demo-paused={paused}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          flags.current.hover = true
          update()
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") {
          flags.current.hover = false
          update()
        }
      }}
      onFocusCapture={() => {
        flags.current.focus = true
        update()
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          flags.current.focus = false
          update()
        }
      }}
      onPointerDownCapture={update}
      onInputCapture={update}
      onKeyDownCapture={update}
    >
      <CardContext.Provider value={{ paused, resetKey, delay: index * 600 }}>
        {children}
      </CardContext.Provider>
    </article>
  )
}

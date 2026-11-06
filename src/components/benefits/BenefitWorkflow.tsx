import type { BenefitIcon, RenderBenefitIcon } from "./types"
import useDemoTimeline from "./useDemoTimeline"
import { demoPeriods, workflowSteps } from "./demoTimelines"

interface WorkflowStep {
  label: string
  icon: BenefitIcon
}

const steps: WorkflowStep[] = [
  { label: "Tạo & quản lý", icon: "page" },
  { label: "Theo dõi", icon: "sync" },
  { label: "Hoàn thành", icon: "check" },
]

export default function BenefitWorkflow({
  renderIcon,
  activeStep,
}: {
  renderIcon: RenderBenefitIcon
  activeStep?: number
}) {
  const { frame, started, reduced } = useDemoTimeline(
    workflowSteps,
    demoPeriods.workflow,
    0,
    activeStep !== undefined,
  )
  const automatic = activeStep === undefined && started && !reduced
  const current =
    activeStep ?? (automatic ? (frame.reset ? -1 : frame.step) : 2)
  const complete = automatic ? frame.complete : current === 2
  return (
    <ol
      className="bnf-workflow"
      aria-label="Các bước vận hành tài sản"
      data-demo-state={
        automatic
          ? frame.reset
            ? "reset"
            : frame.complete
              ? "completed"
              : "demo"
          : "idle"
      }
    >
      {steps.map((step, i) => (
        <li
          key={step.label}
          data-active={current === i}
          data-complete={i < current || (i === 2 && complete)}
          data-link-active={automatic && frame.link === i}
        >
          <span className="bnf-workflow-icon">{renderIcon(step.icon, 23)}</span>
          <b>{step.label}</b>
          <small>
            0{i + 1}
            {i === 2 && (
              <span className="bnf-complete-badge" data-visible={complete}>
                Hoàn tất
              </span>
            )}
          </small>
        </li>
      ))}
    </ol>
  )
}

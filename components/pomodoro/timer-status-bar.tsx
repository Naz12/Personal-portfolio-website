import { PhaseBadge } from "@/components/pomodoro/phase-badge"
import { SessionDots } from "@/components/pomodoro/session-dots"
import type { Phase } from "@/lib/pomodoro/types"

interface TimerStatusBarProps {
  phase: Phase
  sessionsCompleted: number
  sessionsTarget: number
}

export function TimerStatusBar({
  phase,
  sessionsCompleted,
  sessionsTarget,
}: TimerStatusBarProps) {
  return (
    <div className="shrink-0 w-full max-w-md flex flex-col items-center gap-2.5 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm px-4 py-2.5">
      <PhaseBadge phase={phase} />
      <SessionDots sessionsCompleted={sessionsCompleted} sessionsTarget={sessionsTarget} />
    </div>
  )
}

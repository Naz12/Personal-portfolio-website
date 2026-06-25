import { Check, ChevronRight } from "lucide-react"

import { formatClimbCount } from "@/lib/pomodoro/climb-size"
import type { DailyProgress, PomodoroSettings } from "@/lib/pomodoro/types"
import { cn } from "@/lib/utils"

interface DailyProgressBarProps {
  daily: DailyProgress
  settings: PomodoroSettings
  compact?: boolean
  onClick?: () => void
}

export function DailyProgressBar({
  daily,
  settings,
  compact,
  onClick,
}: DailyProgressBarProps) {
  const target = settings.dailyMinClimbs
  const completed = daily.climbsCompleted
  const goalMet = completed >= target
  const percent = target > 0 ? Math.min(100, (completed / target) * 100) : 0
  const completedLabel = formatClimbCount(completed)
  const targetLabel = formatClimbCount(target)

  const Wrapper = onClick ? "button" : "div"

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "w-full max-w-sm mx-auto rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm px-3 text-left",
        compact ? "py-2 space-y-1.5" : "px-4 py-3 space-y-2.5",
        onClick &&
          "hover:bg-card/60 hover:border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
      )}
      aria-label={onClick ? "View climb history" : undefined}
    >
      <div className="flex items-center justify-between text-sm">
        <span className={cn("text-muted-foreground font-medium", compact && "text-xs")}>
          Today&apos;s climbs
        </span>
        <span
          className={cn(
            "flex items-center gap-1",
            compact ? "text-xs" : "text-sm",
            goalMet && "text-primary font-semibold"
          )}
        >
          {goalMet && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />}
          <span className="tabular-nums">
            {goalMet
              ? `${completedLabel} / ${targetLabel}`
              : `${completedLabel} / ${targetLabel}`}
          </span>
          {onClick && (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden />
          )}
        </span>
      </div>
      <div
        className={cn(
          "w-full bg-secondary/80 rounded-full overflow-hidden",
          compact ? "h-2" : "h-2.5"
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            goalMet ? "bg-emerald-500" : "bg-primary"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {goalMet && completed > target && !compact && (
        <p className="text-xs text-muted-foreground">
          +{formatClimbCount(completed - target)} beyond today&apos;s minimum
        </p>
      )}
    </Wrapper>
  )
}

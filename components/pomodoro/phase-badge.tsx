import { Badge } from "@/components/ui/badge"
import type { Phase } from "@/lib/pomodoro/types"
import { cn } from "@/lib/utils"

interface PhaseBadgeProps {
  phase: Phase
}

const phaseStyles: Record<Phase, string> = {
  idle: "bg-muted/60 text-muted-foreground border-border/60",
  work: "bg-primary/15 text-primary border-primary/30",
  break: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  longBreak: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
  summit: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  paused: "bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40 animate-pulse",
}

const phaseLabels: Record<Phase, string> = {
  idle: "Ready",
  work: "Focus",
  break: "Short break",
  longBreak: "Long break",
  summit: "Summit",
  paused: "Paused",
}

export function PhaseBadge({ phase }: PhaseBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "px-3 py-1 text-xs sm:text-sm font-semibold uppercase tracking-widest border",
        phaseStyles[phase]
      )}
    >
      {phaseLabels[phase]}
    </Badge>
  )
}

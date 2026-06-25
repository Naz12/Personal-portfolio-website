import { CalendarDays, Flame, Trophy } from "lucide-react"

import type { StreakData } from "@/lib/pomodoro/types"
import { cn } from "@/lib/utils"

interface StreakBadgeProps {
  streak: StreakData
  onClick?: () => void
}

export function StreakBadge({ streak, onClick }: StreakBadgeProps) {
  const hasStreak = streak.currentStreak > 0

  const content = (
    <>
      <Flame
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          hasStreak ? "text-orange-500" : "text-muted-foreground"
        )}
        aria-hidden
      />
      <span className="font-semibold tabular-nums">{streak.currentStreak}</span>
      <span className="text-muted-foreground hidden sm:inline text-xs">
        day{streak.currentStreak === 1 ? "" : "s"}
      </span>
      {streak.bestStreak > 0 && (
        <span className="text-muted-foreground hidden sm:flex items-center gap-1 border-l border-border/60 pl-2 ml-0.5 text-xs">
          <Trophy className="h-3.5 w-3.5" aria-hidden />
          {streak.bestStreak}
        </span>
      )}
      {onClick && (
        <CalendarDays className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0 sm:hidden" aria-hidden />
      )}
    </>
  )

  const className = cn(
    "flex items-center gap-1.5 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 text-sm",
    onClick && "hover:bg-card/80 hover:border-border active:scale-[0.98] transition-all"
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(className, "min-h-10")}
        aria-label="View climb history and streak"
        title="View history"
      >
        {content}
      </button>
    )
  }

  return <div className={className}>{content}</div>
}

import { cn } from "@/lib/utils"

interface SessionDotsProps {
  sessionsCompleted: number
  sessionsTarget: number
}

export function SessionDots({ sessionsCompleted, sessionsTarget }: SessionDotsProps) {
  const currentSession = Math.min(sessionsCompleted + 1, sessionsTarget)

  return (
    <div
      className="flex items-center gap-2 w-full justify-center"
      aria-label={`Session ${currentSession} of ${sessionsTarget}`}
    >
      <p className="text-[10px] sm:text-xs text-muted-foreground shrink-0 tabular-nums">
        {currentSession}/{sessionsTarget}
      </p>
      <div className="flex items-center gap-1">
        {Array.from({ length: sessionsTarget }).map((_, index) => {
          const isComplete = index < sessionsCompleted
          const isCurrent = index === sessionsCompleted

          return (
            <div
              key={index}
              className={cn(
                "h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all duration-300",
                isComplete
                  ? "bg-primary"
                  : isCurrent
                    ? "bg-primary/50 ring-2 ring-primary/40 ring-offset-1 ring-offset-background scale-110"
                    : "bg-muted-foreground/20"
              )}
            />
          )
        })}
      </div>
    </div>
  )
}

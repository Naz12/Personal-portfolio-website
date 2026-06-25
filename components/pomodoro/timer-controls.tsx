"use client"

import * as React from "react"
import { RotateCcw, SkipForward } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Phase } from "@/lib/pomodoro/types"
import { cn } from "@/lib/utils"

interface TimerControlsProps {
  phase: Phase
  canStart: boolean
  startHint?: string
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onSkip?: () => void
  onReset?: () => void
  onDismissSummit?: () => void
}

export function TimerControls({
  phase,
  canStart,
  startHint,
  onStart,
  onPause,
  onResume,
  onSkip,
  onReset,
  onDismissSummit,
}: TimerControlsProps) {
  const [confirmAction, setConfirmAction] = React.useState<"skip" | "reset" | null>(
    null
  )

  const isRunning =
    phase === "work" || phase === "break" || phase === "longBreak"
  const isPaused = phase === "paused"
  const isIdle = phase === "idle"
  const isSummit = phase === "summit"

  const handleSkip = () => {
    if (confirmAction !== "skip") {
      setConfirmAction("skip")
      return
    }
    setConfirmAction(null)
    onSkip?.()
  }

  const handleReset = () => {
    if (confirmAction !== "reset") {
      setConfirmAction("reset")
      return
    }
    setConfirmAction(null)
    onReset?.()
  }

  React.useEffect(() => {
    setConfirmAction(null)
  }, [phase])

  React.useEffect(() => {
    if (!confirmAction) return
    const timer = window.setTimeout(() => setConfirmAction(null), 3000)
    return () => window.clearTimeout(timer)
  }, [confirmAction])

  return (
    <div className="w-full max-w-md mx-auto space-y-2">
      <div className="flex flex-col gap-2">
        {isIdle && (
          <>
            <Button
              size="lg"
              className="w-full min-h-11 sm:min-h-12 text-sm sm:text-base font-semibold shadow-lg shadow-primary/20 transition-all"
              onClick={onStart}
              disabled={!canStart}
            >
              Start climb
            </Button>
            {!canStart && startHint && (
              <p className="text-center text-xs text-muted-foreground">{startHint}</p>
            )}
            {canStart && (
              <p className="text-center text-[10px] sm:text-xs text-muted-foreground">
                Press Enter to start
              </p>
            )}
          </>
        )}

        {isRunning && (
          <Button
            size="lg"
            className="w-full min-h-11 sm:min-h-12 text-sm sm:text-base font-semibold"
            onClick={onPause}
          >
            Pause
          </Button>
        )}

        {isPaused && (
          <Button
            size="lg"
            className="w-full min-h-11 sm:min-h-12 text-sm sm:text-base font-semibold shadow-lg shadow-primary/20"
            onClick={onResume}
          >
            Resume
          </Button>
        )}

        {isSummit && onDismissSummit && (
          <Button
            size="lg"
            className="w-full min-h-12 text-base font-semibold"
            onClick={onDismissSummit}
          >
            Start long break
          </Button>
        )}
      </div>

      {(isRunning || isPaused) && (onSkip || onReset) && (
        <div className="grid grid-cols-2 gap-2">
          {onSkip && (
            <Button
              variant={confirmAction === "skip" ? "default" : "outline"}
              className="min-h-10 sm:min-h-11 gap-2 text-xs sm:text-sm"
              onClick={handleSkip}
            >
              <SkipForward className="h-4 w-4 shrink-0" />
              {confirmAction === "skip" ? "Confirm?" : "Skip"}
            </Button>
          )}
          {onReset && (
            <Button
              variant={confirmAction === "reset" ? "destructive" : "outline"}
              className={cn(
                "min-h-10 sm:min-h-11 gap-2 text-xs sm:text-sm",
                confirmAction !== "reset" &&
                  "text-muted-foreground hover:text-destructive hover:border-destructive/50"
              )}
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4 shrink-0" />
              {confirmAction === "reset" ? "Confirm?" : "Reset"}
            </Button>
          )}
        </div>
      )}

      {(isRunning || isPaused) && (
        <p className="text-center text-[10px] sm:text-xs text-muted-foreground">
          Space to {isPaused ? "resume" : "pause"}
        </p>
      )}
    </div>
  )
}

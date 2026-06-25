"use client"

import { motion } from "framer-motion"

import { formatTime } from "@/hooks/use-pomodoro"
import { getBatchClimbLabel } from "@/lib/pomodoro/batch"
import { formatTagLabel } from "@/lib/pomodoro/tags"
import type { Phase } from "@/lib/pomodoro/types"

interface TimerDisplayProps {
  remainingMs: number
  totalMs: number
  phase: Phase
  climbName: string
  tag?: string
  isLongBreakUpNext?: boolean
  targetClimbs: number
  climbsCompletedInBatch: number
}

const RADIUS = 132
const STROKE = 6
const SIZE = (RADIUS + STROKE) * 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function TimerDisplay({
  remainingMs,
  totalMs,
  phase,
  climbName,
  tag,
  isLongBreakUpNext = false,
  targetClimbs,
  climbsCompletedInBatch,
}: TimerDisplayProps) {
  const isRest = phase === "break" || phase === "longBreak"
  const isPaused = phase === "paused"
  const progress = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0
  const offset = CIRCUMFERENCE * (1 - progress)
  const batchLabel = getBatchClimbLabel(climbsCompletedInBatch, targetClimbs, phase)

  const ringColor = isPaused
    ? "stroke-amber-500/70"
    : isRest
      ? "stroke-emerald-500/60"
      : "stroke-primary/80"

  const trackColor = isPaused
    ? "stroke-amber-500/15"
    : isRest
      ? "stroke-emerald-500/10"
      : "stroke-primary/10"

  return (
    <motion.div
      key={`${phase}-${climbName}-${climbsCompletedInBatch}`}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col items-center gap-2 sm:gap-3"
    >
      {batchLabel && (
        <p className="text-[10px] sm:text-xs font-medium text-primary/90 uppercase tracking-wide">
          {batchLabel}
        </p>
      )}

      {climbName && (
        <div className="text-center space-y-0.5 max-w-xs sm:max-w-md px-2">
          <p className="text-sm sm:text-base text-muted-foreground truncate">
            {isLongBreakUpNext ? "Up next: " : "Climbing "}
            <span className="font-semibold text-foreground">{climbName}</span>
          </p>
          {tag && (
            <span className="inline-flex rounded-full border border-border/60 bg-background/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {formatTagLabel(tag)}
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center justify-center origin-center scale-[0.78] sm:scale-90 md:scale-100">
        {isPaused && (
          <div className="absolute inset-0 rounded-full bg-amber-500/5 animate-pulse pointer-events-none" />
        )}

        <svg width={SIZE} height={SIZE} className="-rotate-90" aria-hidden>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            className={trackColor}
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            className={`${ringColor} transition-[stroke-dashoffset] duration-1000 ease-linear`}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>

        <p
          className={`absolute text-5xl sm:text-6xl md:text-7xl font-bold tabular-nums tracking-tight ${
            isPaused
              ? "text-amber-600/90 dark:text-amber-400/90"
              : isRest
                ? "text-muted-foreground"
                : "gradient-text"
          }`}
        >
          {formatTime(remainingMs)}
        </p>
      </div>
    </motion.div>
  )
}

"use client"

import { motion } from "framer-motion"
import { Mountain, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getBatchClimbLabel } from "@/lib/pomodoro/batch"
import { CLIMB_SIZE_LABELS, getSessionsForClimbSize, isFullClimbSize } from "@/lib/pomodoro/climb-size"
import { formatTagLabel } from "@/lib/pomodoro/tags"
import type { ClimbSize, SummitResult } from "@/lib/pomodoro/types"

interface SummitScreenProps {
  climbName: string
  climbSize: ClimbSize
  tag: string
  targetClimbs: number
  climbsCompletedInBatch: number
  nextClimbName?: string
  result: SummitResult | null
  onContinue: () => void
}

export function SummitScreen({
  climbName,
  climbSize,
  tag,
  targetClimbs,
  climbsCompletedInBatch,
  nextClimbName,
  result,
  onContinue,
}: SummitScreenProps) {
  const batchLabel = getBatchClimbLabel(climbsCompletedInBatch, targetClimbs, "summit")
  const hasMoreClimbs = climbsCompletedInBatch < targetClimbs
  const sessions = getSessionsForClimbSize(climbSize)
  const completionLabel = isFullClimbSize(climbSize)
    ? `${CLIMB_SIZE_LABELS[climbSize]} · ${sessions} sessions complete`
    : `${CLIMB_SIZE_LABELS[climbSize]} complete`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="text-center space-y-3 sm:space-y-4 max-w-md mx-auto rounded-2xl border border-primary/20 bg-card/50 backdrop-blur-md px-4 sm:px-6 py-4 sm:py-6 shadow-xl shadow-primary/10"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
        className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/15"
      >
        <Mountain className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
      </motion.div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold flex items-center justify-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Summit reached
        </p>
        {batchLabel && (
          <p className="text-sm font-medium text-primary">{batchLabel}</p>
        )}
        <h2 className="text-xl sm:text-2xl font-bold">{climbName}</h2>
        <p className="text-muted-foreground text-sm">{completionLabel}</p>
        {tag && (
          <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium">
            {formatTagLabel(tag)}
          </span>
        )}
      </div>

      {result?.dailyGoalReached && (
        <p className="inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 text-sm font-semibold">
          Daily goal reached!
        </p>
      )}

      {result?.streakUpdated && (
        <p className="text-sm text-muted-foreground">
          Streak updated — keep climbing tomorrow.
        </p>
      )}

      {hasMoreClimbs && (
        <p className="text-sm text-muted-foreground">
          Long break next, then{" "}
          <span className="font-medium text-foreground">
            {nextClimbName || `climb ${climbsCompletedInBatch + 1}`}
          </span>{" "}
          starts automatically.
        </p>
      )}

      {!hasMoreClimbs && (
        <p className="text-sm text-muted-foreground">
          {targetClimbs > 1
            ? `All ${targetClimbs} climbs complete — great work!`
            : "Climb complete — great work!"}
        </p>
      )}

      <Button size="lg" className="w-full min-h-12 font-semibold" onClick={onContinue}>
        {hasMoreClimbs ? "Start long break" : "Finish"}
      </Button>
    </motion.div>
  )
}

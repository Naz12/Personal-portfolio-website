import type { Phase } from "@/lib/pomodoro/types"

export function getBatchClimbLabel(
  climbsCompletedInBatch: number,
  targetClimbs: number,
  phase: Phase
): string | null {
  if (targetClimbs <= 1) return null

  if (phase === "summit") {
    return `Climb ${climbsCompletedInBatch} of ${targetClimbs} complete`
  }

  if (phase === "longBreak") {
    if (climbsCompletedInBatch >= targetClimbs) return null
    return `Up next: Climb ${climbsCompletedInBatch + 1} of ${targetClimbs}`
  }

  if (phase === "idle") return null

  return `Climb ${climbsCompletedInBatch + 1} of ${targetClimbs}`
}

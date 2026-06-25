import type { ClimbSize } from "./types"

export const CLIMB_SIZE_SESSIONS: Record<ClimbSize, number> = {
  quarter: 1,
  half: 2,
  full: 4,
}

export const CLIMB_SIZE_WEIGHT: Record<ClimbSize, number> = {
  quarter: 0.25,
  half: 0.5,
  full: 1,
}

export const CLIMB_SIZE_LABELS: Record<ClimbSize, string> = {
  quarter: "1 session",
  half: "2 sessions",
  full: "Full climb",
}

export function isFullClimbSize(size: ClimbSize): boolean {
  return size === "full"
}

export const CLIMB_SIZES: ClimbSize[] = ["full", "half", "quarter"]

export const IDLE_CLIMB_DEFAULTS = {
  climbSize: "full" as ClimbSize,
  targetClimbs: 1,
  separateClimbNames: false,
}

export function getSessionsForClimbSize(size: ClimbSize): number {
  return CLIMB_SIZE_SESSIONS[size]
}

export function getClimbWeight(size: ClimbSize): number {
  return CLIMB_SIZE_WEIGHT[size]
}

export function formatClimbCount(value: number): string {
  const rounded = Math.round(value * 100) / 100
  if (Number.isInteger(rounded)) return String(rounded)
  return rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")
}

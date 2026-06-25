import type { PomodoroState } from "./types"

export function resizeClimbNames(
  names: string[],
  target: number,
  fallback: string
): string[] {
  const next = [...names]
  while (next.length < target) {
    next.push(fallback)
  }
  return next.slice(0, target)
}

export function getClimbNameAtIndex(state: PomodoroState, index: number): string {
  if (state.separateClimbNames) {
    const name = state.climbNames[index]?.trim()
    if (name) return name
  }
  return state.climbName.trim()
}

export function getActiveClimbName(state: PomodoroState): string {
  return getClimbNameAtIndex(state, state.climbsCompletedInBatch)
}

export function getSummitClimbName(state: PomodoroState): string {
  return getClimbNameAtIndex(state, Math.max(0, state.climbsCompletedInBatch - 1))
}

export function getNextClimbName(state: PomodoroState): string {
  return getClimbNameAtIndex(state, state.climbsCompletedInBatch)
}

export function getDisplayClimbName(state: PomodoroState): string {
  if (state.phase === "summit") {
    return getSummitClimbName(state)
  }
  if (state.phase === "longBreak") {
    return getNextClimbName(state)
  }
  return getActiveClimbName(state)
}

export function canStartBatch(state: PomodoroState): boolean {
  if (!state.separateClimbNames) {
    return state.climbName.trim().length > 0
  }
  for (let i = 0; i < state.targetClimbs; i++) {
    if (!state.climbNames[i]?.trim()) return false
  }
  return true
}

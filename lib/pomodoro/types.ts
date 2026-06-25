export type ActivePhase = "idle" | "work" | "break" | "longBreak" | "summit"
export type Phase = ActivePhase | "paused"
export type RunnablePhase = "work" | "break" | "longBreak"
export type ClimbSize = "quarter" | "half" | "full"

export interface PomodoroSettings {
  workMinutes: number
  breakMinutes: number
  longBreakMinutes: number
  dailyMinClimbs: number
  soundEnabled: boolean
  notificationsEnabled: boolean
  customTags: string[]
}

export interface PomodoroState {
  phase: Phase
  climbName: string
  separateClimbNames: boolean
  climbNames: string[]
  climbSize: ClimbSize
  tag: string
  sessionsCompleted: number
  targetClimbs: number
  climbsCompletedInBatch: number
  phaseEndAt: number | null
  pausedRemainingMs: number | null
  pausedPhase: RunnablePhase | null
}

export interface DailyProgress {
  date: string
  climbsCompleted: number
}

export interface StreakData {
  currentStreak: number
  lastQualifyingDate: string | null
  totalClimbs: number
  bestStreak: number
}

export interface SummitResult {
  daily: DailyProgress
  streak: StreakData
  dailyGoalReached: boolean
  streakUpdated: boolean
  climbWeight: number
  tag: string
}

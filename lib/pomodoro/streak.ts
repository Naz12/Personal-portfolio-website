import { getTodayDateString, getYesterdayDateString } from "./storage"
import { recordHistoryClimb } from "./history"
import type { DailyProgress, PomodoroSettings, StreakData, SummitResult } from "./types"

function roundClimbs(value: number): number {
  return Math.round(value * 100) / 100
}

export function normalizeDailyProgress(daily: DailyProgress): DailyProgress {
  const today = getTodayDateString()
  if (daily.date !== today) {
    return { date: today, climbsCompleted: 0 }
  }
  return daily
}

export function recordSummit(
  daily: DailyProgress,
  streak: StreakData,
  settings: PomodoroSettings,
  climbWeight: number,
  tag: string
): SummitResult {
  const today = getTodayDateString()
  const yesterday = getYesterdayDateString()
  const normalizedDaily = normalizeDailyProgress(daily)

  const updatedDaily: DailyProgress = {
    date: today,
    climbsCompleted: roundClimbs(normalizedDaily.climbsCompleted + climbWeight),
  }

  const updatedStreak: StreakData = {
    ...streak,
    totalClimbs: roundClimbs(streak.totalClimbs + climbWeight),
  }

  let streakUpdated = false
  const wasBelowMinimum = normalizedDaily.climbsCompleted < settings.dailyMinClimbs
  const dailyGoalReached =
    wasBelowMinimum && updatedDaily.climbsCompleted >= settings.dailyMinClimbs

  if (updatedDaily.climbsCompleted >= settings.dailyMinClimbs) {
    if (streak.lastQualifyingDate !== today) {
      streakUpdated = true
      if (streak.lastQualifyingDate === yesterday) {
        updatedStreak.currentStreak = streak.currentStreak + 1
      } else {
        updatedStreak.currentStreak = 1
      }
      updatedStreak.lastQualifyingDate = today
      updatedStreak.bestStreak = Math.max(
        updatedStreak.bestStreak,
        updatedStreak.currentStreak
      )
    }
  }

  recordHistoryClimb(today, climbWeight, tag)

  return {
    daily: updatedDaily,
    streak: updatedStreak,
    dailyGoalReached,
    streakUpdated,
    climbWeight,
    tag,
  }
}

export function reevaluateStreakForToday(
  daily: DailyProgress,
  streak: StreakData,
  settings: PomodoroSettings
): StreakData {
  const today = getTodayDateString()
  const yesterday = getYesterdayDateString()
  const normalizedDaily = normalizeDailyProgress(daily)

  if (normalizedDaily.climbsCompleted < settings.dailyMinClimbs) {
    return streak
  }

  if (streak.lastQualifyingDate === today) {
    return streak
  }

  const currentStreak =
    streak.lastQualifyingDate === yesterday ? streak.currentStreak + 1 : 1

  return {
    ...streak,
    currentStreak,
    lastQualifyingDate: today,
    bestStreak: Math.max(streak.bestStreak, currentStreak),
  }
}

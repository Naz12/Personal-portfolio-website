"use client"

import * as React from "react"

import { BATCH_CLIMBS_LIMIT } from "@/lib/pomodoro/constants"
import {
  canStartBatch,
  resizeClimbNames,
} from "@/lib/pomodoro/climb-names"
import { getClimbWeight, getSessionsForClimbSize, IDLE_CLIMB_DEFAULTS } from "@/lib/pomodoro/climb-size"
import { getAllTags } from "@/lib/pomodoro/tags"
import { recordSummit, reevaluateStreakForToday } from "@/lib/pomodoro/streak"
import {
  clampSetting,
  createInitialState,
  getPhaseDurationMs,
  getTodayDateString,
  loadDailyProgress,
  loadSettings,
  loadState,
  loadStreakData,
  saveDailyProgress,
  saveSettings,
  saveState,
  saveStreakData,
} from "@/lib/pomodoro/storage"
import type {
  ClimbSize,
  DailyProgress,
  Phase,
  PomodoroSettings,
  PomodoroState,
  RunnablePhase,
  StreakData,
  SummitResult,
} from "@/lib/pomodoro/types"

function batchFields(current: PomodoroState): Pick<
  PomodoroState,
  | "climbName"
  | "separateClimbNames"
  | "climbNames"
  | "targetClimbs"
  | "climbsCompletedInBatch"
  | "climbSize"
  | "tag"
> {
  return {
    climbName: current.climbName,
    separateClimbNames: current.separateClimbNames,
    climbNames: current.climbNames,
    targetClimbs: current.targetClimbs,
    climbsCompletedInBatch: current.climbsCompletedInBatch,
    climbSize: current.climbSize,
    tag: current.tag,
  }
}

function getRemainingMs(state: PomodoroState): number {
  if (state.phase === "paused" && state.pausedRemainingMs !== null) {
    return state.pausedRemainingMs
  }
  if (state.phaseEndAt !== null) {
    return Math.max(0, state.phaseEndAt - Date.now())
  }
  return 0
}

function startPhase(
  phase: RunnablePhase,
  settings: PomodoroSettings,
  partial: Partial<PomodoroState>
): PomodoroState {
  const durationMs = getPhaseDurationMs(phase, settings)
  return {
    ...createInitialState(),
    ...partial,
    phase,
    phaseEndAt: Date.now() + durationMs,
    pausedRemainingMs: null,
    pausedPhase: null,
  } as PomodoroState
}

export interface UsePomodoroReturn {
  mounted: boolean
  state: PomodoroState
  settings: PomodoroSettings
  daily: DailyProgress
  streak: StreakData
  remainingMs: number
  lastSummitResult: SummitResult | null
  startClimb: () => void
  pause: () => void
  resume: () => void
  skipPhase: () => void
  resetClimb: () => void
  setClimbName: (name: string) => void
  setSeparateClimbNames: (separate: boolean) => void
  setClimbNameAtIndex: (index: number, name: string) => void
  setTargetClimbs: (count: number) => void
  setClimbSize: (size: ClimbSize) => void
  setTag: (tag: string) => void
  updateSettings: (next: PomodoroSettings) => void
  toggleSound: () => void
  clearSummitResult: () => void
  dismissSummit: () => void
}

export function usePomodoro(): UsePomodoroReturn {
  const [mounted, setMounted] = React.useState(false)
  const [settings, setSettings] = React.useState<PomodoroSettings>(loadSettings())
  const [state, setState] = React.useState<PomodoroState>(createInitialState())
  const [daily, setDaily] = React.useState<DailyProgress>({
    date: getTodayDateString(),
    climbsCompleted: 0,
  })
  const [streak, setStreak] = React.useState<StreakData>({
    currentStreak: 0,
    lastQualifyingDate: null,
    totalClimbs: 0,
    bestStreak: 0,
  })
  const [remainingMs, setRemainingMs] = React.useState(0)
  const [lastSummitResult, setLastSummitResult] = React.useState<SummitResult | null>(
    null
  )

  const stateRef = React.useRef(state)
  const settingsRef = React.useRef(settings)
  const dailyRef = React.useRef(daily)
  const streakRef = React.useRef(streak)

  React.useEffect(() => {
    stateRef.current = state
  }, [state])
  React.useEffect(() => {
    settingsRef.current = settings
  }, [settings])
  React.useEffect(() => {
    dailyRef.current = daily
  }, [daily])
  React.useEffect(() => {
    streakRef.current = streak
  }, [streak])

  const persistState = React.useCallback((next: PomodoroState) => {
    stateRef.current = next
    setState(next)
    saveState(next)
  }, [])

  const handleSummit = React.useCallback(() => {
    const current = stateRef.current
    const climbWeight = getClimbWeight(current.climbSize)
    const result = recordSummit(
      dailyRef.current,
      streakRef.current,
      settingsRef.current,
      climbWeight,
      current.tag
    )
    setDaily(result.daily)
    setStreak(result.streak)
    setLastSummitResult(result)
    saveDailyProgress(result.daily)
    saveStreakData(result.streak)
    persistState({
      ...stateRef.current,
      phase: "summit",
      climbsCompletedInBatch: stateRef.current.climbsCompletedInBatch + 1,
      phaseEndAt: null,
      pausedRemainingMs: null,
      pausedPhase: null,
    })
  }, [persistState])

  const advanceFromWork = React.useCallback(() => {
    const current = stateRef.current
    const nextSessions = current.sessionsCompleted + 1
    const targetSessions = getSessionsForClimbSize(current.climbSize)
    if (nextSessions >= targetSessions) {
      persistState({ ...current, sessionsCompleted: nextSessions })
      handleSummit()
      return
    }
    persistState(
      startPhase("break", settingsRef.current, {
        ...batchFields(current),
        sessionsCompleted: nextSessions,
      })
    )
  }, [handleSummit, persistState])

  const advanceFromBreak = React.useCallback(() => {
    const current = stateRef.current
    persistState(
      startPhase("work", settingsRef.current, {
        ...batchFields(current),
        sessionsCompleted: current.sessionsCompleted,
      })
    )
  }, [persistState])

  const advanceFromLongBreak = React.useCallback(() => {
    const current = stateRef.current
    const batchComplete = current.climbsCompletedInBatch >= current.targetClimbs

    if (batchComplete) {
      persistState({
        ...batchFields(current),
        ...IDLE_CLIMB_DEFAULTS,
        phase: "idle",
        sessionsCompleted: 0,
        climbsCompletedInBatch: 0,
        phaseEndAt: null,
        pausedRemainingMs: null,
        pausedPhase: null,
      })
      return
    }

    persistState(
      startPhase("work", settingsRef.current, {
        ...batchFields(current),
        sessionsCompleted: 0,
      })
    )
  }, [persistState])

  const advancePhase = React.useCallback(() => {
    const current = stateRef.current
    if (current.phase === "work") advanceFromWork()
    else if (current.phase === "break") advanceFromBreak()
    else if (current.phase === "longBreak") advanceFromLongBreak()
  }, [advanceFromBreak, advanceFromLongBreak, advanceFromWork])

  React.useEffect(() => {
    const loadedSettings = loadSettings()
    const loadedState = loadState()
    const loadedDaily = loadDailyProgress()
    const loadedStreak = loadStreakData()

    setSettings(loadedSettings)
    setDaily(loadedDaily)
    setStreak(loadedStreak)

    const allTags = getAllTags(loadedSettings)
    const loadedWithTag =
      allTags.includes(loadedState.tag)
        ? loadedState
        : { ...loadedState, tag: allTags[0] ?? loadedState.tag }

    if (loadedWithTag.phaseEndAt && loadedWithTag.phaseEndAt <= Date.now()) {
      stateRef.current = loadedWithTag
      settingsRef.current = loadedSettings
      if (loadedWithTag.phase === "work") advanceFromWork()
      else if (loadedWithTag.phase === "break") advanceFromBreak()
      else if (loadedWithTag.phase === "longBreak") advanceFromLongBreak()
    } else {
      persistState(loadedWithTag)
      setRemainingMs(getRemainingMs(loadedWithTag))
    }

    setMounted(true)
  }, [advanceFromBreak, advanceFromLongBreak, advanceFromWork, persistState])

  React.useEffect(() => {
    if (!mounted) return

    const interval = window.setInterval(() => {
      const today = getTodayDateString()
      if (dailyRef.current.date !== today) {
        const resetDaily = { date: today, climbsCompleted: 0 }
        dailyRef.current = resetDaily
        setDaily(resetDaily)
        saveDailyProgress(resetDaily)
      }

      const current = stateRef.current
      const remaining = getRemainingMs(current)
      setRemainingMs(remaining)

      if (
        current.phase !== "idle" &&
        current.phase !== "paused" &&
        current.phase !== "summit" &&
        current.phaseEndAt !== null &&
        remaining <= 0
      ) {
        advancePhase()
      }
    }, 1000)

    return () => window.clearInterval(interval)
  }, [advancePhase, mounted])

  const startClimb = React.useCallback(() => {
    const current = stateRef.current
    if (!canStartBatch(current)) return

    const climbNames = current.separateClimbNames
      ? current.climbNames.map((name) => name.trim())
      : current.climbNames

    persistState(
      startPhase("work", settingsRef.current, {
        ...batchFields(current),
        climbName: current.climbName.trim(),
        climbNames,
        sessionsCompleted: 0,
        climbsCompletedInBatch: 0,
      })
    )
  }, [persistState])

  const pause = React.useCallback(() => {
    const current = stateRef.current
    if (
      current.phase !== "work" &&
      current.phase !== "break" &&
      current.phase !== "longBreak"
    ) {
      return
    }
    const remaining = getRemainingMs(current)
    persistState({
      ...current,
      phase: "paused",
      pausedPhase: current.phase,
      pausedRemainingMs: remaining,
      phaseEndAt: null,
    })
    setRemainingMs(remaining)
  }, [persistState])

  const resume = React.useCallback(() => {
    const current = stateRef.current
    if (current.phase !== "paused" || !current.pausedPhase) return
    const remaining = current.pausedRemainingMs ?? 0
    persistState({
      ...current,
      phase: current.pausedPhase,
      phaseEndAt: Date.now() + remaining,
      pausedRemainingMs: null,
      pausedPhase: null,
    })
  }, [persistState])

  const skipPhase = React.useCallback(() => {
    const current = stateRef.current
    if (current.phase === "paused" && current.pausedPhase) {
      stateRef.current = { ...current, phase: current.pausedPhase }
    }
    advancePhase()
  }, [advancePhase])

  const resetClimb = React.useCallback(() => {
    const current = stateRef.current
    persistState({
      ...batchFields(current),
      ...IDLE_CLIMB_DEFAULTS,
      phase: "idle",
      sessionsCompleted: 0,
      climbsCompletedInBatch: 0,
      phaseEndAt: null,
      pausedRemainingMs: null,
      pausedPhase: null,
    })
    setRemainingMs(0)
  }, [persistState])

  const setClimbName = React.useCallback(
    (name: string) => {
      persistState({ ...stateRef.current, climbName: name })
    },
    [persistState]
  )

  const setTargetClimbs = React.useCallback(
    (count: number) => {
      const current = stateRef.current
      const next = clampSetting(
        count,
        BATCH_CLIMBS_LIMIT.min,
        BATCH_CLIMBS_LIMIT.max,
        current.targetClimbs
      )
      const separateClimbNames = next === 1 ? false : current.separateClimbNames
      const climbNames =
        separateClimbNames
          ? resizeClimbNames(current.climbNames, next, current.climbName)
          : current.climbNames

      persistState({
        ...current,
        targetClimbs: next,
        separateClimbNames,
        climbNames,
      })
    },
    [persistState]
  )

  const setSeparateClimbNames = React.useCallback(
    (separate: boolean) => {
      const current = stateRef.current
      if (!separate || current.targetClimbs <= 1) {
        persistState({ ...current, separateClimbNames: false })
        return
      }

      persistState({
        ...current,
        separateClimbNames: true,
        climbNames: resizeClimbNames(
          current.climbNames,
          current.targetClimbs,
          current.climbName
        ),
      })
    },
    [persistState]
  )

  const setClimbNameAtIndex = React.useCallback(
    (index: number, name: string) => {
      const current = stateRef.current
      const climbNames = [...current.climbNames]
      while (climbNames.length <= index) {
        climbNames.push("")
      }
      climbNames[index] = name
      persistState({ ...current, climbNames })
    },
    [persistState]
  )

  const setClimbSize = React.useCallback(
    (size: ClimbSize) => {
      const current = stateRef.current
      persistState({
        ...current,
        climbSize: size,
        ...(size !== "full"
          ? { targetClimbs: 1, separateClimbNames: false }
          : { targetClimbs: 1 }),
      })
    },
    [persistState]
  )

  const setTag = React.useCallback(
    (tag: string) => {
      persistState({ ...stateRef.current, tag })
    },
    [persistState]
  )

  const updateSettings = React.useCallback(
    (next: PomodoroSettings) => {
      setSettings(next)
      saveSettings(next)
      settingsRef.current = next
      const allTags = getAllTags(next)
      if (!allTags.includes(stateRef.current.tag)) {
        persistState({ ...stateRef.current, tag: allTags[0] ?? stateRef.current.tag })
      }
      const reevaluated = reevaluateStreakForToday(
        dailyRef.current,
        streakRef.current,
        next
      )
      if (reevaluated !== streakRef.current) {
        streakRef.current = reevaluated
        setStreak(reevaluated)
        saveStreakData(reevaluated)
      }
    },
    [persistState]
  )

  const toggleSound = React.useCallback(() => {
    const next = {
      ...settingsRef.current,
      soundEnabled: !settingsRef.current.soundEnabled,
    }
    setSettings(next)
    saveSettings(next)
    settingsRef.current = next
  }, [])

  const dismissSummit = React.useCallback(() => {
    const current = stateRef.current
    const batchComplete = current.climbsCompletedInBatch >= current.targetClimbs

    if (batchComplete) {
      persistState({
        ...batchFields(current),
        ...IDLE_CLIMB_DEFAULTS,
        phase: "idle",
        sessionsCompleted: 0,
        climbsCompletedInBatch: 0,
        phaseEndAt: null,
        pausedRemainingMs: null,
        pausedPhase: null,
      })
    } else {
      persistState(
        startPhase("longBreak", settingsRef.current, {
          ...batchFields(current),
          sessionsCompleted: 0,
        })
      )
    }
    setLastSummitResult(null)
  }, [persistState])

  const clearSummitResult = React.useCallback(() => {
    setLastSummitResult(null)
  }, [])

  return {
    mounted,
    state,
    settings,
    daily,
    streak,
    remainingMs,
    lastSummitResult,
    startClimb,
    pause,
    resume,
    skipPhase,
    resetClimb,
    setClimbName,
    setSeparateClimbNames,
    setClimbNameAtIndex,
    setTargetClimbs,
    setClimbSize,
    setTag,
    updateSettings,
    toggleSound,
    clearSummitResult,
    dismissSummit,
  }
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

export function getPhaseLabel(phase: Phase): string {
  switch (phase) {
    case "work":
      return "Focus"
    case "break":
      return "Short break"
    case "longBreak":
      return "Long break"
    case "summit":
      return "Summit reached"
    case "paused":
      return "Paused"
    default:
      return "Ready"
  }
}

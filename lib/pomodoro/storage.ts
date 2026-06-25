import { IDLE_CLIMB_DEFAULTS } from "./climb-size"
import { BATCH_CLIMBS_LIMIT, DEFAULT_SETTINGS, DEFAULT_TAGS, STORAGE_KEYS } from "./constants"
import { normalizeTag } from "./tags"
import type {
  DailyProgress,
  PomodoroSettings,
  PomodoroState,
  RunnablePhase,
  StreakData,
} from "./types"

export function isBrowser(): boolean {
  return typeof window !== "undefined"
}

export function getTodayDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function getYesterdayDateString(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota errors
  }
}

export function clampSetting(
  value: number,
  min: number,
  max: number,
  fallback: number
): number {
  if (!Number.isFinite(value)) return fallback
  return Math.min(max, Math.max(min, Math.round(value)))
}

export function loadSettings(): PomodoroSettings {
  const stored = readJson<Partial<PomodoroSettings>>(STORAGE_KEYS.settings, {})
  return {
    workMinutes: stored.workMinutes ?? DEFAULT_SETTINGS.workMinutes,
    breakMinutes: stored.breakMinutes ?? DEFAULT_SETTINGS.breakMinutes,
    longBreakMinutes: stored.longBreakMinutes ?? DEFAULT_SETTINGS.longBreakMinutes,
    dailyMinClimbs: stored.dailyMinClimbs ?? DEFAULT_SETTINGS.dailyMinClimbs,
    soundEnabled: stored.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled,
    notificationsEnabled:
      stored.notificationsEnabled ?? DEFAULT_SETTINGS.notificationsEnabled,
    customTags: Array.isArray(stored.customTags)
      ? Array.from(
          new Set(
            stored.customTags
              .map((t) => normalizeTag(String(t)))
              .filter(
                (t) => t && !DEFAULT_TAGS.includes(t as (typeof DEFAULT_TAGS)[number])
              )
          )
        ).slice(0, 20)
      : DEFAULT_SETTINGS.customTags,
  }
}

export function saveSettings(settings: PomodoroSettings): void {
  writeJson(STORAGE_KEYS.settings, settings)
}

export function createInitialState(): PomodoroState {
  return {
    phase: "idle",
    climbName: "",
    separateClimbNames: false,
    climbNames: [],
    climbSize: "full",
    tag: DEFAULT_TAGS[0],
    sessionsCompleted: 0,
    targetClimbs: 1,
    climbsCompletedInBatch: 0,
    phaseEndAt: null,
    pausedRemainingMs: null,
    pausedPhase: null,
  }
}

export function loadState(): PomodoroState {
  const stored = readJson<Partial<PomodoroState>>(STORAGE_KEYS.state, createInitialState())
  const targetClimbs = clampSetting(
    stored.targetClimbs ?? 1,
    BATCH_CLIMBS_LIMIT.min,
    BATCH_CLIMBS_LIMIT.max,
    1
  )
  return {
    ...createInitialState(),
    ...stored,
    targetClimbs,
    climbsCompletedInBatch: Math.max(0, stored.climbsCompletedInBatch ?? 0),
    separateClimbNames: stored.separateClimbNames ?? false,
    climbNames: Array.isArray(stored.climbNames) ? stored.climbNames : [],
    climbSize:
      stored.climbSize === "quarter" ||
      stored.climbSize === "half" ||
      stored.climbSize === "full"
        ? stored.climbSize
        : "full",
    tag: typeof stored.tag === "string" && stored.tag ? stored.tag : DEFAULT_TAGS[0],
    ...(stored.phase === "idle" || !stored.phase ? IDLE_CLIMB_DEFAULTS : {}),
  }
}

export function saveState(state: PomodoroState): void {
  writeJson(STORAGE_KEYS.state, state)
}

export function loadDailyProgress(): DailyProgress {
  const today = getTodayDateString()
  const stored = readJson<DailyProgress>(STORAGE_KEYS.daily, {
    date: today,
    climbsCompleted: 0,
  })
  if (stored.date !== today) {
    return { date: today, climbsCompleted: 0 }
  }
  return stored
}

export function saveDailyProgress(daily: DailyProgress): void {
  writeJson(STORAGE_KEYS.daily, daily)
}

export function loadStreakData(): StreakData {
  return readJson<StreakData>(STORAGE_KEYS.streak, {
    currentStreak: 0,
    lastQualifyingDate: null,
    totalClimbs: 0,
    bestStreak: 0,
  })
}

export function saveStreakData(streak: StreakData): void {
  writeJson(STORAGE_KEYS.streak, streak)
}

export function getPhaseDurationMs(
  phase: RunnablePhase,
  settings: PomodoroSettings
): number {
  switch (phase) {
    case "work":
      return settings.workMinutes * 60 * 1000
    case "break":
      return settings.breakMinutes * 60 * 1000
    case "longBreak":
      return settings.longBreakMinutes * 60 * 1000
  }
}

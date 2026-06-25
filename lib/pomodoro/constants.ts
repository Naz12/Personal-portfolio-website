export const SESSIONS_PER_CLIMB = 4

export const BATCH_CLIMBS_LIMIT = { min: 1, max: 10 } as const

export const DEFAULT_TAGS = [
  "studying",
  "working",
  "researching",
  "upwork",
] as const

export const TAG_LIMITS = {
  minLength: 2,
  maxLength: 24,
  maxCustom: 20,
} as const

export const HISTORY_MAX_DAYS = 90

export const DEFAULT_SETTINGS = {
  workMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  dailyMinClimbs: 1,
  soundEnabled: true,
  notificationsEnabled: true,
  customTags: [] as string[],
} as const

export const SETTINGS_LIMITS = {
  workMinutes: { min: 1, max: 90 },
  breakMinutes: { min: 1, max: 30 },
  longBreakMinutes: { min: 5, max: 60 },
  dailyMinClimbs: { min: 1, max: 10 },
} as const

export const STORAGE_KEYS = {
  settings: "pomodoro:settings",
  state: "pomodoro:state",
  daily: "pomodoro:daily",
  streak: "pomodoro:streak",
  history: "pomodoro:history",
} as const

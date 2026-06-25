import { HISTORY_MAX_DAYS, STORAGE_KEYS } from "./constants"
import { getTodayDateString, isBrowser } from "./storage"

export interface DayHistoryEntry {
  c: number
  t?: Record<string, number>
}

export interface CompactHistory {
  days: Record<string, DayHistoryEntry>
}

function readHistory(): CompactHistory {
  if (!isBrowser()) return { days: {} }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history)
    if (!raw) return { days: {} }
    const parsed = JSON.parse(raw) as CompactHistory
    return parsed?.days ? parsed : { days: {} }
  } catch {
    return { days: {} }
  }
}

function pruneHistory(days: Record<string, DayHistoryEntry>): Record<string, DayHistoryEntry> {
  const dates = Object.keys(days).sort()
  if (dates.length <= HISTORY_MAX_DAYS) return days

  const keep = dates.slice(-HISTORY_MAX_DAYS)
  const pruned: Record<string, DayHistoryEntry> = {}
  for (const date of keep) {
    pruned[date] = days[date]
  }
  return pruned
}

export function recordHistoryClimb(
  date: string,
  climbWeight: number,
  tag: string
): CompactHistory {
  const history = readHistory()
  const entry = history.days[date] ?? { c: 0 }
  const climbs = Math.round((entry.c + climbWeight) * 100) / 100

  const tagCounts = { ...entry.t }
  if (tag) {
    tagCounts[tag] = (tagCounts[tag] ?? 0) + 1
  }

  const nextDays = pruneHistory({
    ...history.days,
    [date]: {
      c: climbs,
      ...(Object.keys(tagCounts).length > 0 ? { t: tagCounts } : {}),
    },
  })

  const next = { days: nextDays }
  if (isBrowser()) {
    try {
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(next))
    } catch {
      // ignore quota errors
    }
  }
  return next
}

export function loadHistory(): CompactHistory {
  const history = readHistory()
  return { days: pruneHistory(history.days) }
}

export function getTodayHistoryTagSummary(): Record<string, number> {
  const today = getTodayDateString()
  return loadHistory().days[today]?.t ?? {}
}

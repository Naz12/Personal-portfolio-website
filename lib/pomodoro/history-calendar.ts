import { HISTORY_MAX_DAYS } from "./constants"
import type { CompactHistory, DayHistoryEntry } from "./history"
import { getTodayDateString } from "./storage"

export interface CalendarDayCell {
  date: string | null
  inRange: boolean
}

export interface HistorySummary {
  totalClimbs: number
  activeDays: number
  bestDay: { date: string; climbs: number } | null
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

export function getWeekdayLabels(): readonly string[] {
  return WEEKDAY_LABELS
}

export function formatDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function getHistoryStartDateString(): string {
  const start = new Date()
  start.setDate(start.getDate() - (HISTORY_MAX_DAYS - 1))
  return formatDateString(start)
}

export function isDateInHistoryRange(dateStr: string): boolean {
  return dateStr >= getHistoryStartDateString() && dateStr <= getTodayDateString()
}

export function buildMonthCalendarDays(year: number, month: number): CalendarDayCell[] {
  const first = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0).getDate()
  const startPad = (first.getDay() + 6) % 7

  const cells: CalendarDayCell[] = []

  for (let i = 0; i < startPad; i++) {
    cells.push({ date: null, inRange: false })
  }

  for (let day = 1; day <= lastDay; day++) {
    const dateStr = formatDateString(new Date(year, month, day))
    cells.push({ date: dateStr, inRange: isDateInHistoryRange(dateStr) })
  }

  return cells
}

export function canNavigateToMonth(year: number, month: number): boolean {
  const monthStart = formatDateString(new Date(year, month, 1))
  const monthEnd = formatDateString(new Date(year, month + 1, 0))
  const rangeStart = getHistoryStartDateString()
  const rangeEnd = getTodayDateString()
  return monthEnd >= rangeStart && monthStart <= rangeEnd
}

export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const next = new Date(year, month + delta, 1)
  return { year: next.getFullYear(), month: next.getMonth() }
}

export function getInitialCalendarMonth(): { year: number; month: number } {
  const today = new Date()
  return { year: today.getFullYear(), month: today.getMonth() }
}

export function formatShortDisplayDate(dateStr: string): string {
  return parseDateString(dateStr).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  })
}

export function formatDisplayDate(dateStr: string): string {
  return parseDateString(dateStr).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export const INTENSITY_LEVELS = [
  { label: "None", className: "bg-muted/50" },
  { label: "Low", className: "bg-primary/25" },
  { label: "Medium", className: "bg-primary/45" },
  { label: "High", className: "bg-primary/70" },
  { label: "Peak", className: "bg-primary" },
] as const

export function formatMonthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  })
}

export function getHistorySummary(history: CompactHistory): HistorySummary {
  let totalClimbs = 0
  let activeDays = 0
  let bestDay: HistorySummary["bestDay"] = null

  for (const [date, entry] of Object.entries(history.days)) {
    if (!isDateInHistoryRange(date) || entry.c <= 0) continue
    totalClimbs += entry.c
    activeDays += 1
    if (!bestDay || entry.c > bestDay.climbs) {
      bestDay = { date, climbs: entry.c }
    }
  }

  totalClimbs = Math.round(totalClimbs * 100) / 100

  return { totalClimbs, activeDays, bestDay }
}

export function getMonthMaxClimbs(
  history: CompactHistory,
  year: number,
  month: number
): number {
  let max = 0
  const lastDay = new Date(year, month + 1, 0).getDate()

  for (let day = 1; day <= lastDay; day++) {
    const dateStr = formatDateString(new Date(year, month, day))
    const climbs = history.days[dateStr]?.c ?? 0
    if (climbs > max) max = climbs
  }

  return max
}

export function getClimbIntensityClass(
  climbs: number,
  maxClimbs: number,
  inRange: boolean
): string {
  if (!inRange) return "bg-muted/20 text-muted-foreground/40"
  if (climbs <= 0) return "bg-muted/40 text-muted-foreground"

  if (maxClimbs <= 0) return "bg-primary/30 text-foreground"

  const ratio = climbs / maxClimbs
  if (ratio >= 0.75) return "bg-primary text-primary-foreground"
  if (ratio >= 0.5) return "bg-primary/70 text-primary-foreground"
  if (ratio >= 0.25) return "bg-primary/45 text-foreground"
  return "bg-primary/25 text-foreground"
}

export function getDayEntry(
  history: CompactHistory,
  date: string
): DayHistoryEntry | null {
  const entry = history.days[date]
  if (!entry || entry.c <= 0) return null
  return entry
}

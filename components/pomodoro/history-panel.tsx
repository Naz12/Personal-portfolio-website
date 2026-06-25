"use client"

import * as React from "react"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Flame,
  Mountain,
  Trophy,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatClimbCount } from "@/lib/pomodoro/climb-size"
import { HISTORY_MAX_DAYS } from "@/lib/pomodoro/constants"
import { loadHistory, type CompactHistory } from "@/lib/pomodoro/history"
import {
  buildMonthCalendarDays,
  canNavigateToMonth,
  formatDisplayDate,
  formatMonthLabel,
  formatShortDisplayDate,
  getClimbIntensityClass,
  getDayEntry,
  getHistorySummary,
  getInitialCalendarMonth,
  getMonthMaxClimbs,
  getWeekdayLabels,
  INTENSITY_LEVELS,
  isDateInHistoryRange,
  parseDateString,
  shiftMonth,
} from "@/lib/pomodoro/history-calendar"
import { getTodayDateString } from "@/lib/pomodoro/storage"
import { formatTagLabel } from "@/lib/pomodoro/tags"
import { cn } from "@/lib/utils"

interface HistoryPanelProps {
  open: boolean
  onClose: () => void
  dailyMinClimbs: number
}

export function HistoryPanel({ open, onClose, dailyMinClimbs }: HistoryPanelProps) {
  const [history, setHistory] = React.useState<CompactHistory>({ days: {} })
  const [viewMonth, setViewMonth] = React.useState(getInitialCalendarMonth)
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null)

  const today = getTodayDateString()
  const initialMonth = getInitialCalendarMonth()

  React.useEffect(() => {
    if (!open) return
    setHistory(loadHistory())
    setViewMonth(getInitialCalendarMonth())
    setSelectedDate(getTodayDateString())
  }, [open])

  if (!open) return null

  const summary = getHistorySummary(history)
  const monthMax = getMonthMaxClimbs(history, viewMonth.year, viewMonth.month)
  const cells = buildMonthCalendarDays(viewMonth.year, viewMonth.month)
  const selectedEntry = selectedDate ? getDayEntry(history, selectedDate) : null
  const isCurrentMonth =
    viewMonth.year === initialMonth.year && viewMonth.month === initialMonth.month

  const canGoPrev = canNavigateToMonth(
    shiftMonth(viewMonth.year, viewMonth.month, -1).year,
    shiftMonth(viewMonth.year, viewMonth.month, -1).month
  )
  const canGoNext = canNavigateToMonth(
    shiftMonth(viewMonth.year, viewMonth.month, 1).year,
    shiftMonth(viewMonth.year, viewMonth.month, 1).month
  )

  const goToToday = () => {
    setViewMonth(initialMonth)
    setSelectedDate(today)
  }

  const handlePrevMonth = () => {
    const next = shiftMonth(viewMonth.year, viewMonth.month, -1)
    if (!canNavigateToMonth(next.year, next.month)) return
    setViewMonth(next)
  }

  const handleNextMonth = () => {
    const next = shiftMonth(viewMonth.year, viewMonth.month, 1)
    if (!canNavigateToMonth(next.year, next.month)) return
    setViewMonth(next)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        aria-label="Close history"
        onClick={onClose}
      />
      <div className="relative z-10 w-full sm:max-w-md rounded-2xl border border-border/80 bg-card shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="shrink-0 px-4 sm:px-5 pt-4 sm:pt-5 pb-3 border-b border-border/50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <CalendarDays className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold leading-tight">Climb history</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Last {HISTORY_MAX_DAYS} days on this device
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <StatCard
              icon={<Mountain className="h-3.5 w-3.5 text-primary" />}
              label="Total"
              value={formatClimbCount(summary.totalClimbs)}
            />
            <StatCard
              icon={<Flame className="h-3.5 w-3.5 text-orange-500" />}
              label="Active days"
              value={String(summary.activeDays)}
            />
            <StatCard
              icon={<Trophy className="h-3.5 w-3.5 text-amber-500" />}
              label="Best day"
              value={
                summary.bestDay ? formatClimbCount(summary.bestDay.climbs) : "—"
              }
            />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3 sm:p-3.5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handlePrevMonth}
                disabled={!canGoPrev}
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-center min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">
                  {formatMonthLabel(viewMonth.year, viewMonth.month)}
                </p>
                {!isCurrentMonth && (
                  <button
                    type="button"
                    onClick={goToToday}
                    className="text-[10px] text-primary hover:underline mt-0.5"
                  >
                    Jump to today
                  </button>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleNextMonth}
                disabled={!canGoNext}
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1.5">
              {getWeekdayLabels().map((label) => (
                <div
                  key={label}
                  className="text-center text-[10px] font-medium text-muted-foreground py-0.5"
                >
                  {label.slice(0, 1)}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell, index) => {
                if (!cell.date) {
                  return <div key={`empty-${index}`} className="aspect-square" aria-hidden />
                }

                const climbs = history.days[cell.date]?.c ?? 0
                const dayNum = parseDateString(cell.date).getDate()
                const isSelected = selectedDate === cell.date
                const isToday = cell.date === today
                const hasClimbs = climbs > 0

                return (
                  <button
                    key={cell.date}
                    type="button"
                    disabled={!cell.inRange}
                    onClick={() => setSelectedDate(cell.date)}
                    className={cn(
                      "relative aspect-square rounded-lg text-xs font-medium tabular-nums transition-all",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      getClimbIntensityClass(climbs, monthMax, cell.inRange),
                      isSelected &&
                        "ring-2 ring-primary ring-offset-2 ring-offset-card z-[1] scale-[1.04]",
                      isToday && !isSelected && "ring-1 ring-primary/40"
                    )}
                    aria-label={`${formatDisplayDate(cell.date)}${hasClimbs ? `, ${formatClimbCount(climbs)} climbs` : ", no climbs"}`}
                    aria-pressed={isSelected}
                  >
                    <span className="absolute inset-0 flex items-center justify-center">
                      {dayNum}
                    </span>
                    {hasClimbs && cell.inRange && (
                      <span
                        className={cn(
                          "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
                          climbs >= dailyMinClimbs ? "bg-emerald-400" : "bg-current opacity-60"
                        )}
                        aria-hidden
                      />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-center gap-1 mt-3 pt-3 border-t border-border/40">
              <span className="text-[10px] text-muted-foreground mr-0.5">Less</span>
              {INTENSITY_LEVELS.map((level) => (
                <div
                  key={level.label}
                  className={cn("h-3 w-3 rounded-[4px]", level.className)}
                  title={level.label}
                  aria-hidden
                />
              ))}
              <span className="text-[10px] text-muted-foreground ml-0.5">More</span>
              <span className="text-[10px] text-muted-foreground ml-2 hidden sm:inline">
                · dot = goal met
              </span>
            </div>
          </div>

          {summary.activeDays === 0 && (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/10 px-4 py-6 text-center">
              <Mountain className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm font-medium">No climbs yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Finish a climb and it will appear on the calendar.
              </p>
            </div>
          )}

          {selectedDate && isDateInHistoryRange(selectedDate) && (
            <DayDetailCard
              date={selectedDate}
              entry={selectedEntry}
              dailyMinClimbs={dailyMinClimbs}
              isToday={selectedDate === today}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/50 px-2.5 py-2.5 text-center">
      <div className="flex items-center justify-center gap-1 mb-1">
        {icon}
        <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
      </div>
      <p className="text-base font-bold tabular-nums leading-none">{value}</p>
    </div>
  )
}

function DayDetailCard({
  date,
  entry,
  dailyMinClimbs,
  isToday,
}: {
  date: string
  entry: ReturnType<typeof getDayEntry>
  dailyMinClimbs: number
  isToday: boolean
}) {
  const goalMet = entry ? entry.c >= dailyMinClimbs : false

  return (
    <div className="rounded-xl border border-border/60 bg-gradient-to-br from-muted/30 to-muted/10 px-4 py-3.5 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">{formatShortDisplayDate(date)}</p>
          {isToday && (
            <span className="inline-flex mt-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
              Today
            </span>
          )}
        </div>
        {entry && goalMet && (
          <span className="shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            Goal met
          </span>
        )}
      </div>

      {entry ? (
        <>
          <p className="text-2xl font-bold tabular-nums">
            {formatClimbCount(entry.c)}
            <span className="text-sm font-normal text-muted-foreground ml-1.5">
              climb{entry.c === 1 ? "" : "s"}
            </span>
          </p>
          {entry.t && Object.keys(entry.t).length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {Object.entries(entry.t)
                .sort(([, a], [, b]) => b - a)
                .map(([tag, count]) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-xs font-medium"
                  >
                    {formatTagLabel(tag)}
                    <span className="text-muted-foreground tabular-nums">{count}</span>
                  </span>
                ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">No climbs recorded this day.</p>
      )}
    </div>
  )
}

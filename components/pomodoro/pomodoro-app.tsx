"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, CalendarDays, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ClimbForm } from "@/components/pomodoro/climb-form"
import { DailyProgressBar } from "@/components/pomodoro/daily-progress"
import { HistoryPanel } from "@/components/pomodoro/history-panel"
import { SettingsPanel } from "@/components/pomodoro/settings-panel"
import { SoundToggle } from "@/components/pomodoro/sound-toggle"
import { StreakBadge } from "@/components/pomodoro/streak-badge"
import { SummitScreen } from "@/components/pomodoro/summit-screen"
import { TimerControls } from "@/components/pomodoro/timer-controls"
import { TimerDisplay } from "@/components/pomodoro/timer-display"
import { TimerStatusBar } from "@/components/pomodoro/timer-status-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { formatTime, usePomodoro } from "@/hooks/use-pomodoro"
import { playChime } from "@/lib/pomodoro/audio"
import { getSessionsForClimbSize } from "@/lib/pomodoro/climb-size"
import {
  canStartBatch,
  getDisplayClimbName,
  getNextClimbName,
  getSummitClimbName,
} from "@/lib/pomodoro/climb-names"
import { notifyPhaseEnd } from "@/lib/pomodoro/notifications"
import { getPhaseDurationMs } from "@/lib/pomodoro/storage"
import type { Phase, RunnablePhase } from "@/lib/pomodoro/types"

function getRunnablePhase(
  phase: Phase,
  pausedPhase: RunnablePhase | null
): RunnablePhase | null {
  if (phase === "work" || phase === "break" || phase === "longBreak") return phase
  if (phase === "paused" && pausedPhase) return pausedPhase
  return null
}

export function PomodoroApp() {
  const {
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
    dismissSummit,
  } = usePomodoro()

  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const prevPhaseRef = React.useRef(state.phase)
  const settingsRef = React.useRef(settings)

  React.useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  const displayClimbName = getDisplayClimbName(state)

  React.useEffect(() => {
    if (!mounted) return

    const time =
      state.phase === "idle" || state.phase === "summit"
        ? ""
        : formatTime(remainingMs)
    const climb = displayClimbName ? ` · ${displayClimbName}` : ""
    document.title =
      state.phase === "idle"
        ? "Focus · Pomodoro"
        : state.phase === "paused"
          ? `Paused${climb}`
          : `${time}${climb}`
  }, [displayClimbName, mounted, remainingMs, state.phase])

  React.useEffect(() => {
    const prev = prevPhaseRef.current
    prevPhaseRef.current = state.phase

    if (!mounted || prev === state.phase) return

    const soundOn = settingsRef.current.soundEnabled
    const notifyOn = settingsRef.current.notificationsEnabled

    const summitName = getSummitClimbName(state)
    const nextName = getNextClimbName(state)

    if (state.phase === "summit" && prev === "work") {
      playChime("summit", soundOn)
      const isLastClimb = state.climbsCompletedInBatch >= state.targetClimbs
      void notifyPhaseEnd(
        "Summit reached!",
        isLastClimb
          ? `${summitName} — all climbs complete!`
          : `${summitName} — time for a long break.`,
        notifyOn
      )
      return
    }

    if (
      (state.phase === "break" || state.phase === "longBreak") &&
      prev === "work"
    ) {
      playChime("workComplete", soundOn)
      void notifyPhaseEnd("Focus session complete", "Time for a break.", notifyOn)
      return
    }

    if (state.phase === "work" && prev === "break") {
      playChime("breakComplete", soundOn)
      void notifyPhaseEnd("Break over", "Back to focus.", notifyOn)
      return
    }

    if (state.phase === "work" && prev === "longBreak") {
      playChime("breakComplete", soundOn)
      const nextClimb = state.climbsCompletedInBatch + 1
      const message =
        state.targetClimbs > 1
          ? `${nextName} — climb ${nextClimb} of ${state.targetClimbs}, session 1 starting.`
          : "Back to focus."
      void notifyPhaseEnd("Break over", message, notifyOn)
      return
    }

    if (state.phase === "idle" && prev === "longBreak") {
      playChime("longBreakComplete", soundOn)
      void notifyPhaseEnd("Long break complete", "Ready for a new climb.", notifyOn)
    }
  }, [mounted, state])

  React.useEffect(() => {
    if (state.phase !== "summit") return
    const timer = window.setTimeout(() => dismissSummit(), 4000)
    return () => window.clearTimeout(timer)
  }, [dismissSummit, state.phase])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.code === "Enter" && state.phase === "idle" && canStartBatch(state)) {
        e.preventDefault()
        startClimb()
        return
      }

      if (e.code !== "Space") return
      e.preventDefault()
      if (state.phase === "paused") resume()
      else if (
        state.phase === "work" ||
        state.phase === "break" ||
        state.phase === "longBreak"
      ) {
        pause()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [pause, resume, startClimb, state])

  if (!mounted) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading focus timer...</p>
        </div>
      </div>
    )
  }

  const showClimbForm = state.phase === "idle"
  const isSummit = state.phase === "summit"
  const runnablePhase = getRunnablePhase(state.phase, state.pausedPhase)
  const totalMs = runnablePhase
    ? getPhaseDurationMs(runnablePhase, settings)
    : 0

  const ambientGlow =
    state.phase === "work"
      ? "from-primary/10 via-transparent to-violet-500/5"
      : state.phase === "break" || state.phase === "longBreak"
        ? "from-emerald-500/8 via-transparent to-transparent"
        : state.phase === "paused"
          ? "from-amber-500/8 via-transparent to-transparent"
          : "from-primary/5 via-transparent to-secondary/5"

  const canStart = canStartBatch(state)
  const startHint = state.separateClimbNames
    ? "Name each climb to start"
    : "Name your climb to start"

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${ambientGlow} pointer-events-none transition-colors duration-700`}
      />
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.12)_1px,transparent_0)] bg-[length:24px_24px]" />
      </div>

      <header className="relative z-10 shrink-0 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-border/50 bg-background/60 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-10"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Portfolio</span>
        </Link>
        <StreakBadge streak={streak} onClick={() => setHistoryOpen(true)} />
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="min-h-10 min-w-10"
            onClick={() => setHistoryOpen(true)}
            aria-label="Climb history"
          >
            <CalendarDays className="h-5 w-5" />
          </Button>
          <SoundToggle enabled={settings.soundEnabled} onToggle={toggleSound} />
          <Button
            variant="ghost"
            size="icon"
            className="min-h-10 min-w-10"
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main
        className={`relative z-10 flex-1 min-h-0 flex flex-col items-center px-3 sm:px-4 pt-2 sm:pt-4 pb-5 sm:pb-8 overflow-hidden ${
          showClimbForm ? "justify-start" : "justify-center"
        }`}
      >
        {isSummit ? (
          <SummitScreen
            climbName={getSummitClimbName(state)}
            climbSize={state.climbSize}
            tag={state.tag}
            targetClimbs={state.targetClimbs}
            climbsCompletedInBatch={state.climbsCompletedInBatch}
            nextClimbName={
              state.climbsCompletedInBatch < state.targetClimbs
                ? getNextClimbName(state)
                : undefined
            }
            result={lastSummitResult}
            onContinue={dismissSummit}
          />
        ) : (
          <div
            className={`w-full max-w-lg h-full min-h-0 flex flex-col items-center gap-2 sm:gap-3 ${
              showClimbForm ? "justify-start pt-1 sm:pt-2" : "justify-center"
            }`}
          >
            {state.phase !== "idle" && (
              <TimerStatusBar
                phase={state.phase}
                sessionsCompleted={state.sessionsCompleted}
                sessionsTarget={getSessionsForClimbSize(state.climbSize)}
              />
            )}

            {showClimbForm ? (
              <>
                <ClimbForm
                  climbName={state.climbName}
                  targetClimbs={state.targetClimbs}
                  separateClimbNames={state.separateClimbNames}
                  climbNames={state.climbNames}
                  climbSize={state.climbSize}
                  tag={state.tag}
                  settings={settings}
                  onClimbNameChange={setClimbName}
                  onTargetClimbsChange={setTargetClimbs}
                  onSeparateClimbNamesChange={setSeparateClimbNames}
                  onClimbNameAtIndexChange={setClimbNameAtIndex}
                  onClimbSizeChange={setClimbSize}
                  onTagChange={setTag}
                />
                <DailyProgressBar
                  daily={daily}
                  settings={settings}
                  compact
                  onClick={() => setHistoryOpen(true)}
                />
              </>
            ) : (
              <div className="min-h-0 flex flex-col items-center justify-center">
                <TimerDisplay
                remainingMs={remainingMs}
                totalMs={totalMs}
                phase={state.phase}
                climbName={displayClimbName}
                tag={state.tag}
                isLongBreakUpNext={state.phase === "longBreak"}
                targetClimbs={state.targetClimbs}
                climbsCompletedInBatch={state.climbsCompletedInBatch}
              />
              </div>
            )}

            {state.phase === "idle" && (
              <div className="mt-auto shrink-0 w-full pb-0.5 sm:pb-1">
                <TimerControls
                phase={state.phase}
                canStart={canStart}
                startHint={startHint}
                onStart={startClimb}
                onPause={pause}
                onResume={resume}
              />
              </div>
            )}

            {state.phase !== "idle" && !isSummit && (
              <div className="shrink-0 w-full flex flex-col items-center gap-2 sm:gap-3">
                <TimerControls
                  phase={state.phase}
                  canStart={false}
                  onStart={startClimb}
                  onPause={pause}
                  onResume={resume}
                  onSkip={skipPhase}
                  onReset={resetClimb}
                />
                <DailyProgressBar
                  daily={daily}
                  settings={settings}
                  compact
                  onClick={() => setHistoryOpen(true)}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <SettingsPanel
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={updateSettings}
      />
      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        dailyMinClimbs={settings.dailyMinClimbs}
      />
    </div>
  )
}

"use client"

import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CLIMB_SIZE_LABELS,
  CLIMB_SIZES,
  isFullClimbSize,
} from "@/lib/pomodoro/climb-size"
import { BATCH_CLIMBS_LIMIT } from "@/lib/pomodoro/constants"
import { formatTagLabel, getAllTags } from "@/lib/pomodoro/tags"
import type { ClimbSize, PomodoroSettings } from "@/lib/pomodoro/types"
import { cn } from "@/lib/utils"

interface ClimbFormProps {
  climbName: string
  targetClimbs: number
  separateClimbNames: boolean
  climbNames: string[]
  climbSize: ClimbSize
  tag: string
  settings: PomodoroSettings
  onClimbNameChange: (name: string) => void
  onTargetClimbsChange: (count: number) => void
  onSeparateClimbNamesChange: (separate: boolean) => void
  onClimbNameAtIndexChange: (index: number, name: string) => void
  onClimbSizeChange: (size: ClimbSize) => void
  onTagChange: (tag: string) => void
  disabled?: boolean
}

function FormSection({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs sm:text-sm font-semibold">{label}</p>
      {children}
    </div>
  )
}

function CollapseSection({
  show,
  children,
  className,
}: {
  show: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-out",
        show ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  )
}

export function ClimbForm({
  climbName,
  targetClimbs,
  separateClimbNames,
  climbNames,
  climbSize,
  tag,
  settings,
  onClimbNameChange,
  onTargetClimbsChange,
  onSeparateClimbNamesChange,
  onClimbNameAtIndexChange,
  onClimbSizeChange,
  onTagChange,
  disabled,
}: ClimbFormProps) {
  const decrease = () =>
    onTargetClimbsChange(Math.max(BATCH_CLIMBS_LIMIT.min, targetClimbs - 1))
  const increase = () =>
    onTargetClimbsChange(Math.min(BATCH_CLIMBS_LIMIT.max, targetClimbs + 1))
  const allTags = getAllTags(settings)
  const isFullClimb = isFullClimbSize(climbSize)
  const showSeparateNames =
    isFullClimb && separateClimbNames && targetClimbs > 1

  return (
    <div className="w-full max-w-md mx-auto shrink-0 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm shadow-sm px-3 sm:px-4 py-3 sm:py-4">
      <div className="space-y-3">
        <FormSection label="Session length">
          <div className="flex rounded-xl border border-border/60 bg-background/40 p-1 gap-1">
            {CLIMB_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                disabled={disabled}
                onClick={() => onClimbSizeChange(size)}
                className={cn(
                  "flex-1 rounded-lg px-1.5 py-2 text-center transition-all min-h-9",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  climbSize === size
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <span className="text-[11px] sm:text-sm font-semibold">
                  {CLIMB_SIZE_LABELS[size]}
                </span>
              </button>
            ))}
          </div>
        </FormSection>

        <div className="border-t border-border/40" />

        <FormSection label="Tag">
          <div className="relative -mx-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-card/90 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-card/90 to-transparent z-10" />
            <div className="flex gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {allTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  disabled={disabled}
                  onClick={() => onTagChange(t)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-all min-h-8",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    tag === t
                      ? "bg-primary text-primary-foreground border-primary shadow-sm scale-[1.02]"
                      : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/30"
                  )}
                >
                  {formatTagLabel(t)}
                </button>
              ))}
            </div>
          </div>
        </FormSection>

        <CollapseSection show={isFullClimb}>
          <div className="border-t border-border/40 pt-3">
            <FormSection label="How many climbs?">
              <div className="flex items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="min-h-9 min-w-9 shrink-0 rounded-full"
                  onClick={decrease}
                  disabled={disabled || targetClimbs <= BATCH_CLIMBS_LIMIT.min}
                  aria-label="Fewer climbs"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="text-center min-w-[4rem] rounded-xl bg-muted/40 px-3 py-1.5">
                  <p className="text-2xl font-bold tabular-nums leading-none">{targetClimbs}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    climb{targetClimbs === 1 ? "" : "s"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="min-h-9 min-w-9 shrink-0 rounded-full"
                  onClick={increase}
                  disabled={disabled || targetClimbs >= BATCH_CLIMBS_LIMIT.max}
                  aria-label="More climbs"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </FormSection>
          </div>

          <CollapseSection show={targetClimbs > 1}>
            <div className="flex rounded-xl border border-border/60 bg-background/40 p-1 gap-1">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSeparateClimbNamesChange(false)}
                className={cn(
                  "flex-1 rounded-lg px-2 py-2 text-[11px] sm:text-xs font-medium transition-colors min-h-9",
                  !separateClimbNames
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                Same name
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSeparateClimbNamesChange(true)}
                className={cn(
                  "flex-1 rounded-lg px-2 py-2 text-[11px] sm:text-xs font-medium transition-colors min-h-9",
                  separateClimbNames
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                Name each
              </button>
            </div>
          </CollapseSection>
        </CollapseSection>

        <div className="border-t border-border/40" />

        <CollapseSection show={!showSeparateNames}>
          <FormSection
            label={isFullClimb && targetClimbs > 1 ? "Name for all climbs" : "Name your climb"}
          >
            <Input
              id="climb-name"
              value={climbName}
              onChange={(e) => onClimbNameChange(e.target.value)}
              placeholder="What are you working on?"
              disabled={disabled}
              className="text-sm sm:text-base min-h-10 bg-background/60"
              maxLength={80}
              autoComplete="off"
            />
          </FormSection>
        </CollapseSection>

        <CollapseSection show={showSeparateNames}>
          <FormSection label="Name each climb">
            <div className="space-y-1.5 max-h-[8rem] overflow-y-auto">
              {Array.from({ length: targetClimbs }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <label
                    htmlFor={`climb-name-${index}`}
                    className="text-[10px] font-medium text-muted-foreground w-8 shrink-0 tabular-nums"
                  >
                    {index + 1}
                  </label>
                  <Input
                    id={`climb-name-${index}`}
                    value={climbNames[index] ?? ""}
                    onChange={(e) => onClimbNameAtIndexChange(index, e.target.value)}
                    placeholder={`Climb ${index + 1}`}
                    disabled={disabled}
                    className="text-sm min-h-9 bg-background/60 flex-1"
                    maxLength={80}
                    autoComplete="off"
                  />
                </div>
              ))}
            </div>
          </FormSection>
        </CollapseSection>
      </div>
    </div>
  )
}

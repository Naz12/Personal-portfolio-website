"use client"

import * as React from "react"
import { Bell, BellOff, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SETTINGS_LIMITS, TAG_LIMITS } from "@/lib/pomodoro/constants"
import {
  isNotificationSupported,
  requestNotificationPermission,
} from "@/lib/pomodoro/notifications"
import { clampSetting } from "@/lib/pomodoro/storage"
import {
  formatTagLabel,
  isValidCustomTag,
  normalizeTag,
} from "@/lib/pomodoro/tags"
import type { PomodoroSettings } from "@/lib/pomodoro/types"
import { cn } from "@/lib/utils"

interface SettingsPanelProps {
  open: boolean
  settings: PomodoroSettings
  onClose: () => void
  onSave: (settings: PomodoroSettings) => void
}

export function SettingsPanel({ open, settings, onClose, onSave }: SettingsPanelProps) {
  const [draft, setDraft] = React.useState(settings)
  const [notificationError, setNotificationError] = React.useState<string | null>(
    null
  )
  const [newTag, setNewTag] = React.useState("")
  const [tagError, setTagError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open) {
      setDraft(settings)
      setNotificationError(null)
      setNewTag("")
      setTagError(null)
    }
  }, [open, settings])

  if (!open) return null

  const handleSave = () => {
    const next: PomodoroSettings = {
      workMinutes: clampSetting(
        draft.workMinutes,
        SETTINGS_LIMITS.workMinutes.min,
        SETTINGS_LIMITS.workMinutes.max,
        settings.workMinutes
      ),
      breakMinutes: clampSetting(
        draft.breakMinutes,
        SETTINGS_LIMITS.breakMinutes.min,
        SETTINGS_LIMITS.breakMinutes.max,
        settings.breakMinutes
      ),
      longBreakMinutes: clampSetting(
        draft.longBreakMinutes,
        SETTINGS_LIMITS.longBreakMinutes.min,
        SETTINGS_LIMITS.longBreakMinutes.max,
        settings.longBreakMinutes
      ),
      dailyMinClimbs: clampSetting(
        draft.dailyMinClimbs,
        SETTINGS_LIMITS.dailyMinClimbs.min,
        SETTINGS_LIMITS.dailyMinClimbs.max,
        settings.dailyMinClimbs
      ),
      soundEnabled: settings.soundEnabled,
      notificationsEnabled: draft.notificationsEnabled,
      customTags: draft.customTags,
    }
    onSave(next)
    onClose()
  }

  const handleNotificationsToggle = async () => {
    if (draft.notificationsEnabled) {
      setDraft((d) => ({ ...d, notificationsEnabled: false }))
      setNotificationError(null)
      return
    }

    if (!isNotificationSupported()) {
      setNotificationError("Notifications are not supported in this browser.")
      return
    }

    const granted = await requestNotificationPermission()
    if (granted) {
      setDraft((d) => ({ ...d, notificationsEnabled: true }))
      setNotificationError(null)
    } else {
      setNotificationError(
        "Permission denied. Enable notifications in your browser settings."
      )
    }
  }

  const handleAddTag = () => {
    if (!isValidCustomTag(newTag, draft)) {
      setTagError("Tag is invalid or already exists.")
      return
    }
    const normalized = normalizeTag(newTag)
    setDraft((d) => ({ ...d, customTags: [...d.customTags, normalized] }))
    setNewTag("")
    setTagError(null)
  }

  const handleRemoveTag = (tag: string) => {
    setDraft((d) => ({
      ...d,
      customTags: d.customTags.filter((t) => t !== tag),
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        aria-label="Close settings"
        onClick={onClose}
      />
      <div className="relative z-10 w-full sm:max-w-md mx-4 mb-4 sm:mb-0 rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <SettingField
            id="work-minutes"
            label="Work duration (minutes)"
            value={draft.workMinutes}
            onChange={(v) => setDraft((d) => ({ ...d, workMinutes: v }))}
            min={SETTINGS_LIMITS.workMinutes.min}
            max={SETTINGS_LIMITS.workMinutes.max}
          />
          <SettingField
            id="break-minutes"
            label="Break duration (minutes)"
            value={draft.breakMinutes}
            onChange={(v) => setDraft((d) => ({ ...d, breakMinutes: v }))}
            min={SETTINGS_LIMITS.breakMinutes.min}
            max={SETTINGS_LIMITS.breakMinutes.max}
          />
          <SettingField
            id="long-break-minutes"
            label="Long break (minutes)"
            value={draft.longBreakMinutes}
            onChange={(v) => setDraft((d) => ({ ...d, longBreakMinutes: v }))}
            min={SETTINGS_LIMITS.longBreakMinutes.min}
            max={SETTINGS_LIMITS.longBreakMinutes.max}
          />
          <SettingField
            id="daily-min-climbs"
            label="Daily minimum climbs"
            value={draft.dailyMinClimbs}
            onChange={(v) => setDraft((d) => ({ ...d, dailyMinClimbs: v }))}
            min={SETTINGS_LIMITS.dailyMinClimbs.min}
            max={SETTINGS_LIMITS.dailyMinClimbs.max}
          />

          <ToggleRow
            id="notifications-enabled"
            label="Push notifications"
            description="Alert when a phase ends"
            icon={
              draft.notificationsEnabled ? (
                <Bell className="h-4 w-4 text-primary" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )
            }
            checked={draft.notificationsEnabled}
            onToggle={() => void handleNotificationsToggle()}
          />
          {notificationError && (
            <p className="text-xs text-destructive -mt-2">{notificationError}</p>
          )}

          <div className="rounded-lg border border-border/60 px-4 py-3 space-y-3">
            <div>
              <p className="text-sm font-medium">Custom tags</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Default tags: Studying, Working, Researching, Upwork
              </p>
            </div>
            {draft.customTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {draft.customTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="rounded-full border border-border/60 px-3 py-1 text-xs font-medium hover:border-destructive/50 hover:text-destructive transition-colors"
                    aria-label={`Remove ${formatTagLabel(tag)} tag`}
                  >
                    {formatTagLabel(tag)} ×
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => {
                  setNewTag(e.target.value)
                  setTagError(null)
                }}
                placeholder="Add custom tag"
                maxLength={TAG_LIMITS.maxLength}
                className="min-h-10"
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {tagError && <p className="text-xs text-destructive">{tagError}</p>}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Timer changes apply to the next phase. Use the speaker icon in the header to
          mute sounds.
        </p>

        <Button className="w-full mt-6 min-h-12" onClick={handleSave}>
          Save settings
        </Button>
      </div>
    </div>
  )
}

function ToggleRow({
  id,
  label,
  description,
  icon,
  checked,
  onToggle,
}: {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 gap-3">
      <div className="flex items-start gap-2 min-w-0">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div className="min-w-0">
          <label htmlFor={id} className="text-sm font-medium block">
            {label}
          </label>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
          checked ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  )
}

function SettingField({
  id,
  label,
  value,
  onChange,
  min,
  max,
}: {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

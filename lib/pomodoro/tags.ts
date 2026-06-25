import { DEFAULT_TAGS, TAG_LIMITS } from "./constants"
import type { PomodoroSettings } from "./types"

export function normalizeTag(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, TAG_LIMITS.maxLength)
}

export function formatTagLabel(tag: string): string {
  if (!tag) return ""
  return tag
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function getAllTags(settings: PomodoroSettings): string[] {
  const seen = new Set<string>()
  const tags: string[] = []

  for (const tag of [...DEFAULT_TAGS, ...settings.customTags]) {
    const normalized = normalizeTag(tag)
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    tags.push(normalized)
  }

  return tags
}

export function isValidCustomTag(raw: string, settings: PomodoroSettings): boolean {
  const normalized = normalizeTag(raw)
  if (!normalized || normalized.length < TAG_LIMITS.minLength) return false
  if (DEFAULT_TAGS.includes(normalized as (typeof DEFAULT_TAGS)[number])) return false
  if (settings.customTags.includes(normalized)) return false
  if (settings.customTags.length >= TAG_LIMITS.maxCustom) return false
  return true
}

"use client"

import { Volume2, VolumeX } from "lucide-react"

import { Button } from "@/components/ui/button"

interface SoundToggleProps {
  enabled: boolean
  onToggle: () => void
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="min-h-10 min-w-10"
      onClick={onToggle}
      aria-label={enabled ? "Mute sounds" : "Unmute sounds"}
      aria-pressed={!enabled}
    >
      {enabled ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5 text-muted-foreground" />
      )}
    </Button>
  )
}

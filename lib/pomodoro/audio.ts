export type ChimeType =
  | "workComplete"
  | "breakComplete"
  | "summit"
  | "longBreakComplete"

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  try {
    if (!audioContext || audioContext.state === "closed") {
      audioContext = new AudioContext()
    }
    if (audioContext.state === "suspended") {
      void audioContext.resume()
    }
    return audioContext
  } catch {
    return null
  }
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  volume = 0.12
): void {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = "sine"
  oscillator.frequency.value = frequency
  oscillator.connect(gain)
  gain.connect(ctx.destination)

  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  oscillator.start(startTime)
  oscillator.stop(startTime + duration + 0.05)
}

const CHIME_SEQUENCES: Record<ChimeType, { freq: number; delay: number; duration: number }[]> =
  {
    workComplete: [
      { freq: 523.25, delay: 0, duration: 0.35 },
      { freq: 659.25, delay: 0.12, duration: 0.35 },
      { freq: 783.99, delay: 0.24, duration: 0.5 },
    ],
    breakComplete: [
      { freq: 440, delay: 0, duration: 0.3 },
      { freq: 554.37, delay: 0.15, duration: 0.45 },
    ],
    summit: [
      { freq: 523.25, delay: 0, duration: 0.25 },
      { freq: 659.25, delay: 0.1, duration: 0.25 },
      { freq: 783.99, delay: 0.2, duration: 0.25 },
      { freq: 1046.5, delay: 0.32, duration: 0.6 },
    ],
    longBreakComplete: [
      { freq: 587.33, delay: 0, duration: 0.4 },
      { freq: 493.88, delay: 0.18, duration: 0.4 },
      { freq: 392, delay: 0.36, duration: 0.55 },
    ],
  }

export function playChime(type: ChimeType, enabled = true): void {
  if (!enabled) return

  const ctx = getAudioContext()
  if (!ctx) return

  const sequence = CHIME_SEQUENCES[type]
  const now = ctx.currentTime

  for (const note of sequence) {
    playTone(ctx, note.freq, now + note.delay, note.duration)
  }
}

/** @deprecated Use playChime instead */
export function playPhaseEndChime(): void {
  playChime("workComplete")
}

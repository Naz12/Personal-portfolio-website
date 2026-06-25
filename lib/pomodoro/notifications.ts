export async function notifyPhaseEnd(
  title: string,
  body: string,
  enabled = true
): Promise<void> {
  if (!enabled) return
  if (typeof window === "undefined" || !("Notification" in window)) return
  if (Notification.permission !== "granted") return
  try {
    new Notification(title, { body })
  } catch {
    // ignore
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false
  if (Notification.permission === "granted") return true
  if (Notification.permission === "denied") return false
  const result = await Notification.requestPermission()
  return result === "granted"
}

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window
}

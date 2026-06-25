import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Focus · Pomodoro",
  description: "A calm Pomodoro focus timer with climb-based goals and daily streaks.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function PomodoroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="fixed inset-0 overflow-hidden">{children}</div>
}

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nazrawi Solomon Abera - Portfolio",
  description: "Computer Science & Engineering Graduate | Full-Stack Developer | Next.js, React, Node.js Expert",
  keywords: ["portfolio", "developer", "nextjs", "react", "nodejs", "typescript"],
  authors: [{ name: "Nazrawi Solomon Abera" }],
  openGraph: {
    title: "Nazrawi Solomon Abera - Portfolio",
    description: "Computer Science & Engineering Graduate | Full-Stack Developer",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

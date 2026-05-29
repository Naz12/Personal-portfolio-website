import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { siteUrl } from "@/lib/site"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Nazrawi Solomon Abera - Portfolio",
  description: "Computer Science & Engineering Graduate | Full-Stack Developer | Next.js, React, Node.js Expert",
  keywords: ["portfolio", "developer", "nextjs", "react", "nodejs", "typescript"],
  authors: [{ name: "Nazrawi Solomon Abera" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Nazrawi Solomon Abera - Portfolio",
    description: "Computer Science & Engineering Graduate | Full-Stack Developer",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nazrawi Solomon Abera - Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nazrawi Solomon Abera - Portfolio",
    description: "Computer Science & Engineering Graduate | Full-Stack Developer",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
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
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
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

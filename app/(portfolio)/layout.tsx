import type { Metadata } from "next"

import { Navigation } from "@/components/navigation"
import { siteUrl } from "@/lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Nazrawi Solomon Abera - Portfolio",
  description: "Computer Science & Engineering Graduate | Full-Stack Developer | Next.js, React, Node.js Expert",
  keywords: ["portfolio", "developer", "nextjs", "react", "nodejs", "typescript"],
  authors: [{ name: "Nazrawi Solomon Abera" }],
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

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Navigation />
      <main className="pt-16">{children}</main>
    </>
  )
}

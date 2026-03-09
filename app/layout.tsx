import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Orbitron } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { BackgroundEffects } from "@/components/background-effects"
import { AuthProvider } from "@/contexts/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { NotificationProvider } from "@/components/notification-provider"
import { PWAProvider } from "@/components/pwa-provider"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { NetworkStatus } from "@/components/network-status"
import { PreviewModeIndicator } from "@/components/preview-mode-indicator"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" })

const siteUrl = process.env.SITE_URL || "https://zappygames.online"

export const metadata: Metadata = {
  title: {
    default: "ZappyGames - Play Free Online Games No Download",
    template: "%s | ZappyGames",
  },
  description:
    "ZappyGames is your #1 destination for free browser games. Play Action, Puzzle, Racing, Sports, Horror, Shooting & more online games — no download, no registration required.",
  keywords: [
    "free online games",
    "browser games",
    "unblocked games",
    "no download games",
    "play games online",
    "zappy games",
    "action games",
    "racing games",
    "puzzle games",
    "shooting games",
    "basketball games",
    "soccer games",
    "horror games",
    "multiplayer games",
    "strategy games",
    "mobile browser games",
  ],
  authors: [{ name: "ZappyGames Team", url: siteUrl }],
  creator: "ZappyGames",
  publisher: "ZappyGames",
  category: "Games",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ZappyGames - Play Free Online Games No Download",
    description:
      "ZappyGames is your #1 destination for free browser games. Play Action, Puzzle, Racing, Sports & more — no download required.",
    url: siteUrl,
    siteName: "ZappyGames",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZappyGames - Free Online Games",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZappyGames - Play Free Online Games No Download",
    description:
      "ZappyGames is your #1 destination for free browser games. Play Action, Puzzle, Racing & more — no download required.",
    images: ["/og-image.png"],
    site: "@ZappyGames",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SEARCH_CONSOLE_KEY || "your-google-verification-code",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#00d26a" },
    { media: "(prefers-color-scheme: dark)", color: "#00d26a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00d26a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ZappyGames" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#00d26a" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="google-adsense-account" content="ca-pub-1519616963911527" />
      </head>
      <body className={`${inter.className} ${orbitron.variable} overflow-x-hidden`}>
        <AuthProvider>
          <BackgroundEffects />
          <Navigation />
          <main className="relative min-h-screen">{children}</main>
          <Footer />
          <AuthModal />
          <NotificationProvider />
          <PWAProvider />
          <PWAInstallPrompt />
          <NetworkStatus />
          <PreviewModeIndicator />
        </AuthProvider>
      </body>
    </html>
  )
}

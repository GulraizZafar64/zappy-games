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

export const metadata: Metadata = {
  title: "ZappyGames - Play Free Online Games",
  description: "Discover and play thousands of free online games across all categories",
  keywords: ["games", "online games", "free games", "browser games", "mobile games"],
  authors: [{ name: "ZappyGames Team" }],
  creator: "ZappyGames",
  publisher: "ZappyGames",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://zappygames.online"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ZappyGames - Play Free Online Games",
    description: "Discover and play thousands of free online games across all categories",
    url: "https://zappygames.online",
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
    title: "ZappyGames - Play Free Online Games",
    description: "Discover and play thousands of free online games across all categories",
    images: ["/og-image.png"],
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
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8b5cf6" },
    { media: "(prefers-color-scheme: dark)", color: "#8b5cf6" },
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
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ZappyGames" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
      </head>
      <body className={`${inter.className} ${orbitron.variable} overflow-x-hidden`}>
        <AuthProvider>
          <BackgroundEffects />
          <Navigation />
          <main className="relative min-h-screen">{children}</main>
          <Footer/>
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

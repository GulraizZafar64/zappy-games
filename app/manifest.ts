import type { MetadataRoute } from "next"

// Required for static export
export const dynamic = 'force-static'
export const revalidate = false

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ZappyGames - Free Online Games",
    short_name: "ZappyGames",
    description: "Play thousands of free online games. No downloads required!",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f23",
    theme_color: "#8b5cf6",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    categories: ["games", "entertainment"],
    icons: [
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any",
      },
    ],
    shortcuts: [
      {
        name: "Popular Games",
        short_name: "Popular",
        description: "Browse popular games",
        url: "/games?filter=popular",
        icons: [{ src: "/icons/shortcut-popular.png", sizes: "96x96" }],
      },
      {
        name: "Action Games",
        short_name: "Action",
        description: "Play action games",
        url: "/games?category=action",
        icons: [{ src: "/icons/shortcut-action.png", sizes: "96x96" }],
      },
      {
        name: "Puzzle Games",
        short_name: "Puzzle",
        description: "Play puzzle games",
        url: "/games?category=puzzle",
        icons: [{ src: "/icons/shortcut-puzzle.png", sizes: "96x96" }],
      },
    ],
    screenshots: [
      {
        src: "/screenshots/desktop-home.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "ZappyGames Homepage",
      },
      {
        src: "/screenshots/mobile-home.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "ZappyGames Mobile",
      },
    ],
  }
}
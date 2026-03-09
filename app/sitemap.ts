import type { MetadataRoute } from 'next'
import { connectDB } from '@/lib/mongodb'
import { Game } from '@/models/Game'

function getBaseUrl(): string {
    if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '')
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    return 'https://zappygames.online'
}

export const revalidate = 3600 // revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getBaseUrl()

    // Static high-priority pages
    const entries: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/games`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ]

    // Dynamic game pages from DB
    try {
        await connectDB()
        const games = await Game.find({}, { url: 1, updatedAt: 1, scraped_at: 1 })
            .sort({ updatedAt: -1 })
            .lean()

        for (const game of games) {
            if (!game.url) continue
            entries.push({
                url: `${baseUrl}/game/${game.url}`,
                lastModified: (game as any).updatedAt
                    ? new Date((game as any).updatedAt)
                    : (game as any).scraped_at
                        ? new Date((game as any).scraped_at)
                        : new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            })
        }
    } catch (err) {
        console.error('Sitemap: failed to fetch games from DB', err)
    }

    return entries
}

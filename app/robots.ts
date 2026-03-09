import type { MetadataRoute } from 'next'

function getBaseUrl(): string {
    if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '')
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    return 'https://zappygames.online'
}

export default function robots(): MetadataRoute.Robots {
    const baseUrl = getBaseUrl()
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/', '/admin/'],
            },
            {
                // Block AI training bots — good for AdSense compliance
                userAgent: ['GPTBot', 'CCBot', 'anthropic-ai', 'Claude-Web'],
                disallow: ['/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    }
}

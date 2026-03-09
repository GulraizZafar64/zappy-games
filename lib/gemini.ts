/**
 * Gemini API client for enriching game data: SEO keywords, meta descriptions,
 * ranking keywords, and enhanced content.
 */

export interface RawGameInput {
  name: string
  image?: string
  url?: string
  category?: string
  source_url?: string
}

export interface EnrichedGame {
  name: string
  url: string
  category: string
  image: string
  description: string
  meta_description: string
  seo_keywords: string[]
  ranking_keywords: string[]
  content_enhanced: string
  badge?: "Hot" | "New" | "Featured" | "Top"
  rank?: number
}

const ENRICH_PROMPT = `You are an SEO and content expert for a free online games website.
Given a game's basic info, return a JSON object with these exact keys (no markdown, no code block):
- name: string (clean title)
- url: string (slug: lowercase, hyphens only, e.g. "super-racing-championship")
- category: string (one of: action, puzzle, racing, sports, adventure, strategy, simulation, other)
- image: string (use the provided image URL as-is)
- description: string (2-3 sentences, engaging, include genre and appeal)
- meta_description: string (max 160 chars for SEO)
- seo_keywords: string[] (8-12 keywords/phrases for SEO, e.g. "free online racing game")
- ranking_keywords: string[] (5-8 high-intent search phrases people use to find this game)
- content_enhanced: string (1 short paragraph with ranking_keywords naturally woven in for SEO)
- badge: "Hot" | "New" | "Featured" | "Top" | null (pick one if it fits, else null)
- rank: number | null (1-100 popularity, null if unknown)`;

export async function enrichGameWithGemini(
  raw: RawGameInput,
  apiKey: string
): Promise<EnrichedGame> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai")
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" })

  const prompt = `${ENRICH_PROMPT}\n\nInput game:\n${JSON.stringify(raw)}`
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const jsonStr = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
  return JSON.parse(jsonStr) as EnrichedGame
}

export async function enrichGamesBatch(
  rawGames: RawGameInput[],
  apiKey: string
): Promise<EnrichedGame[]> {
  const out: EnrichedGame[] = []
  for (const raw of rawGames) {
    try {
      const enriched = await enrichGameWithGemini(raw, apiKey)
      out.push(enriched)
    } catch (e) {
      console.error("Gemini enrich failed for:", raw.name, e)
    }
  }
  return out
}

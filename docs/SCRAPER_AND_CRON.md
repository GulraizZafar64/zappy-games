# Game Scraper & Monthly Cron

## Overview

- **Games JSON** (`data/games.json`): Contains all games with images, descriptions, SEO keywords, rank, badges (Hot/New/Featured), and meta descriptions.
- **Monthly scraper**: Fetches latest games from a configurable source, enriches each with **Gemini API** (SEO keywords, ranking keywords, enhanced content), and saves **only new games** to the database. Existing games (by `url` or `external_id`) are never updated or duplicated.

## Setup

1. **Environment**
   - Copy `.env.example` to `.env.local` and set:
     - `GEMINI_API_KEY` – for content enrichment
     - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` – for DB
   - Optional: `SCRAPE_SOURCE_URL` – URL that returns a JSON array of games: `[{ "name", "image", "url?", "category?", "source_url?" }]`
   - Optional: `CRON_SECRET` – used to protect the cron API route

2. **Database**
   - Run `scripts/create-tables.sql` then `scripts/migrate-games-seo.sql` in your Supabase SQL editor so the `games` table has SEO/video/rank columns.

## Running the Scraper

### Option A: Vercel Cron (monthly)

- Deploy to Vercel. The cron is defined in `vercel.json`: **1st day of every month at 00:00 UTC**.
- Set `CRON_SECRET` in Vercel env. Vercel will call:
  `GET/POST /api/cron/scrape-games` with `Authorization: Bearer <CRON_SECRET>`.

### Option B: Manual / external cron

```bash
pnpm run scrape-games
```

Requires `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in the environment. If `SCRAPE_SOURCE_URL` is not set, the script uses the first few entries from `data/games.json` as a demo source.

## Behavior

1. **Fetch** raw games from `SCRAPE_SOURCE_URL` or fallback to local JSON.
2. **Deduplicate**: Load existing `url` and `external_id` from DB; skip any game that already exists.
3. **Enrich** each new game with Gemini:
   - Normalized name, slug (`url`), category
   - Description, meta_description
   - SEO keywords and ranking keywords
   - Short AI-enhanced content paragraph
   - Optional badge (Hot/New/Featured/Top) and rank
4. **Insert** only new games into the `games` table. Previous DB rows are left unchanged.

## API route

- **Path**: `/api/cron/scrape-games`
- **Methods**: GET, POST
- **Auth**: If `CRON_SECRET` is set, request must include header: `Authorization: Bearer <CRON_SECRET>`
- **Response**: `{ ok: true, inserted: number, total: number }`

-- Add SEO, video, rank, and scraping columns to games table (run after create-tables.sql)
ALTER TABLE games ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS rank INTEGER;
ALTER TABLE games ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS seo_keywords JSONB DEFAULT '[]';
ALTER TABLE games ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS content_enhanced BOOLEAN DEFAULT false;
ALTER TABLE games ADD COLUMN IF NOT EXISTS scraped_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE games ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS external_id TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_games_external_id ON games(external_id);
CREATE INDEX IF NOT EXISTS idx_games_scraped_at ON games(scraped_at);
CREATE INDEX IF NOT EXISTS idx_games_rank ON games(rank);

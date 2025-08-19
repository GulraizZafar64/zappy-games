-- Insert sample games data
INSERT INTO games (name, url, category, image, iframe, rating, plays) VALUES
('Super Racing Championship', 'super-racing-championship', 'racing', '/racing-game-car.png', 'https://example.com/games/racing/embed', 4.7, 15420),
('Puzzle Master 3D', 'puzzle-master-3d', 'puzzle', '/colorful-puzzle-blocks.png', 'https://example.com/games/puzzle/embed', 4.5, 8930),
('Action Hero Adventure', 'action-hero-adventure', 'action', '/action-hero.png', 'https://example.com/games/action/embed', 4.8, 20345),
('Football Champions', 'football-champions', 'sports', '/vibrant-football-soccer-game.png', 'https://example.com/games/sports/embed', 4.6, 12000),
('Mystic Quest', 'mystic-quest', 'adventure', '/fantasy-adventure-world.png', 'https://example.com/games/adventure/embed', 4.4, 9876),
('Tower Defense Pro', 'tower-defense-pro', 'strategy', '/strategy-game-towers-defense.png', 'https://example.com/games/strategy/embed', 4.3, 7654),
('Speed Racer X', 'speed-racer-x', 'racing', '/sports-car-race.png', 'https://example.com/games/racing2/embed', 4.9, 32100),
('Brain Teaser Challenge', 'brain-teaser-challenge', 'puzzle', '/brain-teaser-puzzle.png', 'https://example.com/games/puzzle2/embed', 4.2, 5432)
ON CONFLICT (url) DO NOTHING;

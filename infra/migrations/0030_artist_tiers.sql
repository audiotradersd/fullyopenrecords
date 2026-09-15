CREATE TABLE IF NOT EXISTS artist_tiers (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  track_limit INTEGER,
  album_limit INTEGER,
  photo_limit INTEGER,
  video_limit INTEGER,
  radio_track_limit INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS artist_tiers_slug_idx ON artist_tiers (slug);
INSERT OR IGNORE INTO artist_tiers (slug, name, track_limit, album_limit, photo_limit, video_limit, radio_track_limit) VALUES
  ('free', 'Free', 200, 20, 10, 3, 1),
  ('paid', 'Paid', NULL, NULL, NULL, NULL, NULL);

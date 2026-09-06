CREATE TABLE IF NOT EXISTS track_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  song_id INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  version_type TEXT NOT NULL,
  version_number INTEGER,
  audio_url TEXT NOT NULL,
  duration INTEGER,
  notes TEXT,
  recorded_at TEXT,
  uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS track_versions_song_type_number_idx
  ON track_versions (song_id, version_type, version_number);
CREATE INDEX IF NOT EXISTS track_versions_song_created_idx
  ON track_versions (song_id, created_at, id);

CREATE TABLE IF NOT EXISTS track_version_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  track_version_id INTEGER NOT NULL REFERENCES track_versions(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS track_version_photos_version_sort_idx
  ON track_version_photos (track_version_id, sort_order, id);

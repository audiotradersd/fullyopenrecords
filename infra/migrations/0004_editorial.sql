CREATE TABLE gigs (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  artist_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  venue TEXT,
  city TEXT,
  event_date TEXT NOT NULL,
  ticket_url TEXT,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

CREATE TABLE editorial_slots (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  slot_key TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE editorial_slot_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  slot_id INTEGER NOT NULL,
  item_type TEXT NOT NULL,
  item_id INTEGER,
  artist_id INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  custom_title TEXT,
  custom_subtitle TEXT,
  custom_description TEXT,
  custom_image TEXT,
  custom_href TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (slot_id) REFERENCES editorial_slots(id) ON DELETE CASCADE,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE SET NULL
);

INSERT INTO editorial_slots (slot_key, title, description, active) VALUES
  ('home_featured_release', 'Featured Release', 'Primary homepage release slot', 1),
  ('home_featured_artists', 'Discover Artists', 'Homepage artist grid', 1),
  ('home_latest_releases', 'Latest Releases', 'Homepage release grid', 1),
  ('radio_featured_tracks', 'Radio Picks', 'Editorial radio rotation surface', 1);

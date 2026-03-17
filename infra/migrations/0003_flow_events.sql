CREATE TABLE flow_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  event_type TEXT NOT NULL,
  user_id INTEGER,
  artist_id INTEGER,
  path TEXT,
  session_key TEXT,
  meta TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE SET NULL
);

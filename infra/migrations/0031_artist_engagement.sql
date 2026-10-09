CREATE TABLE IF NOT EXISTS artist_engagement_email_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  email_id TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'nurture',
  theme TEXT NOT NULL,
  sent_at TEXT,
  trigger_reason TEXT NOT NULL,
  state_snapshot TEXT NOT NULL,
  postmark_message_id TEXT,
  send_status TEXT NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'unconfirmed',
  postmark_bounce_id INTEGER,
  delivery_details TEXT,
  delivery_checked_at TEXT,
  error TEXT,
  evaluation_date TEXT,
  attempt_key TEXT,
  trigger_key TEXT,
  schedule_id INTEGER,
  schedule_revision INTEGER,
  schedule_slot_id TEXT,
  daily_decision_id INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS artist_engagement_history_artist_sent_idx
  ON artist_engagement_email_history (artist_id, sent_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS artist_engagement_history_attempt_key_idx
  ON artist_engagement_email_history (attempt_key);

CREATE UNIQUE INDEX IF NOT EXISTS artist_engagement_history_artist_day_idx
  ON artist_engagement_email_history (artist_id, evaluation_date) WHERE category = 'nurture';

CREATE UNIQUE INDEX IF NOT EXISTS artist_engagement_history_trigger_idx
  ON artist_engagement_email_history (trigger_key) WHERE trigger_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS artist_engagement_preferences (
  artist_id INTEGER PRIMARY KEY NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  nurture_unsubscribed_at TEXT,
  unsubscribe_token_hash TEXT,
  email_suppressed_at TEXT,
  email_suppressed_reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS artist_engagement_preferences_token_idx
  ON artist_engagement_preferences (unsubscribe_token_hash);

CREATE TABLE IF NOT EXISTS artist_engagement_opportunities (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  email_id TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'nurture',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  audience TEXT,
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS artist_engagement_opportunities_active_dates_idx
  ON artist_engagement_opportunities (active, starts_at, ends_at);

CREATE TABLE IF NOT EXISTS artist_engagement_runs (
  run_date TEXT PRIMARY KEY NOT NULL,
  status TEXT NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  summary TEXT
);

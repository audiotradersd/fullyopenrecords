-- Private-master / public-preview media pipeline.
-- Originals live in R2's private masters bucket; only encoded previews are
-- exposed by the public MEDIA_BUCKET binding.
ALTER TABLE songs ADD COLUMN master_key TEXT;
ALTER TABLE songs ADD COLUMN processing_status TEXT NOT NULL DEFAULT 'ready';

CREATE TABLE IF NOT EXISTS media_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  song_id INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('encode', 'radio_upload')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
  source_bucket TEXT NOT NULL CHECK (source_bucket IN ('masters', 'media')),
  source_key TEXT NOT NULL,
  master_key TEXT,
  output_key TEXT,
  error TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  claimed_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS media_jobs_status_created_idx ON media_jobs (status, created_at);
CREATE INDEX IF NOT EXISTS media_jobs_song_type_idx ON media_jobs (song_id, job_type);

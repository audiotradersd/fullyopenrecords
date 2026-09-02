CREATE INDEX IF NOT EXISTS radio_history_played_at_id_idx
  ON radio_history (played_at DESC, id DESC);

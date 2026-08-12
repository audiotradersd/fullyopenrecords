-- Account deactivation preserves records while blocking login and public profile access.
ALTER TABLE users ADD COLUMN active INTEGER NOT NULL DEFAULT 1;

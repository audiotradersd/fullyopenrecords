ALTER TABLE account_email_notifications ADD COLUMN delivery_status TEXT NOT NULL DEFAULT 'unconfirmed';
ALTER TABLE account_email_notifications ADD COLUMN postmark_bounce_id INTEGER;
ALTER TABLE account_email_notifications ADD COLUMN delivery_details TEXT;
ALTER TABLE account_email_notifications ADD COLUMN delivery_checked_at TEXT;

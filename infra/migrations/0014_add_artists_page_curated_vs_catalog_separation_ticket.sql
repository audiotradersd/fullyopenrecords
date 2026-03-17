INSERT INTO tracking_items (number, details, status)
SELECT
  COALESCE((SELECT MAX(number) + 1 FROM tracking_items), 1),
  'Update the artists page so station-catalog imports are not shown as featured artists. Keep the curated featured bands with editorial profiles separate, and move imported/currently-on-radio artists into their own list or section instead.',
  'backlog'
WHERE NOT EXISTS (
  SELECT 1
  FROM tracking_items
  WHERE details = 'Update the artists page so station-catalog imports are not shown as featured artists. Keep the curated featured bands with editorial profiles separate, and move imported/currently-on-radio artists into their own list or section instead.'
);

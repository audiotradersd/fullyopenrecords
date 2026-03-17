INSERT INTO tracking_items (number, details, status)
SELECT
  COALESCE((SELECT MAX(number) + 1 FROM tracking_items), 1),
  'Allow artists to delete tracks and albums from the dashboard, with a clear warning that deletion completely removes the content. If a deleted track is on radio, also remove it from Citrus over FTP.',
  'backlog'
WHERE NOT EXISTS (
  SELECT 1
  FROM tracking_items
  WHERE details = 'Allow artists to delete tracks and albums from the dashboard, with a clear warning that deletion completely removes the content. If a deleted track is on radio, also remove it from Citrus over FTP.'
);

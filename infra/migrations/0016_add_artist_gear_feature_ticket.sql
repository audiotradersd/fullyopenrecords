INSERT INTO tracking_items (number, details, status)
SELECT
  COALESCE((SELECT MAX(number) + 1 FROM tracking_items), 1),
  'Add an "artist gear" feature so artists can list the gear they use, including brand and model, and optionally add photos plus notes about settings, levels, controls, and recording setup.',
  'backlog'
WHERE NOT EXISTS (
  SELECT 1
  FROM tracking_items
  WHERE details = 'Add an "artist gear" feature so artists can list the gear they use, including brand and model, and optionally add photos plus notes about settings, levels, controls, and recording setup.'
);

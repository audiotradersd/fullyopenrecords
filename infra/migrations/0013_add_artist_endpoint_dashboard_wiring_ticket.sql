INSERT INTO tracking_items (number, details, status)
SELECT
  COALESCE((SELECT MAX(number) + 1 FROM tracking_items), 1),
  'Fix the /artist/:slug endpoint wiring to the artist dashboard so enabled tracks appear correctly. Example: /artist/stone should show 5 of 6 enabled tracks for a free account, and those tracks should be streamable.',
  'backlog'
WHERE NOT EXISTS (
  SELECT 1
  FROM tracking_items
  WHERE details = 'Fix the /artist/:slug endpoint wiring to the artist dashboard so enabled tracks appear correctly. Example: /artist/stone should show 5 of 6 enabled tracks for a free account, and those tracks should be streamable.'
);

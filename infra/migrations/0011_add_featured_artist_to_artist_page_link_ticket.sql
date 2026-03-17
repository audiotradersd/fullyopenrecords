INSERT INTO tracking_items (number, details, status)
SELECT
  COALESCE((SELECT MAX(number) + 1 FROM tracking_items), 1),
  'Add a link on each featured artist page to that artist''s page from the artists endpoint, for example linking /featured/stone to /artist/stone.',
  'backlog'
WHERE NOT EXISTS (
  SELECT 1
  FROM tracking_items
  WHERE details = 'Add a link on each featured artist page to that artist''s page from the artists endpoint, for example linking /featured/stone to /artist/stone.'
);

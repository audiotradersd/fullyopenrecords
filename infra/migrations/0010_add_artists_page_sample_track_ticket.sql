INSERT INTO tracking_items (number, details, status)
SELECT
  COALESCE((SELECT MAX(number) + 1 FROM tracking_items), 1),
  'Reinstate the chosen single-track sample for each band on the artists page using the sample track data already present in the featured endpoint.',
  'backlog'
WHERE NOT EXISTS (
  SELECT 1
  FROM tracking_items
  WHERE details = 'Reinstate the chosen single-track sample for each band on the artists page using the sample track data already present in the featured endpoint.'
);

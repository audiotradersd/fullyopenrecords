INSERT INTO tracking_items (number, details, status)
SELECT
  COALESCE((SELECT MAX(number) + 1 FROM tracking_items), 1),
  'Add feature-song version control so an artist can keep one base track title and upload superseded versions with notes, for example handheld live jam, structured jam, 4-track recording, 16-track demo, and final recorded or mastered versions.',
  'backlog'
WHERE NOT EXISTS (
  SELECT 1
  FROM tracking_items
  WHERE details = 'Add feature-song version control so an artist can keep one base track title and upload superseded versions with notes, for example handheld live jam, structured jam, 4-track recording, 16-track demo, and final recorded or mastered versions.'
);

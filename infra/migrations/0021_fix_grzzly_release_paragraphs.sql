-- Convert literal escape sequences into real paragraph breaks.
UPDATE releases
SET description = replace(description, '\n\n', char(10) || char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'how-2-have-fun-and-stay-alive';

UPDATE albums
SET description = replace(description, '\n\n', char(10) || char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE artist_id = (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1)
  AND title = 'How 2 Have Fun and Stay Alive';

UPDATE artists
SET bio = replace(bio, '\n\n', char(10) || char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'grzzly';

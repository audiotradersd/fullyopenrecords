ALTER TABLE releases ADD COLUMN slug TEXT;
ALTER TABLE releases ADD COLUMN published INTEGER NOT NULL DEFAULT 0;
ALTER TABLE releases ADD COLUMN catalog_number TEXT;
ALTER TABLE releases ADD COLUMN credits TEXT;
ALTER TABLE releases ADD COLUMN artist_name TEXT;
ALTER TABLE releases ADD COLUMN artist_slug TEXT;
ALTER TABLE releases ADD COLUMN track_snapshot TEXT NOT NULL DEFAULT '[]';
ALTER TABLE releases ADD COLUMN media_snapshot TEXT NOT NULL DEFAULT '[]';
UPDATE releases SET slug = 'release-' || id WHERE slug IS NULL OR slug = '';

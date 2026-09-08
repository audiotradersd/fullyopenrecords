-- Keep the published curated release in sync with its approved track order and titles.
UPDATE releases
SET track_snapshot = '[{"title":"Nail It"},{"title":"Kodiak"},{"title":"Intermingle"},{"title":"Fun Bus"},{"title":"Jack Issues"},{"title":"Break the Duck"},{"title":"Rob References"},{"title":"Verbal"},{"title":"Dead Leg"},{"title":"Frock"}]'
WHERE slug = 'jack-issues';

-- Grzzly — Sonny Boy: artist profile, 15-track album and curated release.

UPDATE artists
SET
  name = 'Grzzly',
  bio = 'Grzzly creates immersive cinematic ambient music that sits somewhere between dark ambient, experimental electronic and film score. Their sound is built on evolving textures, atmospheric synths and carefully crafted sound design, creating music that rewards close listening as much as it works as a backdrop for thought and reflection.\n\nRather than relying on conventional song structures, Grzzly''s compositions unfold gradually, using tension, space and subtle movement to create a strong sense of narrative. Spoken-word elements, drones and layered electronic textures combine to produce pieces that feel equally at home accompanying documentaries, late-night journeys or moments of quiet introspection.\n\nThe result is music that is both haunting and immersive—drawing listeners into expansive sonic landscapes where mood and emotion take precedence over genre conventions.',
  hero_image = 'https://fullyopenrecords.com/artists/grzzly.webp',
  profile_image = 'https://fullyopenrecords.com/artists/grzzly.webp',
  banner_image = 'https://fullyopenrecords.com/artists/grzzly.webp',
  genres = '["Ambient","Cinematic Ambient"]',
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'grzzly';

INSERT INTO albums (artist_id, title, release_date, description, cover_art)
SELECT id, 'Sonny Boy', '2026-08-13',
  'Sonny Boy is an immersive cinematic ambient album from Grzzly, sitting somewhere between dark ambient, experimental electronic and film score. Evolving textures, atmospheric synths and carefully crafted sound design create music that rewards close listening as much as it works as a backdrop for thought and reflection.\n\nRather than relying on conventional song structures, these compositions unfold gradually, using tension, space and subtle movement to create a strong sense of narrative. Spoken-word elements, drones and layered electronic textures combine to produce pieces equally at home accompanying documentaries, late-night journeys or moments of quiet introspection.\n\nThe result is haunting and immersive: expansive sonic landscapes where mood and emotion take precedence over genre conventions.',
  'https://fullyopenrecords.com/artists/grzzly.webp'
FROM artists
WHERE slug = 'grzzly'
  AND NOT EXISTS (
    SELECT 1 FROM albums
    WHERE albums.artist_id = artists.id AND albums.title = 'Sonny Boy'
  );

UPDATE songs
SET
  album_id = (SELECT id FROM albums WHERE artist_id = songs.artist_id AND title = 'Sonny Boy' LIMIT 1),
  track_number = CASE title
    WHEN 'Clement' THEN 1
    WHEN 'China boy' THEN 2
    WHEN 'Water shortage' THEN 3
    WHEN 'Advert for a daydream' THEN 4
    WHEN 'Winter wonderland' THEN 5
    WHEN 'How to have fun' THEN 6
    WHEN 'The end' THEN 7
    WHEN 'Grrr' THEN 8
    WHEN 'Intermission' THEN 9
    WHEN 'Being tapped by the US Gov' THEN 10
    WHEN 'Reprise' THEN 11
    WHEN 'A Fire' THEN 12
    WHEN 'Sonny Boy' THEN 13
    WHEN 'Gonzalez' THEN 14
    WHEN 'Bikini Woman' THEN 15
  END,
  audio_url = CASE title
    WHEN 'Clement' THEN 'https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/01-clement.mp3'
    WHEN 'China boy' THEN 'https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/02-china-boy.mp3'
    WHEN 'Water shortage' THEN 'https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/03-water-shortage.mp3'
    WHEN 'Advert for a daydream' THEN 'https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/04-advert-for-a-daydream.mp3'
    WHEN 'Winter wonderland' THEN 'https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/05-winter-wonderland.mp3'
    WHEN 'How to have fun' THEN 'https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/06-how-to-have-fun.mp3'
    WHEN 'The end' THEN 'https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/07-the-end.mp3'
    WHEN 'Grrr' THEN 'https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/08-grrr.mp3'
    WHEN 'Intermission' THEN 'https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/09-intermission.mp3'
    WHEN 'Being tapped by the US Gov' THEN 'https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/10-being-tapped-by-the-us-gov.mp3'
    WHEN 'Reprise' THEN 'https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/11-reprise.mp3'
    WHEN 'A Fire' THEN 'https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/12-a-fire.mp3'
    WHEN 'Sonny Boy' THEN 'https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/13-sonny-boy.mp3'
    WHEN 'Gonzalez' THEN 'https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/14-gonzalez.mp3'
    WHEN 'Bikini Woman' THEN 'https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/15-bikini-woman.mp3'
  END,
  cover_image = 'https://fullyopenrecords.com/artists/grzzly.webp',
  enabled = 1,
  updated_at = CURRENT_TIMESTAMP
WHERE artist_id = (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1)
  AND title IN (
    'Clement', 'China boy', 'Water shortage', 'Advert for a daydream', 'Winter wonderland',
    'How to have fun', 'The end', 'Grrr', 'Intermission', 'Being tapped by the US Gov',
    'Reprise', 'A Fire', 'Sonny Boy', 'Gonzalez', 'Bikini Woman'
  );

INSERT INTO releases (
  title, slug, published, artist_id, type, artwork, release_date, streaming_links,
  description, catalog_number, credits, artist_name, artist_slug, track_snapshot, media_snapshot
)
SELECT
  'Sonny Boy', 'sonny-boy', 1, id, 'Album', 'https://fullyopenrecords.com/artists/grzzly.webp', '2026-08-13', '{}',
  'Sonny Boy is an immersive cinematic ambient album from Grzzly, sitting somewhere between dark ambient, experimental electronic and film score. Evolving textures, atmospheric synths and carefully crafted sound design create music that rewards close listening as much as it works as a backdrop for thought and reflection.\n\nRather than relying on conventional song structures, these compositions unfold gradually, using tension, space and subtle movement to create a strong sense of narrative. Spoken-word elements, drones and layered electronic textures combine to produce pieces equally at home accompanying documentaries, late-night journeys or moments of quiet introspection.\n\nThe result is haunting and immersive: expansive sonic landscapes where mood and emotion take precedence over genre conventions.',
  NULL, 'Written, produced and performed by Grzzly.', 'Grzzly', 'grzzly',
  '[{"title":"Clement","audioUrl":"https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/01-clement.mp3"},{"title":"China boy","audioUrl":"https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/02-china-boy.mp3"},{"title":"Water shortage","audioUrl":"https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/03-water-shortage.mp3"},{"title":"Advert for a daydream","audioUrl":"https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/04-advert-for-a-daydream.mp3"},{"title":"Winter wonderland","audioUrl":"https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/05-winter-wonderland.mp3"},{"title":"How to have fun","audioUrl":"https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/06-how-to-have-fun.mp3"},{"title":"The end","audioUrl":"https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/07-the-end.mp3"},{"title":"Grrr","audioUrl":"https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/08-grrr.mp3"},{"title":"Intermission","audioUrl":"https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/09-intermission.mp3"},{"title":"Being tapped by the US Gov","audioUrl":"https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/10-being-tapped-by-the-us-gov.mp3"},{"title":"Reprise","audioUrl":"https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/11-reprise.mp3"},{"title":"A Fire","audioUrl":"https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/12-a-fire.mp3"},{"title":"Sonny Boy","audioUrl":"https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/13-sonny-boy.mp3"},{"title":"Gonzalez","audioUrl":"https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/14-gonzalez.mp3"},{"title":"Bikini Woman","audioUrl":"https://fully-open-records-api.sbdownes.workers.dev/media/artists/grzzly/albums/sonny-boy/tracks/15-bikini-woman.mp3"}]',
  '[{"url":"https://fullyopenrecords.com/artists/grzzly.webp","alt":"Sonny Boy album artwork by Grzzly"}]'
FROM artists
WHERE slug = 'grzzly'
  AND NOT EXISTS (SELECT 1 FROM releases WHERE slug = 'sonny-boy');

-- Correct the published Grzzly album name and canonical release slug.

UPDATE albums
SET
  title = 'How 2 Have Fun and Stay Alive',
  description = 'How 2 Have Fun and Stay Alive is an immersive cinematic ambient album from Grzzly, sitting somewhere between dark ambient, experimental electronic and film score. Evolving textures, atmospheric synths and carefully crafted sound design create music that rewards close listening as much as it works as a backdrop for thought and reflection.\n\nRather than relying on conventional song structures, these compositions unfold gradually, using tension, space and subtle movement to create a strong sense of narrative. Spoken-word elements, drones and layered electronic textures combine to produce pieces equally at home accompanying documentaries, late-night journeys or moments of quiet introspection.\n\nThe result is haunting and immersive: expansive sonic landscapes where mood and emotion take precedence over genre conventions.',
  updated_at = CURRENT_TIMESTAMP
WHERE artist_id = (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1)
  AND title = 'Sonny Boy';

UPDATE releases
SET
  title = 'How 2 Have Fun and Stay Alive',
  slug = 'how-2-have-fun-and-stay-alive',
  description = 'How 2 Have Fun and Stay Alive is an immersive cinematic ambient album from Grzzly, sitting somewhere between dark ambient, experimental electronic and film score. Evolving textures, atmospheric synths and carefully crafted sound design create music that rewards close listening as much as it works as a backdrop for thought and reflection.\n\nRather than relying on conventional song structures, these compositions unfold gradually, using tension, space and subtle movement to create a strong sense of narrative. Spoken-word elements, drones and layered electronic textures combine to produce pieces equally at home accompanying documentaries, late-night journeys or moments of quiet introspection.\n\nThe result is haunting and immersive: expansive sonic landscapes where mood and emotion take precedence over genre conventions.',
  media_snapshot = '[{"url":"https://fullyopenrecords.com/artists/grzzly.webp","alt":"How 2 Have Fun and Stay Alive album artwork by Grzzly"}]',
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'sonny-boy';

UPDATE songs
SET
  audio_url = '/api/media/latest-releases/violet-piper-inside-baseball.mp3',
  cover_image = '/latest-releases/violet-piper.jpeg'
WHERE slug = 'violet-piper-inside-baseball';

UPDATE songs
SET
  audio_url = '/api/media/latest-releases/troll-mother-forest-child.mp3',
  cover_image = '/latest-releases/troll-mother.jpg'
WHERE slug = 'troll-mother-forest-child';

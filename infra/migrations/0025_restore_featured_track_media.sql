-- Legacy featured-track files already exist in R2. Register their public URLs so
-- they are available to editorial selectors alongside normal artist uploads.
UPDATE songs SET audio_url = 'https://fully-open-records-api.sbdownes.workers.dev/media/tracks/audio-kulture/comfort-zone.mp3' WHERE slug = 'audio-kulture-comfort-zone' AND audio_url IS NULL;
UPDATE songs SET audio_url = 'https://fully-open-records-api.sbdownes.workers.dev/media/tracks/ivan-hays/goodnight.mp3' WHERE slug = 'ivan-hays-goodnight' AND audio_url IS NULL;
UPDATE songs SET audio_url = 'https://fully-open-records-api.sbdownes.workers.dev/media/tracks/noahs-house-band/dodo.mp3' WHERE slug = 'noah-s-house-band-dodo' AND audio_url IS NULL;
UPDATE songs SET audio_url = 'https://fully-open-records-api.sbdownes.workers.dev/media/tracks/the-ship-heads/jolly-rogered.mp3' WHERE slug = 'the-ship-heads-jolly-rogered' AND audio_url IS NULL;
UPDATE songs SET audio_url = 'https://fully-open-records-api.sbdownes.workers.dev/media/tracks/ticklin-the-pickle/give-it.mp3' WHERE slug = 'ticklin-the-pickle-give-it' AND audio_url IS NULL;

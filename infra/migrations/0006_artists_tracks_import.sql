-- Generated from artists_tracks.csv

-- Idempotent artist + song import for Fully Open Records

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  '900 Spaces',
  '900-spaces',
  '900 Spaces artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = '900-spaces'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'A.K.A.',
  'a-k-a',
  'A.K.A. artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'a-k-a'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Arrival of the Romans',
  'arrival-of-the-romans',
  'Arrival of the Romans artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'arrival-of-the-romans'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Audio Kulture',
  'audio-kulture',
  'Audio Kulture artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'audio-kulture'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Black Gamma',
  'black-gamma',
  'Black Gamma artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'black-gamma'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Black Mountain College',
  'black-mountain-college',
  'Black Mountain College artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'black-mountain-college'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Black Star',
  'black-star',
  'Black Star artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'black-star'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Bolzenschuss',
  'bolzenschuss',
  'Bolzenschuss artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'bolzenschuss'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Britonica',
  'britonica',
  'Britonica artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'britonica'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Caustic Visions',
  'caustic-visions',
  'Caustic Visions artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'caustic-visions'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Censor',
  'censor',
  'Censor artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'censor'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'COLLyde',
  'collyde',
  'COLLyde artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'collyde'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Core of io',
  'core-of-io',
  'Core of io artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'core-of-io'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'DANCEHALL',
  'dancehall',
  'DANCEHALL artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'dancehall'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Deponi',
  'deponi',
  'Deponi artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'deponi'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Designated Moshers Unit',
  'designated-moshers-unit',
  'Designated Moshers Unit artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'designated-moshers-unit'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Dirty Noiz/Alex Holmes',
  'dirty-noiz-alex-holmes',
  'Dirty Noiz/Alex Holmes artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'dirty-noiz-alex-holmes'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Disco Assassins',
  'disco-assassins',
  'Disco Assassins artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'disco-assassins'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'DJ Prosper vs Disco Assassins',
  'dj-prosper-vs-disco-assassins',
  'DJ Prosper vs Disco Assassins artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'dj-prosper-vs-disco-assassins'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Drone in the Woods',
  'drone-in-the-woods',
  'Drone in the Woods artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'drone-in-the-woods'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Emmay',
  'emmay',
  'Emmay artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'emmay'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Grzzly',
  'grzzly',
  'Grzzly artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'grzzly'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Hellrazor',
  'hellrazor',
  'Hellrazor artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'hellrazor'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'I Am Jack',
  'i-am-jack',
  'I Am Jack artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'i-am-jack'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Idesyne',
  'idesyne',
  'Idesyne artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'idesyne'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Indigo Sun',
  'indigo-sun',
  'Indigo Sun artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'indigo-sun'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Infinite Spark',
  'infinite-spark',
  'Infinite Spark artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'infinite-spark'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Ivan Hays',
  'ivan-hays',
  'Ivan Hays artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'ivan-hays'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Ken K',
  'ken-k',
  'Ken K artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'ken-k'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Last Days Of Lorca',
  'last-days-of-lorca',
  'Last Days Of Lorca artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'last-days-of-lorca'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'LITTLE TREASURE ALLSTARS',
  'little-treasure-allstars',
  'LITTLE TREASURE ALLSTARS artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'little-treasure-allstars'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Lost Legion',
  'lost-legion',
  'Lost Legion artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'lost-legion'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Mark Allister',
  'mark-allister',
  'Mark Allister artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'mark-allister'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Mask of Judas',
  'mask-of-judas',
  'Mask of Judas artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'mask-of-judas'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Matt Argle Band',
  'matt-argle-band',
  'Matt Argle Band artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'matt-argle-band'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Muskoka',
  'muskoka',
  'Muskoka artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'muskoka'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'NÃO',
  'n-o',
  'NÃO artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'n-o'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Nectar International',
  'nectar-international',
  'Nectar International artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'nectar-international'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'New Tropics',
  'new-tropics',
  'New Tropics artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'new-tropics'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'No Humans',
  'no-humans',
  'No Humans artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'no-humans'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Noah''s House Band',
  'noah-s-house-band',
  'Noah''s House Band artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'noah-s-house-band'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Ornaments of the Countryside',
  'ornaments-of-the-countryside',
  'Ornaments of the Countryside artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'ornaments-of-the-countryside'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Penfold',
  'penfold',
  'Penfold artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'penfold'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Public Acid',
  'public-acid',
  'Public Acid artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'public-acid'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Raiden',
  'raiden',
  'Raiden artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'raiden'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Reggae Roast & Gappy Ranks',
  'reggae-roast-gappy-ranks',
  'Reggae Roast & Gappy Ranks artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'reggae-roast-gappy-ranks'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Reggae Roast & Horace Andy',
  'reggae-roast-horace-andy',
  'Reggae Roast & Horace Andy artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'reggae-roast-horace-andy'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Rob Hyde',
  'rob-hyde',
  'Rob Hyde artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'rob-hyde'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Scape One',
  'scape-one',
  'Scape One artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'scape-one'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Security Footage',
  'security-footage',
  'Security Footage artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'security-footage'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Shelley Mack Band',
  'shelley-mack-band',
  'Shelley Mack Band artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'shelley-mack-band'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Shroud',
  'shroud',
  'Shroud artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'shroud'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Skyggesiden',
  'skyggesiden',
  'Skyggesiden artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'skyggesiden'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Space Baby',
  'space-baby',
  'Space Baby artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'space-baby'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Stiletto',
  'stiletto',
  'Stiletto artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'stiletto'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Stone!?',
  'stone',
  'Stone!? artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'stone'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'SUPERBITCH',
  'superbitch',
  'SUPERBITCH artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'superbitch'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Swamp',
  'swamp',
  'Swamp artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'swamp'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Tales of George',
  'tales-of-george',
  'Tales of George artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'tales-of-george'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Tau Sagittarii',
  'tau-sagittarii',
  'Tau Sagittarii artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'tau-sagittarii'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'The Catchpenny Broadcast',
  'the-catchpenny-broadcast',
  'The Catchpenny Broadcast artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'the-catchpenny-broadcast'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'The Ship Heads',
  'the-ship-heads',
  'The Ship Heads artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'the-ship-heads'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Ticklin'' The Pickle',
  'ticklin-the-pickle',
  'Ticklin'' The Pickle artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'ticklin-the-pickle'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Tom Warren, Stefan Rajic, Mike Stevenson, Nick Robert',
  'tom-warren-stefan-rajic-mike-stevenson-nick-robert',
  'Tom Warren, Stefan Rajic, Mike Stevenson, Nick Robert artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'tom-warren-stefan-rajic-mike-stevenson-nick-robert'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Trevor Nobes',
  'trevor-nobes',
  'Trevor Nobes artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'trevor-nobes'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Troll Mother',
  'troll-mother',
  'Troll Mother artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'troll-mother'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Truesounds, Jah Mirikle, Lone Ranger',
  'truesounds-jah-mirikle-lone-ranger',
  'Truesounds, Jah Mirikle, Lone Ranger artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'truesounds-jah-mirikle-lone-ranger'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Urban Swallow',
  'urban-swallow',
  'Urban Swallow artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'urban-swallow'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Violet Piper',
  'violet-piper',
  'Violet Piper artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'violet-piper'
);

INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  'Viva Los Villians',
  'viva-los-villians',
  'Viva Los Villians artist profile imported from the current station catalog.',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = 'viva-los-villians'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = '900-spaces' LIMIT 1),
  '900 Spaces',
  'A murder of crows',
  '900-spaces-a-murder-of-crows',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = '900 Spaces'
    AND title = 'A murder of crows'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = '900-spaces' LIMIT 1),
  '900 Spaces',
  'Ballerina Remixed',
  '900-spaces-ballerina-remixed',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = '900 Spaces'
    AND title = 'Ballerina Remixed'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = '900-spaces' LIMIT 1),
  '900 Spaces',
  'Sea of Tokyo',
  '900-spaces-sea-of-tokyo',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = '900 Spaces'
    AND title = 'Sea of Tokyo'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = '900-spaces' LIMIT 1),
  '900 Spaces',
  'Tamaris',
  '900-spaces-tamaris',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = '900 Spaces'
    AND title = 'Tamaris'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = '900-spaces' LIMIT 1),
  '900 Spaces',
  'This Beat Mechanical',
  '900-spaces-this-beat-mechanical',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = '900 Spaces'
    AND title = 'This Beat Mechanical'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = '900-spaces' LIMIT 1),
  '900 Spaces',
  'We remove the batteries',
  '900-spaces-we-remove-the-batteries',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = '900 Spaces'
    AND title = 'We remove the batteries'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'a-k-a' LIMIT 1),
  'A.K.A.',
  'Scary Noises',
  'a-k-a-scary-noises',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'A.K.A.'
    AND title = 'Scary Noises'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'arrival-of-the-romans' LIMIT 1),
  'Arrival of the Romans',
  'Arrival',
  'arrival-of-the-romans-arrival',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Arrival of the Romans'
    AND title = 'Arrival'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'arrival-of-the-romans' LIMIT 1),
  'Arrival of the Romans',
  'Caesar',
  'arrival-of-the-romans-caesar',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Arrival of the Romans'
    AND title = 'Caesar'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'arrival-of-the-romans' LIMIT 1),
  'Arrival of the Romans',
  'Marching',
  'arrival-of-the-romans-marching',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Arrival of the Romans'
    AND title = 'Marching'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'audio-kulture' LIMIT 1),
  'Audio Kulture',
  'Babblement',
  'audio-kulture-babblement',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Audio Kulture'
    AND title = 'Babblement'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'audio-kulture' LIMIT 1),
  'Audio Kulture',
  'Comfort Zone',
  'audio-kulture-comfort-zone',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Audio Kulture'
    AND title = 'Comfort Zone'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'audio-kulture' LIMIT 1),
  'Audio Kulture',
  'Omni Groove',
  'audio-kulture-omni-groove',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Audio Kulture'
    AND title = 'Omni Groove'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'audio-kulture' LIMIT 1),
  'Audio Kulture',
  'Tin Foil Hat',
  'audio-kulture-tin-foil-hat',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Audio Kulture'
    AND title = 'Tin Foil Hat'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-gamma' LIMIT 1),
  'Black Gamma',
  'Falling Slowly',
  'black-gamma-falling-slowly',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Gamma'
    AND title = 'Falling Slowly'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-gamma' LIMIT 1),
  'Black Gamma',
  'I Want to Believe It',
  'black-gamma-i-want-to-believe-it',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Gamma'
    AND title = 'I Want to Believe It'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-gamma' LIMIT 1),
  'Black Gamma',
  'Just to See How it Feels',
  'black-gamma-just-to-see-how-it-feels',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Gamma'
    AND title = 'Just to See How it Feels'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-gamma' LIMIT 1),
  'Black Gamma',
  'Someday',
  'black-gamma-someday',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Gamma'
    AND title = 'Someday'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-gamma' LIMIT 1),
  'Black Gamma',
  'SVAE',
  'black-gamma-svae',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Gamma'
    AND title = 'SVAE'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-mountain-college' LIMIT 1),
  'Black Mountain College',
  'All The Fears',
  'black-mountain-college-all-the-fears',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Mountain College'
    AND title = 'All The Fears'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-mountain-college' LIMIT 1),
  'Black Mountain College',
  'Bright by the Sea (Alt Version)',
  'black-mountain-college-bright-by-the-sea-alt-version',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Mountain College'
    AND title = 'Bright by the Sea (Alt Version)'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-mountain-college' LIMIT 1),
  'Black Mountain College',
  'Bright By The Sea',
  'black-mountain-college-bright-by-the-sea',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Mountain College'
    AND title = 'Bright By The Sea'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-mountain-college' LIMIT 1),
  'Black Mountain College',
  'Interiors',
  'black-mountain-college-interiors',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Mountain College'
    AND title = 'Interiors'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-mountain-college' LIMIT 1),
  'Black Mountain College',
  'Lightning',
  'black-mountain-college-lightning',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Mountain College'
    AND title = 'Lightning'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-mountain-college' LIMIT 1),
  'Black Mountain College',
  'Marked Lands',
  'black-mountain-college-marked-lands',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Mountain College'
    AND title = 'Marked Lands'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-mountain-college' LIMIT 1),
  'Black Mountain College',
  'Mountains',
  'black-mountain-college-mountains',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Mountain College'
    AND title = 'Mountains'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-mountain-college' LIMIT 1),
  'Black Mountain College',
  'The Introduction',
  'black-mountain-college-the-introduction',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Mountain College'
    AND title = 'The Introduction'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-mountain-college' LIMIT 1),
  'Black Mountain College',
  'View',
  'black-mountain-college-view',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Mountain College'
    AND title = 'View'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-star' LIMIT 1),
  'Black Star',
  'My favorite band',
  'black-star-my-favorite-band',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Star'
    AND title = 'My favorite band'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-star' LIMIT 1),
  'Black Star',
  'So be it',
  'black-star-so-be-it',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Star'
    AND title = 'So be it'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'black-star' LIMIT 1),
  'Black Star',
  'Supreme alchemy',
  'black-star-supreme-alchemy',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Black Star'
    AND title = 'Supreme alchemy'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'bolzenschuss' LIMIT 1),
  'Bolzenschuss',
  'Can''t Get You out of my Head',
  'bolzenschuss-can-t-get-you-out-of-my-head',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Bolzenschuss'
    AND title = 'Can''t Get You out of my Head'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'bolzenschuss' LIMIT 1),
  'Bolzenschuss',
  'Follow The Herd',
  'bolzenschuss-follow-the-herd',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Bolzenschuss'
    AND title = 'Follow The Herd'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'bolzenschuss' LIMIT 1),
  'Bolzenschuss',
  'Live Laugh Love',
  'bolzenschuss-live-laugh-love',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Bolzenschuss'
    AND title = 'Live Laugh Love'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'bolzenschuss' LIMIT 1),
  'Bolzenschuss',
  'Rot',
  'bolzenschuss-rot',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Bolzenschuss'
    AND title = 'Rot'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'britonica' LIMIT 1),
  'Britonica',
  'Henry',
  'britonica-henry',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Britonica'
    AND title = 'Henry'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'britonica' LIMIT 1),
  'Britonica',
  'Kings of melody',
  'britonica-kings-of-melody',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Britonica'
    AND title = 'Kings of melody'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'britonica' LIMIT 1),
  'Britonica',
  'She is sunrise',
  'britonica-she-is-sunrise',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Britonica'
    AND title = 'She is sunrise'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'britonica' LIMIT 1),
  'Britonica',
  'Strange feeling',
  'britonica-strange-feeling',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Britonica'
    AND title = 'Strange feeling'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'britonica' LIMIT 1),
  'Britonica',
  'Universal',
  'britonica-universal',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Britonica'
    AND title = 'Universal'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'britonica' LIMIT 1),
  'Britonica',
  'Women and whisky',
  'britonica-women-and-whisky',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Britonica'
    AND title = 'Women and whisky'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'caustic-visions' LIMIT 1),
  'Caustic Visions',
  '313 by Tom Spragg',
  'caustic-visions-313-by-tom-spragg',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Caustic Visions'
    AND title = '313 by Tom Spragg'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'caustic-visions' LIMIT 1),
  'Caustic Visions',
  'Cycle by Tom Spragg',
  'caustic-visions-cycle-by-tom-spragg',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Caustic Visions'
    AND title = 'Cycle by Tom Spragg'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'caustic-visions' LIMIT 1),
  'Caustic Visions',
  'ISODRUM by Timothy Evans',
  'caustic-visions-isodrum-by-timothy-evans',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Caustic Visions'
    AND title = 'ISODRUM by Timothy Evans'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'caustic-visions' LIMIT 1),
  'Caustic Visions',
  'juxtaposition by Tom Spragg',
  'caustic-visions-juxtaposition-by-tom-spragg',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Caustic Visions'
    AND title = 'juxtaposition by Tom Spragg'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'caustic-visions' LIMIT 1),
  'Caustic Visions',
  'Mars sunrise',
  'caustic-visions-mars-sunrise',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Caustic Visions'
    AND title = 'Mars sunrise'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'caustic-visions' LIMIT 1),
  'Caustic Visions',
  'perception by Caustic Visions',
  'caustic-visions-perception-by-caustic-visions',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Caustic Visions'
    AND title = 'perception by Caustic Visions'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'caustic-visions' LIMIT 1),
  'Caustic Visions',
  'symmetry of time by Tom Spragg',
  'caustic-visions-symmetry-of-time-by-tom-spragg',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Caustic Visions'
    AND title = 'symmetry of time by Tom Spragg'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'censor' LIMIT 1),
  'Censor',
  'Blue jazz',
  'censor-blue-jazz',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Censor'
    AND title = 'Blue jazz'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'collyde' LIMIT 1),
  'COLLyde',
  'Finally For Now',
  'collyde-finally-for-now',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'COLLyde'
    AND title = 'Finally For Now'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'collyde' LIMIT 1),
  'COLLyde',
  'Killing Me',
  'collyde-killing-me',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'COLLyde'
    AND title = 'Killing Me'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'collyde' LIMIT 1),
  'COLLyde',
  'Radio Down',
  'collyde-radio-down',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'COLLyde'
    AND title = 'Radio Down'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'collyde' LIMIT 1),
  'COLLyde',
  'Success',
  'collyde-success',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'COLLyde'
    AND title = 'Success'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'core-of-io' LIMIT 1),
  'Core of io',
  'Done',
  'core-of-io-done',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Core of io'
    AND title = 'Done'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'core-of-io' LIMIT 1),
  'Core of io',
  'Four Years Later',
  'core-of-io-four-years-later',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Core of io'
    AND title = 'Four Years Later'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'core-of-io' LIMIT 1),
  'Core of io',
  'Leave',
  'core-of-io-leave',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Core of io'
    AND title = 'Leave'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'core-of-io' LIMIT 1),
  'Core of io',
  'Things I Should Have Said',
  'core-of-io-things-i-should-have-said',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Core of io'
    AND title = 'Things I Should Have Said'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'core-of-io' LIMIT 1),
  'Core of io',
  'You Got This',
  'core-of-io-you-got-this',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Core of io'
    AND title = 'You Got This'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'dancehall' LIMIT 1),
  'DANCEHALL',
  '96',
  'dancehall-96',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'DANCEHALL'
    AND title = '96'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'dancehall' LIMIT 1),
  'DANCEHALL',
  'Drugs',
  'dancehall-drugs',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'DANCEHALL'
    AND title = 'Drugs'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'dancehall' LIMIT 1),
  'DANCEHALL',
  'KO',
  'dancehall-ko',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'DANCEHALL'
    AND title = 'KO'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'dancehall' LIMIT 1),
  'DANCEHALL',
  'Vitamins',
  'dancehall-vitamins',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'DANCEHALL'
    AND title = 'Vitamins'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'deponi' LIMIT 1),
  'Deponi',
  'Angrip!',
  'deponi-angrip',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Deponi'
    AND title = 'Angrip!'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'deponi' LIMIT 1),
  'Deponi',
  'Eg hate måker',
  'deponi-eg-hate-m-ker',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Deponi'
    AND title = 'Eg hate måker'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'deponi' LIMIT 1),
  'Deponi',
  'Hærverk',
  'deponi-h-rverk',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Deponi'
    AND title = 'Hærverk'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'deponi' LIMIT 1),
  'Deponi',
  'Sensur',
  'deponi-sensur',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Deponi'
    AND title = 'Sensur'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'deponi' LIMIT 1),
  'Deponi',
  'Uteliggeren',
  'deponi-uteliggeren',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Deponi'
    AND title = 'Uteliggeren'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'deponi' LIMIT 1),
  'Deponi',
  'Uventet Angrep',
  'deponi-uventet-angrep',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Deponi'
    AND title = 'Uventet Angrep'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'designated-moshers-unit' LIMIT 1),
  'Designated Moshers Unit',
  'ANIMOSITY',
  'designated-moshers-unit-animosity',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Designated Moshers Unit'
    AND title = 'ANIMOSITY'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'designated-moshers-unit' LIMIT 1),
  'Designated Moshers Unit',
  'BLOODBEAT',
  'designated-moshers-unit-bloodbeat',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Designated Moshers Unit'
    AND title = 'BLOODBEAT'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'designated-moshers-unit' LIMIT 1),
  'Designated Moshers Unit',
  'NEVER COME BACK',
  'designated-moshers-unit-never-come-back',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Designated Moshers Unit'
    AND title = 'NEVER COME BACK'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'dirty-noiz-alex-holmes' LIMIT 1),
  'Dirty Noiz/Alex Holmes',
  'Papa',
  'dirty-noiz-alex-holmes-papa',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Dirty Noiz/Alex Holmes'
    AND title = 'Papa'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'disco-assassins' LIMIT 1),
  'Disco Assassins',
  'Mind Technology',
  'disco-assassins-mind-technology',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Disco Assassins'
    AND title = 'Mind Technology'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'dj-prosper-vs-disco-assassins' LIMIT 1),
  'DJ Prosper vs Disco Assassins',
  'Defiance',
  'dj-prosper-vs-disco-assassins-defiance',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'DJ Prosper vs Disco Assassins'
    AND title = 'Defiance'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'dj-prosper-vs-disco-assassins' LIMIT 1),
  'DJ Prosper vs Disco Assassins',
  'Venom Rising',
  'dj-prosper-vs-disco-assassins-venom-rising',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'DJ Prosper vs Disco Assassins'
    AND title = 'Venom Rising'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'drone-in-the-woods' LIMIT 1),
  'Drone in the Woods',
  'Dawn Chorus',
  'drone-in-the-woods-dawn-chorus',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Drone in the Woods'
    AND title = 'Dawn Chorus'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'drone-in-the-woods' LIMIT 1),
  'Drone in the Woods',
  'Spider Forest',
  'drone-in-the-woods-spider-forest',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Drone in the Woods'
    AND title = 'Spider Forest'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'drone-in-the-woods' LIMIT 1),
  'Drone in the Woods',
  'The Light Through The Trees',
  'drone-in-the-woods-the-light-through-the-trees',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Drone in the Woods'
    AND title = 'The Light Through The Trees'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'emmay' LIMIT 1),
  'Emmay',
  'Anymore',
  'emmay-anymore',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Emmay'
    AND title = 'Anymore'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'emmay' LIMIT 1),
  'Emmay',
  'One of Them',
  'emmay-one-of-them',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Emmay'
    AND title = 'One of Them'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'emmay' LIMIT 1),
  'Emmay',
  'Paper',
  'emmay-paper',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Emmay'
    AND title = 'Paper'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'emmay' LIMIT 1),
  'Emmay',
  'Playback',
  'emmay-playback',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Emmay'
    AND title = 'Playback'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'A Fire',
  'grzzly-a-fire',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'A Fire'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'Advert for a daydream',
  'grzzly-advert-for-a-daydream',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'Advert for a daydream'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'Being tapped by the US Gov',
  'grzzly-being-tapped-by-the-us-gov',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'Being tapped by the US Gov'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'Bikini Woman',
  'grzzly-bikini-woman',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'Bikini Woman'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'China boy',
  'grzzly-china-boy',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'China boy'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'Clement',
  'grzzly-clement',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'Clement'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'Gonzalez',
  'grzzly-gonzalez',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'Gonzalez'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'Grrr',
  'grzzly-grrr',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'Grrr'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'How to have fun',
  'grzzly-how-to-have-fun',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'How to have fun'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'Intermission',
  'grzzly-intermission',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'Intermission'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'Its Not that Im a Sad Man',
  'grzzly-its-not-that-im-a-sad-man',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'Its Not that Im a Sad Man'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'Paisley',
  'grzzly-paisley',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'Paisley'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'Reprise',
  'grzzly-reprise',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'Reprise'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'Sonny Boy',
  'grzzly-sonny-boy',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'Sonny Boy'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'The end',
  'grzzly-the-end',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'The end'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'Water shortage',
  'grzzly-water-shortage',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'Water shortage'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'grzzly' LIMIT 1),
  'Grzzly',
  'Winter wonderland',
  'grzzly-winter-wonderland',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Grzzly'
    AND title = 'Winter wonderland'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'hellrazor' LIMIT 1),
  'Hellrazor',
  'Dark Places',
  'hellrazor-dark-places',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Hellrazor'
    AND title = 'Dark Places'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'hellrazor' LIMIT 1),
  'Hellrazor',
  'Unfinished business',
  'hellrazor-unfinished-business',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Hellrazor'
    AND title = 'Unfinished business'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'i-am-jack' LIMIT 1),
  'I Am Jack',
  'Atmosphere',
  'i-am-jack-atmosphere',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'I Am Jack'
    AND title = 'Atmosphere'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'i-am-jack' LIMIT 1),
  'I Am Jack',
  'B-Movie',
  'i-am-jack-b-movie',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'I Am Jack'
    AND title = 'B-Movie'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'i-am-jack' LIMIT 1),
  'I Am Jack',
  'Earache',
  'i-am-jack-earache',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'I Am Jack'
    AND title = 'Earache'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'i-am-jack' LIMIT 1),
  'I Am Jack',
  'Found My Silence',
  'i-am-jack-found-my-silence',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'I Am Jack'
    AND title = 'Found My Silence'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'i-am-jack' LIMIT 1),
  'I Am Jack',
  'Killa Bees',
  'i-am-jack-killa-bees',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'I Am Jack'
    AND title = 'Killa Bees'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'i-am-jack' LIMIT 1),
  'I Am Jack',
  'Mamajama',
  'i-am-jack-mamajama',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'I Am Jack'
    AND title = 'Mamajama'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'i-am-jack' LIMIT 1),
  'I Am Jack',
  'Ocean Eyes',
  'i-am-jack-ocean-eyes',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'I Am Jack'
    AND title = 'Ocean Eyes'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'i-am-jack' LIMIT 1),
  'I Am Jack',
  'Playing In the cold',
  'i-am-jack-playing-in-the-cold',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'I Am Jack'
    AND title = 'Playing In the cold'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'i-am-jack' LIMIT 1),
  'I Am Jack',
  'Prophet Lullaby',
  'i-am-jack-prophet-lullaby',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'I Am Jack'
    AND title = 'Prophet Lullaby'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'i-am-jack' LIMIT 1),
  'I Am Jack',
  'Space Invaders',
  'i-am-jack-space-invaders',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'I Am Jack'
    AND title = 'Space Invaders'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'i-am-jack' LIMIT 1),
  'I Am Jack',
  'The Vincent Song',
  'i-am-jack-the-vincent-song',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'I Am Jack'
    AND title = 'The Vincent Song'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'idesyne' LIMIT 1),
  'Idesyne',
  'Cubism',
  'idesyne-cubism',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Idesyne'
    AND title = 'Cubism'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'idesyne' LIMIT 1),
  'Idesyne',
  'Simplified Arabic',
  'idesyne-simplified-arabic',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Idesyne'
    AND title = 'Simplified Arabic'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'idesyne' LIMIT 1),
  'Idesyne',
  'Until I Burn',
  'idesyne-until-i-burn',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Idesyne'
    AND title = 'Until I Burn'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'indigo-sun' LIMIT 1),
  'Indigo Sun',
  'Spaced Out Refugee',
  'indigo-sun-spaced-out-refugee',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Indigo Sun'
    AND title = 'Spaced Out Refugee'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'infinite-spark' LIMIT 1),
  'Infinite Spark',
  'Family Tree',
  'infinite-spark-family-tree',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Infinite Spark'
    AND title = 'Family Tree'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ivan-hays' LIMIT 1),
  'Ivan Hays',
  'Blumagik',
  'ivan-hays-blumagik',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ivan Hays'
    AND title = 'Blumagik'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ivan-hays' LIMIT 1),
  'Ivan Hays',
  'Goodnight',
  'ivan-hays-goodnight',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ivan Hays'
    AND title = 'Goodnight'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ivan-hays' LIMIT 1),
  'Ivan Hays',
  'Headlights',
  'ivan-hays-headlights',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ivan Hays'
    AND title = 'Headlights'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ivan-hays' LIMIT 1),
  'Ivan Hays',
  'I''ll Wait',
  'ivan-hays-i-ll-wait',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ivan Hays'
    AND title = 'I''ll Wait'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ivan-hays' LIMIT 1),
  'Ivan Hays',
  'The 1',
  'ivan-hays-the-1',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ivan Hays'
    AND title = 'The 1'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ivan-hays' LIMIT 1),
  'Ivan Hays',
  'Touch The Sky',
  'ivan-hays-touch-the-sky',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ivan Hays'
    AND title = 'Touch The Sky'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ken-k' LIMIT 1),
  'Ken K',
  'Lost Lyrics ft Jaydar',
  'ken-k-lost-lyrics-ft-jaydar',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ken K'
    AND title = 'Lost Lyrics ft Jaydar'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ken-k' LIMIT 1),
  'Ken K',
  'Nas is Like',
  'ken-k-nas-is-like',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ken K'
    AND title = 'Nas is Like'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ken-k' LIMIT 1),
  'Ken K',
  'Pass it round',
  'ken-k-pass-it-round',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ken K'
    AND title = 'Pass it round'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ken-k' LIMIT 1),
  'Ken K',
  'Reuben x Ken K - Affirmations',
  'ken-k-reuben-x-ken-k-affirmations',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ken K'
    AND title = 'Reuben x Ken K - Affirmations'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'last-days-of-lorca' LIMIT 1),
  'Last Days Of Lorca',
  'As Flies Fly',
  'last-days-of-lorca-as-flies-fly',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Last Days Of Lorca'
    AND title = 'As Flies Fly'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'last-days-of-lorca' LIMIT 1),
  'Last Days Of Lorca',
  'I am Rat',
  'last-days-of-lorca-i-am-rat',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Last Days Of Lorca'
    AND title = 'I am Rat'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'last-days-of-lorca' LIMIT 1),
  'Last Days Of Lorca',
  'My Militia Will Eat Your Militia',
  'last-days-of-lorca-my-militia-will-eat-your-militia',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Last Days Of Lorca'
    AND title = 'My Militia Will Eat Your Militia'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'last-days-of-lorca' LIMIT 1),
  'Last Days Of Lorca',
  'Warma Art',
  'last-days-of-lorca-warma-art',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Last Days Of Lorca'
    AND title = 'Warma Art'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'little-treasure-allstars' LIMIT 1),
  'LITTLE TREASURE ALLSTARS',
  'ADULT WEEKEND',
  'little-treasure-allstars-adult-weekend',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'LITTLE TREASURE ALLSTARS'
    AND title = 'ADULT WEEKEND'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'little-treasure-allstars' LIMIT 1),
  'LITTLE TREASURE ALLSTARS',
  'HOLEY DRIVER',
  'little-treasure-allstars-holey-driver',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'LITTLE TREASURE ALLSTARS'
    AND title = 'HOLEY DRIVER'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'little-treasure-allstars' LIMIT 1),
  'LITTLE TREASURE ALLSTARS',
  'JEREMY KYLE',
  'little-treasure-allstars-jeremy-kyle',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'LITTLE TREASURE ALLSTARS'
    AND title = 'JEREMY KYLE'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'little-treasure-allstars' LIMIT 1),
  'LITTLE TREASURE ALLSTARS',
  'RAZZLE DAZZLE',
  'little-treasure-allstars-razzle-dazzle',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'LITTLE TREASURE ALLSTARS'
    AND title = 'RAZZLE DAZZLE'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'little-treasure-allstars' LIMIT 1),
  'LITTLE TREASURE ALLSTARS',
  'SUPER SELECTIVE',
  'little-treasure-allstars-super-selective',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'LITTLE TREASURE ALLSTARS'
    AND title = 'SUPER SELECTIVE'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'lost-legion' LIMIT 1),
  'Lost Legion',
  'Bridging Electricity',
  'lost-legion-bridging-electricity',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Lost Legion'
    AND title = 'Bridging Electricity'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'lost-legion' LIMIT 1),
  'Lost Legion',
  'The Game',
  'lost-legion-the-game',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Lost Legion'
    AND title = 'The Game'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'mark-allister' LIMIT 1),
  'Mark Allister',
  'The Path',
  'mark-allister-the-path',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Mark Allister'
    AND title = 'The Path'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'mask-of-judas' LIMIT 1),
  'Mask of Judas',
  'Alive',
  'mask-of-judas-alive',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Mask of Judas'
    AND title = 'Alive'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'mask-of-judas' LIMIT 1),
  'Mask of Judas',
  'Ashground.',
  'mask-of-judas-ashground',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Mask of Judas'
    AND title = 'Ashground.'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'mask-of-judas' LIMIT 1),
  'Mask of Judas',
  'Forsaken',
  'mask-of-judas-forsaken',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Mask of Judas'
    AND title = 'Forsaken'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'mask-of-judas' LIMIT 1),
  'Mask of Judas',
  'Late Night Burnings',
  'mask-of-judas-late-night-burnings',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Mask of Judas'
    AND title = 'Late Night Burnings'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'mask-of-judas' LIMIT 1),
  'Mask of Judas',
  'The Conspirator',
  'mask-of-judas-the-conspirator',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Mask of Judas'
    AND title = 'The Conspirator'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'matt-argle-band' LIMIT 1),
  'Matt Argle Band',
  'Decyphering The Code',
  'matt-argle-band-decyphering-the-code',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Matt Argle Band'
    AND title = 'Decyphering The Code'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'matt-argle-band' LIMIT 1),
  'Matt Argle Band',
  'Drown',
  'matt-argle-band-drown',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Matt Argle Band'
    AND title = 'Drown'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'matt-argle-band' LIMIT 1),
  'Matt Argle Band',
  'Mexico',
  'matt-argle-band-mexico',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Matt Argle Band'
    AND title = 'Mexico'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'matt-argle-band' LIMIT 1),
  'Matt Argle Band',
  'On The Edge',
  'matt-argle-band-on-the-edge',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Matt Argle Band'
    AND title = 'On The Edge'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'matt-argle-band' LIMIT 1),
  'Matt Argle Band',
  'Snow Angels',
  'matt-argle-band-snow-angels',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Matt Argle Band'
    AND title = 'Snow Angels'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'muskoka' LIMIT 1),
  'Muskoka',
  'Duet',
  'muskoka-duet',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Muskoka'
    AND title = 'Duet'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'n-o' LIMIT 1),
  'NÃO',
  '1964 - Abismo',
  'n-o-1964-abismo',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'NÃO'
    AND title = '1964 - Abismo'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'n-o' LIMIT 1),
  'NÃO',
  'Crime Nuclear',
  'n-o-crime-nuclear',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'NÃO'
    AND title = 'Crime Nuclear'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'n-o' LIMIT 1),
  'NÃO',
  'Futuro',
  'n-o-futuro',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'NÃO'
    AND title = 'Futuro'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'n-o' LIMIT 1),
  'NÃO',
  'Medo.',
  'n-o-medo',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'NÃO'
    AND title = 'Medo.'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'n-o' LIMIT 1),
  'NÃO',
  'Redução de danos.',
  'n-o-redu-o-de-danos',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'NÃO'
    AND title = 'Redução de danos.'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'n-o' LIMIT 1),
  'NÃO',
  'Reflexo',
  'n-o-reflexo',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'NÃO'
    AND title = 'Reflexo'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'nectar-international' LIMIT 1),
  'Nectar International',
  '01',
  'nectar-international-01',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Nectar International'
    AND title = '01'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'nectar-international' LIMIT 1),
  'Nectar International',
  '02',
  'nectar-international-02',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Nectar International'
    AND title = '02'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'nectar-international' LIMIT 1),
  'Nectar International',
  '03',
  'nectar-international-03',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Nectar International'
    AND title = '03'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'nectar-international' LIMIT 1),
  'Nectar International',
  '04',
  'nectar-international-04',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Nectar International'
    AND title = '04'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'nectar-international' LIMIT 1),
  'Nectar International',
  '05',
  'nectar-international-05',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Nectar International'
    AND title = '05'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'nectar-international' LIMIT 1),
  'Nectar International',
  '06',
  'nectar-international-06',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Nectar International'
    AND title = '06'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'nectar-international' LIMIT 1),
  'Nectar International',
  'Track 01',
  'nectar-international-track-01',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Nectar International'
    AND title = 'Track 01'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'nectar-international' LIMIT 1),
  'Nectar International',
  'Track 02',
  'nectar-international-track-02',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Nectar International'
    AND title = 'Track 02'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'new-tropics' LIMIT 1),
  'New Tropics',
  'Swan Song',
  'new-tropics-swan-song',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'New Tropics'
    AND title = 'Swan Song'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'no-humans' LIMIT 1),
  'No Humans',
  'Last Laugh',
  'no-humans-last-laugh',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'No Humans'
    AND title = 'Last Laugh'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'no-humans' LIMIT 1),
  'No Humans',
  'Mutiny',
  'no-humans-mutiny',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'No Humans'
    AND title = 'Mutiny'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'no-humans' LIMIT 1),
  'No Humans',
  'Options',
  'no-humans-options',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'No Humans'
    AND title = 'Options'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'no-humans' LIMIT 1),
  'No Humans',
  'Parody',
  'no-humans-parody',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'No Humans'
    AND title = 'Parody'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'no-humans' LIMIT 1),
  'No Humans',
  'Punks For Profit',
  'no-humans-punks-for-profit',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'No Humans'
    AND title = 'Punks For Profit'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'noah-s-house-band' LIMIT 1),
  'Noah''s House Band',
  'DODO',
  'noah-s-house-band-dodo',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Noah''s House Band'
    AND title = 'DODO'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'noah-s-house-band' LIMIT 1),
  'Noah''s House Band',
  'HORSE',
  'noah-s-house-band-horse',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Noah''s House Band'
    AND title = 'HORSE'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ornaments-of-the-countryside' LIMIT 1),
  'Ornaments of the Countryside',
  '360',
  'ornaments-of-the-countryside-360',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ornaments of the Countryside'
    AND title = '360'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ornaments-of-the-countryside' LIMIT 1),
  'Ornaments of the Countryside',
  'After Thought',
  'ornaments-of-the-countryside-after-thought',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ornaments of the Countryside'
    AND title = 'After Thought'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ornaments-of-the-countryside' LIMIT 1),
  'Ornaments of the Countryside',
  'Black Clouds',
  'ornaments-of-the-countryside-black-clouds',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ornaments of the Countryside'
    AND title = 'Black Clouds'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ornaments-of-the-countryside' LIMIT 1),
  'Ornaments of the Countryside',
  'Eh?',
  'ornaments-of-the-countryside-eh',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ornaments of the Countryside'
    AND title = 'Eh?'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ornaments-of-the-countryside' LIMIT 1),
  'Ornaments of the Countryside',
  'F.O.E',
  'ornaments-of-the-countryside-f-o-e',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ornaments of the Countryside'
    AND title = 'F.O.E'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ornaments-of-the-countryside' LIMIT 1),
  'Ornaments of the Countryside',
  'Hashtag',
  'ornaments-of-the-countryside-hashtag',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ornaments of the Countryside'
    AND title = 'Hashtag'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ornaments-of-the-countryside' LIMIT 1),
  'Ornaments of the Countryside',
  'Nightmaringale',
  'ornaments-of-the-countryside-nightmaringale',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ornaments of the Countryside'
    AND title = 'Nightmaringale'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ornaments-of-the-countryside' LIMIT 1),
  'Ornaments of the Countryside',
  'Oxbow Lakes',
  'ornaments-of-the-countryside-oxbow-lakes',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ornaments of the Countryside'
    AND title = 'Oxbow Lakes'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ornaments-of-the-countryside' LIMIT 1),
  'Ornaments of the Countryside',
  'Somg',
  'ornaments-of-the-countryside-somg',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ornaments of the Countryside'
    AND title = 'Somg'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ornaments-of-the-countryside' LIMIT 1),
  'Ornaments of the Countryside',
  'Springtime',
  'ornaments-of-the-countryside-springtime',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ornaments of the Countryside'
    AND title = 'Springtime'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ornaments-of-the-countryside' LIMIT 1),
  'Ornaments of the Countryside',
  'Still Life',
  'ornaments-of-the-countryside-still-life',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ornaments of the Countryside'
    AND title = 'Still Life'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'penfold' LIMIT 1),
  'Penfold',
  'Airtight',
  'penfold-airtight',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Penfold'
    AND title = 'Airtight'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'penfold' LIMIT 1),
  'Penfold',
  'Play it for Screams',
  'penfold-play-it-for-screams',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Penfold'
    AND title = 'Play it for Screams'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'penfold' LIMIT 1),
  'Penfold',
  'Purification',
  'penfold-purification',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Penfold'
    AND title = 'Purification'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'penfold' LIMIT 1),
  'Penfold',
  'While you Sleep',
  'penfold-while-you-sleep',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Penfold'
    AND title = 'While you Sleep'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'public-acid' LIMIT 1),
  'Public Acid',
  'Confession',
  'public-acid-confession',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Public Acid'
    AND title = 'Confession'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'public-acid' LIMIT 1),
  'Public Acid',
  'Deadly Struggle',
  'public-acid-deadly-struggle',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Public Acid'
    AND title = 'Deadly Struggle'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'public-acid' LIMIT 1),
  'Public Acid',
  'End of Pain',
  'public-acid-end-of-pain',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Public Acid'
    AND title = 'End of Pain'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'public-acid' LIMIT 1),
  'Public Acid',
  'Ignorance',
  'public-acid-ignorance',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Public Acid'
    AND title = 'Ignorance'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'public-acid' LIMIT 1),
  'Public Acid',
  'Slow Bleed',
  'public-acid-slow-bleed',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Public Acid'
    AND title = 'Slow Bleed'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'raiden' LIMIT 1),
  'Raiden',
  '657',
  'raiden-657',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Raiden'
    AND title = '657'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'raiden' LIMIT 1),
  'Raiden',
  'Baptism Of Fire (First Version)',
  'raiden-baptism-of-fire-first-version',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Raiden'
    AND title = 'Baptism Of Fire (First Version)'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'raiden' LIMIT 1),
  'Raiden',
  'Celexa',
  'raiden-celexa',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Raiden'
    AND title = 'Celexa'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'raiden' LIMIT 1),
  'Raiden',
  'Rust',
  'raiden-rust',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Raiden'
    AND title = 'Rust'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'reggae-roast-gappy-ranks' LIMIT 1),
  'Reggae Roast & Gappy Ranks',
  'My Selecta',
  'reggae-roast-gappy-ranks-my-selecta',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Reggae Roast & Gappy Ranks'
    AND title = 'My Selecta'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'reggae-roast-horace-andy' LIMIT 1),
  'Reggae Roast & Horace Andy',
  'Lets Live In Love',
  'reggae-roast-horace-andy-lets-live-in-love',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Reggae Roast & Horace Andy'
    AND title = 'Lets Live In Love'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'rob-hyde' LIMIT 1),
  'Rob Hyde',
  'Old Bones (feat Oliver Rees)',
  'rob-hyde-old-bones-feat-oliver-rees',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Rob Hyde'
    AND title = 'Old Bones (feat Oliver Rees)'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'scape-one' LIMIT 1),
  'Scape One',
  'Hold It Back',
  'scape-one-hold-it-back',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Scape One'
    AND title = 'Hold It Back'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'scape-one' LIMIT 1),
  'Scape One',
  'Timelapse',
  'scape-one-timelapse',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Scape One'
    AND title = 'Timelapse'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'security-footage' LIMIT 1),
  'Security Footage',
  'IDEATION',
  'security-footage-ideation',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Security Footage'
    AND title = 'IDEATION'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'security-footage' LIMIT 1),
  'Security Footage',
  'LEAVE',
  'security-footage-leave',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Security Footage'
    AND title = 'LEAVE'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'security-footage' LIMIT 1),
  'Security Footage',
  'OUTSIDE THE WINDOW',
  'security-footage-outside-the-window',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Security Footage'
    AND title = 'OUTSIDE THE WINDOW'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'security-footage' LIMIT 1),
  'Security Footage',
  'SECURITY FOOTAGE II',
  'security-footage-security-footage-ii',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Security Footage'
    AND title = 'SECURITY FOOTAGE II'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'security-footage' LIMIT 1),
  'Security Footage',
  'THE CHASE',
  'security-footage-the-chase',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Security Footage'
    AND title = 'THE CHASE'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'shelley-mack-band' LIMIT 1),
  'Shelley Mack Band',
  'Ancient Artefacts',
  'shelley-mack-band-ancient-artefacts',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Shelley Mack Band'
    AND title = 'Ancient Artefacts'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'shelley-mack-band' LIMIT 1),
  'Shelley Mack Band',
  'Funk For Frank (Ill Boogs)',
  'shelley-mack-band-funk-for-frank-ill-boogs',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Shelley Mack Band'
    AND title = 'Funk For Frank (Ill Boogs)'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'shelley-mack-band' LIMIT 1),
  'Shelley Mack Band',
  'Funky Ghost Train',
  'shelley-mack-band-funky-ghost-train',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Shelley Mack Band'
    AND title = 'Funky Ghost Train'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'shelley-mack-band' LIMIT 1),
  'Shelley Mack Band',
  'Pot Belly (Ill Boogs)',
  'shelley-mack-band-pot-belly-ill-boogs',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Shelley Mack Band'
    AND title = 'Pot Belly (Ill Boogs)'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'shelley-mack-band' LIMIT 1),
  'Shelley Mack Band',
  'Rockin'' Feels',
  'shelley-mack-band-rockin-feels',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Shelley Mack Band'
    AND title = 'Rockin'' Feels'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'shelley-mack-band' LIMIT 1),
  'Shelley Mack Band',
  'Song Of The Siren (feat. Sam Chara)',
  'shelley-mack-band-song-of-the-siren-feat-sam-chara',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Shelley Mack Band'
    AND title = 'Song Of The Siren (feat. Sam Chara)'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'shelley-mack-band' LIMIT 1),
  'Shelley Mack Band',
  'The Chugger',
  'shelley-mack-band-the-chugger',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Shelley Mack Band'
    AND title = 'The Chugger'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'shroud' LIMIT 1),
  'Shroud',
  'Committed to Violence',
  'shroud-committed-to-violence',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Shroud'
    AND title = 'Committed to Violence'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'shroud' LIMIT 1),
  'Shroud',
  'This Will Define You',
  'shroud-this-will-define-you',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Shroud'
    AND title = 'This Will Define You'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'shroud' LIMIT 1),
  'Shroud',
  'Under the Fallen Sun',
  'shroud-under-the-fallen-sun',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Shroud'
    AND title = 'Under the Fallen Sun'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'shroud' LIMIT 1),
  'Shroud',
  'Weighed Down by the Flesh',
  'shroud-weighed-down-by-the-flesh',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Shroud'
    AND title = 'Weighed Down by the Flesh'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'skyggesiden' LIMIT 1),
  'Skyggesiden',
  'Bruan Brenn',
  'skyggesiden-bruan-brenn',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Skyggesiden'
    AND title = 'Bruan Brenn'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'skyggesiden' LIMIT 1),
  'Skyggesiden',
  'Fasaden Faller',
  'skyggesiden-fasaden-faller',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Skyggesiden'
    AND title = 'Fasaden Faller'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'skyggesiden' LIMIT 1),
  'Skyggesiden',
  'Frihet Koste Penga',
  'skyggesiden-frihet-koste-penga',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Skyggesiden'
    AND title = 'Frihet Koste Penga'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'skyggesiden' LIMIT 1),
  'Skyggesiden',
  'Krigsmaskina',
  'skyggesiden-krigsmaskina',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Skyggesiden'
    AND title = 'Krigsmaskina'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'skyggesiden' LIMIT 1),
  'Skyggesiden',
  'Nervevrak',
  'skyggesiden-nervevrak',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Skyggesiden'
    AND title = 'Nervevrak'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'skyggesiden' LIMIT 1),
  'Skyggesiden',
  'Teppefall',
  'skyggesiden-teppefall',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Skyggesiden'
    AND title = 'Teppefall'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'space-baby' LIMIT 1),
  'Space Baby',
  'Fuctifino',
  'space-baby-fuctifino',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Space Baby'
    AND title = 'Fuctifino'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'stiletto' LIMIT 1),
  'Stiletto',
  'Control',
  'stiletto-control',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Stiletto'
    AND title = 'Control'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'stiletto' LIMIT 1),
  'Stiletto',
  'Dehumanized',
  'stiletto-dehumanized',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Stiletto'
    AND title = 'Dehumanized'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'stiletto' LIMIT 1),
  'Stiletto',
  'No Longer I Stand',
  'stiletto-no-longer-i-stand',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Stiletto'
    AND title = 'No Longer I Stand'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'stiletto' LIMIT 1),
  'Stiletto',
  'Only Death',
  'stiletto-only-death',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Stiletto'
    AND title = 'Only Death'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'stiletto' LIMIT 1),
  'Stiletto',
  'Unmoveable Weight',
  'stiletto-unmoveable-weight',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Stiletto'
    AND title = 'Unmoveable Weight'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'stone' LIMIT 1),
  'Stone!?',
  'Frock',
  'stone-frock',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Stone!?'
    AND title = 'Frock'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'stone' LIMIT 1),
  'Stone!?',
  'Fun Bus',
  'stone-fun-bus',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Stone!?'
    AND title = 'Fun Bus'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'stone' LIMIT 1),
  'Stone!?',
  'Jack Issues',
  'stone-jack-issues',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Stone!?'
    AND title = 'Jack Issues'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'stone' LIMIT 1),
  'Stone!?',
  'Nail It',
  'stone-nail-it',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Stone!?'
    AND title = 'Nail It'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'stone' LIMIT 1),
  'Stone!?',
  'Rob Ref',
  'stone-rob-ref',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Stone!?'
    AND title = 'Rob Ref'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'stone' LIMIT 1),
  'Stone!?',
  'Verbal',
  'stone-verbal',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Stone!?'
    AND title = 'Verbal'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'superbitch' LIMIT 1),
  'SUPERBITCH',
  'birthday',
  'superbitch-birthday',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'SUPERBITCH'
    AND title = 'birthday'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'superbitch' LIMIT 1),
  'SUPERBITCH',
  'don''t touch me',
  'superbitch-don-t-touch-me',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'SUPERBITCH'
    AND title = 'don''t touch me'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'superbitch' LIMIT 1),
  'SUPERBITCH',
  'EW!',
  'superbitch-ew',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'SUPERBITCH'
    AND title = 'EW!'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'superbitch' LIMIT 1),
  'SUPERBITCH',
  'feed me',
  'superbitch-feed-me',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'SUPERBITCH'
    AND title = 'feed me'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'superbitch' LIMIT 1),
  'SUPERBITCH',
  'one more',
  'superbitch-one-more',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'SUPERBITCH'
    AND title = 'one more'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'superbitch' LIMIT 1),
  'SUPERBITCH',
  'piss',
  'superbitch-piss',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'SUPERBITCH'
    AND title = 'piss'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'superbitch' LIMIT 1),
  'SUPERBITCH',
  'yeah',
  'superbitch-yeah',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'SUPERBITCH'
    AND title = 'yeah'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'swamp' LIMIT 1),
  'Swamp',
  'Death',
  'swamp-death',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Swamp'
    AND title = 'Death'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'swamp' LIMIT 1),
  'Swamp',
  'Suburbia is Claustrophobia',
  'swamp-suburbia-is-claustrophobia',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Swamp'
    AND title = 'Suburbia is Claustrophobia'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'swamp' LIMIT 1),
  'Swamp',
  'Wasted Youth',
  'swamp-wasted-youth',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Swamp'
    AND title = 'Wasted Youth'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'tales-of-george' LIMIT 1),
  'Tales of George',
  'Bows and Arrows',
  'tales-of-george-bows-and-arrows',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Tales of George'
    AND title = 'Bows and Arrows'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'tales-of-george' LIMIT 1),
  'Tales of George',
  'Brickwall',
  'tales-of-george-brickwall',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Tales of George'
    AND title = 'Brickwall'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'tales-of-george' LIMIT 1),
  'Tales of George',
  'Deceptive',
  'tales-of-george-deceptive',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Tales of George'
    AND title = 'Deceptive'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'tales-of-george' LIMIT 1),
  'Tales of George',
  'Give Me Peace',
  'tales-of-george-give-me-peace',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Tales of George'
    AND title = 'Give Me Peace'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'tales-of-george' LIMIT 1),
  'Tales of George',
  'In My Head',
  'tales-of-george-in-my-head',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Tales of George'
    AND title = 'In My Head'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'tales-of-george' LIMIT 1),
  'Tales of George',
  'Mr Plastic',
  'tales-of-george-mr-plastic',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Tales of George'
    AND title = 'Mr Plastic'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'tales-of-george' LIMIT 1),
  'Tales of George',
  'Red Eyes At Midnight',
  'tales-of-george-red-eyes-at-midnight',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Tales of George'
    AND title = 'Red Eyes At Midnight'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'tales-of-george' LIMIT 1),
  'Tales of George',
  'Susie',
  'tales-of-george-susie',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Tales of George'
    AND title = 'Susie'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'tau-sagittarii' LIMIT 1),
  'Tau Sagittarii',
  'Damavand',
  'tau-sagittarii-damavand',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Tau Sagittarii'
    AND title = 'Damavand'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'tau-sagittarii' LIMIT 1),
  'Tau Sagittarii',
  'Inside Outside',
  'tau-sagittarii-inside-outside',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Tau Sagittarii'
    AND title = 'Inside Outside'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'the-catchpenny-broadcast' LIMIT 1),
  'The Catchpenny Broadcast',
  'Bigger Man',
  'the-catchpenny-broadcast-bigger-man',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'The Catchpenny Broadcast'
    AND title = 'Bigger Man'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'the-catchpenny-broadcast' LIMIT 1),
  'The Catchpenny Broadcast',
  'Cougar',
  'the-catchpenny-broadcast-cougar',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'The Catchpenny Broadcast'
    AND title = 'Cougar'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'the-catchpenny-broadcast' LIMIT 1),
  'The Catchpenny Broadcast',
  'Midnight',
  'the-catchpenny-broadcast-midnight',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'The Catchpenny Broadcast'
    AND title = 'Midnight'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'the-ship-heads' LIMIT 1),
  'The Ship Heads',
  'Cutlass & Pistol',
  'the-ship-heads-cutlass-pistol',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'The Ship Heads'
    AND title = 'Cutlass & Pistol'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'the-ship-heads' LIMIT 1),
  'The Ship Heads',
  'Hipster Fruit',
  'the-ship-heads-hipster-fruit',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'The Ship Heads'
    AND title = 'Hipster Fruit'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'the-ship-heads' LIMIT 1),
  'The Ship Heads',
  'Jolly Rogered',
  'the-ship-heads-jolly-rogered',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'The Ship Heads'
    AND title = 'Jolly Rogered'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'the-ship-heads' LIMIT 1),
  'The Ship Heads',
  'Row Yer Boat',
  'the-ship-heads-row-yer-boat',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'The Ship Heads'
    AND title = 'Row Yer Boat'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'the-ship-heads' LIMIT 1),
  'The Ship Heads',
  'Shitty Deth',
  'the-ship-heads-shitty-deth',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'The Ship Heads'
    AND title = 'Shitty Deth'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ticklin-the-pickle' LIMIT 1),
  'Ticklin'' The Pickle',
  'Bound Up',
  'ticklin-the-pickle-bound-up',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ticklin'' The Pickle'
    AND title = 'Bound Up'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ticklin-the-pickle' LIMIT 1),
  'Ticklin'' The Pickle',
  'Dave''s Boogaloo',
  'ticklin-the-pickle-dave-s-boogaloo',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ticklin'' The Pickle'
    AND title = 'Dave''s Boogaloo'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ticklin-the-pickle' LIMIT 1),
  'Ticklin'' The Pickle',
  'Dirt Drops',
  'ticklin-the-pickle-dirt-drops',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ticklin'' The Pickle'
    AND title = 'Dirt Drops'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ticklin-the-pickle' LIMIT 1),
  'Ticklin'' The Pickle',
  'Dirty Hurt',
  'ticklin-the-pickle-dirty-hurt',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ticklin'' The Pickle'
    AND title = 'Dirty Hurt'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ticklin-the-pickle' LIMIT 1),
  'Ticklin'' The Pickle',
  'Do It!',
  'ticklin-the-pickle-do-it',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ticklin'' The Pickle'
    AND title = 'Do It!'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ticklin-the-pickle' LIMIT 1),
  'Ticklin'' The Pickle',
  'Ghesters Groove',
  'ticklin-the-pickle-ghesters-groove',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ticklin'' The Pickle'
    AND title = 'Ghesters Groove'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ticklin-the-pickle' LIMIT 1),
  'Ticklin'' The Pickle',
  'Give It',
  'ticklin-the-pickle-give-it',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ticklin'' The Pickle'
    AND title = 'Give It'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ticklin-the-pickle' LIMIT 1),
  'Ticklin'' The Pickle',
  'Hold On A Sec',
  'ticklin-the-pickle-hold-on-a-sec',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ticklin'' The Pickle'
    AND title = 'Hold On A Sec'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ticklin-the-pickle' LIMIT 1),
  'Ticklin'' The Pickle',
  'K.O.F.',
  'ticklin-the-pickle-k-o-f',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ticklin'' The Pickle'
    AND title = 'K.O.F.'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ticklin-the-pickle' LIMIT 1),
  'Ticklin'' The Pickle',
  'The Duck',
  'ticklin-the-pickle-the-duck',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ticklin'' The Pickle'
    AND title = 'The Duck'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ticklin-the-pickle' LIMIT 1),
  'Ticklin'' The Pickle',
  'The Hawk',
  'ticklin-the-pickle-the-hawk',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ticklin'' The Pickle'
    AND title = 'The Hawk'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'ticklin-the-pickle' LIMIT 1),
  'Ticklin'' The Pickle',
  'Untitled',
  'ticklin-the-pickle-untitled',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Ticklin'' The Pickle'
    AND title = 'Untitled'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'tom-warren-stefan-rajic-mike-stevenson-nick-robert' LIMIT 1),
  'Tom Warren, Stefan Rajic, Mike Stevenson, Nick Robert',
  'Midnight',
  'tom-warren-stefan-rajic-mike-stevenson-nick-robert-midnight',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Tom Warren, Stefan Rajic, Mike Stevenson, Nick Robert'
    AND title = 'Midnight'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'trevor-nobes' LIMIT 1),
  'Trevor Nobes',
  'Bittersweet',
  'trevor-nobes-bittersweet',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Trevor Nobes'
    AND title = 'Bittersweet'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'troll-mother' LIMIT 1),
  'Troll Mother',
  'Battle For Troll Mountain',
  'troll-mother-battle-for-troll-mountain',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Troll Mother'
    AND title = 'Battle For Troll Mountain'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'troll-mother' LIMIT 1),
  'Troll Mother',
  'Forest Child',
  'troll-mother-forest-child',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Troll Mother'
    AND title = 'Forest Child'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'troll-mother' LIMIT 1),
  'Troll Mother',
  'Prologue',
  'troll-mother-prologue',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Troll Mother'
    AND title = 'Prologue'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'troll-mother' LIMIT 1),
  'Troll Mother',
  'Xmas',
  'troll-mother-xmas',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Troll Mother'
    AND title = 'Xmas'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'truesounds-jah-mirikle-lone-ranger' LIMIT 1),
  'Truesounds, Jah Mirikle, Lone Ranger',
  'Time Get Ruff',
  'truesounds-jah-mirikle-lone-ranger-time-get-ruff',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Truesounds, Jah Mirikle, Lone Ranger'
    AND title = 'Time Get Ruff'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'urban-swallow' LIMIT 1),
  'Urban Swallow',
  'You Can Call Me',
  'urban-swallow-you-can-call-me',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Urban Swallow'
    AND title = 'You Can Call Me'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'violet-piper' LIMIT 1),
  'Violet Piper',
  'Inside Baseball',
  'violet-piper-inside-baseball',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Violet Piper'
    AND title = 'Inside Baseball'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'violet-piper' LIMIT 1),
  'Violet Piper',
  'Men Make Me',
  'violet-piper-men-make-me',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Violet Piper'
    AND title = 'Men Make Me'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'viva-los-villians' LIMIT 1),
  'Viva Los Villians',
  'Bury Me Now',
  'viva-los-villians-bury-me-now',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Viva Los Villians'
    AND title = 'Bury Me Now'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'viva-los-villians' LIMIT 1),
  'Viva Los Villians',
  'Guillotine',
  'viva-los-villians-guillotine',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Viva Los Villians'
    AND title = 'Guillotine'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'viva-los-villians' LIMIT 1),
  'Viva Los Villians',
  'Hurricane',
  'viva-los-villians-hurricane',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Viva Los Villians'
    AND title = 'Hurricane'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'viva-los-villians' LIMIT 1),
  'Viva Los Villians',
  'On My Mind',
  'viva-los-villians-on-my-mind',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Viva Los Villians'
    AND title = 'On My Mind'
);

INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = 'viva-los-villians' LIMIT 1),
  'Viva Los Villians',
  'Your Darkness',
  'viva-los-villians-your-darkness',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = 'Viva Los Villians'
    AND title = 'Your Darkness'
);

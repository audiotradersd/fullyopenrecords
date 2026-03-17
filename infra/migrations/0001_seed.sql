INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  gallery_images,
  social_links,
  embedded_player,
  genres,
  featured
) VALUES (
  'Cinder Static',
  'cinder-static',
  'Experimental electronics and late-night drum programming from South London.',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
  '["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f","https://images.unsplash.com/photo-1501386761578-eac5c94b800a"]',
  '{"instagram":"https://instagram.com/fullyopenrecords","bandcamp":"https://bandcamp.com"}',
  '<iframe src=''https://bandcamp.com/EmbeddedPlayer/''></iframe>',
  '["Electronic","Ambient"]',
  1
);

INSERT INTO releases (
  title,
  artist_id,
  type,
  artwork,
  release_date,
  streaming_links,
  description
) VALUES (
  'Night Index',
  1,
  'EP',
  'https://images.unsplash.com/photo-1507838153414-b4b713384a76',
  '2025-11-14',
  '{"spotify":"https://spotify.com","apple":"https://music.apple.com"}',
  'A four-track EP built for pirate radio transitions.'
);

INSERT INTO products (
  title,
  slug,
  description,
  price,
  currency,
  category,
  images,
  variants,
  inventory,
  stripe_price_id,
  featured
) VALUES (
  'Night Index Vinyl',
  'night-index-vinyl',
  '180g limited pressing with risograph sleeve.',
  2800,
  'GBP',
  'vinyl',
  '["https://images.unsplash.com/photo-1511379938547-c1f69419868d"]',
  '[{"name":"Format","value":"Black","inventory":25},{"name":"Format","value":"Smoked","inventory":12}]',
  37,
  'price_demo_vinyl',
  1
);

INSERT INTO faq_items (question, answer, order_index) VALUES
  ('Do you accept demos?', 'Yes. Use the submission form and include one private stream link.', 1),
  ('Do you ship internationally?', 'Yes. Shipping rates are calculated at Stripe Checkout.', 2);

INSERT INTO pages (
  title,
  slug,
  seo_title,
  seo_description,
  blocks,
  published
) VALUES
  (
    'Home',
    'home',
    'Fully Open Records',
    'Independent label, radio station, and merch store.',
    '[{"type":"hero","data":{"eyebrow":"Independent Label","title":"Fully Open Records","body":"Music, radio, and carefully made physical editions.","ctaLabel":"Explore artists","ctaHref":"/artists"}},{"type":"artist_grid","data":{"title":"Featured artists"}},{"type":"radio_player","data":{"title":"Live radio"}},{"type":"product_grid","data":{"title":"Latest merch"}},{"type":"newsletter","data":{"title":"Newsletter"}}]',
    1
  ),
  (
    'About',
    'about',
    'About Fully Open Records',
    'About the label and radio ethos.',
    '[{"type":"text","data":{"title":"About","body":"Fully Open Records is a platform for artists who like edges left visible."}}]',
    1
  );

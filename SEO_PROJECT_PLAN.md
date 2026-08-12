# Fully Open SEO Project Plan

## Purpose

Fully Open should become the most connected independent-music catalogue: a place where every artist, release, track, mood, place, credit and story creates a meaningful way to discover music.

The immediate goal is simpler: make the existing public site clear, unique and easy for search engines to understand. We will earn the right to build a large discovery graph by first fixing metadata, index quality and public-page depth.

## Brand SEO position

**Fully Open is an all-genres independent music platform for discovering artists, listening to human-curated radio and giving music a public home.**

Use concrete search language alongside the ethos:

- independent music and independent artists
- online radio and underground radio
- artist profiles and artist pages
- submit music and music discovery
- all genres welcome; no genre gatekeeping; music before categories

Do not use "all genres" as empty repetition. Support it with real artists, releases, radio selections, stories and listening routes.

## Current position

Already complete:

- Google Analytics is installed.
- `robots.txt` allows public crawling and blocks private admin, account, dashboard and API routes.
- `sitemap.xml` includes core public pages and active artist pages.

Current issues to address:

- Most public pages use the same title and description.
- Indexable pages do not yet declare canonical URLs.
- Artist pages do not yet have tailored metadata or structured data.
- The sitemap contains test or legacy-looking artist profiles; only pages intended for public search should remain indexed.
- There are not yet dedicated release, genre, mood, location, playlist or editorial article pages.

## Phase 1 — Quick wins (start here)

### 1. Clean the sitemap and index

- Deactivate or permanently delete test accounts before Search Console submission.
- Confirm every remaining sitemap URL is public, useful and canonical.
- Add `noindex` metadata to signup, account and dashboard pages as a second line of protection.
- Create and verify a Google Search Console property for `fullyopenrecords.com`.
- Submit `https://fullyopenrecords.com/sitemap.xml`.

**Outcome:** Google spends crawl attention only on pages we actively want in search.

### 2. Give every core public page its own search purpose

Implement unique title, meta description, canonical URL, Open Graph title, description and image for:

| Route | Search purpose | Working title direction |
| --- | --- | --- |
| `/` | Brand and broad discovery | Fully Open Records — Independent Music, Radio & Artists |
| `/about` | Mission and trust | About Fully Open — An All-Genres Independent Music Community |
| `/artists` | Artist discovery | Discover Independent Artists Across Every Genre |
| `/radio` | Listening intent | Fully Open Radio — 24/7 Independent Music Across Genres |
| `/get-heard` | Artist acquisition | Submit Music & Build Your Artist Page |
| `/releases` | Release discovery | New Independent Music Releases |
| `/store` | Merch intent | Fully Open Records Store — Independent Music & Merch |
| `/faq` | Questions and reassurance | Fully Open FAQ — Artists, Radio and Music Submissions |
| `/contact` | Contact intent | Contact Fully Open Records |

**Outcome:** Each page communicates a distinct reason to rank and click.

### 3. Make artist pages indexable destinations

For every active public artist profile, generate:

- title: `Artist Name — Independent [genre / location] Artist | Fully Open`
- description from the artist bio, genre and location (with a safe fallback)
- canonical URL: `/artist/[slug]`
- Open Graph image using the artist profile or hero image
- `MusicGroup` or `Person` JSON-LD, only using visible verified profile data

Also add an artist-profile completion prompt for a useful bio, genre tags, location, image alt text, social links and release links.

**Outcome:** Artist pages capture branded artist searches and long-tail discovery searches.

### 4. Establish measurement

Track these Analytics events:

- artist profile viewed
- radio play started
- Get Heard viewed
- artist signup started and completed
- artist page shared
- track played

Review Search Console monthly for indexed pages, search queries, crawl issues and pages excluded from search.

## Phase 2 — Build depth around the existing catalogue

### Releases and tracks

- Create a unique URL for each release.
- Add release story, artwork, tracklist, credits, release date, listening links and related artists.
- Create track pages only when they have enough meaningful material: lyrics where permitted, notes, credits, story, radio appearances or reviews.
- Add `MusicAlbum` and `MusicRecording` structured data matching visible content.

### Radio and editorial depth

- Publish a crawlable radio archive: recently played, featured tracks and recurring programmes.
- Create editorial features: artist interviews, release notes, recording stories and scene reports.
- Add internal links from every story to artists, releases, tracks and radio pages.

### Useful evergreen collections

- New artists on Fully Open
- Recently added independent releases
- Most played on Fully Open Radio
- Hidden gems
- No Genre Required

Only publish a collection when its contents are curated or have a clear editorial rule.

## Phase 3 — Discovery hubs

Build public directory pages with an editorial introduction, clear filters, internal links and enough entries to be useful:

- genres
- moods
- countries and cities
- recently added artists
- radio-selected tracks
- curated playlists

Examples:

- `Independent artists from Hungary`
- `Rainy evening music — independent artists across genres`
- `New independent electronic music`
- `Artists featured on Fully Open Radio`

Mood is especially important: genres divide people, while moods connect listeners across styles.

## Phase 4 — Build the world’s most discoverable independent music catalogue

### Philosophy

Fully Open should not aim to become the biggest independent music platform. It should aim to become the most connected one.

Every artist, release, track, mood, place, instrument, influence, collaboration and story should create another meaningful path through the catalogue. As each new artist contributes metadata, stories and relationships, Fully Open gains compounding entry points for listeners and search engines.

### Entity model

Over time, model these as connected entities rather than isolated pages:

- Artist, album, track, genre and mood
- Country, city, language, venue and festival
- Instrument, influence, producer, engineer and recording location
- Radio show, playlist, article, interview and review
- Collaboration, event and listener collection

### Rich pages

An artist page can connect genres, moods, place, influences, releases, radio appearances, editorial coverage, events, collaborators and recommendations.

An album page can connect recording story, personnel, artwork, instruments, locations, production credits, related releases, radio features and reviews.

Every relationship should provide a real listener benefit, not merely generate a page.

### Discovery graph

No page should be a dead end. Use meaningful connections such as:

- same producer or engineer
- same country, city or venue
- shared moods, genres or instruments
- radio appearance or playlist inclusion
- collaboration and influence relationships
- shared editorial features or release context

### Living collections

Create automatically refreshed, carefully defined collections:

- Best independent albums this month
- New artists added today
- Most played on Fully Open Radio
- Recently reviewed
- Hidden gems and albums you may have missed
- No Genre Required

### Artist-contributed authority

Allow artists to add material that strengthens the catalogue when it is public and high quality:

- favourite albums and influences
- recording diaries and studio photos
- gear and mix breakdowns
- song meanings and track-by-track notes
- tour journals and behind-the-scenes stories

### AI discovery (later)

Only after the catalogue has reliable, well-governed relationship data, build natural-language discovery such as:

`Melancholy jazz recorded live` or `cinematic electronic artists from Scotland`.

Do not create indexable pages for every AI query until there is useful editorial or catalogue content behind them.

## Data and quality rules

Before creating a new entity type, define:

1. Who supplies or verifies it.
2. Its controlled vocabulary and moderation rules.
3. The minimum content required before its page can be indexed.
4. Its relationships to existing entities.
5. What makes the page genuinely useful to a listener.

Avoid mass-generated thin pages. An instrument, mood or city page should not be indexable until it has meaningful copy and enough relevant, high-quality entries.

## Delivery order

1. Phase 1 metadata, canonicals, noindex, sitemap clean-up and Search Console.
2. Artist page metadata and structured data.
3. Individual release pages and radio/editorial archive.
4. Genre, mood and geographic discovery hubs.
5. Extended entity data and relationship graph.
6. Living collections and AI discovery.

## Success measures

- More valid, indexed public URLs in Search Console.
- Organic visits to artist and release pages.
- Branded artist searches landing on Fully Open profiles.
- Organic visits to Get Heard and artist signup conversion rate.
- Radio starts from organic landing pages.
- Growth in internal links and useful related-content journeys.


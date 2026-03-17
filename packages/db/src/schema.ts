import { relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex
} from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
};

export const artists = sqliteTable(
  "artists",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    bio: text("bio").notNull(),
    heroImage: text("hero_image").notNull(),
    profileImage: text("profile_image"),
    bannerImage: text("banner_image"),
    location: text("location"),
    galleryImages: text("gallery_images", { mode: "json" }).$type<string[]>(),
    socialLinks: text("social_links", { mode: "json" }).$type<Record<string, string>>(),
    embeddedPlayer: text("embedded_player"),
    genres: text("genres", { mode: "json" }).$type<string[]>(),
    plan: text("plan").notNull().default("free"),
    adminOverride: integer("admin_override", { mode: "boolean" }).notNull().default(false),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    ...timestamps
  },
  (table) => [
    uniqueIndex("artists_slug_idx").on(table.slug),
    uniqueIndex("artists_user_id_idx").on(table.userId)
  ]
);

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    username: text("username").notNull(),
    passwordHash: text("password_hash").notNull(),
    passwordSalt: text("password_salt").notNull(),
    accountType: text("account_type").notNull(),
    role: text("role").notNull().default("user"),
    ...timestamps
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    uniqueIndex("users_username_idx").on(table.username)
  ]
);

export const sessions = sqliteTable(
  "sessions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: text("expires_at").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => [uniqueIndex("sessions_token_hash_idx").on(table.tokenHash)]
);

export const releases = sqliteTable("releases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  artistId: integer("artist_id")
    .notNull()
    .references(() => artists.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  artwork: text("artwork").notNull(),
  releaseDate: text("release_date").notNull(),
  streamingLinks: text("streaming_links", { mode: "json" }).$type<Record<string, string>>(),
  description: text("description").notNull(),
  ...timestamps
});

export const products = sqliteTable(
  "products",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    price: integer("price").notNull(),
    currency: text("currency").notNull().default("GBP"),
    category: text("category").notNull(),
    images: text("images", { mode: "json" }).$type<string[]>(),
    variants: text("variants", { mode: "json" }).$type<
      Array<{ name: string; value: string; inventory: number }>
    >(),
    inventory: integer("inventory").notNull().default(0),
    stripePriceId: text("stripe_price_id").notNull(),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    ...timestamps
  },
  (table) => [uniqueIndex("products_slug_idx").on(table.slug)]
);

export const submissions = sqliteTable("submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  socials: text("socials", { mode: "json" }).$type<Record<string, string>>(),
  musicLink: text("music_link").notNull(),
  message: text("message").notNull(),
  rightsConfirmed: integer("rights_confirmation", { mode: "boolean" })
    .notNull()
    .default(false),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

export const faqItems = sqliteTable("faq_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order_index").notNull().default(0),
  ...timestamps
});

export const pages = sqliteTable(
  "pages",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    blocks: text("blocks", { mode: "json" }).$type<
      Array<{ type: string; data: Record<string, unknown> }>
    >(),
    published: integer("published", { mode: "boolean" }).notNull().default(true),
    ...timestamps
  },
  (table) => [uniqueIndex("pages_slug_idx").on(table.slug)]
);

export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fileName: text("file_name").notNull(),
  alt: text("alt").notNull().default(""),
  mimeType: text("mime_type").notNull(),
  url: text("url").notNull(),
  r2Key: text("r2_key").notNull(),
  ...timestamps
});

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stripeSessionId: text("stripe_session_id").notNull(),
  email: text("email"),
  items: text("items", { mode: "json" }).$type<
    Array<{ productId: number; quantity: number; title: string }>
  >(),
  total: integer("total").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

export const flowEvents = sqliteTable("flow_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventType: text("event_type").notNull(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  artistId: integer("artist_id").references(() => artists.id, { onDelete: "set null" }),
  path: text("path"),
  sessionKey: text("session_key"),
  meta: text("meta", { mode: "json" }).$type<Record<string, unknown>>(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

export const gigs = sqliteTable("gigs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  artistId: integer("artist_id")
    .notNull()
    .references(() => artists.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  venue: text("venue"),
  city: text("city"),
  eventDate: text("event_date").notNull(),
  ticketUrl: text("ticket_url"),
  description: text("description"),
  ...timestamps
});

export const albums = sqliteTable("albums", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  artistId: integer("artist_id")
    .notNull()
    .references(() => artists.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  releaseDate: text("release_date"),
  description: text("description"),
  coverArt: text("cover_art"),
  ...timestamps
});

export const pressItems = sqliteTable("press_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  artistId: integer("artist_id")
    .notNull()
    .references(() => artists.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  publication: text("publication").notNull(),
  pressDate: text("press_date"),
  articleLink: text("article_link"),
  excerpt: text("excerpt"),
  featureImage: text("feature_image"),
  ...timestamps
});

export const trackingItems = sqliteTable("tracking_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  number: integer("number").notNull(),
  details: text("details").notNull(),
  status: text("status").notNull().default("backlog"),
  ...timestamps
});

export const editorialSlots = sqliteTable(
  "editorial_slots",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slotKey: text("slot_key").notNull(),
    title: text("title"),
    description: text("description"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    ...timestamps
  },
  (table) => [uniqueIndex("editorial_slots_key_idx").on(table.slotKey)]
);

export const editorialSlotItems = sqliteTable("editorial_slot_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slotId: integer("slot_id")
    .notNull()
    .references(() => editorialSlots.id, { onDelete: "cascade" }),
  itemType: text("item_type").notNull(),
  itemId: integer("item_id"),
  artistId: integer("artist_id").references(() => artists.id, { onDelete: "set null" }),
  sortOrder: integer("sort_order").notNull().default(0),
  customTitle: text("custom_title"),
  customSubtitle: text("custom_subtitle"),
  customDescription: text("custom_description"),
  customImage: text("custom_image"),
  customHref: text("custom_href"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  ...timestamps
});

export const songs = sqliteTable("songs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  artistId: integer("artist_id").references(() => artists.id, { onDelete: "cascade" }),
  albumId: integer("album_id").references(() => albums.id, { onDelete: "set null" }),
  trackNumber: integer("track_number"),
  artistName: text("artist_name").notNull(),
  title: text("title").notNull(),
  slug: text("slug"),
  audioUrl: text("audio_url"),
  duration: integer("duration"),
  coverImage: text("cover_image"),
  description: text("description"),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  isRadioEligible: integer("is_radio_eligible", { mode: "boolean" }).notNull().default(false),
  radioSelected: integer("radio_selected", { mode: "boolean" }).notNull().default(false),
  approvedForRadio: integer("approved_for_radio", { mode: "boolean" }).notNull().default(false),
  playCount: integer("play_count").notNull().default(0),
  ...timestamps
});

export const videos = sqliteTable("videos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  artistId: integer("artist_id")
    .notNull()
    .references(() => artists.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  ...timestamps
});

export const photos = sqliteTable("photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  artistId: integer("artist_id")
    .notNull()
    .references(() => artists.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  alt: text("alt").notNull().default(""),
  ...timestamps
});

export const favouriteSongs = sqliteTable(
  "favourite_songs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    songId: integer("song_id")
      .notNull()
      .references(() => songs.id, { onDelete: "cascade" }),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => [uniqueIndex("favourite_songs_user_song_idx").on(table.userId, table.songId)]
);

export const radioHistory = sqliteTable("radio_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  artistName: text("artist_name").notNull(),
  title: text("title").notNull(),
  songId: integer("song_id").references(() => songs.id, { onDelete: "set null" }),
  coverImage: text("cover_image"),
  source: text("source").notNull().default("citrus3"),
  playedAt: text("played_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

export const artistsRelations = relations(artists, ({ many }) => ({
  releases: many(releases),
  albums: many(albums),
  songs: many(songs),
  videos: many(videos),
  photos: many(photos),
  gigs: many(gigs),
  pressItems: many(pressItems),
  editorialItems: many(editorialSlotItems)
}));

export const albumsRelations = relations(albums, ({ one, many }) => ({
  artist: one(artists, {
    fields: [albums.artistId],
    references: [artists.id]
  }),
  songs: many(songs)
}));

export const releasesRelations = relations(releases, ({ one }) => ({
  artist: one(artists, {
    fields: [releases.artistId],
    references: [artists.id]
  })
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  artist: one(artists, {
    fields: [users.id],
    references: [artists.userId]
  }),
  sessions: many(sessions),
  favourites: many(favouriteSongs)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}));

export const songsRelations = relations(songs, ({ one, many }) => ({
  artist: one(artists, {
    fields: [songs.artistId],
    references: [artists.id]
  }),
  album: one(albums, {
    fields: [songs.albumId],
    references: [albums.id]
  }),
  favourites: many(favouriteSongs)
}));

export const videosRelations = relations(videos, ({ one }) => ({
  artist: one(artists, {
    fields: [videos.artistId],
    references: [artists.id]
  })
}));

export const photosRelations = relations(photos, ({ one }) => ({
  artist: one(artists, {
    fields: [photos.artistId],
    references: [artists.id]
  })
}));

export const gigsRelations = relations(gigs, ({ one }) => ({
  artist: one(artists, {
    fields: [gigs.artistId],
    references: [artists.id]
  })
}));

export const pressItemsRelations = relations(pressItems, ({ one }) => ({
  artist: one(artists, {
    fields: [pressItems.artistId],
    references: [artists.id]
  })
}));

export const editorialSlotsRelations = relations(editorialSlots, ({ many }) => ({
  items: many(editorialSlotItems)
}));

export const editorialSlotItemsRelations = relations(editorialSlotItems, ({ one }) => ({
  slot: one(editorialSlots, {
    fields: [editorialSlotItems.slotId],
    references: [editorialSlots.id]
  }),
  artist: one(artists, {
    fields: [editorialSlotItems.artistId],
    references: [artists.id]
  })
}));

export const favouriteSongsRelations = relations(favouriteSongs, ({ one }) => ({
  user: one(users, {
    fields: [favouriteSongs.userId],
    references: [users.id]
  }),
  song: one(songs, {
    fields: [favouriteSongs.songId],
    references: [songs.id]
  })
}));

export const flowEventsRelations = relations(flowEvents, ({ one }) => ({
  user: one(users, {
    fields: [flowEvents.userId],
    references: [users.id]
  }),
  artist: one(artists, {
    fields: [flowEvents.artistId],
    references: [artists.id]
  })
}));

export const radioHistoryRelations = relations(radioHistory, ({ one }) => ({
  song: one(songs, {
    fields: [radioHistory.songId],
    references: [songs.id]
  })
}));

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Artist = typeof artists.$inferSelect;
export type Release = typeof releases.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type FAQItem = typeof faqItems.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type MediaItem = typeof media.$inferSelect;
export type Song = typeof songs.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type Photo = typeof photos.$inferSelect;
export type FavouriteSong = typeof favouriteSongs.$inferSelect;
export type FlowEvent = typeof flowEvents.$inferSelect;
export type Gig = typeof gigs.$inferSelect;
export type Album = typeof albums.$inferSelect;
export type PressItem = typeof pressItems.$inferSelect;
export type TrackingItem = typeof trackingItems.$inferSelect;
export type EditorialSlot = typeof editorialSlots.$inferSelect;
export type EditorialSlotItem = typeof editorialSlotItems.$inferSelect;
export type RadioHistoryItem = typeof radioHistory.$inferSelect;

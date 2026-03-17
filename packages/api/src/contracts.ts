import { z } from "zod";

export const socialLinksSchema = z.record(z.string(), z.string()).default({});

export const optionalUrlSchema = z.string().url().or(z.literal("")).optional();

export const artistSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  bio: z.string().min(1),
  heroImage: z.string().url(),
  galleryImages: z.array(z.string().url()).default([]),
  socialLinks: socialLinksSchema,
  embeddedPlayer: z.string().optional().nullable(),
  genres: z.array(z.string()).default([]),
  featured: z.boolean().default(false)
});

export const releaseSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  artistId: z.number(),
  type: z.string().min(1),
  artwork: z.string().url(),
  releaseDate: z.string(),
  streamingLinks: socialLinksSchema,
  description: z.string().min(1)
});

export const productSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  price: z.number().int().nonnegative(),
  currency: z.string().default("GBP"),
  category: z.string().min(1),
  images: z.array(z.string().url()).default([]),
  variants: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
        inventory: z.number().int().nonnegative()
      })
    )
    .default([]),
  inventory: z.number().int().nonnegative(),
  stripePriceId: z.string().min(1),
  featured: z.boolean().default(false)
});

export const faqSchema = z.object({
  id: z.number().optional(),
  question: z.string().min(1),
  answer: z.string().min(1),
  order: z.number().int().default(0)
});

export const pageBlockSchema = z.object({
  type: z.enum([
    "hero",
    "text",
    "image",
    "artist_grid",
    "product_grid",
    "radio_player",
    "newsletter",
    "cta"
  ]),
  data: z.record(z.string(), z.unknown())
});

export const pageSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  slug: z.string().min(1),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  blocks: z.array(pageBlockSchema).default([]),
  published: z.boolean().default(true)
});

export const submissionSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  socials: socialLinksSchema,
  musicLink: z.string().url(),
  message: z.string().min(1),
  rightsConfirmed: z.boolean()
});

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const accountTypeSchema = z.enum(["listener", "artist"]);

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z
    .string()
    .trim()
    .min(3)
    .max(64)
    .regex(/^[a-zA-Z0-9 !?&.,()_+'’-]+$/),
  accountType: accountTypeSchema
});

export const sessionUserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string(),
  accountType: accountTypeSchema,
  role: z.string(),
  artistId: z.number().nullable().optional(),
  artistSlug: z.string().nullable().optional()
});

export const artistProfileSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  bio: z.string().min(1),
  genres: z.array(z.string()).default([]),
  location: z.string().default(""),
  profileImage: z.string().url().or(z.literal("")).default(""),
  bannerImage: z.string().url().or(z.literal("")).default(""),
  heroImage: z.string().url().or(z.literal("")).default(""),
  socialLinks: socialLinksSchema.default({}),
  embeddedPlayer: z.string().optional().nullable(),
  galleryImages: z.array(z.string().url()).default([])
});

export const songSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  artistName: z.string().min(1).optional(),
  trackNumber: z.number().int().positive().optional().nullable(),
  audioUrl: optionalUrlSchema,
  duration: z.number().int().nonnegative().optional().nullable(),
  coverImage: optionalUrlSchema,
  albumId: z.number().int().positive().optional().nullable(),
  description: z.string().optional().nullable(),
  enabled: z.boolean().default(true),
  isRadioEligible: z.boolean().default(false),
  radioSelected: z.boolean().default(false)
});

export const albumSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  releaseDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  coverArt: optionalUrlSchema
});

export const gigSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  venue: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  eventDate: z.string().min(1),
  ticketUrl: optionalUrlSchema,
  description: z.string().optional().nullable()
});

export const pressSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  publication: z.string().min(1),
  date: z.string().optional().nullable(),
  articleLink: optionalUrlSchema,
  excerpt: z.string().optional().nullable(),
  featureImage: optionalUrlSchema
});

export const trackingItemSchema = z.object({
  id: z.number().optional(),
  number: z.number().int().positive().optional(),
  details: z.string().min(1),
  status: z.string().min(1).default("backlog")
});

export const videoSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  videoUrl: z.string().url(),
  thumbnailUrl: optionalUrlSchema
});

export const photoSchema = z.object({
  id: z.number().optional(),
  imageUrl: z.string().url(),
  alt: z.string().default("")
});

export const favouriteSongSchema = z.object({
  songId: z.number()
});

export const currentRadioFavouriteSchema = z.object({
  title: z.string().min(1),
  artistName: z.string().min(1),
  coverImage: z.string().url().optional(),
  duration: z.number().int().nonnegative().optional().nullable()
});

export const checkoutItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().int().min(1),
  title: z.string(),
  stripePriceId: z.string(),
  unitAmount: z.number().int().nonnegative()
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  successUrl: z.string().url(),
  cancelUrl: z.string().url()
});

export type ArtistInput = z.infer<typeof artistSchema>;
export type ReleaseInput = z.infer<typeof releaseSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type FAQInput = z.infer<typeof faqSchema>;
export type PageInput = z.infer<typeof pageSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ArtistProfileInput = z.infer<typeof artistProfileSchema>;
export type SongInput = z.infer<typeof songSchema>;
export type AlbumInput = z.infer<typeof albumSchema>;
export type GigInput = z.infer<typeof gigSchema>;
export type PressInput = z.infer<typeof pressSchema>;
export type TrackingItemInput = z.infer<typeof trackingItemSchema>;
export type VideoInput = z.infer<typeof videoSchema>;
export type PhotoInput = z.infer<typeof photoSchema>;

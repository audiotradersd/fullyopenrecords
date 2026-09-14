export type SessionUser = {
  id: number;
  email: string;
  username: string;
  accountType: "listener" | "artist";
  role: string;
  artistId: number | null;
  artistSlug: string | null;
};

export type AppVariables = {
  user: SessionUser;
};

export type Env = {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  MASTER_BUCKET: R2Bucket;
  JWT_SECRET: string;
  POSTMARK_SERVER_TOKEN: string;
  POSTMARK_FROM_EMAIL: string;
  POSTMARK_ARTIST_EMAIL_FROM?: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  SITE_URL: string;
  R2_PUBLIC_URL?: string;
  MEDIA_PROCESSOR_TOKEN: string;
  RADIO_STREAM_URL: string;
  RADIO_METADATA_URL?: string;
  RADIO_EMBED_URL?: string;
};

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
  JWT_SECRET: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  SITE_URL: string;
  R2_PUBLIC_URL?: string;
  RADIO_STREAM_URL: string;
  RADIO_METADATA_URL?: string;
  RADIO_EMBED_URL?: string;
};

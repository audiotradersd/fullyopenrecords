import type { Env } from "../types";

type AccountWelcomeRecipient = {
  email: string;
  username: string;
  accountType: "artist" | "listener";
  artistSlug?: string;
};

type NewAccountNotification = {
  email: string;
  username: string;
  accountType: "artist" | "listener";
  artist?: {
    name: string;
    slug: string;
  };
};

/** Sends the existing Postmark welcome template without gating account creation on email delivery. */
export async function sendAccountWelcomeEmail(env: Env, recipient: AccountWelcomeRecipient) {
  try {
    const response = await fetch("https://api.postmarkapp.com/email/withTemplate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": env.POSTMARK_SERVER_TOKEN
      },
      body: JSON.stringify({
        From: env.POSTMARK_FROM_EMAIL,
        To: recipient.email,
        TemplateAlias: recipient.accountType === "artist" ? "get-started" : "account-verified",
        TemplateModel: {
          first_name: recipient.username,
          dashboard_url: new URL(recipient.accountType === "artist" ? "/artist/dashboard" : "/account", env.SITE_URL).toString(),
          getting_started_url: new URL("/dashboard/getting-started", env.SITE_URL).toString(),
          artist_page_url: recipient.artistSlug ? new URL(`/artist/${encodeURIComponent(recipient.artistSlug)}`, env.SITE_URL).toString() : null,
          upload_url: new URL("/dashboard/getting-started#upload", env.SITE_URL).toString(),
          bulk_upload_url: new URL("/dashboard/getting-started#bulk-upload", env.SITE_URL).toString(),
          releases_url: new URL("/dashboard/getting-started#releases", env.SITE_URL).toString(),
          video_url: new URL("/dashboard/getting-started#video", env.SITE_URL).toString(),
          versions_url: new URL("/dashboard/getting-started#versions", env.SITE_URL).toString(),
          gigs_url: new URL("/dashboard/getting-started#gigs", env.SITE_URL).toString()
        }
      })
    });

    if (!response.ok) {
      console.error("account welcome email failed", response.status);
    }
  } catch (error) {
    console.error("account welcome email failed", error);
  }
}

/** Notifies the label team without making registration depend on Postmark. */
export async function sendNewAccountNotification(env: Env, account: NewAccountNotification) {
  try {
    const artistPageUrl = account.artist
      ? new URL(`/artist/${encodeURIComponent(account.artist.slug)}`, env.SITE_URL).toString()
      : null;
    const response = await fetch("https://api.postmarkapp.com/email/withTemplate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": env.POSTMARK_SERVER_TOKEN
      },
      body: JSON.stringify({
        From: env.POSTMARK_FROM_EMAIL,
        To: "si@fullyopenrecords.com",
        Cc: "rich@fullyopenrecords.com",
        ReplyTo: account.email,
        TemplateAlias: "new-account-created",
        TemplateModel: {
          username: account.username,
          email: account.email,
          account_type: account.accountType,
          artist: account.artist
            ? { name: account.artist.name, slug: account.artist.slug, page_url: artistPageUrl }
            : null
        }
      })
    });

    const body = await response.text();
    if (!response.ok) {
      console.error("new account notification failed", response.status);
      return { ok: false as const, error: `Postmark returned ${response.status}.` };
    }
    let messageId: string | null = null;
    try {
      const parsed = JSON.parse(body) as { MessageID?: unknown };
      messageId = typeof parsed.MessageID === "string" ? parsed.MessageID : null;
    } catch {
      // Postmark accepted the message even if a proxy returned no JSON body.
    }
    return { ok: true as const, messageId };
  } catch (error) {
    console.error("new account notification failed", error);
    return { ok: false as const, error: error instanceof Error ? error.message.slice(0, 1000) : "Postmark request failed." };
  }
}

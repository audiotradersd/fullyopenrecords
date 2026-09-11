import type { Env } from "../types";

type AccountWelcomeRecipient = {
  email: string;
  username: string;
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
        TemplateAlias: "account-verified",
        TemplateModel: {
          first_name: recipient.username,
          dashboard_url: new URL("/dashboard", env.SITE_URL).toString()
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
          is_artist: account.accountType === "artist",
          artist_name: account.artist?.name ?? "",
          artist_page_url: artistPageUrl ?? ""
        }
      })
    });

    if (!response.ok) {
      console.error("new account notification failed", response.status);
    }
  } catch (error) {
    console.error("new account notification failed", error);
  }
}

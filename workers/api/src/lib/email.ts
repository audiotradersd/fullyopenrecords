import type { Env } from "../types";

type AccountWelcomeRecipient = {
  email: string;
  username: string;
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

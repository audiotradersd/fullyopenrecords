import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const allTemplates = JSON.parse(await readFile(resolve(root, "docs/postmark/artist-engagement-templates.json"), "utf8"));
const onlyArg = process.argv.find((value) => value.startsWith("--only="));
const onlyAliases = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",").map((alias) => alias.toLowerCase())) : null;
const templates = onlyAliases ? allTemplates.filter((item) => onlyAliases.has(item.alias.toLowerCase())) : allTemplates;
if (!templates.length) throw new Error("No templates match the requested --only alias list.");
const credentialText = await readFile(resolve(root, "api.txt"), "utf8");
const token = credentialText.match(/^postmark for token\s*-\s*([0-9a-f-]{36})/im)?.[1];
if (!token) throw new Error("Could not find the Postmark server token in api.txt.");

const headers = { Accept: "application/json", "Content-Type": "application/json", "X-Postmark-Server-Token": token };
const base = "https://api.postmarkapp.com";
const sampleModel = {
  artist_name: "Aster",
  track_title: "A track title",
  opportunity_title: "A current Fully Open opportunity",
  opportunity_details: "Opportunity details configured by Fully Open.",
  opportunity_url: "https://fullyopenrecords.com/radio",
  artist_page_url: "https://fullyopenrecords.com/artist/aster",
  dashboard_url: "https://fullyopenrecords.com/artist/dashboard",
  upload_url: "https://fullyopenrecords.com/artist/dashboard",
  release_url: "https://fullyopenrecords.com/artist/dashboard",
  versions_url: "https://fullyopenrecords.com/artist/dashboard",
  gigs_url: "https://fullyopenrecords.com/artist/dashboard",
  video_url: "https://fullyopenrecords.com/artist/dashboard",
  photo_url: "https://fullyopenrecords.com/artist/dashboard",
  social_url: "https://fullyopenrecords.com/artist/aster",
  share_url: "https://fullyopenrecords.com/artist/aster",
  discover_url: "https://fullyopenrecords.com/radio",
  radio_url: "https://fullyopenrecords.com/radio",
  invite_url: "https://fullyopenrecords.com/signup",
  unsubscribe_url: "https://fullyopenrecords.com/artist-email/unsubscribe?token=sample"
};

if (new Set(templates.map((item) => item.alias)).size !== templates.length) throw new Error("Duplicate template aliases in source manifest.");

const listResponse = await fetch(`${base}/templates?count=100&offset=0`, { headers });
if (!listResponse.ok) throw new Error(`Could not inspect Postmark templates (${listResponse.status}).`);
const listed = await listResponse.json();
const current = new Map((listed.Templates ?? []).filter((item) => item.Alias).map((item) => [String(item.Alias).toLowerCase(), item]));
const defaultLayout = current.get("code-your-own");
if (!defaultLayout || defaultLayout.TemplateType !== "Layout") throw new Error("The Postmark default layout alias code-your-own was not found.");
if (Number(listed.TotalCount ?? 0) - current.size + templates.length > 100) throw new Error("Postmark's 100-template server limit would be exceeded.");

for (const template of templates) {
  const validation = await fetch(`${base}/templates/validate`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      Subject: template.subject,
      HtmlBody: template.html,
      TextBody: template.text,
      TestRenderModel: sampleModel,
      TemplateType: "Standard",
      LayoutTemplate: "code-your-own"
    })
  });
  const result = await validation.json().catch(() => ({}));
  if (!validation.ok || result.AllContentIsValid !== true) {
    const messages = ["Subject", "HtmlBody", "TextBody"].flatMap((field) => (result[field]?.ValidationErrors ?? []).map((entry) => entry.Message));
    throw new Error(`Postmark rejected template ${template.alias}: ${messages.join("; ") || `HTTP ${validation.status}`}`);
  }
}

if (!process.argv.includes("--apply")) {
  console.log(`Validated ${templates.length} templates against Postmark's code-your-own default layout. No templates were changed. Pass --apply to create/update them.`);
  process.exit(0);
}

for (const template of templates) {
  const existing = current.get(template.alias.toLowerCase());
  const method = existing ? "PUT" : "POST";
  const url = existing ? `${base}/templates/${encodeURIComponent(template.alias)}` : `${base}/templates`;
  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify({
      Name: template.name,
      Alias: template.alias,
      Subject: template.subject,
      HtmlBody: template.html,
      TextBody: template.text,
      ...(existing ? {} : { TemplateType: "Standard" }),
      LayoutTemplate: "code-your-own"
    })
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Postmark ${method} failed for ${template.alias} (HTTP ${response.status}, code ${error.ErrorCode ?? "unknown"}).`);
  }
  console.log(`${existing ? "updated" : "created"} ${template.alias}`);
}

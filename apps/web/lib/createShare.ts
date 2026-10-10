import { siteConfig } from "./site";

export type ShareContentType = "track" | "release" | "gig" | "press" | "artist";

export type ShareFormat = "square" | "portrait" | "story" | "landscape";

export type ShareDesign =
  | "artwork-hero"
  | "full-bleed"
  | "editorial"
  | "brutalist"
  | "gig-poster"
  | "type-only"
  | "split"
  | "release-strip";

export type ShareableContent = {
  contentType: ShareContentType;
  /** The release type from FOR's releases.type field, or Album for the dashboard albums table. */
  releaseType?: string | null;
  /** Parent context for an individual track when it belongs to an album/release. */
  parentReleaseType?: string | null;
  parentReleaseTitle?: string | null;
  id?: number;
  catalogNumber?: string | null;
  artistName: string;
  title: string;
  subtitle?: string;
  /** Existing release description; rendered only in Story format. */
  description?: string | null;
  image?: string | null;
  date?: string | null;
  venue?: string | null;
  location?: string | null;
  time?: string | null;
  details?: string | null;
  cta: string;
  url: string;
};

export type ShareArtistArtwork = {
  profileImage?: string | null;
  heroImage?: string | null;
  image?: string | null;
};

/** Selects the image fields used by the existing FOR artist data model. */
export function shareArtworkForRecord(
  kind: ShareContentType,
  record: Record<string, unknown>,
  relatedAlbums: Array<Record<string, unknown>> = [],
  artist: ShareArtistArtwork = {},
) {
  const profile = artist.profileImage || artist.heroImage || artist.image || null;
  if (kind === "release") return stringField(record, "coverArt") || profile;
  if (kind === "track") {
    const album = relatedAlbums.find((item) => Number(item.id) === Number(record.albumId));
    return stringField(record, "coverImage") || (album && stringField(album, "coverArt")) || profile;
  }
  if (kind === "press") return stringField(record, "featureImage") || profile;
  // The current FOR gigs table has no event-image field, so use artist imagery.
  if (kind === "gig") return profile;
  return artist.profileImage || artist.heroImage || artist.image || null;
}

function stringField(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : null;
}

export type SharePalette = { accent: string };

export const SHARE_FORMATS: Array<{
  id: ShareFormat;
  label: string;
  width: number;
  height: number;
}> = [
  { id: "square", label: "Square", width: 1080, height: 1080 },
  { id: "portrait", label: "Portrait", width: 1080, height: 1350 },
  { id: "story", label: "Story", width: 1080, height: 1920 },
  { id: "landscape", label: "Landscape", width: 1920, height: 1080 },
];

export const SHARE_DESIGNS: Array<{
  id: ShareDesign;
  label: string;
  types: ShareContentType[];
}> = [
  { id: "artwork-hero", label: "Artwork Hero", types: ["track", "release"] },
  {
    id: "full-bleed",
    label: "Full Bleed",
    types: ["track", "release", "gig", "press", "artist"],
  },
  { id: "editorial", label: "Editorial", types: ["press", "artist", "release"] },
  { id: "brutalist", label: "Brutalist", types: ["track", "release", "gig"] },
  { id: "gig-poster", label: "Gig Poster", types: ["gig"] },
  {
    id: "type-only",
    label: "Type Only",
    types: ["track", "release", "press", "artist"],
  },
  {
    id: "split",
    label: "Split",
    types: ["track", "release", "gig", "press", "artist"],
  },
  { id: "release-strip", label: "Release Strip", types: ["track", "release"] },
];

export const DEFAULT_DESIGN: Record<ShareContentType, ShareDesign> = {
  track: "artwork-hero",
  release: "artwork-hero",
  gig: "gig-poster",
  press: "editorial",
  artist: "editorial",
};

export const SHARE_DIMENSIONS: Record<
  ShareFormat,
  { width: number; height: number }
> = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
  landscape: { width: 1920, height: 1080 },
};

export function createAttributedShareUrl(
  url: string,
  contentType: ShareContentType,
) {
  const site = new URL(siteConfig.url);
  const parsed = new URL(url, site);
  if (parsed.origin !== site.origin)
    throw new Error("Create & Share links must lead to Fully Open Records.");
  parsed.searchParams.set("utm_source", "fullyopenrecords");
  parsed.searchParams.set("utm_medium", "artist_share");
  parsed.searchParams.set("utm_campaign", contentType);
  parsed.searchParams.set("utm_content", "create_share");
  return parsed.toString();
}

function xml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[character];
  });
}

function safeImage(image?: string | null) {
  if (!image) return "";
  if (/^data:image\/(?:png|jpeg|webp);base64,[a-z\d+/]+=*$/i.test(image))
    return image;
  try {
    const parsed = new URL(image, "https://fullyopenrecords.com");
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : "";
  } catch {
    return "";
  }
}

/** Resolve the string URL fields returned by FOR content APIs before exporting.
 * Public FOR records currently return absolute media URLs; same-site relative
 * URLs are also used for the legacy artist images. Bare storage keys are not
 * URLs and are deliberately rejected instead of being guessed here.
 */
export async function loadShareArtwork(reference: string) {
  const value = reference.trim();
  if (!value) throw new Error("No artwork was selected.");
  let url: URL;
  try {
    url = new URL(value, "https://fullyopenrecords.com");
  } catch {
    throw new Error("The artwork reference is not a valid public image URL.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:")
    throw new Error("The artwork URL must use HTTP or HTTPS.");
  if (!/^https?:\/\//i.test(value) && !value.startsWith("/"))
    throw new Error("The artwork reference is a storage key, not a public URL.");

  const response = await fetch(url.toString(), { mode: "cors", cache: "force-cache" });
  if (!response.ok) throw new Error(`Artwork request failed (${response.status}).`);
  const blob = await response.blob();
  const mime = blob.type.toLowerCase().split(";")[0];
  if (!["image/png", "image/jpeg", "image/webp"].includes(mime))
    throw new Error("Artwork must be a PNG, JPG or WebP image.");
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize)
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  return `data:${mime};base64,${btoa(binary)}`;
}

function fitText(value: string, max = 48) {
  return value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;
}

function dateLabel(value?: string | null) {
  if (!value) return "";
  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value,
  );
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

function isFutureDate(value?: string | null) {
  if (!value) return false;
  const parsed = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value);
  if (Number.isNaN(parsed.getTime())) return false;
  parsed.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return parsed.getTime() > now.getTime();
}

function normalizedReleaseType(value?: string | null) {
  const type = value?.trim().toLowerCase();
  if (!type) return "RELEASE";
  if (type === "lp") return "ALBUM";
  if (type === "ep") return "EP";
  if (type === "single") return "SINGLE";
  if (type === "album") return "ALBUM";
  if (type === "compilation") return "COMPILATION";
  return type.toUpperCase();
}

export type ShareSemanticCopy = {
  eyebrow: string;
  releaseLabel: string;
  statusLabel: string;
  ctaLabel: string;
  supportingMetadata: string;
};

/** Derives the poster language once from FOR content and release data. */
export function deriveShareCopy(content: ShareableContent): ShareSemanticCopy {
  const date = dateLabel(content.date);
  if (content.contentType === "release") {
    const kind = normalizedReleaseType(content.releaseType);
    return {
      eyebrow: `NEW ${kind}`,
      releaseLabel: kind,
      statusLabel: isFutureDate(content.date) ? `OUT ${date}` : date ? "OUT NOW" : "RELEASE DATE TBC",
      ctaLabel: content.cta || `LISTEN TO THE ${kind}`,
      supportingMetadata: "",
    };
  }
  if (content.contentType === "track") {
    if (content.parentReleaseTitle) {
      const parentKind = normalizedReleaseType(content.parentReleaseType);
      return {
        eyebrow: "NOW PLAYING",
        releaseLabel: `FROM THE ${parentKind} ${content.parentReleaseTitle.toUpperCase()}`,
        statusLabel: isFutureDate(content.date) ? `OUT ${date}` : "LISTEN NOW",
        ctaLabel: "LISTEN NOW",
        supportingMetadata: `FROM THE ${parentKind} ${content.parentReleaseTitle.toUpperCase()}`,
      };
    }
    const explicitKind = normalizedReleaseType(content.releaseType);
    const isSingle = explicitKind === "SINGLE";
    return {
      eyebrow: isSingle ? "NEW SINGLE" : "NEW TRACK",
      releaseLabel: isSingle ? "SINGLE" : "TRACK",
      statusLabel: isFutureDate(content.date)
        ? `${isSingle ? "SINGLE " : ""}OUT ${date}`
        : content.date ? `${isSingle ? "SINGLE " : ""}OUT NOW` : "LISTEN NOW",
      ctaLabel: isSingle ? "LISTEN TO THE SINGLE" : "LISTEN NOW",
      supportingMetadata: "",
    };
  }
  if (content.contentType === "gig") {
    return {
      eyebrow: "LIVE",
      releaseLabel: "GIG",
      statusLabel: date ? `LIVE ${date}` : "LIVE",
      ctaLabel: "GIG DETAILS",
      supportingMetadata: [content.venue, content.location].filter(Boolean).join(" · "),
    };
  }
  if (content.contentType === "press") {
    return {
      eyebrow: "ARTIST NEWS",
      releaseLabel: "PRESS",
      statusLabel: date,
      ctaLabel: "READ MORE",
      supportingMetadata: content.subtitle?.trim() || "",
    };
  }
  return {
    eyebrow: "DISCOVER",
    releaseLabel: "ARTIST",
    statusLabel: "",
    ctaLabel: content.cta?.toUpperCase() || `DISCOVER ${content.artistName.toUpperCase()}`,
    supportingMetadata: "",
  };
}

function wrap(value: string, limit: number) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (word.length > limit) {
      if (line) {
        lines.push(line);
        line = "";
      }
      for (let index = 0; index < word.length; index += limit)
        lines.push(word.slice(index, index + limit));
      continue;
    }
    if (line && `${line} ${word}`.length > limit) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function escapedText(value: string, x: number, y: number, size: number, fill: string, extra = "") {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="Impact,'Arial Narrow',sans-serif" font-size="${size}" ${extra}>${xml(value)}</text>`;
}

function lines(value: string, x: number, y: number, maxChars: number, size: number, fill: string, anchor = "start", extra = "") {
  return `<text x="${x}" y="${y}" fill="${fill}" text-anchor="${anchor}" font-family="Impact,'Arial Narrow',sans-serif" font-size="${size}" font-weight="900" letter-spacing="-1" ${extra}>${wrap(value, maxChars).map((line, i) => `<tspan x="${x}" dy="${i ? size * 0.9 : 0}">${xml(line)}</tspan>`).join("")}</text>`;
}

function bodyLines(value: string, x: number, y: number, maxChars: number, size: number, fill: string) {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="Arial,sans-serif" font-size="${size}" leading="1.35">${wrap(value, maxChars).slice(0, 3).map((line, i) => `<tspan x="${x}" dy="${i ? size * 1.35 : 0}">${xml(line)}</tspan>`).join("")}</text>`;
}

function wrapParagraph(value: string, maxChars: number) {
  const result: string[] = [];
  let line = "";
  for (const word of value.trim().split(/\s+/).filter(Boolean)) {
    if (word.length > maxChars) {
      if (line) result.push(line);
      line = "";
      for (let index = 0; index < word.length; index += maxChars)
        result.push(word.slice(index, index + maxChars));
      continue;
    }
    if (line && `${line} ${word}`.length > maxChars) {
      result.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) result.push(line);
  return result;
}

/** Fits release editorial copy to its Story panel, reducing size before truncating. */
function storyDescription(
  value: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill = "#24231f",
  preferredSize = 25,
) {
  const text = value.trim().replace(/\s+/g, " ");
  if (!text || width <= 0 || height <= 0) return "";
  let selectedSize = 18;
  let selectedLines: string[] = [];
  for (let size = preferredSize; size >= 18; size -= 1) {
    const charLimit = Math.max(24, Math.floor(width / (size * 0.52)));
    const wrapped = wrapParagraph(text, charLimit);
    const maxLines = Math.max(1, Math.floor(height / (size * 1.38)));
    selectedSize = size;
    selectedLines = wrapped;
    if (wrapped.length <= maxLines) break;
  }
  const maxLines = Math.max(1, Math.floor(height / (selectedSize * 1.38)));
  if (selectedLines.length > maxLines) {
    selectedLines = selectedLines.slice(0, maxLines);
    selectedLines[maxLines - 1] = `${selectedLines[maxLines - 1].replace(/[.,;:!?-]*$/, "").trimEnd()}…`;
  }
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="Arial,sans-serif" font-size="${selectedSize}" font-weight="400" letter-spacing=".15">${selectedLines.map((line, index) => `<tspan x="${x}" dy="${index ? selectedSize * 1.38 : 0}">${xml(line)}</tspan>`).join("")}</text>`;
}

export function buildShareSvg(
  content: ShareableContent,
  design: ShareDesign,
  format: ShareFormat,
  options: {
    headline?: string;
    supportingText?: string;
    image?: string | null;
    palette?: SharePalette;
  } = {},
) {
  const { width: w, height: h } = SHARE_DIMENSIONS[format];
  const landscape = w > h;
  const accent = options.palette?.accent ?? "#f04435";
  const paper = "#e9e4d8";
  const ink = "#111211";
  const titleText = fitText(options.headline?.trim() || content.title, 68);
  const artistText = fitText(content.artistName, 54);
  const supporting = fitText(options.supportingText?.trim() || content.subtitle || content.details || "", 132);
  const storyCopy = content.contentType === "release" && format === "story"
    ? content.description?.trim() ?? ""
    : "";
  const releaseStory = Boolean(storyCopy);
  const editorialCopy = content.contentType === "release"
    ? (releaseStory ? storyCopy : content.subtitle || "")
    : supporting.length < 44 ? content.details || supporting : supporting;
  const image = safeImage(options.image ?? content.image);
  const date = dateLabel(content.date);
  const copy = deriveShareCopy(content);
  const eyebrow = xml(copy.eyebrow);
  const status = xml(copy.statusLabel);
  const metadata = xml(copy.supportingMetadata);
  const ctaText = fitText(copy.ctaLabel.toUpperCase(), 34);
  const footer = (y: number, color = "#f4f0e8", onPaper = false) => `<g font-family="Impact,'Arial Narrow',sans-serif"><text x="58" y="${y}" fill="${onPaper ? ink : color}" font-size="48" font-weight="900" letter-spacing="1">FOR</text><text x="146" y="${y}" fill="${onPaper ? "#403d37" : color}" font-family="Arial,sans-serif" font-size="15" letter-spacing="2">FULLY OPEN RECORDS</text><text x="${w - 58}" y="${y}" fill="${onPaper ? ink : color}" font-family="Arial,sans-serif" font-size="16" text-anchor="end" letter-spacing="1">${xml(ctaText)}  →</text></g>`;
  const photo = (x: number, y: number, iw: number, ih: number, extra = "") => image
    ? `<image href="${xml(image)}" x="${x}" y="${y}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid slice" ${extra}/>`
    : `<rect x="${x}" y="${y}" width="${iw}" height="${ih}" fill="#252624"/><text x="${x + iw / 2}" y="${y + ih / 2}" fill="#eee8dc" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" letter-spacing="4">ARTWORK REQUIRED</text>`;
  const paperLayer = `<rect width="${w}" height="${h}" fill="${paper}"/><rect width="${w}" height="${h}" filter="url(#paperGrain)" opacity=".14"/>`;
  const defs = `<defs><filter id="paperGrain"><feTurbulence type="fractalNoise" baseFrequency=".22" numOctaves="3" seed="17"/><feColorMatrix values=".55 0 0 0 .28 .55 0 0 0 .25 .55 0 0 0 .18 0 0 0 1 0"/></filter><filter id="distress"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="12"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070707" stop-opacity=".25"/><stop offset=".54" stop-color="#070707" stop-opacity=".1"/><stop offset="1" stop-color="#070707" stop-opacity=".93"/></linearGradient><linearGradient id="leftShade"><stop offset="0" stop-color="#090909" stop-opacity=".9"/><stop offset=".62" stop-color="#090909" stop-opacity=".25"/><stop offset="1" stop-color="#090909" stop-opacity="0"/></linearGradient><pattern id="halftone" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="#f1eee7" opacity=".22"/></pattern></defs>`;
  let body = "";

  if (design === "artwork-hero") {
    if (releaseStory) {
      const art = 760, ax = (w - art) / 2, ay = 170;
      body = `${paperLayer}<text x="${w / 2}" y="112" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" letter-spacing="9" fill="#272622">${eyebrow}</text>${photo(ax, ay, art, art)}<text x="${w / 2}" y="1005" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" font-weight="700" letter-spacing="5" fill="#151514">${xml(artistText.toUpperCase())}</text>${lines(titleText.toUpperCase(), w / 2, 1130, 24, 104, ink, "middle")}<path d="M90 1180H990" stroke="#827f76" stroke-width="2"/>${storyDescription(storyCopy, 90, 1240, 900, 410)}<text x="${w / 2}" y="1740" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" letter-spacing="8" fill="#292824">${status}</text>${footer(h - 24, ink, true)}`;
    } else if (landscape) {
      const art = h * .76, ax = 54, ay = (h - art) / 2, tx = ax + art + 58;
      body = `${paperLayer}<text x="${tx}" y="${h * .2}" font-family="Arial,sans-serif" font-size="18" letter-spacing="8" fill="#383630">${eyebrow}</text>${photo(ax, ay, art, art)}${lines(titleText.toUpperCase(), tx, h * .48, 18, h * .12, ink)}${escapedText(artistText.toUpperCase(), tx, h * .64, 24, "#292824", 'letter-spacing="4"')}${copy.supportingMetadata ? `<text x="${tx}" y="${h * .72}" font-family="Arial,sans-serif" font-size="15" letter-spacing="3" fill="#292824">${metadata}</text>` : ""}<text x="${tx}" y="${h * .82}" font-family="Arial,sans-serif" font-size="20" letter-spacing="7" fill="#292824">${status}</text>${footer(h - 35, ink, true)}`;
    } else {
      const art = Math.min(w * .78, h * (titleText.length > 24 ? .5 : .58)), ax = (w - art) / 2, ay = h * .105;
      body = `${paperLayer}<text x="${w / 2}" y="${h * .075}" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" letter-spacing="9" fill="#272622">${eyebrow}</text>${photo(ax, ay, art, art)}${lines(titleText.toUpperCase(), w / 2, ay + art + h * .105, 22, Math.min(92, w * .09), ink, "middle")}<text x="${w / 2}" y="${ay + art + h * .17}" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="700" letter-spacing="4" fill="#151514">${xml(artistText.toUpperCase())}</text>${copy.supportingMetadata ? `<text x="${w / 2}" y="${ay + art + h * .21}" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" letter-spacing="3" fill="#333">${metadata}</text>` : ""}<text x="${w / 2}" y="${h * .91}" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" letter-spacing="9" fill="#292824">${status}</text>${footer(h - 24, ink, true)}`;
    }
  } else if (design === "full-bleed") {
    const x = 56;
    const displaySize = releaseStory ? Math.min(h * .14, w * .12) : Math.min(h * .24, w * .18);
    const chars = Math.max(4, Math.floor((w - x * 2) / (displaySize * .56)));
    const titleY = releaseStory ? h * .53 : h * .59;
    body = `${photo(0, 0, w, h)}<rect width="${w}" height="${h}" fill="url(#shade)"/><rect width="${w * .72}" height="${h}" fill="url(#leftShade)"/><path d="M${x} ${h * .19}h${w * .19}" stroke="${accent}" stroke-width="7"/><text x="${x}" y="${h * .16}" fill="#f7f2e8" font-family="Arial,sans-serif" font-size="17" letter-spacing="7">${eyebrow}</text><text x="${x}" y="${h * .3}" fill="#f7f2e8" font-family="Arial,sans-serif" font-size="22" letter-spacing="9">${xml(artistText.toUpperCase())}</text>${lines(titleText.toUpperCase(), x, titleY, chars, displaySize, "#fff8ee")}${copy.supportingMetadata ? `<text x="${x}" y="${h * .7}" fill="#fff8ee" font-family="Arial,sans-serif" font-size="17" letter-spacing="4">${metadata}</text>` : ""}${releaseStory ? `<rect x="36" y="${h * .63}" width="${w - 72}" height="${h * .255}" fill="#e9e4d8"/>${storyDescription(storyCopy, 78, h * .675, w - 156, h * .185, "#24231f", 23)}<text x="${x}" y="${h * .91}" fill="#f7f2e8" font-family="Arial,sans-serif" font-size="22" letter-spacing="8">${status}</text>` : `<text x="${x}" y="${h * .79}" fill="#fff8ee" font-family="Arial,sans-serif" font-size="22" letter-spacing="8">${status}</text><rect x="${x}" y="${h * .83}" width="${w * .22}" height="5" fill="${accent}"/>`}${footer(h - 34)}`;
  } else if (design === "editorial") {
    const pad = 54, mast = h * .105, bottom = h * .94;
    if (releaseStory) {
      const imageY = 205, imageH = 555;
      body = `${paperLayer}<text x="${pad}" y="${mast}" fill="${ink}" font-family="Impact,sans-serif" font-size="46">FOR</text><text x="${pad + 82}" y="${mast}" fill="#292824" font-family="Arial,sans-serif" font-size="16" letter-spacing="4">${eyebrow}</text><text x="${w - pad}" y="${mast}" text-anchor="end" fill="#292824" font-family="Arial,sans-serif" font-size="16">${xml(date || "FULLY OPEN RECORDS")}</text><path d="M${pad} ${mast + 20}H${w - pad}" stroke="#292824" stroke-width="2"/>${photo(pad, imageY, w - pad * 2, imageH)}<text x="${pad}" y="${imageY + imageH + 84}" fill="#111211" font-family="Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="6">${xml(artistText.toUpperCase())}</text>${lines(titleText.toUpperCase(), pad, imageY + imageH + 180, 25, 86, ink)}${storyDescription(storyCopy, pad, imageY + imageH + 250, w - pad * 2, 420, "#292824", 30)}<text x="${pad}" y="${h * .83}" fill="#22211f" font-family="Arial,sans-serif" font-size="20" font-weight="700" letter-spacing="6">${status}</text><rect x="${pad}" y="${h * .86}" width="${w - pad * 2}" height="76" fill="#111211"/><text x="${pad + 20}" y="${h * .86 + 47}" fill="#f4f0e8" font-family="Impact,sans-serif" font-size="26" letter-spacing="1">${xml(ctaText)} →</text>`;
    } else if (landscape) {
      body = `${paperLayer}<text x="${pad}" y="${mast}" fill="${ink}" font-family="Impact,sans-serif" font-size="46">FOR</text><text x="${pad + 82}" y="${mast}" fill="#292824" font-family="Arial,sans-serif" font-size="16" letter-spacing="4">${eyebrow}</text><text x="${w - pad}" y="${mast}" text-anchor="end" fill="#292824" font-family="Arial,sans-serif" font-size="16">${xml(date || "FULLY OPEN RECORDS")}</text><path d="M${pad} ${mast + 20}H${w - pad}" stroke="#292824" stroke-width="2"/>${photo(w * .53, mast + 42, w * .42, h * .75)}<text x="${pad}" y="${h * .3}" fill="#141413" font-family="Impact,sans-serif" font-size="${h * .1}">${xml(artistText.toUpperCase())}</text>${lines(titleText.toUpperCase(), pad, h * .48, 14, h * .083, ink)}${bodyLines(editorialCopy, pad, h * .72, 68, 17, "#252420")}<rect x="${pad}" y="${h * .82}" width="${w * .35}" height="56" fill="#111211"/><text x="${pad + 18}" y="${h * .82 + 36}" fill="#f4f0e8" font-family="Impact,sans-serif" font-size="24" letter-spacing="1">${xml(copy.ctaLabel)} →</text>`;
    } else {
      const ix = pad, iy = mast + 42, iw = w - pad * 2, ih = h * .39;
      body = `${paperLayer}<text x="${pad}" y="${mast}" fill="${ink}" font-family="Impact,sans-serif" font-size="47">FOR</text><text x="${pad + 82}" y="${mast}" fill="#292824" font-family="Arial,sans-serif" font-size="16" letter-spacing="3">${eyebrow}</text><text x="${w - pad}" y="${mast}" text-anchor="end" fill="#292824" font-family="Arial,sans-serif" font-size="16">${xml(date || "FULLY OPEN RECORDS")}</text><path d="M${pad} ${mast + 20}H${w - pad}" stroke="#292824" stroke-width="2"/>${photo(ix, iy, iw, ih)}<text x="${pad}" y="${iy + ih + 120}" fill="#111211" font-family="Impact,sans-serif" font-size="${w * .1}">${xml(artistText.toUpperCase())}</text>${lines(titleText.toUpperCase(), pad, iy + ih + 196, 23, w * .064, ink)}${bodyLines(editorialCopy, pad, h * .84, 62, 16, "#292824")}<rect x="${pad}" y="${h * .89}" width="${w - pad * 2}" height="70" fill="#111211"/><text x="${pad + 18}" y="${h * .89 + 44}" fill="#f4f0e8" font-family="Impact,sans-serif" font-size="27" letter-spacing="1">${xml(copy.ctaLabel)} ON FULLY OPEN RECORDS →</text>`;
    }
  } else if (design === "brutalist") {
    const artX = landscape ? w * .45 : w * .32, artY = landscape ? h * .2 : h * .25;
    const artW = landscape ? w * .48 : w * .65, artH = landscape ? h * .62 : h * .52;
    const repeated = titleText.toUpperCase();
    if (releaseStory) {
      body = `<rect width="${w}" height="${h}" fill="#101010"/><rect width="${w}" height="${h}" fill="url(#halftone)"/><rect x="0" y="${h * .08}" width="${w}" height="8" fill="${accent}"/><text x="${w * .04}" y="${h * .075}" fill="${accent}" font-family="Arial,sans-serif" font-size="19" font-weight="900" letter-spacing="6">${eyebrow} / ${eyebrow} / ${eyebrow}</text>${[0,1,2].map(i=>`<text x="${w*.035}" y="${h*(.25+i*.15)}" fill="#f0ece2" font-family="Impact,sans-serif" font-size="${Math.min(h*.17,w*.14)}" letter-spacing="-3" filter="url(#distress)">${xml(repeated)}</text>`).join("")}${photo(w * .32, h * .2, w * .65, h * .43)}<rect x="${w * .92}" y="${h * .2}" width="${w * .04}" height="${h * .43}" fill="${accent}" opacity=".72"/><text x="${w*.045}" y="${h*.68}" fill="#f2eee5" font-family="Impact,sans-serif" font-size="${Math.min(w*.085,85)}">${xml(artistText.toUpperCase())}</text><rect x="${w*.04}" y="${h*.695}" width="${w*.92}" height="${h*.17}" fill="#111" opacity=".94"/>${storyDescription(storyCopy, w * .065, h * .73, w * .87, h * .12, "#f2eee5", 21)}<text x="${w*.045}" y="${h*.885}" fill="#f2eee5" font-family="Arial,sans-serif" font-size="21" letter-spacing="6">${status}</text><rect x="${w*.04}" y="${h*.9}" width="${w*.3}" height="${h*.06}" fill="${accent}"/><text x="${w*.055}" y="${h*.94}" fill="#111" font-family="Impact,sans-serif" font-size="20">${xml(ctaText)} →</text>${footer(h - 20)}`;
    } else {
      body = `<rect width="${w}" height="${h}" fill="#101010"/><rect width="${w}" height="${h}" fill="url(#halftone)"/><rect x="0" y="${h * .08}" width="${w}" height="8" fill="${accent}"/><text x="${w * .04}" y="${h * .075}" fill="${accent}" font-family="Arial,sans-serif" font-size="19" font-weight="900" letter-spacing="6">${eyebrow} / ${eyebrow} / ${eyebrow}</text>${[0,1,2].map(i=>`<text x="${w*.035}" y="${h*(.25+i*.18)}" fill="#f0ece2" font-family="Impact,sans-serif" font-size="${Math.min(h*.19,w*.16)}" letter-spacing="-3" filter="url(#distress)">${xml(repeated)}</text>`).join("")}${photo(artX, artY, artW, artH)}<rect x="${artX + artW * .82}" y="${artY}" width="${artW * .06}" height="${artH}" fill="${accent}" opacity=".72"/><text x="${w*.045}" y="${h*.77}" fill="#f2eee5" font-family="Impact,sans-serif" font-size="${Math.min(w*.085,85)}">${xml(artistText.toUpperCase())}</text><text x="${w*.045}" y="${h*.85}" fill="#f2eee5" font-family="Arial,sans-serif" font-size="22" letter-spacing="6">${status}</text><rect x="${w*.04}" y="${h*.9}" width="${w*.26}" height="${h*.06}" fill="${accent}"/><text x="${w*.055}" y="${h*.94}" fill="#111" font-family="Impact,sans-serif" font-size="20">${xml(ctaText)} →</text>${footer(h - 20)}`;
    }
  } else if (design === "gig-poster") {
    const artY = h * .24, artH = h * .36;
    const venue = content.venue || "VENUE TBC";
    const dateCopy = date || "DATE TO BE ANNOUNCED";
    body = `<rect width="${w}" height="${h}" fill="#111210"/>${photo(0, artY, w, artH)}<rect y="${artY}" width="${w}" height="${artH}" fill="#000" opacity=".24"/><text x="${w/2}" y="${h*.17}" text-anchor="middle" fill="#ef402e" font-family="Impact,sans-serif" font-size="${Math.min(w*.17,150)}" letter-spacing="-3">${xml(artistText.toUpperCase())}</text><text x="${w*.08}" y="${h*.26}" fill="#ede6d8" font-family="Georgia,serif" font-size="${h*.075}" font-style="italic" transform="rotate(-8 ${w*.08} ${h*.26})">${eyebrow}</text><text x="${w*.06}" y="${h*.72}" fill="#eee8db" font-family="Impact,sans-serif" font-size="${w*.095}">${xml(venue.toUpperCase())}</text><text x="${w*.06}" y="${h*.78}" fill="#eee8db" font-family="Impact,sans-serif" font-size="${w*.055}">${xml((content.location || "CITY TBC").toUpperCase())}</text><text x="${w*.06}" y="${h*.85}" fill="#eee8db" font-family="Impact,sans-serif" font-size="${w*.052}">${xml(dateCopy.toUpperCase())}</text>${content.time ? `<text x="${w*.06}" y="${h*.89}" fill="#eee8db" font-family="Arial,sans-serif" font-size="16" letter-spacing="3">${xml(content.time.toUpperCase())}</text>` : ""}<rect x="${w*.62}" y="${h*.82}" width="${w*.34}" height="${h*.09}" fill="${accent}"/><text x="${w*.79}" y="${h*.878}" text-anchor="middle" fill="#111" font-family="Impact,sans-serif" font-size="22">${xml(copy.ctaLabel)} →</text>${footer(h - 18)}`;
  } else if (design === "type-only") {
    const titleSize = Math.min(h * .2, w * .17);
    if (releaseStory) {
      body = `<rect width="${w}" height="${h}" fill="#111211"/><path d="M${w*.89} 0v${h}" stroke="${accent}" stroke-width="${w*.045}"/><path d="M${w*.94} 0v${h}" stroke="#efeee7" stroke-width="${w*.008}" opacity=".35"/><rect x="${w*.91}" width="${w*.09}" height="${h}" fill="url(#halftone)"/><text x="${w*.07}" y="${h*.1}" fill="#eee9de" font-family="Arial,sans-serif" font-size="18" letter-spacing="7">${eyebrow}</text>${[0,1].map(i=>`<text x="${w*.06}" y="${h*(.31+i*.19)}" fill="${i===1?accent:"#f0ede5"}" font-family="Impact,sans-serif" font-size="${Math.min(titleSize,290)}" letter-spacing="-3">${xml(titleText.toUpperCase())}</text>`).join("")}<text x="${w*.07}" y="${h*.56}" fill="#ded9ce" font-family="Arial,sans-serif" font-size="22" letter-spacing="8">${xml(artistText.toUpperCase())}</text><path d="M${w*.07} ${h*.59}h${w*.2}" stroke="#eee9de" stroke-width="2"/><rect x="${w*.05}" y="${h*.615}" width="${w*.81}" height="${h*.24}" fill="#191a18"/>${storyDescription(storyCopy, w*.075, h*.655, w*.75, h*.17, "#eee9de", 24)}<text x="${w*.07}" y="${h*.89}" fill="#eee9de" font-family="Arial,sans-serif" font-size="21" letter-spacing="8">${status}</text>${footer(h - 20)}`;
    } else {
      body = `<rect width="${w}" height="${h}" fill="#111211"/><path d="M${w*.89} 0v${h}" stroke="${accent}" stroke-width="${w*.045}"/><path d="M${w*.94} 0v${h}" stroke="#efeee7" stroke-width="${w*.008}" opacity=".35"/><rect x="${w*.91}" width="${w*.09}" height="${h}" fill="url(#halftone)"/><text x="${w*.07}" y="${h*.1}" fill="#eee9de" font-family="Arial,sans-serif" font-size="18" letter-spacing="7">${eyebrow}</text>${[0,1,2].map(i=>`<text x="${w*.06}" y="${h*(.35+i*.2)}" fill="${i===1?accent:"#f0ede5"}" font-family="Impact,sans-serif" font-size="${titleSize}" letter-spacing="-3">${xml(titleText.toUpperCase())}</text>`).join("")}<text x="${w*.07}" y="${h*.72}" fill="#eee9de" font-family="Arial,sans-serif" font-size="18" letter-spacing="5">${metadata}</text><text x="${w*.07}" y="${h*.81}" fill="#ded9ce" font-family="Arial,sans-serif" font-size="22" letter-spacing="8">${xml(artistText.toUpperCase())}</text><path d="M${w*.07} ${h*.85}h${w*.2}" stroke="#eee9de" stroke-width="2"/><text x="${w*.07}" y="${h*.91}" fill="#eee9de" font-family="Arial,sans-serif" font-size="21" letter-spacing="8">${status}</text>${footer(h - 20)}`;
    }
  } else if (design === "split") {
    const vertical = !landscape;
    const aw = vertical ? w : w * .5, ah = vertical ? h * (releaseStory ? .42 : .52) : h;
    const bx = vertical ? 0 : aw, by = vertical ? ah : 0, bw = vertical ? w : w - aw, bh = vertical ? h - ah : h;
    const pad = Math.min(w, h) * .07, tx = bx + pad, ty = by + bh * .08;
    const splitSize = Math.min(bw * .19, bh * .16);
    const splitChars = Math.max(4, Math.floor((bw - pad * 2) / (splitSize * .56)));
    if (releaseStory) {
      body = `${paperLayer}${photo(0, 0, aw, ah)}<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${paper}"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" filter="url(#paperGrain)" opacity=".14"/><text x="${tx}" y="${ty + bh*.06}" fill="#252420" font-family="Arial,sans-serif" font-size="17" letter-spacing="7">${eyebrow}</text>${lines(titleText.toUpperCase(), tx, by + bh*.28, splitChars, Math.min(splitSize, 125), ink)}<text x="${tx}" y="${by + bh*.43}" fill="#22211f" font-family="Arial,sans-serif" font-size="20" letter-spacing="7">${xml(artistText.toUpperCase())}</text><path d="M${tx} ${by + bh*.47}h${bw*.18}" stroke="#111" stroke-width="3"/>${storyDescription(storyCopy, tx, by + bh*.53, bw - pad * 2, bh*.27, "#292824", 23)}<text x="${tx}" y="${by + bh*.91}" fill="#252420" font-family="Arial,sans-serif" font-size="20" letter-spacing="6">${status}</text>${footer(h - 34, ink, true)}`;
    } else {
      body = `${paperLayer}${photo(0, 0, aw, ah)}<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${paper}"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" filter="url(#paperGrain)" opacity=".14"/><text x="${tx}" y="${ty + bh*.04}" fill="#252420" font-family="Arial,sans-serif" font-size="17" letter-spacing="7">${eyebrow}</text>${lines(titleText.toUpperCase(), tx, ty + bh*.25, splitChars, splitSize, ink)}<text x="${tx}" y="${ty + bh*.58}" fill="#22211f" font-family="Arial,sans-serif" font-size="20" letter-spacing="7">${xml(artistText.toUpperCase())}</text>${copy.supportingMetadata ? `<text x="${tx}" y="${ty + bh*.64}" fill="#22211f" font-family="Arial,sans-serif" font-size="14" letter-spacing="3">${metadata}</text>` : ""}<path d="M${tx} ${ty + bh*.68}h${bw*.18}" stroke="#111" stroke-width="3"/><text x="${tx}" y="${ty + bh*.72}" fill="#252420" font-family="Arial,sans-serif" font-size="20" letter-spacing="6">${status}</text>${footer(h - 34, ink, true)}`;
    }
  } else {
    const strip = h * (releaseStory ? .57 : landscape ? .36 : .31), photoH = h - strip;
    const catalog = content.catalogNumber || (content.contentType === "release" ? "FOR RELEASE" : "FOR 0027");
    if (releaseStory) {
      body = `${photo(0,0,w,photoH)}<rect y="${photoH}" width="${w}" height="${strip}" fill="${paper}"/><rect y="${photoH}" width="${w}" height="${strip}" filter="url(#paperGrain)" opacity=".14"/><text x="58" y="${photoH + 52}" fill="#111" font-family="Arial,sans-serif" font-size="18" font-weight="800" letter-spacing="3">${xml(catalog.toUpperCase())}  /  ${eyebrow}</text><g transform="translate(${w-225} ${photoH+18})" fill="#111">${Array.from({length:31},(_,i)=>`<rect x="${i*5}" y="0" width="${i%4===0?3:1.5}" height="${strip*.12}"/>`).join("")}</g><path d="M58 ${photoH+72}H${w-58}" stroke="#111" stroke-width="2"/>${lines(titleText.toUpperCase(),58,photoH+210,28,78,ink)}<text x="58" y="${photoH+285}" fill="#111" font-family="Arial,sans-serif" font-size="19" font-weight="700" letter-spacing="4">${xml(artistText.toUpperCase())}</text>${storyDescription(storyCopy, 58, photoH + 350, w - 116, 445, "#24231f", 23)}<text x="58" y="${h-82}" fill="#111" font-family="Arial,sans-serif" font-size="20" font-weight="700" letter-spacing="5">${xml(status)}</text><text x="58" y="${h-30}" fill="#111" font-family="Arial,sans-serif" font-size="17" font-weight="700" letter-spacing="3">${xml(catalog.toUpperCase())}  /  FULLY OPEN RECORDS</text><text x="${w-58}" y="${h-30}" text-anchor="end" fill="#111" font-family="Arial,sans-serif" font-size="16" letter-spacing="2">${xml(ctaText)}  →</text>`;
    } else {
      body = `${photo(0,0,w,photoH)}<rect y="${photoH}" width="${w}" height="${strip}" fill="${paper}"/><rect y="${photoH}" width="${w}" height="${strip}" filter="url(#paperGrain)" opacity=".14"/><text x="58" y="${photoH + 48}" fill="#111" font-family="Arial,sans-serif" font-size="18" font-weight="800" letter-spacing="3">${xml(catalog.toUpperCase())}  /  ${eyebrow}</text><g transform="translate(${w-225} ${photoH+20})" fill="#111">${Array.from({length:31},(_,i)=>`<rect x="${i*5}" y="0" width="${i%4===0?3:1.5}" height="${strip*.26}"/>`).join("")}</g><path d="M58 ${photoH+62}H${w-58}" stroke="#111" stroke-width="2"/>${lines(titleText.toUpperCase(),58,photoH+strip*.62,landscape?38:24,Math.min(strip*.3,w*.075),ink)}<text x="58" y="${h-30}" fill="#111" font-family="Arial,sans-serif" font-size="17" font-weight="700" letter-spacing="3">${xml(artistText.toUpperCase())}  /  ${xml(status || date || copy.releaseLabel)}</text><text x="${w-58}" y="${h-30}" text-anchor="end" fill="#111" font-family="Arial,sans-serif" font-size="16" letter-spacing="2">${xml(ctaText)}  →</text>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}<title>${xml(titleText)} — ${xml(artistText)} | Fully Open Records</title>${body}</svg>`;
}

export async function renderSharePng(
  svg: string,
  width: number,
  height: number,
) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(
          new Error(
            "The artwork could not be loaded for export. Try uploading the image to Fully Open first.",
          ),
        );
      image.src = objectUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context)
      throw new Error("Image export is unavailable in this browser.");
    context.drawImage(image, 0, 0, width, height);
    const png = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png", 1),
    );
    if (!png) throw new Error("Could not create the PNG image.");
    return png;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

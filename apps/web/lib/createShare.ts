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
  artistName: string;
  title: string;
  subtitle?: string;
  image?: string | null;
  date?: string | null;
  venue?: string | null;
  location?: string | null;
  time?: string | null;
  details?: string | null;
  cta: string;
  url: string;
};

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
  { id: "editorial", label: "Editorial", types: ["press", "artist"] },
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
  try {
    const parsed = new URL(image, "https://fullyopenrecords.com");
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : "";
  } catch {
    return "";
  }
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
  const accent = options.palette?.accent ?? "#ee5b48";
  const darkAccent =
    accent
      .replace(/^#/, "")
      .match(/.{2}/g)
      ?.map((part) =>
        Math.round(Number.parseInt(part, 16) * 0.58)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("") ?? "96392e";
  const paperAccent =
    accent
      .replace(/^#/, "")
      .match(/.{2}/g)
      ?.map((part) =>
        Math.round(Number.parseInt(part, 16) * 0.62)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("") ?? "96392e";
  const titleText = fitText(options.headline?.trim() || content.title, 72);
  const title = xml(titleText);
  const artistText = fitText(content.artistName, 68);
  const artist = xml(artistText);
  const subtitle = xml(
    fitText(
      options.supportingText?.trim() ||
        content.subtitle ||
        content.details ||
        "",
      118,
    ),
  );
  const image = safeImage(options.image ?? content.image);
  const cta = xml(content.cta.toUpperCase());
  const date = xml(dateLabel(content.date));
  const venue = xml(content.venue || "");
  const location = xml(content.location || "");
  const imageEl = (x: number, y: number, iw: number, ih: number, radius = 0) =>
    image
      ? `<image href="${xml(image)}" crossorigin="anonymous" x="${x}" y="${y}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid slice"${radius ? ` clip-path="inset(0 round ${radius}px)"` : ""}/>`
      : `<rect x="${x}" y="${y}" width="${iw}" height="${ih}" fill="#262624"/><text x="${x + iw / 2}" y="${y + ih / 2}" fill="#efede7" font-size="${Math.min(iw, ih) * 0.07}" text-anchor="middle" letter-spacing="8">UPLOAD ARTWORK</text>`;
  const textBlockFor = (
    value: string,
    x: number,
    y: number,
    maxChars: number,
    fill: string,
    large: number,
    anchor = "start",
  ) => {
    const lines = wrap(value, maxChars);
    return `<text x="${x}" y="${y}" fill="${fill}" font-family="Arial,Helvetica,sans-serif" font-size="${large}" font-weight="800" text-anchor="${anchor}" letter-spacing="-2">${lines.map((line, index) => `<tspan x="${x}" dy="${index ? large * 1.02 : 0}">${xml(line)}</tspan>`).join("")}</text>`;
  };
  const textBlock = (
    x: number,
    y: number,
    maxChars: number,
    fill: string,
    large: number,
    anchor = "start",
  ) => textBlockFor(titleText, x, y, maxChars, fill, large, anchor);
  const artistBlock = (
    x: number,
    y: number,
    maxChars: number,
    fill: string,
    large: number,
    anchor = "start",
  ) => textBlockFor(artistText, x, y, maxChars, fill, large, anchor);
  const footer = (y: number, fill: string, brandFill = fill) =>
    `<text x="64" y="${y}" fill="${brandFill}" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="700" letter-spacing="2">FOR / FULLY OPEN RECORDS</text><text x="${w - 64}" y="${y}" fill="${fill}" font-family="Arial,Helvetica,sans-serif" font-size="19" text-anchor="end" letter-spacing="1">${cta}  ↗</text>`;
  let body = "";

  if (design === "artwork-hero") {
    const pad = Math.round(w * 0.075);
    const header = Math.round(h * 0.115);
    const footerY = h - Math.round(h * 0.055);
    const artSize = Math.min(
      w - pad * 2,
      Math.round(h * (landscape ? 0.62 : 0.5)),
    );
    const artX = landscape ? pad : (w - artSize) / 2;
    const artY = landscape ? (h - artSize) / 2 : header;
    const copyX = landscape ? artX + artSize + 42 : pad;
    const artistY = landscape ? h * 0.34 : artY + artSize + 48;
    const titleY = landscape ? h * 0.48 : artY + artSize + 108;
    const dateY = landscape
      ? h * 0.79
      : artY + artSize + Math.min(h * 0.29, 315);
    body = `<rect width="${w}" height="${h}" fill="#f1eee6"/><text x="${w / 2}" y="${header * 0.53}" text-anchor="middle" fill="#34322f" font-family="Arial,Helvetica,sans-serif" font-size="22" letter-spacing="10">${content.contentType === "release" ? "NEW RELEASE" : "NEW SINGLE"}</text>${imageEl(artX, artY, artSize, artSize)}${artistBlock(copyX, artistY, landscape ? 42 : 32, "#78736b", 22)}${textBlock(copyX, titleY, landscape ? 26 : 24, "#171716", landscape ? 65 : 58)}<text x="${copyX}" y="${dateY}" fill="#47443f" font-family="Arial,Helvetica,sans-serif" font-size="22" letter-spacing="5">${date ? `OUT ${date}` : "OUT NOW"}</text>${footer(footerY, "#22211f")}`;
  } else if (design === "full-bleed") {
    body = `<rect width="${w}" height="${h}" fill="#171615"/>${imageEl(0, 0, w, h)}<defs><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="48%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".82"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#shade)"/><text x="64" y="${h * 0.66}" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="24" letter-spacing="7">${content.contentType === "gig" ? "LIVE" : content.contentType === "artist" ? "ARTIST PROFILE" : "NEW RELEASE"}</text>${artistBlock(64, h * 0.72, landscape ? 46 : 38, "#fff", 21)}${textBlock(64, h * 0.81, landscape ? 36 : 24, "#fff", landscape ? 76 : 58)}${footer(h - 36, "#fff")}`;
  } else if (design === "editorial") {
    const top = Math.round(h * 0.09);
    const ix = landscape ? w * 0.48 : 64;
    const iy = landscape ? top + 35 : top + 52;
    const iw = landscape ? w * 0.46 : w - 128;
    const ih = landscape ? h - 250 : h * 0.39;
    const headlineY = landscape ? top + 128 : iy + ih + Math.min(h * 0.13, 140);
    body = `<rect width="${w}" height="${h}" fill="#efece4"/><text x="64" y="${top}" fill="#171716" font-family="Arial,Helvetica,sans-serif" font-size="27" font-weight="900">FOR</text><text x="145" y="${top}" fill="#4b4943" font-family="Arial,Helvetica,sans-serif" font-size="17" letter-spacing="3">/ ${content.contentType === "press" ? "ARTIST NEWS" : content.contentType.toUpperCase()}</text><text x="${w - 64}" y="${top}" fill="#4b4943" font-family="Arial,Helvetica,sans-serif" font-size="17" text-anchor="end" letter-spacing="2">${date}</text><path d="M64 ${top + 24}H${w - 64}" stroke="#34322f" stroke-width="2"/>${imageEl(landscape ? 64 : 64, iy, landscape ? w * 0.37 : iw, ih)}${artistBlock(64, landscape ? top + 95 : headlineY, landscape ? 42 : 34, "#777168", 20)}${textBlock(64, landscape ? headlineY + 64 : headlineY + 86, landscape ? 20 : 24, "#171716", landscape ? 67 : 60)}<text x="64" y="${h - 155}" fill="#383630" font-family="Arial,Helvetica,sans-serif" font-size="23">${subtitle}</text><text x="64" y="${h - 84}" fill="#${paperAccent}" font-family="Arial,Helvetica,sans-serif" font-size="23" font-weight="800" letter-spacing="2">${cta}  →</text><text x="${w - 64}" y="${h - 84}" fill="#34322f" font-family="Arial,Helvetica,sans-serif" font-size="20" text-anchor="end" letter-spacing="2">FULLY OPEN RECORDS</text>`;
  } else if (design === "brutalist") {
    const art = Math.min(w * 0.62, h * 0.36);
    const artistSize =
      artistText.length > 38 ? (landscape ? 55 : 46) : landscape ? 72 : 61;
    body = `<rect width="${w}" height="${h}" fill="#111110"/><path d="M0 ${h * 0.16}H${w}" stroke="${accent}" stroke-width="9"/><text x="40" y="${h * 0.13}" fill="${accent}" font-family="Arial,Helvetica,sans-serif" font-size="30" font-weight="900" letter-spacing="5">${content.contentType === "gig" ? "LIVE / LIVE / LIVE" : "NEW / NEW / NEW"}</text>${artistBlock(w / 2, h * 0.25, landscape ? 46 : 36, "#f1eee7", artistSize, "middle")}${imageEl((w - art) / 2, h * 0.34, art, art)}${textBlock(w / 2, h * 0.34 + art + 55, landscape ? 34 : 22, "#f1eee7", landscape ? 60 : 49, "middle")}<text x="${w / 2}" y="${h - 135}" fill="${accent}" font-family="Arial,Helvetica,sans-serif" font-size="26" font-weight="800" text-anchor="middle" letter-spacing="5">${date || "OUT NOW"}</text><text x="64" y="${h - 54}" fill="#f1eee7" font-family="Arial,Helvetica,sans-serif" font-size="21" letter-spacing="2">FOR / FULLY OPEN RECORDS</text><text x="${w - 64}" y="${h - 54}" fill="#f1eee7" font-family="Arial,Helvetica,sans-serif" font-size="20" text-anchor="end">${cta} ↗</text>`;
  } else if (design === "gig-poster") {
    const art = Math.min(w * 0.72, h * 0.3);
    const venueY = h * 0.66;
    const artistSize = artistText.length > 25 ? 36 : landscape ? 80 : 62;
    const eventTitle =
      content.title !== content.venue
        ? textBlockFor(
            content.title,
            w / 2,
            venueY + 84,
            landscape ? 42 : 30,
            "#bcb6aa",
            19,
            "middle",
          )
        : "";
    body = `<rect width="${w}" height="${h}" fill="#151413"/><rect width="${w}" height="${h * 0.24}" fill="#${darkAccent}"/>${artistBlock(w / 2, h * 0.075, landscape ? 38 : 30, "#fff8ec", artistSize, "middle")}<text x="${w / 2}" y="${h * 0.29}" fill="#f1eee7" font-family="Arial,Helvetica,sans-serif" font-size="28" font-weight="800" text-anchor="middle" letter-spacing="10">LIVE</text>${imageEl((w - art) / 2, h * 0.32, art, art)}${textBlockFor(content.venue || content.title, w / 2, venueY + 42, landscape ? 30 : 22, "#f1eee7", 42, "middle")}${eventTitle}<text x="${w / 2}" y="${venueY + 122}" fill="${accent}" font-family="Arial,Helvetica,sans-serif" font-size="26" font-weight="800" text-anchor="middle" letter-spacing="3">${location}</text><text x="${w / 2}" y="${venueY + 162}" fill="#f1eee7" font-family="Arial,Helvetica,sans-serif" font-size="28" font-weight="700" text-anchor="middle" letter-spacing="4">${date}</text>${content.time ? `<text x="${w / 2}" y="${venueY + 199}" fill="#f1eee7" font-family="Arial,Helvetica,sans-serif" font-size="20" font-weight="700" text-anchor="middle" letter-spacing="3">${xml(content.time)}</text>` : ""}<text x="${w / 2}" y="${h - 120}" fill="#f1eee7" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="800" text-anchor="middle" letter-spacing="3">${cta} →</text><text x="${w / 2}" y="${h - 65}" fill="#c7c2b7" font-family="Arial,Helvetica,sans-serif" font-size="18" text-anchor="middle" letter-spacing="3">FULLY OPEN RECORDS</text>`;
  } else if (design === "type-only") {
    body = `<rect width="${w}" height="${h}" fill="#141413"/><path d="M0 ${h * 0.17}H${w}" stroke="${accent}" stroke-width="16"/><text x="44" y="${h * 0.145}" fill="#f1eee7" font-family="Arial,Helvetica,sans-serif" font-size="22" letter-spacing="6">${content.contentType === "press" ? "ARTIST NEWS" : "NEW / FULLY OPEN RECORDS"}</text>${artistBlock(w * 0.08, h * 0.38, landscape ? 30 : 22, "#77736d", landscape ? 100 : 60)}${textBlock(w * 0.08, h * 0.57, landscape ? 28 : 22, "#f1eee7", Math.min(92, w * 0.09))}<text x="${w * 0.08}" y="${h * 0.79}" fill="${accent}" font-family="Arial,Helvetica,sans-serif" font-size="38" font-weight="800" letter-spacing="4">${date || "OUT NOW"}</text><text x="${w * 0.08}" y="${h - 80}" fill="#f1eee7" font-family="Arial,Helvetica,sans-serif" font-size="21" letter-spacing="3">${cta} ↗  /  FULLY OPEN RECORDS</text>`;
  } else if (design === "split") {
    const verticalSplit = !landscape;
    const artW = verticalSplit ? w : w * 0.49;
    const artH = verticalSplit ? h * 0.52 : h;
    const pad = Math.min(w, h) * 0.07;
    const textX = verticalSplit ? pad : artW + pad;
    const textY = verticalSplit ? artH + h * 0.13 : h * 0.28;
    body = `<rect width="${w}" height="${h}" fill="#f0ede5"/>${imageEl(0, 0, artW, artH)}<rect x="${verticalSplit ? 0 : artW}" y="${verticalSplit ? artH : 0}" width="${verticalSplit ? w : w - artW}" height="${verticalSplit ? h - artH : h}" fill="#f0ede5"/><text x="${textX}" y="${textY}" fill="#777168" font-family="Arial,Helvetica,sans-serif" font-size="22" letter-spacing="5">${content.contentType.toUpperCase()}</text>${artistBlock(textX, textY + 72, verticalSplit ? 30 : 34, "#393733", 22)}${textBlock(textX, textY + 160, verticalSplit ? 24 : 22, "#171716", verticalSplit ? 65 : 72)}<text x="${textX}" y="${h - 180}" fill="#383630" font-family="Arial,Helvetica,sans-serif" font-size="24">${date}</text><text x="${textX}" y="${h - 85}" fill="#${paperAccent}" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="800" letter-spacing="2">${cta}  →</text>`;
  } else {
    const stripH = Math.round(h * (landscape ? 0.39 : 0.4));
    body = `<rect width="${w}" height="${h}" fill="#22211f"/>${imageEl(0, 0, w, h - stripH)}<rect x="0" y="${h - stripH}" width="${w}" height="${stripH}" fill="#f0ede5"/><text x="64" y="${h - stripH + 58}" fill="#171716" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="800" letter-spacing="2">FOR / ${xml(content.contentType === "release" ? "RELEASE" : "SINGLE")}</text><text x="${w - 64}" y="${h - stripH + 58}" fill="#171716" font-family="Arial,Helvetica,sans-serif" font-size="19" text-anchor="end">${date}</text><path d="M64 ${h - stripH + 78}H${w - 64}" stroke="#171716" stroke-width="2"/>${textBlock(64, h - stripH + 155, landscape ? 34 : 26, "#171716", landscape ? 50 : 48)}<text x="64" y="${h - 32}" fill="#171716" font-family="Arial,Helvetica,sans-serif" font-size="19" font-weight="700" letter-spacing="2">${artist}</text><text x="${w - 64}" y="${h - 32}" fill="#171716" font-family="Arial,Helvetica,sans-serif" font-size="19" text-anchor="end" letter-spacing="1">${cta} ↗</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><title>${title} — ${artist} | Fully Open Records</title>${body}</svg>`;
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

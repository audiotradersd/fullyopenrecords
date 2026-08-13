import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PublicArtistPage from "../../../components/artists/PublicArtistPage";
import { getArtist, getArtistContent } from "../../../lib/api";
import {
  buildArtistFallback,
  mergeArtistRecordWithLivePreference,
  normalizeArtistSlug
} from "../../../lib/artistProfiles";
import { mergeArtistPageContent } from "../../../lib/artistPageContent";
import { noIndexMetadata, pageMetadata } from "../../../lib/seo";


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug: paramSlug } = await params;
  const slug = normalizeArtistSlug(paramSlug);
  const artist = await getArtist(slug).then((entry) => mergeArtistRecordWithLivePreference(entry)).catch(() => buildArtistFallback(slug));
  if (!artist) return noIndexMetadata;

  const record = artist as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name : slug;
  const bio = typeof record.bio === "string" ? record.bio.replace(/\s+/g, " ").trim() : "";
  const genres = Array.isArray(record.genres) ? record.genres.filter((genre): genre is string => typeof genre === "string") : [];
  const location = typeof record.location === "string" ? record.location.trim() : "";
  const genreLabel = genres.slice(0, 2).join(" and ");
  const context = [genreLabel, location].filter(Boolean).join(" from ");
  const description = bio || `${name} is an independent artist${context ? ` — ${context}` : ""} on Fully Open.`;
  const titleContext = genreLabel ? `Independent ${genreLabel} Artist` : "Independent Artist";
  const title = `${name} — ${titleContext}${location ? ` from ${location}` : ""}`;
  const image = [record.profileImage, record.heroImage, record.image].find((value): value is string => typeof value === "string" && value.length > 0);

  return pageMetadata({ title, description: description.slice(0, 155), path: `/artist/${slug}`, image });
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: paramSlug } = await params;
  const canonicalSlug = normalizeArtistSlug(paramSlug);

  if (canonicalSlug && canonicalSlug !== paramSlug) {
    redirect(`/artist/${canonicalSlug}`);
  }

  const artist = await getArtist(canonicalSlug)
    .then((entry) => mergeArtistRecordWithLivePreference(entry))
    .catch(() => buildArtistFallback(canonicalSlug));

  if (!artist) {
    notFound();
  }

  const content = await getArtistContent(canonicalSlug).catch(() => null);
  const mergedContent = mergeArtistPageContent(canonicalSlug, artist, content);
  const record = artist as Record<string, unknown>;
  const socialLinks = record.socialLinks && typeof record.socialLinks === "object"
    ? Object.values(record.socialLinks).filter((value): value is string => typeof value === "string" && value.length > 0)
    : [];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: String(record.name ?? canonicalSlug),
    url: `https://fullyopenrecords.com/artist/${canonicalSlug}`,
    description: typeof record.bio === "string" ? record.bio : undefined,
    genre: Array.isArray(record.genres) ? record.genres.filter((genre): genre is string => typeof genre === "string") : undefined,
    image: [record.profileImage, record.heroImage, record.image].find((value): value is string => typeof value === "string" && value.length > 0),
    sameAs: socialLinks.length ? socialLinks : undefined
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <PublicArtistPage artist={artist} content={mergedContent} slug={canonicalSlug} />
  </>;
}

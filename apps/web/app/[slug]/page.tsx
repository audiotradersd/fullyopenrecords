import { notFound, redirect } from "next/navigation";
import { normalizeArtistSlug } from "../../lib/artistProfiles";


export default async function RootArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const reserved = new Set([
    "about",
    "account",
    "artists",
    "artist",
    "contact",
    "faq",
    "get-heard",
    "radio",
    "releases",
    "robots.txt",
    "sitemap.xml",
    "store",
    "submit-music",
    "api"
  ]);

  if (reserved.has(slug)) {
    notFound();
  }
  redirect(`/artist/${normalizeArtistSlug(slug)}`);
}

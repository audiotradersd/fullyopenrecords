import type { MetadataRoute } from "next";
import { getApiBaseUrl } from "../lib/server-api";
import { siteConfig } from "../lib/site";

const staticPaths = ["", "/about", "/artists", "/radio", "/get-heard", "/track-version-control", "/releases", "/store", "/faq", "/contact"];
const excludedArtistSlugs = new Set(["admin-test-artist"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = staticPaths.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date()
  }));

  try {
    const response = await fetch(`${getApiBaseUrl()}/artists`, {
      next: { revalidate: 3600 }
    });
    if (response.ok === false) return staticPages;

    const artists = (await response.json()) as Array<{ slug?: unknown; updatedAt?: unknown }>;
    const releaseResponse = await fetch(getApiBaseUrl() + "/releases", { next: { revalidate: 3600 } });
    const releases = releaseResponse.ok ? (await releaseResponse.json()) as Array<{ slug?: unknown; updatedAt?: unknown }> : [];
    const artistPages = artists.flatMap((artist) => {
      const slug = typeof artist.slug === "string" ? artist.slug.trim() : "";
      if (slug === "" || excludedArtistSlugs.has(slug)) return [];
      const updatedAt = typeof artist.updatedAt === "string" ? new Date(artist.updatedAt) : new Date();
      return [{ url: `${siteConfig.url}/artist/${encodeURIComponent(slug)}`, lastModified: updatedAt }];
    });

    const releasePages = releases.flatMap((release) => {
      const slug = typeof release.slug === "string" ? release.slug.trim() : "";
      if (slug === "") return [];
      const updatedAt = typeof release.updatedAt === "string" ? new Date(release.updatedAt) : new Date();
      return [{ url: siteConfig.url + "/releases/" + encodeURIComponent(slug), lastModified: updatedAt }];
    });

    return [...staticPages, ...artistPages, ...releasePages];
  } catch {
    return staticPages;
  }
}

import type { MetadataRoute } from "next";
import { getApiBaseUrl } from "../lib/server-api";
import { siteConfig } from "../lib/site";

const staticPaths = ["", "/about", "/artists", "/radio", "/get-heard", "/releases", "/store", "/faq", "/contact"];

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
    const artistPages = artists.flatMap((artist) => {
      const slug = typeof artist.slug === "string" ? artist.slug.trim() : "";
      if (slug === "") return [];
      const updatedAt = typeof artist.updatedAt === "string" ? new Date(artist.updatedAt) : new Date();
      return [{ url: `${siteConfig.url}/artist/${encodeURIComponent(slug)}`, lastModified: updatedAt }];
    });

    return [...staticPages, ...artistPages];
  } catch {
    return staticPages;
  }
}

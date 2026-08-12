import type { Metadata } from "next";

export function pageMetadata({ title, description, path, image }: { title: string; description: string; path: string; image?: string | null }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", ...(image ? { images: [{ url: image }] } : {}) },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, ...(image ? { images: [image] } : {}) }
  };
}

export const noIndexMetadata: Metadata = {
  robots: { index: false, follow: false }
};

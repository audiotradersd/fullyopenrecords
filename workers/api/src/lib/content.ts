import { seedArtists, seedFaqs, seedPages, seedProducts, seedReleases } from "@fully-open-records/db/src/seed-data";

// Seed-backed fallback keeps local development usable before D1 is connected.
export const fallbackContent = {
  artists: seedArtists.map((artist, index) => ({ ...artist, id: index + 1 })),
  releases: seedReleases.map((release, index) => ({ ...release, id: index + 1 })),
  products: seedProducts.map((product, index) => ({ ...product, id: index + 1 })),
  faq: seedFaqs.map((item, index) => ({ ...item, id: index + 1 })),
  pages: seedPages.map((page, index) => ({ ...page, id: index + 1 })),
  submissions: []
};


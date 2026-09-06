/**
 * Approved, site-wide artist imagery.
 *
 * Keep promotional placements pointing here so replacing an approved image is
 * a one-file change rather than a hunt through individual pages.
 */
export const artistAssets = {
  stone: {
    promoImage: "/artists/stone-new-logo.png",
    heroImage: "/artists/stone-new-logo.png"
  }
} as const;

export function getArtistHeroImage(slug: string) {
  return artistAssets[slug as keyof typeof artistAssets]?.heroImage ?? null;
}

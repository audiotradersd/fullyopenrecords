/** Images supplied with the original site for legacy artist profiles. */
const legacyArtistImages: Record<string, string> = {
  "audio-kulture": "/artists/audio-kulture.webp",
  "black-gamma": "/artists/black-gamma.webp",
  "core-of-io": "/artists/core-of-io.webp",
  grzzly: "/artists/grzzly.webp",
  "ivan-hays": "/artists/ivan-hays.webp",
  "mask-of-judas": "/artists/mask-of-judas.webp",
  "noahs-house-band": "/artists/noahs-house-band.webp",
  stone: "/artists/stone.webp",
  "tales-of-george": "/artists/tales-of-george.webp",
  "the-ship-heads": "/artists/the-ship-heads.webp",
  "ticklin-the-pickle": "/artists/ticklin-the-pickle.webp"
};

export function resolveArtistImage(
  slug: string | null | undefined,
  profileImage: string | null | undefined,
  heroImage: string | null | undefined
) {
  return profileImage || heroImage || (slug ? legacyArtistImages[slug] : "") || "";
}

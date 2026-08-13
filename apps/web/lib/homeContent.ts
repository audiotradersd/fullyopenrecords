import { getEditorialArtistProfile } from "./artistProfiles";

const grzzly = getEditorialArtistProfile("grzzly");

export const featuredRelease = {
  artistName: "GRZZLY",
  artistSlug: "grzzly",
  title: "How 2 Have Fun and Stay Alive",
  trackTitle: "Sonny Boy",
  description:
    "An immersive cinematic ambient album built from evolving textures, atmospheric synths and carefully crafted sound design.",
  image: grzzly?.image ?? "",
  audioUrl: "/api/media/featured/grzzly-sonny-boy.mp3",
  releaseHref: "/releases/how-2-have-fun-and-stay-alive"
};

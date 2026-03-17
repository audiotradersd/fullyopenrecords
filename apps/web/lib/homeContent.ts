import { getEditorialArtistProfile } from "./artistProfiles";

const grzzly = getEditorialArtistProfile("grzzly");

export const featuredRelease = {
  artistName: "GRZZLY",
  artistSlug: "grzzly",
  title: "Sonny Boy EP",
  trackTitle: "Sonny Boy",
  description:
    "A magnetic first point of entry into the Fully Open world. Raw percussion, damaged synth texture, and underground hip hop phrasing built for headphones and late-night radio.",
  image: grzzly?.image ?? "",
  audioUrl: "/api/media/featured/grzzly-sonny-boy.mp3",
  releaseHref: "/releases"
};

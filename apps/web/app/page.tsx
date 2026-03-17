import BannerSlider from "../components/hero/BannerSlider";
import FeaturedRelease from "../components/home/FeaturedRelease";
import ArtistGrid from "../components/home/ArtistGrid";
import LatestReleasesGrid from "../components/home/LatestReleasesGrid";
import RadioNowPlayingCard from "../components/home/RadioNowPlayingCard";
import ArtistSignupCTA from "../components/home/ArtistSignupCTA";
import { getArtist, getArtistContent, getRadio } from "../lib/api";
import { buildArtistFallback, mergeArtistRecordWithLivePreference } from "../lib/artistProfiles";
import { mergeArtistPageContent } from "../lib/artistPageContent";

export const runtime = "edge";

function parseTrack(raw: unknown, fallbackArtist?: string) {
  const value = typeof raw === "string" ? raw : String(raw ?? "");

  if (value.includes(" - ")) {
    const [artist, title] = value.split(" - ", 2);
    return { artist: artist.trim(), title: title.trim() };
  }
  if (value.includes(" — ")) {
    const [artist, title] = value.split(" — ", 2);
    return { artist: artist.trim(), title: title.trim() };
  }

  return {
    artist: fallbackArtist?.trim() || "Fully Open Radio",
    title: value || "Fully Open Radio"
  };
}

export default async function Home() {
  const [radio, stoneArtist, stoneContent] = await Promise.all([
    getRadio(),
    getArtist("stone")
      .then((entry) => mergeArtistRecordWithLivePreference(entry))
      .catch(() => buildArtistFallback("stone")),
    getArtistContent("stone").catch(() => null)
  ]);
  const track = parseTrack(String(radio.nowPlaying ?? "Fully Open Radio"), String(radio.host ?? ""));
  const mergedStoneContent = mergeArtistPageContent("stone", stoneArtist ?? {}, stoneContent);
  const stoneHeroImage =
    mergedStoneContent.heroImage ||
    mergedStoneContent.profileImage ||
    (typeof stoneArtist?.image === "string" ? stoneArtist.image : "");

  return (
    <>
      <BannerSlider />
      <div className="mt-20">
        <FeaturedRelease />
      </div>
      <ArtistGrid />
      <LatestReleasesGrid stoneImage={stoneHeroImage} />
      <RadioNowPlayingCard artist={track.artist} title={track.title} />
      <ArtistSignupCTA />
    </>
  );
}

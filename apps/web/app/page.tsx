import BannerSlider from "../components/hero/BannerSlider";
import FeaturedRelease from "../components/home/FeaturedRelease";
import ArtistGrid from "../components/home/ArtistGrid";
import LatestReleasesGrid from "../components/home/LatestReleasesGrid";
import RadioNowPlayingCard from "../components/home/RadioNowPlayingCard";
import ArtistSignupCTA from "../components/home/ArtistSignupCTA";
import ShareFullyOpen from "../components/share/ShareFullyOpen";
import { getHome, getRadio } from "../lib/api";
import { pageMetadata } from "../lib/seo";

export const metadata = pageMetadata({ title: "Independent Music, Radio & Artists", description: "Discover independent artists across every genre, listen to Fully Open Radio, and give your music a public home.", path: "/" });

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
  const [radio, home] = await Promise.all([
    getRadio(),
    getHome()
  ]);
  const track = parseTrack(String(radio.nowPlaying ?? "Fully Open Radio"), String(radio.host ?? ""));
  const featuredArtists = (home.featuredArtists ?? []) as Array<{ id: number; name: string; slug: string; genre: string; image: string }>;
  const latestReleases = (home.latestReleases ?? []) as Array<{ id: number; artistName: string; title: string; artwork: string; audioUrl: string | null }>;

  return (
    <>
      <BannerSlider />
      <div className="mt-20">
        <FeaturedRelease />
      </div>
      <ArtistGrid artists={featuredArtists} />
      <LatestReleasesGrid releases={latestReleases} />
      <ShareFullyOpen variant="homepage" />
      <ArtistSignupCTA />
      <RadioNowPlayingCard artist={track.artist} title={track.title} />
    </>
  );
}

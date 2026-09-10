import BannerSlider from "../components/hero/BannerSlider";
import FeaturedRelease from "../components/home/FeaturedRelease";
import ArtistGrid from "../components/home/ArtistGrid";
import LatestReleasesGrid from "../components/home/LatestReleasesGrid";
import OurPick from "../components/home/OurPick";
import ArtistSignupCTA from "../components/home/ArtistSignupCTA";
import ShareFullyOpen from "../components/share/ShareFullyOpen";
import { getHome } from "../lib/api";
import { pageMetadata } from "../lib/seo";

export const metadata = pageMetadata({ title: "Independent Music, Radio & Artists", description: "Discover independent artists across every genre, listen to Fully Open Radio, and give your music a public home.", path: "/" });

export default async function Home() {
  const home = await getHome();
  const featuredArtists = (home.featuredArtists ?? []) as Array<{ id: number; name: string; slug: string; genre: string; image: string }>;
  const latestReleases = (home.latestReleases ?? []) as Array<{ id: number; artistName: string; title: string; artwork: string; audioUrl: string | null }>;
  const ourPick = (home.ourPick ?? null) as { itemType: "artist" | "song"; artistName: string; title: string; image: string; writeup: string; reason: string; href: string; audioUrl: string | null } | null;

  return (
    <>
      <BannerSlider />
      <div className="mt-20">
        <FeaturedRelease />
      </div>
      <ArtistGrid artists={featuredArtists} />
      <LatestReleasesGrid releases={latestReleases} />
      <OurPick pick={ourPick} />
      <ShareFullyOpen variant="homepage" />
      <ArtistSignupCTA />
    </>
  );
}

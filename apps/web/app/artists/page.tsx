import { Section } from "@fully-open-records/ui";
import FeaturedArtistHero from "../../components/artists/FeaturedArtistHero";
import { ArtistCard } from "../../components/Cards";
import { getArtist, getArtistContent, getArtists } from "../../lib/api";
import { mergeArtistPageContent } from "../../lib/artistPageContent";
import { buildFeaturedArtistList, featuredArtistSlugs } from "../../lib/artistProfiles";
import { featuredArtistHero } from "../../lib/featuredArtistHero";
import { pageMetadata } from "../../lib/seo";
import { artistAssets } from "../../lib/assets";

export const metadata = pageMetadata({ title: "Discover Independent Artists Across Every Genre", description: "Meet independent artists from around the world. Fully Open connects listeners with music beyond genre gatekeeping.", path: "/artists" });

export default async function ArtistsPage() {
  const [artists, heroArtistData, heroArtistContent] = await Promise.all([
    getArtists()
      .then((rows) => buildFeaturedArtistList(rows))
      .catch(() =>
        buildFeaturedArtistList(
          featuredArtistSlugs.map((slug) => ({
            id: slug,
            slug
          }))
        )
      ),
    getArtist(featuredArtistHero.slug).catch(() => null),
    getArtistContent(featuredArtistHero.slug).catch(() => null)
  ]);

  const heroArtist =
    artists.find((artist) => String(artist.slug) === featuredArtistHero.slug) ??
    buildFeaturedArtistList([{ id: featuredArtistHero.slug, slug: featuredArtistHero.slug }])[0];

  const heroContent = mergeArtistPageContent(
    featuredArtistHero.slug,
    (heroArtistData as Record<string, unknown> | null) ?? heroArtist,
    heroArtistContent as Record<string, unknown> | null
  );

  const featuredTrack =
    heroContent.tracks.find((track) => track.title === featuredArtistHero.featuredTrackTitle) ??
    heroContent.albums
      .flatMap((album) => album.tracks)
      .find((track) => track.title === featuredArtistHero.featuredTrackTitle) ??
    null;
  const approvedHeroImage = artistAssets[featuredArtistHero.slug as keyof typeof artistAssets]?.heroImage;
  const heroImage =
    approvedHeroImage ||
    heroContent.heroImage ||
    (typeof heroArtist.image === "string" ? heroArtist.image : "");
  const heroArtistRecord: Record<string, unknown> =
    (heroArtistData as Record<string, unknown> | null) ??
    (heroArtist as unknown as Record<string, unknown>);
  const rawBannerImage = heroArtistRecord["bannerImage"];
  const rawHeroImage = heroArtistRecord["heroImage"];
  const rawProfileImage = heroArtistRecord["profileImage"];
  const backgroundImage = approvedHeroImage || (typeof rawBannerImage === "string" && rawBannerImage) || heroImage;
  const foregroundImage = approvedHeroImage || (typeof rawHeroImage === "string" && rawHeroImage) || (typeof rawProfileImage === "string" && rawProfileImage) || heroImage;
  const gridArtists = artists.filter((artist) => String(artist.slug) !== featuredArtistHero.slug);

  return (
    <Section>
      <h1 className="font-display text-5xl">Featured Artists</h1>
      <div className="mt-10">
        <FeaturedArtistHero
          artist={{
            slug: featuredArtistHero.slug,
            name: String(heroArtist.name ?? "Stone!?"),
            backgroundImage,
            foregroundImage
          }}
          badge={featuredArtistHero.badge}
          genres={[...featuredArtistHero.genres]}
          description={featuredArtistHero.description}
          editorialNote={featuredArtistHero.editorialNote}
          featuredTrack={featuredTrack}
        />
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {gridArtists.map((artist) => (
          <ArtistCard key={String(artist.id)} artist={artist} />
        ))}
      </div>
    </Section>
  );
}

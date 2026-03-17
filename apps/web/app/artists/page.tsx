import { Section } from "@fully-open-records/ui";
import FeaturedArtistHero from "../../components/artists/FeaturedArtistHero";
import { ArtistCard } from "../../components/Cards";
import { getArtist, getArtistContent, getArtists } from "../../lib/api";
import { mergeArtistPageContent } from "../../lib/artistPageContent";
import { buildFeaturedArtistList, featuredArtistSlugs } from "../../lib/artistProfiles";
import { featuredArtistHero } from "../../lib/featuredArtistHero";

export const runtime = "edge";

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
  const releaseTrack =
    heroContent.tracks.find((track) => track.title === featuredArtistHero.releaseTrackTitle) ??
    heroContent.albums
      .flatMap((album) => album.tracks)
      .find((track) => track.title === featuredArtistHero.releaseTrackTitle) ??
    null;

  const heroImage =
    heroContent.heroImage ||
    (typeof heroArtist.image === "string" ? heroArtist.image : "");
  const heroArtistRecord: Record<string, unknown> =
    (heroArtistData as Record<string, unknown> | null) ??
    (heroArtist as unknown as Record<string, unknown>);
  const rawBannerImage = heroArtistRecord["bannerImage"];
  const rawHeroImage = heroArtistRecord["heroImage"];
  const rawProfileImage = heroArtistRecord["profileImage"];
  const backgroundImage =
    (typeof rawBannerImage === "string" && rawBannerImage) || heroImage;
  const foregroundImage =
    (typeof rawHeroImage === "string" && rawHeroImage) ||
    (typeof rawProfileImage === "string" && rawProfileImage) ||
    heroImage;
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
          releaseTrack={releaseTrack}
          releaseTitle={featuredArtistHero.releaseTitle}
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

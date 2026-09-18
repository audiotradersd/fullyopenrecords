import { Section } from "@fully-open-records/ui";
import FeaturedArtistHero from "../../components/artists/FeaturedArtistHero";
import { ArtistCard } from "../../components/Cards";
import Link from "next/link";
import { getArtist, getArtistContent, getArtists, getArtistsEditorial } from "../../lib/api";
import { mergeArtistPageContent } from "../../lib/artistPageContent";
import { buildFeaturedArtistList, featuredArtistSlugs } from "../../lib/artistProfiles";
import { featuredArtistHero } from "../../lib/featuredArtistHero";
import { pageMetadata } from "../../lib/seo";
import { artistAssets } from "../../lib/assets";

export const metadata = pageMetadata({ title: "Discover Independent Artists Across Every Genre", description: "Meet independent artists from around the world. Fully Open connects listeners with music beyond genre gatekeeping.", path: "/artists" });

export default async function ArtistsPage() {
  await getArtistsEditorial().catch(() => null);
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
    <Section className="relative overflow-hidden py-10 md:py-14">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/bg/cosmic-blue-v2.png')] bg-cover bg-center opacity-45" />
      <header className="relative max-w-2xl"><p className="font-meta text-xs uppercase tracking-[0.28em] text-[#76c5ff]">Featured artists</p><h1 className="mt-3 text-5xl font-semibold leading-[0.98] text-white md:text-6xl">Artists we think<br />you should hear.</h1><p className="mt-5 max-w-xl text-base leading-7 text-[#c5d5e7]">Chosen by the Fully Open team from artists and music we discover through the platform. No rankings, no algorithms — just artists that make us stop and listen.</p><p className="mt-4 font-meta text-sm uppercase tracking-[0.15em] text-[#75c9ff]">Real music. Real people. Human picks.</p></header>
      <div className="mt-7">
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
      <section className="mt-12"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="font-meta text-xs uppercase tracking-[0.28em] text-[#76c5ff]">More from our curators</p><h2 className="mt-2 text-4xl font-semibold text-white md:text-5xl">Handpicked across Fully Open.</h2><p className="mt-3 max-w-2xl text-[#c5d5e7]">Different genres, different places, different reasons. Every artist below has been listened to and deliberately selected by the Fully Open team.</p></div><Link href="#all-artists" className="border-b border-[#74c8ff] pb-2 text-sm font-medium text-[#9bd8ff]">View All Featured Artists →</Link></div><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {gridArtists.map((artist) => (
          <ArtistCard key={String(artist.id)} artist={artist} />
        ))}
      </div></section>
      <section id="all-artists" className="relative mt-12 overflow-hidden rounded-2xl border border-[#4a83b4]/60 bg-[linear-gradient(100deg,rgba(7,24,42,0.95),rgba(5,13,25,0.94))] p-7 md:flex md:items-center md:justify-between md:p-10"><img src="/radio/for-vinyl-approved.png" alt="" className="pointer-events-none absolute -bottom-32 -left-24 hidden h-80 w-80 rounded-full object-cover opacity-70 md:block" /><div className="relative md:ml-64"><h2 className="text-3xl font-semibold text-white">There&apos;s more to find.</h2><p className="mt-3 max-w-xl text-[#c5d5e7]">Featured Artists are only a small selection of the incredible music being added to Fully Open. Explore the full artist community and discover your next favourite.</p></div><div className="relative mt-6 flex shrink-0 flex-wrap gap-3 md:mt-0 md:flex-col"><Link href="/artists"><span className="inline-flex rounded-full bg-[#58aef3] px-6 py-3 text-sm font-medium text-white">Explore All Artists</span></Link><Link href="/radio"><span className="inline-flex rounded-full border border-[#74a2ca] px-6 py-3 text-sm font-medium text-white">Listen to Fully Open Radio</span></Link></div></section>
    </Section>
  );
}

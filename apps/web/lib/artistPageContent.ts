type AlbumContent = {
  title: string;
  releaseDate?: string | null;
  description?: string | null;
  coverArt?: string | null;
  tracks: Array<{ title: string; audioUrl?: string | null; duration?: string | null }>;
};

type TrackContent = {
  title: string;
  audioUrl?: string | null;
  releaseDate?: string | null;
  duration?: string | null;
  description?: string | null;
};

type PressContent = {
  title: string;
  publication: string;
  date?: string | null;
  articleLink?: string | null;
  excerpt?: string | null;
  featureImage?: string | null;
};

type GigContent = {
  title: string;
  venue?: string | null;
  city?: string | null;
  eventDate: string;
  ticketUrl?: string | null;
  description?: string | null;
};

type PhotoContent = {
  imageUrl: string;
  alt?: string | null;
};

type VideoContent = {
  title: string;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  description?: string | null;
};

export type ArtistPageContentModel = {
  heroImage?: string | null;
  profileImage?: string | null;
  shortBio?: string | null;
  albums: AlbumContent[];
  tracks: TrackContent[];
  press: PressContent[];
  gigs: GigContent[];
  photos: PhotoContent[];
  videos: VideoContent[];
};

const editorialArtistPageContent: Record<string, ArtistPageContentModel> = {
  stone: {
    heroImage: "/artists/stone.webp",
    profileImage: "/artists/stone.webp",
    shortBio:
      "Stone!? is an industrial and experimental rock band from Brighton, UK known for dark atmospheres and electrifying live performances.",
    albums: [
      {
        title: "Signal Fade EP",
        releaseDate: "2024-03-22",
        description: "A heavy, groove-forward EP built from industrial texture, broken electronics, and late-night club pressure.",
        coverArt: "/artists/stone.webp",
        tracks: [
          { title: "Signal Fade" },
          { title: "Broken Circuits" },
          { title: "Echo Chamber" }
        ]
      }
    ],
    tracks: [
      { title: "Jack Issues", audioUrl: "/api/media/tracks/stone/warm-medium.mp3", duration: "3:41" },
      { title: "Body Electric", duration: "2:55" },
      { title: "Shadow Paradox", duration: "2:54" }
    ],
    press: [
      {
        title: "Interview with Stone!?",
        publication: "Brighton Music Blog",
        date: "2023-06-15",
        excerpt: "A look at how Stone!? build dense riffs, dark atmospheres, and live energy into industrial rock."
      }
    ],
    gigs: [
      {
        title: "Fully Open Records Showcase",
        venue: "The Hope & Ruin",
        city: "Brighton, UK",
        eventDate: "2026-10-12"
      },
      {
        title: "Stone!? Live",
        venue: "The Dome",
        city: "London, UK",
        eventDate: "2026-10-27"
      },
      {
        title: "Stone!? EU Session",
        venue: "Urban Spree",
        city: "Berlin, DE",
        eventDate: "2026-11-11"
      }
    ],
    photos: [
      { imageUrl: "/artists/stone.webp", alt: "Stone!? promo image" },
      { imageUrl: "/artists/stone.webp", alt: "Stone!? live portrait" },
      { imageUrl: "/artists/stone.webp", alt: "Stone!? studio shot" }
    ],
    videos: [
      {
        title: "Stone!? — Signal Fade (Live Session)",
        thumbnailUrl: "/artists/stone.webp",
        description: "Live session footage from the Fully Open Records orbit."
      }
    ]
  }
};

function toDateLabel(value?: string | null) {
  return value ?? null;
}

export function getEditorialArtistPageContent(slug: string) {
  return editorialArtistPageContent[slug] ?? null;
}

export function mergeArtistPageContent(
  slug: string,
  artist: Record<string, unknown>,
  content: Record<string, unknown> | null
): ArtistPageContentModel {
  const editorial = getEditorialArtistPageContent(slug);
  const songs = Array.isArray(content?.tracks) ? (content?.tracks as Array<Record<string, unknown>>) : [];
  const albums = Array.isArray(content?.albums) ? (content?.albums as Array<Record<string, unknown>>) : [];
  const photos = Array.isArray(content?.photos) ? (content?.photos as Array<Record<string, unknown>>) : [];
  const videos = Array.isArray(content?.videos) ? (content?.videos as Array<Record<string, unknown>>) : [];
  const gigs = Array.isArray(content?.gigs) ? (content?.gigs as Array<Record<string, unknown>>) : [];
  const press = Array.isArray(content?.press) ? (content?.press as Array<Record<string, unknown>>) : [];

  const liveAlbums =
    albums.length > 0
      ? albums.map((album) => ({
          title: String(album.title ?? ""),
          releaseDate: toDateLabel(typeof album.releaseDate === "string" ? album.releaseDate : null),
          description: typeof album.description === "string" ? album.description : null,
          coverArt: typeof album.coverArt === "string" ? album.coverArt : null,
          tracks: songs
            .filter((song) => Number(song.albumId ?? 0) === Number(album.id ?? 0) && song.enabled !== false)
            .map((song) => ({
              title: String(song.title ?? ""),
              audioUrl: typeof song.audioUrl === "string" ? song.audioUrl : null
            }))
        }))
      : [];

  const liveTracks =
    songs.length > 0
      ? songs
          .filter((song) => !song.albumId && song.enabled !== false)
          .map((song) => ({
            title: String(song.title ?? ""),
            audioUrl: typeof song.audioUrl === "string" ? song.audioUrl : null,
            releaseDate: typeof song.createdAt === "string" ? song.createdAt : null,
            description: typeof song.description === "string" ? song.description : null
          }))
      : [];

  return {
    heroImage:
      (typeof artist.bannerImage === "string" && artist.bannerImage) ||
      (typeof artist.heroImage === "string" && artist.heroImage) ||
      editorial?.heroImage ||
      (typeof artist.image === "string" ? artist.image : null),
    profileImage:
      (typeof artist.profileImage === "string" && artist.profileImage) ||
      editorial?.profileImage ||
      (typeof artist.image === "string" ? artist.image : null),
    shortBio:
      (typeof artist.shortDescription === "string" && artist.shortDescription) ||
      editorial?.shortBio ||
      (typeof artist.bio === "string" ? artist.bio : null),
    albums: liveAlbums.length > 0 ? liveAlbums : editorial?.albums ?? [],
    tracks: liveTracks.length > 0 ? liveTracks : editorial?.tracks ?? [],
    press:
      press.length > 0
        ? press.map((item) => ({
            title: String(item.title ?? ""),
            publication: String(item.publication ?? ""),
            date: typeof item.date === "string" ? item.date : null,
            articleLink: typeof item.articleLink === "string" ? item.articleLink : null,
            excerpt: typeof item.excerpt === "string" ? item.excerpt : null,
            featureImage: typeof item.featureImage === "string" ? item.featureImage : null
          }))
        : editorial?.press ?? [],
    gigs:
      gigs.length > 0
        ? gigs.map((gig) => ({
            title: String(gig.title ?? ""),
            venue: typeof gig.venue === "string" ? gig.venue : null,
            city: typeof gig.city === "string" ? gig.city : null,
            eventDate: String(gig.eventDate ?? ""),
            ticketUrl: typeof gig.ticketUrl === "string" ? gig.ticketUrl : null,
            description: typeof gig.description === "string" ? gig.description : null
          }))
        : editorial?.gigs ?? [],
    photos:
      photos.length > 0
        ? photos.map((photo) => ({
            imageUrl: String(photo.imageUrl ?? ""),
            alt: typeof photo.alt === "string" ? photo.alt : null
          }))
        : editorial?.photos ?? [],
    videos:
      videos.length > 0
        ? videos.map((video) => ({
            title: String(video.title ?? ""),
            videoUrl: typeof video.videoUrl === "string" ? video.videoUrl : null,
            thumbnailUrl: typeof video.thumbnailUrl === "string" ? video.thumbnailUrl : null
          }))
        : editorial?.videos ?? []
  };
}

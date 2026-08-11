type AlbumContent = {
  title: string;
  releaseDate?: string | null;
  description?: string | null;
  coverArt?: string | null;
  tracks: Array<{ title: string; audioUrl?: string | null; duration?: string | null; enabled?: boolean | null }>;
};

type TrackContent = {
  title: string;
  audioUrl?: string | null;
  releaseDate?: string | null;
  duration?: string | null;
  description?: string | null;
  enabled?: boolean | null;
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
    albums: [],
    tracks: [],
    press: [],
    gigs: [],
    photos: [],
    videos: []
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
            .filter((song) => Number(song.albumId ?? 0) === Number(album.id ?? 0))
            .map((song) => ({
              title: String(song.title ?? ""),
              audioUrl: typeof song.audioUrl === "string" ? song.audioUrl : null,
              enabled: song.enabled !== false
            }))
        }))
      : [];

  const liveTracks =
    songs.length > 0
      ? songs
          .filter((song) => !song.albumId)
          .map((song) => ({
            title: String(song.title ?? ""),
            audioUrl: typeof song.audioUrl === "string" ? song.audioUrl : null,
            releaseDate: typeof song.createdAt === "string" ? song.createdAt : null,
            description: typeof song.description === "string" ? song.description : null,
            enabled: song.enabled !== false
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
      (typeof artist.bio === "string" && artist.bio) ||
      (typeof artist.shortDescription === "string" && artist.shortDescription) ||
      editorial?.shortBio ||
      null,
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

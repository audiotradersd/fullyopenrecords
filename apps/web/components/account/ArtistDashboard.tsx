"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../auth/AuthProvider";
import Container from "../layout/Container";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type DashboardData = {
  artist: {
    name: string;
    slug: string;
    bio: string;
    genres: string[];
    location: string | null;
    heroImage: string;
    profileImage?: string | null;
    bannerImage?: string | null;
    socialLinks?: Record<string, string> | null;
    plan?: string | null;
  };
  usage: {
    songs: number;
    photos: number;
    videos: number;
    radioTracks: number;
  };
  limits: {
    songs: number;
    photos: number;
    videos: number;
    radioTracks: number;
  };
};

type ContentData = {
  albums: Array<{
    id: number;
    title: string;
    releaseDate?: string | null;
    description?: string | null;
    coverArt?: string | null;
  }>;
  songs: Array<{
    id: number;
    title: string;
    trackNumber?: number | null;
    enabled: boolean;
    radioSelected: boolean;
    isRadioEligible?: boolean;
    coverImage?: string | null;
    audioUrl?: string | null;
    albumId?: number | null;
    description?: string | null;
  }>;
  videos: Array<{ id: number; title: string; videoUrl?: string | null; thumbnailUrl?: string | null }>;
  photos: Array<{ id: number; imageUrl: string; alt?: string | null }>;
  gigs: Array<{
    id: number;
    title: string;
    venue?: string | null;
    city?: string | null;
    eventDate: string;
    ticketUrl?: string | null;
    description?: string | null;
  }>;
  press: Array<{
    id: number;
    title: string;
    publication: string;
    date?: string | null;
    articleLink?: string | null;
    excerpt?: string | null;
    featureImage?: string | null;
  }>;
};

type DashboardTab = "profile" | "albums" | "tracks" | "gigs" | "media" | "press" | "settings";

const tabs: Array<{ key: DashboardTab; label: string }> = [
  { key: "profile", label: "Profile" },
  { key: "albums", label: "Albums" },
  { key: "tracks", label: "Tracks" },
  { key: "gigs", label: "Gigs" },
  { key: "media", label: "Media" },
  { key: "press", label: "Press" },
  { key: "settings", label: "Settings" }
];

const initialProfile = {
  name: "",
  slug: "",
  bio: "",
  genres: "",
  location: "",
  heroImage: "",
  profileImage: "",
  bannerImage: "",
  facebook: "",
  x: "",
  instagram: "",
  youtube: "",
  soundcloud: "",
  bandcamp: "",
  spotify: "",
  website: ""
};

function slugifyArtistPath(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function formatDate(value?: string | null) {
  if (!value) return "No date";
  return value.slice(0, 10);
}

function parseBulkTrackFilename(fileName: string) {
  const stem = fileName.replace(/\.[^.]+$/, "").trim();
  const numberedMatch = stem.match(/^\s*(\d+)\s*-\s*(.+)$/);
  const trackNumber = numberedMatch ? Number(numberedMatch[1]) : null;
  const withoutNumber = numberedMatch ? numberedMatch[2].trim() : stem;

  if (numberedMatch) {
    const parts = withoutNumber
      .split(" - ")
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length >= 2) {
      return {
        trackNumber,
        title: parts.slice(0, -1).join(" - "),
        albumTitle: parts.at(-1) ?? null
      };
    }
  }

  if (numberedMatch) {
    return {
      trackNumber,
      title: withoutNumber,
      albumTitle: null
    };
  }

  return {
    trackNumber: null,
    title: withoutNumber,
    albumTitle: null
  };
}

export default function ArtistDashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [content, setContent] = useState<ContentData | null>(null);
  const [profile, setProfile] = useState(initialProfile);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [albumCreated, setAlbumCreated] = useState<{ title: string; coverArt?: string | null } | null>(null);
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
  const [showCreateTrackModal, setShowCreateTrackModal] = useState(false);
  const [showBulkTrackModal, setShowBulkTrackModal] = useState(false);
  const [bulkTrackFiles, setBulkTrackFiles] = useState<
    Array<{ fileName: string; title: string; albumTitle: string | null; trackNumber: number | null }>
  >([]);
  const [editingAlbumId, setEditingAlbumId] = useState<number | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const [editingAlbumTracks, setEditingAlbumTracks] = useState(false);
  const [albumTrackDraft, setAlbumTrackDraft] = useState<ContentData["songs"]>([]);
  const [draggedTrackId, setDraggedTrackId] = useState<number | null>(null);
  const [selectedTrackIds, setSelectedTrackIds] = useState<number[]>([]);
  const [albumDraft, setAlbumDraft] = useState<{ title: string; description: string }>({
    title: "",
    description: ""
  });

  async function loadData() {
    const [artistRes, contentRes] = await Promise.all([
      fetch("/api/artist/me", { cache: "no-store" }),
      fetch("/api/artist/me/content", { cache: "no-store" })
    ]);

    const artistPayload = await artistRes.json();
    const contentPayload = await contentRes.json();

    if (artistRes.ok) {
      setDashboard(artistPayload);
      setProfile({
        name: artistPayload.artist.name ?? "",
        slug: artistPayload.artist.slug ?? "",
        bio: artistPayload.artist.bio ?? "",
        genres: Array.isArray(artistPayload.artist.genres) ? artistPayload.artist.genres.join(", ") : "",
        location: artistPayload.artist.location ?? "",
        heroImage: artistPayload.artist.heroImage ?? "",
        profileImage: artistPayload.artist.profileImage ?? "",
        bannerImage: artistPayload.artist.bannerImage ?? "",
        facebook: artistPayload.artist.socialLinks?.facebook ?? "",
        x: artistPayload.artist.socialLinks?.x ?? "",
        instagram: artistPayload.artist.socialLinks?.instagram ?? "",
        youtube: artistPayload.artist.socialLinks?.youtube ?? "",
        soundcloud: artistPayload.artist.socialLinks?.soundcloud ?? "",
        bandcamp: artistPayload.artist.socialLinks?.bandcamp ?? "",
        spotify: artistPayload.artist.socialLinks?.spotify ?? "",
        website: artistPayload.artist.socialLinks?.website ?? ""
      });
    }

    if (contentRes.ok) {
      setContent({
        albums: contentPayload.albums ?? [],
        songs: contentPayload.songs ?? [],
        videos: contentPayload.videos ?? [],
        photos: contentPayload.photos ?? [],
        gigs: contentPayload.gigs ?? [],
        press: contentPayload.press ?? []
      });
    }
  }

  useEffect(() => {
    if (!user || user.accountType !== "artist") return;
    void loadData();
  }, [user]);

  async function uploadAsset(file: File, kind: string, alt = "", label = `Uploading ${file.name}…`) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", kind);
    formData.append("alt", alt);
    setUploading(label);
    setUploadPercent(0);

    return await new Promise<{ key: string; url: string }>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/artist/me/media");

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        setUploadPercent(Math.max(1, Math.round((event.loaded / event.total) * 100)));
      };

      xhr.onload = () => {
        try {
          const payload = xhr.responseText ? JSON.parse(xhr.responseText) : {};
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadPercent(100);
            resolve(payload as { key: string; url: string });
            return;
          }

          reject(new Error(payload.error ?? "Upload failed."));
        } catch (error) {
          reject(error instanceof Error ? error : new Error("Upload failed."));
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed."));
      xhr.onabort = () => reject(new Error("Upload cancelled."));
      xhr.send(formData);
    });
  }

  async function saveProfile(nextProfile = profile, successMessage = "Profile updated.") {
    const normalizedSlug = slugifyArtistPath(nextProfile.slug || nextProfile.name);

    const response = await fetch("/api/artist/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nextProfile.name,
        slug: normalizedSlug,
        bio: nextProfile.bio,
        genres: nextProfile.genres
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        location: nextProfile.location,
        heroImage: nextProfile.heroImage,
        profileImage: nextProfile.profileImage,
        bannerImage: nextProfile.bannerImage,
        socialLinks: {
          facebook: nextProfile.facebook,
          x: nextProfile.x,
          instagram: nextProfile.instagram,
          youtube: nextProfile.youtube,
          soundcloud: nextProfile.soundcloud,
          bandcamp: nextProfile.bandcamp,
          spotify: nextProfile.spotify,
          website: nextProfile.website
        },
        galleryImages: content?.photos?.map((photo) => photo.imageUrl) ?? []
      })
    });

    const payload = (await response.json()) as { error?: string; artist?: { slug?: string } };
    setMessage(response.ok ? successMessage : payload.error ?? "Update failed.");
    if (response.ok) {
      setProfile((state) => ({
        ...nextProfile,
        slug: payload.artist?.slug ?? normalizedSlug
      }));
      await loadData();
    }

    return response.ok;
  }

  async function uploadProfileImage(file: File, field: "heroImage" | "profileImage" | "bannerImage") {
    try {
      const uploaded = await uploadAsset(file, `profile/${field}`, field, "Uploading image…");
      const nextProfile = { ...profile, [field]: uploaded.url };
      setProfile(nextProfile);
      setUploading("Saving profile…");
      const saved = await saveProfile(nextProfile, "Profile image updated.");
      setUploading(null);
      setUploadPercent(0);
      if (!saved) {
        setMessage("Image uploaded, but profile could not be saved.");
      }
    } catch (error) {
      setUploading(null);
      setUploadPercent(0);
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  async function createAlbum(formData: FormData) {
    try {
      const title = String(formData.get("title") ?? "");
      const coverFile = formData.get("coverFile");
      let coverArt = String(formData.get("coverArt") ?? "");

      if (coverFile instanceof File && coverFile.size > 0) {
        coverArt = (await uploadAsset(coverFile, "albums/covers", title, "Uploading album cover…")).url;
      }

      setUploading(null);
      setUploadPercent(0);

      const response = await fetch("/api/artist/me/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          releaseDate: String(formData.get("releaseDate") ?? ""),
          description: String(formData.get("description") ?? ""),
          coverArt
        })
      });

      const payload = await response.json();
      if (response.ok) {
        setMessage(null);
        setAlbumCreated({ title, coverArt });
        setShowCreateAlbumModal(false);
        await loadData();
      } else {
        setMessage(payload.error ?? "Album creation failed.");
      }
    } catch (error) {
      setUploading(null);
      setUploadPercent(0);
      setMessage(error instanceof Error ? error.message : "Album creation failed.");
    }
  }

  async function uploadSong(formData: FormData) {
    try {
      const title = String(formData.get("title") ?? "");
      const audioFile = formData.get("audioFile");
      const coverFile = formData.get("coverFile");

      let audioUrl = String(formData.get("audioUrl") ?? "");
      let coverImage = String(formData.get("coverImage") ?? "");

      if (audioFile instanceof File && audioFile.size > 0) {
        audioUrl = (await uploadAsset(audioFile, "songs/audio", title, "Uploading audio…")).url;
      }

      if (coverFile instanceof File && coverFile.size > 0) {
        coverImage = (await uploadAsset(coverFile, "songs/covers", title, "Uploading cover art…")).url;
      }

      setUploading(null);
      setUploadPercent(0);

      const albumIdValue = String(formData.get("albumId") ?? "");
      const response = await fetch("/api/artist/me/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          audioUrl,
          coverImage,
          albumId: albumIdValue ? Number(albumIdValue) : null,
          description: String(formData.get("description") ?? ""),
          enabled: formData.get("enabled") === "on",
          isRadioEligible: true,
          radioSelected: formData.get("radioSelected") === "on"
        })
      });

      const payload = await response.json();
      if (response.ok) {
        setMessage("Track saved.");
        setShowCreateTrackModal(false);
        await loadData();
      } else {
        setMessage(payload.error ?? "Track upload failed.");
      }
    } catch (error) {
      setUploading(null);
      setUploadPercent(0);
      setMessage(error instanceof Error ? error.message : "Track upload failed.");
    }
  }

  async function createAlbumByTitle(title: string) {
    const existingAlbum = (content?.albums ?? []).find(
      (album) => album.title.trim().toLowerCase() === title.trim().toLowerCase()
    );

    if (existingAlbum) {
      return existingAlbum.id;
    }

    const response = await fetch("/api/artist/me/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        releaseDate: "",
        description: "",
        coverArt: ""
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error ?? `Could not create album "${title}".`);
    }

    return Number(payload.album?.id);
  }

  async function bulkUploadSongs(formData: FormData) {
    const files = formData.getAll("audioFiles").filter((value): value is File => value instanceof File && value.size > 0);

    if (!files.length) {
      setMessage("Select at least one audio file.");
      return;
    }

    try {
      setUploading(`Uploading 0 of ${files.length} tracks…`);
      setUploadPercent(0);

      const albumMap = new Map<string, number>();

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const parsed = parseBulkTrackFilename(file.name);

        if (!parsed.title) {
          throw new Error(`Could not derive a track title from "${file.name}".`);
        }

        setUploading(`Uploading ${index + 1} of ${files.length}: ${parsed.title}`);
        const uploadedAudio = await uploadAsset(
          file,
          "songs/audio",
          parsed.title,
          `Uploading ${index + 1} of ${files.length}: ${parsed.title}`
        );

        let albumId: number | null = null;
        if (parsed.albumTitle) {
          const cached = albumMap.get(parsed.albumTitle.toLowerCase());
          if (cached) {
            albumId = cached;
          } else {
            const createdAlbumId = await createAlbumByTitle(parsed.albumTitle);
            albumMap.set(parsed.albumTitle.toLowerCase(), createdAlbumId);
            albumId = createdAlbumId;
          }
        }

        const response = await fetch("/api/artist/me/songs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: parsed.title,
            trackNumber: parsed.trackNumber,
            audioUrl: uploadedAudio.url,
            coverImage: "",
            albumId,
            description: "",
            enabled: true,
            isRadioEligible: true,
            radioSelected: false
          })
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error ?? `Track upload failed for "${parsed.title}".`);
        }
      }

      setUploading(null);
      setUploadPercent(0);
      setShowBulkTrackModal(false);
      setMessage(`Uploaded ${files.length} tracks.`);
      await loadData();
    } catch (error) {
      setUploading(null);
      setUploadPercent(0);
      setMessage(error instanceof Error ? error.message : "Bulk upload failed.");
    }
  }

  function handleBulkTrackSelection(files: FileList | null) {
    const parsed = Array.from(files ?? []).map((file) => {
      const result = parseBulkTrackFilename(file.name);
      return {
        fileName: file.name,
        title: result.title,
        albumTitle: result.albumTitle,
        trackNumber: result.trackNumber
      };
    });

    setBulkTrackFiles(parsed);
  }

  async function assignTrackToAlbum(trackId: number, albumId: number | null) {
    const response = await fetch("/api/artist/me/songs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: trackId, albumId })
    });

    const payload = await response.json();
    setMessage(response.ok ? "Track assignment updated." : payload.error ?? "Could not update track assignment.");
    if (response.ok) {
      await loadData();
    }
  }

  async function saveAlbumEdit(albumId: number) {
    const response = await fetch("/api/artist/me/albums", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: albumId,
        title: albumDraft.title,
        description: albumDraft.description
      })
    });

    const payload = await response.json();
    setMessage(response.ok ? "Album updated." : payload.error ?? "Album update failed.");
    if (response.ok) {
      setEditingAlbumId(null);
      await loadData();
    }
  }

  async function updateTrack(trackId: number, updates: Record<string, unknown>, successMessage = "Track updated.") {
    const response = await fetch("/api/artist/me/songs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: trackId,
        ...updates
      })
    });

    const payload = await response.json();
    setMessage(response.ok ? successMessage : payload.error ?? "Track update failed.");
    if (response.ok) {
      await loadData();
    }
  }

  async function deleteTrack(trackId: number, title: string) {
    const confirmed = window.confirm(`Delete "${title}"? This cannot be undone.`);
    if (!confirmed) return;

    const response = await fetch("/api/artist/me/songs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: trackId })
    });

    const payload = await response.json();
    setMessage(response.ok ? "Track deleted." : payload.error ?? "Track deletion failed.");
    if (response.ok) {
      setSelectedTrackIds((current) => current.filter((id) => id !== trackId));
      await loadData();
    }
  }

  async function assignSelectedTracksToAlbum(albumId: number | null) {
    if (!selectedTrackIds.length) {
      setMessage("Select at least one track.");
      return;
    }

    const results = await Promise.all(
      selectedTrackIds.map(async (trackId) => {
        const response = await fetch("/api/artist/me/songs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: trackId,
            albumId
          })
        });

        return response.ok;
      })
    );

    if (results.every(Boolean)) {
      setMessage("Tracks updated.");
      setSelectedTrackIds([]);
      await loadData();
    } else {
      setMessage("Some tracks could not be updated.");
    }
  }

  async function saveAlbumTrackOrder() {
    const updates = await Promise.all(
      albumTrackDraft.map(async (song, index) => {
        const response = await fetch("/api/artist/me/songs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: song.id,
            trackNumber: index + 1
          })
        });

        return response.ok;
      })
    );

    if (updates.every(Boolean)) {
      setEditingAlbumTracks(false);
      setDraggedTrackId(null);
      setMessage("Album track order saved.");
      await loadData();
    } else {
      setMessage("Could not save album track order.");
    }
  }

  async function createGig(formData: FormData) {
    const response = await fetch("/api/artist/me/gigs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: String(formData.get("title") ?? ""),
        venue: String(formData.get("venue") ?? ""),
        city: String(formData.get("city") ?? ""),
        eventDate: String(formData.get("eventDate") ?? ""),
        ticketUrl: String(formData.get("ticketUrl") ?? ""),
        description: String(formData.get("description") ?? "")
      })
    });

    const payload = await response.json();
    setMessage(response.ok ? "Gig added." : payload.error ?? "Gig creation failed.");
    if (response.ok) await loadData();
  }

  async function uploadPhoto(formData: FormData) {
    try {
      const file = formData.get("photoFile");
      if (!(file instanceof File) || file.size === 0) {
        setMessage("Photo file required.");
        return;
      }

      setUploading("Uploading photo…");
      const uploaded = await uploadAsset(file, "photos", String(formData.get("alt") ?? ""), "Uploading photo…");
      setUploading(null);
      setUploadPercent(0);

      const response = await fetch("/api/artist/me/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploaded.url,
          alt: String(formData.get("alt") ?? "")
        })
      });

      const payload = await response.json();
      setMessage(response.ok ? "Photo uploaded." : payload.error ?? "Upload failed.");
      if (response.ok) await loadData();
    } catch (error) {
      setUploading(null);
      setUploadPercent(0);
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  async function addVideo(formData: FormData) {
    try {
      const thumbnailFile = formData.get("thumbnailFile");
      let thumbnailUrl = String(formData.get("thumbnailUrl") ?? "");

      if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
        thumbnailUrl = (
          await uploadAsset(
            thumbnailFile,
            "videos/thumbnails",
            String(formData.get("title") ?? ""),
            "Uploading video thumbnail…"
          )
        ).url;
        setUploading(null);
        setUploadPercent(0);
      }

      const response = await fetch("/api/artist/me/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: String(formData.get("title") ?? ""),
          videoUrl: String(formData.get("videoUrl") ?? ""),
          thumbnailUrl
        })
      });

      const payload = await response.json();
      setMessage(response.ok ? "Video added." : payload.error ?? "Upload failed.");
      if (response.ok) await loadData();
    } catch (error) {
      setUploading(null);
      setUploadPercent(0);
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  async function addPress(formData: FormData) {
    try {
      const featureFile = formData.get("featureFile");
      let featureImage = String(formData.get("featureImage") ?? "");

      if (featureFile instanceof File && featureFile.size > 0) {
        featureImage = (
          await uploadAsset(
            featureFile,
            "press/images",
            String(formData.get("title") ?? ""),
            "Uploading feature image…"
          )
        ).url;
        setUploading(null);
        setUploadPercent(0);
      }

      const response = await fetch("/api/artist/me/press", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: String(formData.get("title") ?? ""),
          publication: String(formData.get("publication") ?? ""),
          date: String(formData.get("date") ?? ""),
          articleLink: String(formData.get("articleLink") ?? ""),
          excerpt: String(formData.get("excerpt") ?? ""),
          featureImage
        })
      });

      const payload = await response.json();
      setMessage(response.ok ? "Press item added." : payload.error ?? "Press item failed.");
      if (response.ok) await loadData();
    } catch (error) {
      setUploading(null);
      setUploadPercent(0);
      setMessage(error instanceof Error ? error.message : "Press item failed.");
    }
  }

  const selectedAlbumTitleById = useMemo(() => {
    return new Map((content?.albums ?? []).map((album) => [album.id, album.title]));
  }, [content?.albums]);
  const selectedAlbum = (content?.albums ?? []).find((album) => album.id === selectedAlbumId) ?? null;
  const selectedAlbumTracks = (content?.songs ?? [])
    .filter((song) => song.albumId === selectedAlbumId)
    .sort((left, right) => {
      const leftOrder = left.trackNumber ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = right.trackNumber ?? Number.MAX_SAFE_INTEGER;
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return left.title.localeCompare(right.title);
    });

  useEffect(() => {
    if (!selectedAlbumId) {
      setEditingAlbumTracks(false);
      setAlbumTrackDraft([]);
      setDraggedTrackId(null);
      return;
    }

    setAlbumTrackDraft(selectedAlbumTracks);
  }, [selectedAlbumId, content?.songs]);

  if (loading) {
    return (
      <Container>
        <section className="py-20">
          <p className="text-fog">Loading dashboard…</p>
        </section>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <section className="py-20">
          <Card className="p-8 text-center">
            <h1 className="text-3xl font-semibold text-white">Artist accounts manage their own page</h1>
            <p className="mt-4 text-fog">
              Create an artist account to manage albums, tracks, gigs, media, press, and radio-ready content.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href={{ pathname: "/signup", query: { type: "artist" } }}>
                <Button>Create artist account</Button>
              </Link>
              <a href="/artists">
                <Button variant="outline">Browse artists</Button>
              </a>
            </div>
          </Card>
        </section>
      </Container>
    );
  }

  if (user.accountType !== "artist") {
    return (
      <Container>
        <section className="py-20">
          <Card className="p-8 text-center">
            <h1 className="text-3xl font-semibold text-white">This dashboard is for artist accounts</h1>
            <p className="mt-4 text-fog">Your current account is set up as a listener.</p>
          </Card>
        </section>
      </Container>
    );
  }

  return (
    <Container>
      <section className="space-y-8 py-20">
        {albumCreated ? (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <Card className="w-full max-w-md border-pink/30 p-6 text-center shadow-[0_0_40px_rgba(209,74,139,0.25)]">
              <p className="text-xs uppercase tracking-[0.24em] text-pink">Album Created</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{albumCreated.title} created</h2>
              {albumCreated.coverArt ? (
                <div className="relative mx-auto mt-5 aspect-square w-44 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                  <Image
                    src={albumCreated.coverArt}
                    alt={`${albumCreated.title} cover art`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : null}
              <p className="mt-5 text-sm text-fog">
                Your album has been added to your artist page content.
              </p>
              <Button className="mt-6 w-full" onClick={() => setAlbumCreated(null)}>
                Okay
              </Button>
            </Card>
          </div>
        ) : null}

        {showCreateAlbumModal ? (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <Card className="w-full max-w-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-pink">Albums</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Create Album</h2>
                </div>
                <Button type="button" variant="outline" onClick={() => setShowCreateAlbumModal(false)}>
                  Close
                </Button>
              </div>
              <form action={async (formData) => { await createAlbum(formData); }} className="mt-6 space-y-4">
                <input name="title" required placeholder="Album title" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input name="releaseDate" type="date" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <textarea name="description" rows={5} placeholder="Album description" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input name="coverArt" placeholder="Album cover URL fallback" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <label className="block rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-fog">
                  Upload cover art
                  <input name="coverFile" type="file" accept="image/*" className="mt-2 block w-full text-xs" />
                </label>
                <Button type="submit" className="w-full">Create</Button>
              </form>
            </Card>
          </div>
        ) : null}

        {showCreateTrackModal ? (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <Card className="w-full max-w-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-pink">Tracks</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Add Track</h2>
                </div>
                <Button type="button" variant="outline" onClick={() => setShowCreateTrackModal(false)}>
                  Close
                </Button>
              </div>
              <form action={async (formData) => { await uploadSong(formData); }} className="mt-6 space-y-4">
                <input name="title" required placeholder="Track title" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <label className="block">
                  <span className="mb-2 block text-sm text-fog">Album</span>
                  <select name="albumId" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white">
                    <option value="">No album</option>
                    {(content?.albums ?? []).map((album) => (
                      <option key={album.id} value={album.id}>{album.title}</option>
                    ))}
                  </select>
                </label>
                <textarea name="description" rows={4} placeholder="Track description" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input name="audioUrl" placeholder="Audio URL fallback (optional)" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input name="coverImage" placeholder="Cover art URL fallback (optional)" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <label className="block rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-fog">
                  Upload audio file
                  <input name="audioFile" type="file" accept="audio/*" className="mt-2 block w-full text-xs" />
                </label>
                <label className="block rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-fog">
                  Upload cover art
                  <input name="coverFile" type="file" accept="image/*" className="mt-2 block w-full text-xs" />
                </label>
                <label className="flex items-center gap-3 text-sm text-fog">
                  <input type="checkbox" name="enabled" defaultChecked />
                  <span>Enabled</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-fog">
                  <input type="checkbox" name="radioSelected" />
                  <span>Prioritise this as your radio-selected track</span>
                </label>
                <Button type="submit" className="w-full">Create Track</Button>
              </form>
            </Card>
          </div>
        ) : null}

        {showBulkTrackModal ? (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <Card className="w-full max-w-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-pink">Tracks</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Bulk Upload</h2>
                </div>
                <Button type="button" variant="outline" onClick={() => setShowBulkTrackModal(false)}>
                  Close
                </Button>
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-fog">
                <p className="font-semibold text-white">Filename rules</p>
                <div className="mt-3 space-y-2">
                  <p><span className="text-white">Track only:</span> <span className="font-mono">Hello World.mp3</span></p>
                  <p><span className="text-white">Numbered track only:</span> <span className="font-mono">01 - Some Song Title.mp3</span></p>
                  <p><span className="text-white">Track + album:</span> <span className="font-mono">01 - Track Title - Album Name.mp3</span></p>
                </div>
                <p className="mt-3">
                  If an album name is present, tracks will be assigned to that album. If the album does not exist yet, it will be created automatically.
                </p>
              </div>
              <form action={async (formData) => { await bulkUploadSongs(formData); }} className="mt-6 space-y-4">
                <label className="block rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-fog">
                  Upload audio files
                  <input
                    name="audioFiles"
                    type="file"
                    accept="audio/*"
                    multiple
                    className="mt-2 block w-full text-xs"
                    onChange={(event) => handleBulkTrackSelection(event.target.files)}
                  />
                </label>
                {bulkTrackFiles.length ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm font-semibold text-white">Tracks to be added</p>
                    <div className="mt-3 space-y-2">
                      {bulkTrackFiles.map((track) => (
                        <div
                          key={track.fileName}
                          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                        >
                          <p className="truncate text-sm text-white">{track.title}</p>
                          <p className="mt-1 truncate text-xs text-fog">{track.fileName}</p>
                          <p className="mt-2 text-xs text-fog">
                            {track.trackNumber ? `Track ${track.trackNumber}` : "No track number"}
                            {track.albumTitle ? ` • Album: ${track.albumTitle}` : " • Standalone track"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                <Button type="submit" className="w-full">Upload Tracks</Button>
              </form>
            </Card>
          </div>
        ) : null}

        {selectedAlbum ? (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <Card className="w-full max-w-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.24em] text-pink">Album View</p>
                  <h2 className="mt-2 truncate text-2xl font-semibold text-white">{selectedAlbum.title}</h2>
                  <p className="mt-1 text-sm text-fog">{formatDate(selectedAlbum.releaseDate)}</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingAlbumTracks((state) => !state);
                      setAlbumTrackDraft(selectedAlbumTracks);
                    }}
                  >
                    {editingAlbumTracks ? "Cancel Edit" : "Edit"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setSelectedAlbumId(null)}>
                    Close
                  </Button>
                </div>
              </div>
              {selectedAlbum.description ? (
                <p className="mt-4 text-sm leading-7 text-fog">{selectedAlbum.description}</p>
              ) : null}
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.18em] text-fog">Tracks</p>
                <div className="mt-3 space-y-2">
                  {(editingAlbumTracks ? albumTrackDraft : selectedAlbumTracks).length ? (
                    (editingAlbumTracks ? albumTrackDraft : selectedAlbumTracks).map((song, index) => (
                      <div
                        key={song.id}
                        draggable={editingAlbumTracks}
                        onDragStart={() => setDraggedTrackId(song.id)}
                        onDragOver={(event) => {
                          if (!editingAlbumTracks) return;
                          event.preventDefault();
                        }}
                        onDrop={() => {
                          if (!editingAlbumTracks || draggedTrackId === null || draggedTrackId === song.id) return;
                          setAlbumTrackDraft((current) => {
                            const next = [...current];
                            const fromIndex = next.findIndex((item) => item.id === draggedTrackId);
                            const toIndex = next.findIndex((item) => item.id === song.id);
                            if (fromIndex === -1 || toIndex === -1) return current;
                            const [moved] = next.splice(fromIndex, 1);
                            next.splice(toIndex, 0, moved);
                            return next;
                          });
                        }}
                        className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 ${
                          editingAlbumTracks
                            ? "cursor-move border-pink/30 bg-pink/10"
                            : "border-white/10 bg-white/[0.03]"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm text-white">{song.title}</p>
                          <p className="mt-1 text-xs text-fog">Track {index + 1}</p>
                        </div>
                        {editingAlbumTracks ? (
                          <span className="text-xs uppercase tracking-[0.18em] text-pink">Drag</span>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-fog">No tracks assigned to this album yet.</p>
                  )}
                </div>
                {editingAlbumTracks ? (
                  <div className="mt-4 flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingAlbumTracks(false);
                        setAlbumTrackDraft(selectedAlbumTracks);
                        setDraggedTrackId(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="button" onClick={() => void saveAlbumTrackOrder()}>
                      Save Order
                    </Button>
                  </div>
                ) : null}
              </div>
            </Card>
          </div>
        ) : null}

        {uploading ? (
          <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <Card className="w-full max-w-md border-pink/30 p-6 shadow-[0_0_40px_rgba(209,74,139,0.18)]">
              <p className="text-xs uppercase tracking-[0.24em] text-pink">Upload in progress</p>
              <h2 className="mt-3 text-xl font-semibold text-white">{uploading}</h2>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#F2A7C4_0%,#D14A8B_50%,#A12C6A_100%)] transition-all duration-200"
                  style={{ width: `${Math.max(uploadPercent, 5)}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-fog">{uploadPercent}%</p>
            </Card>
          </div>
        ) : null}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-fog">Artist CMS</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">{dashboard?.artist.name ?? user.username}</h1>
            <p className="mt-3 max-w-2xl text-fog">
              Manage the content that appears on your public artist page: profile, albums, tracks, gigs, media, and press.
            </p>
          </div>
          <div className="flex gap-3">
            {dashboard?.artist.slug ? (
              <a href={`/${dashboard.artist.slug}`}>
                <Button variant="outline">View public page</Button>
              </a>
            ) : null}
            <a href="/radio">
              <Button>Listen Live</Button>
            </a>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-5">
            <p className="text-fog">Tracks</p>
            <p className="mt-2 text-2xl text-white">
              {dashboard?.usage.songs ?? 0}/{dashboard?.limits.songs ?? 5}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-fog">Photos</p>
            <p className="mt-2 text-2xl text-white">
              {dashboard?.usage.photos ?? 0}/{dashboard?.limits.photos ?? 10}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-fog">Videos</p>
            <p className="mt-2 text-2xl text-white">
              {dashboard?.usage.videos ?? 0}/{dashboard?.limits.videos ?? 3}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-fog">Radio Picks</p>
            <p className="mt-2 text-2xl text-white">
              {dashboard?.usage.radioTracks ?? 0}/{dashboard?.limits.radioTracks ?? 1}
            </p>
          </Card>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                activeTab === tab.key
                  ? "border-pink/60 bg-pink/20 text-white"
                  : "border-white/10 bg-white/[0.03] text-fog hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {message ? <p className="text-sm text-fog">{message}</p> : null}

        {activeTab === "profile" ? (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Card className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold text-white">Profile</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <input value={profile.name} onChange={(e) => setProfile((s) => ({ ...s, name: e.target.value }))} placeholder="Artist name" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input value={profile.slug} onChange={(e) => setProfile((s) => ({ ...s, slug: e.target.value }))} placeholder="Slug" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input value={profile.location} onChange={(e) => setProfile((s) => ({ ...s, location: e.target.value }))} placeholder="Location" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input value={profile.genres} onChange={(e) => setProfile((s) => ({ ...s, genres: e.target.value }))} placeholder="Genres, comma separated" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input value={profile.heroImage} onChange={(e) => setProfile((s) => ({ ...s, heroImage: e.target.value }))} placeholder="Hero image URL" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white md:col-span-2" />
                <input value={profile.profileImage} onChange={(e) => setProfile((s) => ({ ...s, profileImage: e.target.value }))} placeholder="Profile image URL" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input value={profile.bannerImage} onChange={(e) => setProfile((s) => ({ ...s, bannerImage: e.target.value }))} placeholder="Banner image URL" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <label className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-fog">
                  Upload hero image
                  <input type="file" accept="image/*" className="mt-2 block w-full text-xs" onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadProfileImage(file, "heroImage"); }} />
                </label>
                <label className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-fog">
                  Upload profile image
                  <input type="file" accept="image/*" className="mt-2 block w-full text-xs" onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadProfileImage(file, "profileImage"); }} />
                </label>
                <label className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-fog md:col-span-2">
                  Upload banner image
                  <input type="file" accept="image/*" className="mt-2 block w-full text-xs" onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadProfileImage(file, "bannerImage"); }} />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-fog">Hero</p>
                  <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-lg bg-white/[0.04]">
                    {profile.heroImage ? (
                      <Image src={profile.heroImage} alt="Hero preview" fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-fog">No hero image</div>
                    )}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-fog">Profile</p>
                  <div className="relative mt-3 aspect-square overflow-hidden rounded-lg bg-white/[0.04]">
                    {profile.profileImage ? (
                      <Image src={profile.profileImage} alt="Profile preview" fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-fog">No profile image</div>
                    )}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-fog">Banner</p>
                  <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-lg bg-white/[0.04]">
                    {profile.bannerImage ? (
                      <Image src={profile.bannerImage} alt="Banner preview" fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-fog">No banner image</div>
                    )}
                  </div>
                </div>
              </div>
              <textarea value={profile.bio} onChange={(e) => setProfile((s) => ({ ...s, bio: e.target.value }))} rows={7} placeholder="Artist bio" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
              {profile.slug ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-fog">Artist Space</p>
                  <a
                    href={`/artist/${profile.slug}`}
                    className="mt-2 inline-flex text-sm text-pink transition hover:text-white"
                  >
                    fullyopenrecords.com/artist/{profile.slug}
                  </a>
                </div>
              ) : null}
              <div className="grid gap-4 md:grid-cols-2">
                <input value={profile.facebook} onChange={(e) => setProfile((s) => ({ ...s, facebook: e.target.value }))} placeholder="Facebook URL" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input value={profile.x} onChange={(e) => setProfile((s) => ({ ...s, x: e.target.value }))} placeholder="X URL" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input value={profile.instagram} onChange={(e) => setProfile((s) => ({ ...s, instagram: e.target.value }))} placeholder="Instagram URL" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input value={profile.youtube} onChange={(e) => setProfile((s) => ({ ...s, youtube: e.target.value }))} placeholder="YouTube URL" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input value={profile.soundcloud} onChange={(e) => setProfile((s) => ({ ...s, soundcloud: e.target.value }))} placeholder="SoundCloud URL" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input value={profile.bandcamp} onChange={(e) => setProfile((s) => ({ ...s, bandcamp: e.target.value }))} placeholder="Bandcamp URL" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input value={profile.spotify} onChange={(e) => setProfile((s) => ({ ...s, spotify: e.target.value }))} placeholder="Spotify URL" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input value={profile.website} onChange={(e) => setProfile((s) => ({ ...s, website: e.target.value }))} placeholder="Website URL" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
              </div>
              <Button onClick={() => void saveProfile()}>Save profile</Button>
            </Card>

            <Card className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold text-white">Public page summary</h2>
              <div className="space-y-3 text-sm text-fog">
                <p><span className="text-white">URL:</span> /artist/{profile.slug || "your-band-name"}</p>
                <p><span className="text-white">Tracks:</span> {content?.songs.length ?? 0}</p>
                <p><span className="text-white">Albums:</span> {content?.albums.length ?? 0}</p>
                <p><span className="text-white">Gigs:</span> {content?.gigs.length ?? 0}</p>
                <p><span className="text-white">Media:</span> {(content?.photos.length ?? 0) + (content?.videos.length ?? 0)}</p>
                <p><span className="text-white">Press:</span> {content?.press.length ?? 0}</p>
              </div>
            </Card>
          </div>
        ) : null}

        {activeTab === "albums" ? (
          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-white">Albums</h2>
              <Button type="button" onClick={() => setShowCreateAlbumModal(true)}>
                Create Album
              </Button>
            </div>
            <div className="mt-6 grid gap-4">
                {content?.albums.length ? content.albums.map((album) => (
                  <div key={album.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    {editingAlbumId === album.id ? (
                      <div className="space-y-3">
                        <input
                          value={albumDraft.title}
                          onChange={(e) => setAlbumDraft((state) => ({ ...state, title: e.target.value }))}
                          placeholder="Album title"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white"
                        />
                        <textarea
                          value={albumDraft.description}
                          onChange={(e) => setAlbumDraft((state) => ({ ...state, description: e.target.value }))}
                          rows={4}
                          placeholder="Album description"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white"
                        />
                        <div className="flex gap-3">
                          <Button type="button" onClick={() => void saveAlbumEdit(album.id)}>
                            Save
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditingAlbumId(null);
                              setAlbumDraft({ title: "", description: "" });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedAlbumId(album.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedAlbumId(album.id);
                          }
                        }}
                        className="flex w-full items-start gap-4 text-left"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                          {album.coverArt ? (
                            <Image
                              src={album.coverArt}
                              alt={`${album.title} cover art`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.18em] text-fog">
                              No Art
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="truncate text-lg text-white">{album.title}</p>
                              <p className="mt-1 text-sm text-fog">{formatDate(album.releaseDate)}</p>
                              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-fog">
                                {(content.songs ?? []).filter((song) => song.albumId === album.id).length} tracks
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(event) => {
                                event.stopPropagation();
                                setEditingAlbumId(album.id);
                                setAlbumDraft({
                                  title: album.title,
                                  description: album.description ?? ""
                                });
                              }}
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )) : <p className="text-fog">No albums created yet.</p>}
            </div>
          </Card>
        ) : null}

        {activeTab === "tracks" ? (
          <Card className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Track Library</h2>
                <p className="mt-2 text-sm text-fog">
                  Manage your uploaded tracks, control whether they are visible on your artist page, and assign them to albums.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={() => setShowBulkTrackModal(true)}>
                  Bulk Upload
                </Button>
                <Button type="button" onClick={() => setShowCreateTrackModal(true)}>
                  Add Track
                </Button>
              </div>
            </div>

            {dashboard?.artist.plan !== "premium" ? (
              <div className="mt-6 rounded-2xl border border-pink/30 bg-pink/10 p-4">
                <p className="text-sm font-semibold text-white">Free plan streaming limit</p>
                <p className="mt-2 text-sm leading-7 text-fog">
                  All enabled tracks can appear on your public artist page, but only the first 5 enabled tracks are streamable on the free plan.
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Bulk album assignment</p>
                <p className="mt-1 text-sm text-fog">
                  Select one or more tracks, then assign them to an album in one step.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <select
                  defaultValue=""
                  className="min-w-[220px] rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white"
                  onChange={(event) => {
                    const value = event.target.value;
                    if (!value) return;
                    void assignSelectedTracksToAlbum(value === "none" ? null : Number(value));
                    event.target.value = "";
                  }}
                >
                  <option value="">Add selected to album</option>
                  <option value="none">Remove from album</option>
                  {(content?.albums ?? []).map((album) => (
                    <option key={album.id} value={album.id}>
                      {album.title}
                    </option>
                  ))}
                </select>
                <p className="text-xs uppercase tracking-[0.18em] text-fog">
                  {selectedTrackIds.length} selected
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {content?.songs.length ? content.songs.map((song) => {
                const isSelected = selectedTrackIds.includes(song.id);
                return (
                  <div key={song.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <label className="mt-1 flex h-5 items-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(event) => {
                              setSelectedTrackIds((current) =>
                                event.target.checked
                                  ? [...current, song.id]
                                  : current.filter((id) => id !== song.id)
                              );
                            }}
                          />
                        </label>
                        <div className="min-w-0">
                          <p className="truncate text-white">{song.title}</p>
                          <p className="mt-1 text-sm text-fog">
                            {song.albumId ? selectedAlbumTitleById.get(song.albumId) ?? "Album assigned" : "No album"}
                          </p>
                          {song.description ? (
                            <p className="mt-3 text-sm text-fog">{song.description}</p>
                          ) : null}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] ${
                                song.enabled
                                  ? "border border-pink/30 bg-pink/15 text-white"
                                  : "border border-white/10 bg-white/[0.04] text-fog"
                              }`}
                            >
                              {song.enabled ? "Enabled" : "Disabled"}
                            </span>
                            {song.radioSelected ? (
                              <span className="rounded-full border border-pink/30 bg-pink/15 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white">
                                Radio Priority
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => void updateTrack(song.id, { enabled: !song.enabled }, song.enabled ? "Track disabled." : "Track enabled.")}
                        >
                          {song.enabled ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-red-400/20 text-red-200 hover:border-red-400/40 hover:bg-red-500/10 hover:text-white"
                          onClick={() => void deleteTrack(song.id, song.title)}
                        >
                          Delete
                        </Button>
                        <select
                          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white"
                          value={song.albumId ?? ""}
                          onChange={(event) => {
                            const value = event.target.value;
                            void assignTrackToAlbum(song.id, value ? Number(value) : null);
                          }}
                        >
                          <option value="">Add to album</option>
                          {(content?.albums ?? []).map((album) => (
                            <option key={album.id} value={album.id}>
                              {album.title}
                            </option>
                          ))}
                        </select>
                        {song.audioUrl ? (
                          <a
                            href={song.audioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-4 text-xs uppercase tracking-[0.18em] text-fog transition hover:border-pink/40 hover:text-white"
                          >
                            Preview Audio
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              }) : <p className="text-fog">No tracks uploaded yet.</p>}
            </div>
          </Card>
        ) : null}

        {activeTab === "gigs" ? (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold text-white">Add gig</h2>
              <form action={async (formData) => { await createGig(formData); }} className="space-y-4">
                <input name="title" required placeholder="Gig title" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <div className="grid gap-4 md:grid-cols-2">
                  <input name="venue" placeholder="Venue" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                  <input name="city" placeholder="City" className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                </div>
                <input name="eventDate" type="date" required className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input name="ticketUrl" placeholder="Ticket URL" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <textarea name="description" rows={4} placeholder="Gig description" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <Button type="submit" className="w-full">Add gig</Button>
              </form>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-white">Upcoming gigs</h2>
              <div className="mt-4 grid gap-3">
                {content?.gigs.length ? content.gigs.map((gig) => (
                  <div key={gig.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-white">{gig.title}</p>
                    <p className="mt-1 text-sm text-fog">{[gig.venue, gig.city].filter(Boolean).join(" — ") || "Venue TBC"}</p>
                    <p className="mt-1 text-sm text-fog">{formatDate(gig.eventDate)}</p>
                    {gig.description ? <p className="mt-3 text-sm text-fog">{gig.description}</p> : null}
                  </div>
                )) : <p className="text-fog">No gigs added yet.</p>}
              </div>
            </Card>
          </div>
        ) : null}

        {activeTab === "media" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold text-white">Photos</h2>
              <form action={async (formData) => { await uploadPhoto(formData); }} className="space-y-4">
                <input name="alt" placeholder="Photo description" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <label className="block rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-fog">
                  Upload photo
                  <input name="photoFile" type="file" accept="image/*" required className="mt-2 block w-full text-xs" />
                </label>
                <Button type="submit" className="w-full">Add photo</Button>
              </form>
              <div className="grid gap-3 sm:grid-cols-2">
                {content?.photos.length ? content.photos.map((photo) => (
                  <div key={photo.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.imageUrl} alt={photo.alt ?? ""} className="aspect-square w-full object-cover" />
                  </div>
                )) : <p className="text-fog">No photos uploaded yet.</p>}
              </div>
            </Card>

            <Card className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold text-white">Videos</h2>
              <form action={async (formData) => { await addVideo(formData); }} className="space-y-4">
                <input name="title" required placeholder="Video title" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input name="videoUrl" required placeholder="Video URL" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input name="thumbnailUrl" placeholder="Thumbnail URL fallback" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <label className="block rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-fog">
                  Upload video thumbnail
                  <input name="thumbnailFile" type="file" accept="image/*" className="mt-2 block w-full text-xs" />
                </label>
                <Button type="submit" className="w-full">Add video</Button>
              </form>
              <div className="grid gap-3">
                {content?.videos.length ? content.videos.map((video) => (
                  <div key={video.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-white">{video.title}</p>
                    {video.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={video.thumbnailUrl} alt="" className="mt-3 h-32 w-full rounded-xl object-cover" />
                    ) : null}
                    <a href={video.videoUrl ?? "#"} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs uppercase tracking-[0.18em] text-fog">
                      View video
                    </a>
                  </div>
                )) : <p className="text-fog">No videos added yet.</p>}
              </div>
            </Card>
          </div>
        ) : null}

        {activeTab === "press" ? (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="space-y-4 p-6">
              <h2 className="text-2xl font-semibold text-white">Add press item</h2>
              <form action={async (formData) => { await addPress(formData); }} className="space-y-4">
                <input name="title" required placeholder="Title" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input name="publication" required placeholder="Publication" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input name="date" type="date" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input name="articleLink" placeholder="Article link" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <textarea name="excerpt" rows={4} placeholder="Excerpt" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <input name="featureImage" placeholder="Feature image URL fallback" className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white" />
                <label className="block rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-fog">
                  Upload feature image
                  <input name="featureFile" type="file" accept="image/*" className="mt-2 block w-full text-xs" />
                </label>
                <Button type="submit" className="w-full">Add press item</Button>
              </form>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-white">Press coverage</h2>
              <div className="mt-4 grid gap-3">
                {content?.press.length ? content.press.map((item) => (
                  <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-fog">{item.publication} • {formatDate(item.date)}</p>
                    {item.excerpt ? <p className="mt-3 text-sm text-fog">{item.excerpt}</p> : null}
                    {item.articleLink ? <a href={item.articleLink} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs uppercase tracking-[0.18em] text-fog">Read article</a> : null}
                  </div>
                )) : <p className="text-fog">No press items added yet.</p>}
              </div>
            </Card>
          </div>
        ) : null}

        {activeTab === "settings" ? (
          <Card className="space-y-4 p-6">
            <h2 className="text-2xl font-semibold text-white">Settings</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-fog">Plan</p>
                <p className="mt-2 text-white">{dashboard?.artist.plan ?? "free"}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-fog">Public URL</p>
                <p className="mt-2 text-white">/artist/{dashboard?.artist.slug ?? profile.slug}</p>
              </div>
            </div>
            <p className="text-sm text-fog">
              This CMS controls the artist content shown on your public page. Radio placement remains curated by Fully Open Records staff.
            </p>
          </Card>
        ) : null}
      </section>
    </Container>
  );
}

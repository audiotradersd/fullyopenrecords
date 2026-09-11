"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "../../lib/analytics";
import { Button } from "../ui/button";

type AlbumTrack = {
  title: string;
  audioUrl?: string | null;
  enabled?: boolean | null;
};

export default function AlbumPlayAllButton({ tracks, artistName }: { tracks: AlbumTrack[]; artistName: string }) {
  const playableTracks = useMemo(
    () => tracks.filter((track): track is AlbumTrack & { audioUrl: string } => Boolean(track.audioUrl) && track.enabled !== false),
    [tracks]
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackIndexRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  async function playTrack(index: number) {
    const track = playableTracks[index];
    if (!track) return;

    audioRef.current?.pause();
    const audio = new Audio(track.audioUrl);
    audio.preload = "metadata";
    audioRef.current = audio;
    trackIndexRef.current = index;
    setTrackIndex(index);
    setError("");

    audio.addEventListener("play", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("error", () => {
      setPlaying(false);
      setError("This track could not be loaded.");
    });
    audio.addEventListener("ended", () => {
      const nextIndex = trackIndexRef.current + 1;
      if (nextIndex < playableTracks.length) {
        void playTrack(nextIndex);
      } else {
        setPlaying(false);
        setTrackIndex(0);
        trackIndexRef.current = 0;
      }
    });

    try {
      await audio.play();
      trackEvent("track_played", { track_title: track.title, artist_name: artistName });
    } catch {
      setPlaying(false);
      setError("Playback was blocked or the file is unavailable.");
    }
  }

  function togglePlayback() {
    if (!audioRef.current) {
      void playTrack(trackIndexRef.current);
      return;
    }

    if (audioRef.current.paused) {
      void audioRef.current.play().catch(() => setError("Playback was blocked or the file is unavailable."));
    } else {
      audioRef.current.pause();
    }
  }

  if (!playableTracks.length) return null;

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <Button type="button" size="sm" variant={playing ? "default" : "outline"} onClick={togglePlayback}>
        {playing ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
        {playing ? `Pause (${trackIndex + 1}/${playableTracks.length})` : "Play all"}
      </Button>
      {error ? <p className="text-[11px] text-pink">{error}</p> : null}
    </div>
  );
}

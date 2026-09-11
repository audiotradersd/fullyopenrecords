"use client";

import { Pause, Play } from "lucide-react";
import { useMemo } from "react";
import { Button } from "../ui/button";
import { useTrackPlayer } from "./TrackPlayerProvider";

type AlbumTrack = { title: string; audioUrl?: string | null; enabled?: boolean | null };

export default function AlbumPlayAllButton({ tracks, artistName }: { tracks: AlbumTrack[]; artistName: string }) {
  const playableTracks = useMemo(() => tracks.filter((track): track is AlbumTrack & { audioUrl: string } => Boolean(track.audioUrl) && track.enabled !== false).map((track) => ({ ...track, artistName })), [tracks, artistName]);
  const { currentTrack, isPlaying, queueIndex, queueLength, playQueue, togglePlayback } = useTrackPlayer();
  const isAlbumTrack = Boolean(currentTrack && playableTracks.some((track) => track.audioUrl === currentTrack.audioUrl));
  if (!playableTracks.length) return null;
  return <Button type="button" size="sm" variant={isAlbumTrack && isPlaying ? "default" : "outline"} onClick={() => isAlbumTrack ? togglePlayback() : playQueue(playableTracks)}>{isAlbumTrack && isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}{isAlbumTrack && isPlaying ? `Pause (${queueIndex + 1}/${queueLength})` : "Play all"}</Button>;
}

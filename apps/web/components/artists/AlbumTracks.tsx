"use client";

import { PlayCircle } from "lucide-react";
import { useState } from "react";
import AlbumPlayAllButton from "../audio/AlbumPlayAllButton";
import StreamButton from "../audio/StreamButton";

type AlbumTrack = { title: string; audioUrl?: string | null; duration?: string | null; enabled?: boolean | null };

export default function AlbumTracks({ tracks, artistName }: { tracks: AlbumTrack[]; artistName: string }) {
  const [showTracks, setShowTracks] = useState(false);
  return <div className="mt-5">
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => setShowTracks((open) => !open)} aria-expanded={showTracks} className="inline-flex h-10 items-center rounded-full border border-white/15 bg-white/[0.04] px-4 text-sm font-medium text-white transition hover:border-pink/40 hover:bg-white/[0.08]">{showTracks ? "Hide tracks" : `Show tracks (${tracks.length})`}</button>
      <AlbumPlayAllButton tracks={tracks} artistName={artistName} />
    </div>
    {showTracks ? <div className="mt-4 space-y-2">{tracks.map((track) => <div key={track.title} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3"><div><p className="text-sm text-white">{track.title}</p>{track.duration ? <p className="text-xs text-fog">{track.duration}</p> : null}</div>{track.audioUrl && track.enabled !== false ? <StreamButton audioUrl={track.audioUrl} label="Play" pauseLabel="Pause" size="sm" trackTitle={track.title} artistName={artistName} /> : <PlayCircle className="h-5 w-5 text-pink" />}</div>)}</div> : null}
  </div>;
}

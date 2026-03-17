"use client";

import { useEffect, useRef, useState } from "react";

type MiniPlayerProps = {
  streamUrl: string;
  nowPlaying: string;
};

export function MiniPlayer({ streamUrl, nowPlaying }: MiniPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(streamUrl);
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [streamUrl]);

  async function togglePlayback() {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-40 w-[calc(100%-32px)] max-w-[420px] -translate-x-1/2 rounded-[14px] border border-white/10 bg-[rgba(20,10,40,0.95)] px-[18px] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlayback}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink text-sm font-semibold text-white shadow-[0_0_14px_rgba(209,74,139,0.35)]"
          aria-label={isPlaying ? "Pause live radio" : "Play live radio"}
        >
          {isPlaying ? "II" : "Play"}
        </button>
        <div className="min-w-0">
          <p className="font-meta text-[11px] uppercase tracking-[0.24em] text-fog">Now Playing</p>
          <p className="truncate text-sm text-white">{nowPlaying}</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default function RadioPlayer({
  streamUrl,
  nowPlaying
}: {
  streamUrl: string;
  nowPlaying: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(streamUrl);
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [streamUrl]);

  async function toggle() {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    await audioRef.current.play();
    setIsPlaying(true);
  }

  return (
    <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="cosmic-artwork h-20 w-20 rounded-xl" />
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-fog">Fully Open Radio</p>
          <p className="mt-1 text-xl font-semibold text-white">{nowPlaying}</p>
          <p className="mt-1 text-sm text-fog">Live stream from Citrus3 with custom site UI.</p>
        </div>
      </div>
      <Button className="gap-2" onClick={toggle}>
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {isPlaying ? "Pause" : "Play Live"}
      </Button>
    </Card>
  );
}

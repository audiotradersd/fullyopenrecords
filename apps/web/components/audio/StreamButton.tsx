"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

type StreamButtonProps = {
  audioUrl: string;
  label?: string;
  pauseLabel?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "ghost";
  className?: string;
};

export default function StreamButton({
  audioUrl,
  label = "Play",
  size = "default",
  variant = "default",
  className
}: StreamButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState("");

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isActive = playing || loading || currentTime > 0;

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  function togglePlayback() {
    if (!audioRef.current) {
      const audio = new Audio(audioUrl);
      audio.preload = "metadata";
      audioRef.current = audio;

      audio.addEventListener("loadedmetadata", () => {
        setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
        setLoading(false);
      });
      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
      });
      audio.addEventListener("waiting", () => setLoading(true));
      audio.addEventListener("canplay", () => setLoading(false));
      audio.addEventListener("error", () => {
        setLoading(false);
        setPlaying(false);
        setCurrentTime(0);
        setError("Track could not be loaded.");
      });
      audioRef.current.addEventListener("ended", () => {
        setPlaying(false);
        setCurrentTime(0);
      });
      audioRef.current.addEventListener("pause", () => setPlaying(false));
      audioRef.current.addEventListener("play", () => setPlaying(true));
    }

    if (playing) {
      audioRef.current.pause();
      return;
    }

    setError("");
    setLoading(true);
    void audioRef.current
      .play()
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false);
        setError("Playback was blocked or the file is unavailable.");
      });
  }

  function formatTime(value: number) {
    if (!Number.isFinite(value) || value <= 0) {
      return "0:00";
    }

    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  return (
    <div className={className}>
      {isActive ? (
        <div className="min-w-[180px]">
          <button
            type="button"
            onClick={togglePlayback}
            className="relative flex h-11 w-full items-center justify-center overflow-hidden rounded-xl border border-pink/40 bg-[rgba(255,255,255,0.04)] text-white shadow-[0_0_18px_rgba(209,74,139,0.24)] transition duration-200"
          >
            <div
              className="absolute inset-y-0 left-0 bg-pink/70 transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(209,74,139,0.14),rgba(209,74,139,0.04))]" />
            <div className="relative z-10 flex items-center justify-center">
              {loading ? (
                <span className="font-meta text-[11px] uppercase tracking-[0.18em]">Loading...</span>
              ) : playing ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </div>
          </button>
          <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.14em] text-fog">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      ) : (
        <Button type="button" size={size} variant={variant} onClick={togglePlayback}>
          <Play className="mr-2 h-4 w-4" />
          {label}
        </Button>
      )}
      {error ? <p className="mt-1 text-[11px] text-pink">{error}</p> : null}
    </div>
  );
}

"use client";

import { Pause, Play } from "lucide-react";
import { Button } from "../ui/button";
import { useTrackPlayer } from "./TrackPlayerProvider";

type StreamButtonProps = { audioUrl: string; label?: string; pauseLabel?: string; size?: "default" | "sm" | "lg"; variant?: "default" | "outline" | "ghost"; className?: string; buttonClassName?: string; labelClassName?: string; activeClassName?: string; trackTitle?: string; artistName?: string; };

export default function StreamButton({ audioUrl, label = "Play", size = "default", variant = "default", className, buttonClassName, labelClassName, activeClassName, trackTitle, artistName }: StreamButtonProps) {
  const { currentTrack, isPlaying, isLoading, currentTime, duration, playTrack, togglePlayback } = useTrackPlayer();
  const active = currentTrack?.audioUrl === audioUrl;
  const progress = active && duration ? (currentTime / duration) * 100 : 0;
  const toggle = () => active ? togglePlayback() : playTrack({ audioUrl, title: trackTitle ?? label, artistName });
  return <div className={className}>{active ? <div className={activeClassName ?? "min-w-[180px]"}><button type="button" onClick={toggle} className="relative flex h-11 w-full items-center justify-center overflow-hidden rounded-xl border border-pink/40 bg-[rgba(255,255,255,0.04)] text-white shadow-[0_0_18px_rgba(209,74,139,0.24)] transition duration-200"><div className="absolute inset-y-0 left-0 bg-pink/70 transition-[width] duration-200" style={{ width: `${progress}%` }} /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(209,74,139,0.14),rgba(209,74,139,0.04))]" /><div className="relative z-10 flex items-center justify-center">{isLoading ? <span className="font-meta text-[11px] uppercase tracking-[0.18em]">Loading...</span> : isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</div></button></div> : <Button type="button" size={size} variant={variant} onClick={toggle} title={label} className={`max-w-full overflow-hidden whitespace-nowrap ${buttonClassName ?? ""}`}><Play className="mr-2 shrink-0 h-4 w-4" /><span className={labelClassName ? `min-w-0 ${labelClassName}` : "min-w-0 truncate"}>{label}</span></Button>}</div>;
}

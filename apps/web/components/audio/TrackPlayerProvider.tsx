"use client";

import { Pause, Play, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { trackEvent } from "../../lib/analytics";

export type PlayableTrack = { audioUrl: string; title: string; artistName?: string };
type Context = { currentTrack: PlayableTrack | null; isPlaying: boolean; isLoading: boolean; currentTime: number; duration: number; queueIndex: number; queueLength: number; playTrack: (track: PlayableTrack) => void; playQueue: (tracks: PlayableTrack[]) => void; togglePlayback: () => void; closePlayer: () => void };
const TrackPlayerContext = createContext<Context | null>(null);

function formatTime(value: number) { return !Number.isFinite(value) || value <= 0 ? "0:00" : `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, "0")}`; }

export function TrackPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<PlayableTrack[]>([]);
  const queueIndexRef = useRef(0);
  const [currentTrack, setCurrentTrack] = useState<PlayableTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queueIndex, setQueueIndex] = useState(0);
  const [queueLength, setQueueLength] = useState(0);

  const startPlayback = useCallback(async (track: PlayableTrack, queue: PlayableTrack[], index: number) => {
    audioRef.current?.pause();
    const audio = new Audio(track.audioUrl);
    audio.preload = "metadata";
    audioRef.current = audio;
    queueRef.current = queue;
    queueIndexRef.current = index;
    setCurrentTrack(track); setQueueIndex(index); setQueueLength(queue.length); setCurrentTime(0); setDuration(0); setIsLoading(true);
    window.dispatchEvent(new Event("fullyopen:track-play"));
    audio.addEventListener("loadedmetadata", () => { if (audioRef.current === audio) setDuration(Number.isFinite(audio.duration) ? audio.duration : 0); });
    audio.addEventListener("timeupdate", () => { if (audioRef.current === audio) setCurrentTime(audio.currentTime); });
    audio.addEventListener("waiting", () => audioRef.current === audio && setIsLoading(true));
    audio.addEventListener("canplay", () => audioRef.current === audio && setIsLoading(false));
    audio.addEventListener("play", () => audioRef.current === audio && setIsPlaying(true));
    audio.addEventListener("pause", () => audioRef.current === audio && setIsPlaying(false));
    audio.addEventListener("error", () => { if (audioRef.current === audio) { setIsLoading(false); setIsPlaying(false); } });
    audio.addEventListener("ended", () => { if (audioRef.current !== audio) return; const nextIndex = queueIndexRef.current + 1; const next = queueRef.current[nextIndex]; if (next) void startPlayback(next, queueRef.current, nextIndex); else { setIsPlaying(false); setCurrentTime(0); queueIndexRef.current = 0; setQueueIndex(0); } });
    try { await audio.play(); trackEvent("track_played", { track_title: track.title, artist_name: track.artistName }); } catch { if (audioRef.current === audio) { setIsLoading(false); setIsPlaying(false); } }
  }, []);

  const playTrack = useCallback((track: PlayableTrack) => void startPlayback(track, [track], 0), [startPlayback]);
  const playQueue = useCallback((tracks: PlayableTrack[]) => { if (tracks.length) void startPlayback(tracks[0], tracks, 0); }, [startPlayback]);
  const togglePlayback = useCallback(() => { const audio = audioRef.current; if (!audio) return; if (audio.paused) void audio.play().catch(() => setIsPlaying(false)); else audio.pause(); }, []);
  const closePlayer = useCallback(() => { audioRef.current?.pause(); audioRef.current = null; queueRef.current = []; setCurrentTrack(null); setIsPlaying(false); setIsLoading(false); setCurrentTime(0); setDuration(0); setQueueLength(0); setQueueIndex(0); }, []);
  useEffect(() => { const stopForRadio = () => closePlayer(); window.addEventListener("fullyopen:radio-play", stopForRadio); return () => { window.removeEventListener("fullyopen:radio-play", stopForRadio); audioRef.current?.pause(); }; }, [closePlayer]);

  return <TrackPlayerContext.Provider value={{ currentTrack, isPlaying, isLoading, currentTime, duration, queueIndex, queueLength, playTrack, playQueue, togglePlayback, closePlayer }}>
    {children}
    {currentTrack ? <div className="fixed bottom-[74px] left-1/2 z-[71] w-[calc(100%-24px)] max-w-xl -translate-x-1/2 rounded-2xl border border-pink/40 bg-[rgba(20,10,40,0.96)] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl"><div className="flex items-center gap-3"><button type="button" onClick={togglePlayback} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink text-white" aria-label={isPlaying ? "Pause track" : "Play track"}>{isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}</button><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{currentTrack.title}</p><p className="truncate text-xs text-fog">{currentTrack.artistName || "Fully Open Records"}{queueLength > 1 ? ` · ${queueIndex + 1}/${queueLength}` : ""}</p><div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-pink" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} /></div><div className="mt-1 flex justify-between text-[10px] text-fog"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div></div><button type="button" onClick={closePlayer} className="p-2 text-fog transition hover:text-white" aria-label="Close track player"><X className="h-4 w-4" /></button></div></div> : null}
  </TrackPlayerContext.Provider>;
}

export function useTrackPlayer() { const context = useContext(TrackPlayerContext); if (!context) throw new Error("useTrackPlayer must be used within TrackPlayerProvider"); return context; }

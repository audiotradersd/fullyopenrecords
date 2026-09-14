"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { EyeOff, FastForward, Pause, Play, Rewind, X } from "lucide-react";
import { trackEvent } from "../../lib/analytics";

export type PlayableTrack = { audioUrl: string; title: string; artistName?: string };
type Context = { currentTrack: PlayableTrack | null; isPlaying: boolean; isLoading: boolean; currentTime: number; duration: number; queueIndex: number; queueLength: number; playTrack: (track: PlayableTrack) => void; playQueue: (tracks: PlayableTrack[]) => void; togglePlayback: () => void; closePlayer: () => void };
const TrackPlayerContext = createContext<Context | null>(null);

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
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [playerPosition, setPlayerPosition] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number; startX: number; startY: number } | null>(null);
  const didDragRef = useRef(false);
  const scanRef = useRef<{ direction: -1 | 1; previousRate: number; wasPlaying: boolean; interval?: number } | null>(null);

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
  const stopScanning = useCallback(() => {
    const scan = scanRef.current;
    const audio = audioRef.current;
    if (!scan) return;
    if (scan.interval) window.clearInterval(scan.interval);
    scanRef.current = null;
    if (!audio) return;
    audio.playbackRate = scan.previousRate;
    if (scan.wasPlaying) void audio.play().catch(() => setIsPlaying(false)); else audio.pause();
  }, []);
  const togglePlayback = useCallback(() => { stopScanning(); const audio = audioRef.current; if (!audio) return; if (audio.paused) void audio.play().catch(() => setIsPlaying(false)); else audio.pause(); }, [stopScanning]);
  const closePlayer = useCallback(() => { stopScanning(); audioRef.current?.pause(); audioRef.current = null; queueRef.current = []; setCurrentTrack(null); setIsPlaying(false); setIsLoading(false); setCurrentTime(0); setDuration(0); setQueueLength(0); setQueueIndex(0); setIsPlayerMinimized(false); }, [stopScanning]);
  useEffect(() => { const stopForRadio = () => closePlayer(); window.addEventListener("fullyopen:radio-play", stopForRadio); return () => { window.removeEventListener("fullyopen:radio-play", stopForRadio); stopScanning(); audioRef.current?.pause(); }; }, [closePlayer, stopScanning]);

  const startScanning = (direction: -1 | 1, event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !event.isPrimary) return;
    stopScanning();
    event.currentTarget.setPointerCapture(event.pointerId);
    const scan: NonNullable<typeof scanRef.current> = { direction, previousRate: audio.playbackRate, wasPlaying: !audio.paused };
    scanRef.current = scan;
    if (direction === 1) {
      audio.playbackRate = 10;
      void audio.play().catch(() => setIsPlaying(false));
      return;
    }
    audio.pause();
    const rewind = () => {
      if (scanRef.current !== scan) return;
      audio.currentTime = Math.max(0, audio.currentTime - 1);
      setCurrentTime(audio.currentTime);
      if (audio.currentTime === 0) stopScanning();
    };
    scan.interval = window.setInterval(rewind, 100);
  };

  const endScanning = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    stopScanning();
  };

  const startPlayerDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    dragRef.current = { pointerId: event.pointerId, offsetX: event.clientX - bounds.left, offsetY: event.clientY - bounds.top, startX: event.clientX, startY: event.clientY };
    didDragRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
    setPlayerPosition({ x: bounds.left, y: bounds.top });
  };

  const movePlayerDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (Math.abs(event.clientX - drag.startX) > 3 || Math.abs(event.clientY - drag.startY) > 3) didDragRef.current = true;
    setPlayerPosition({
      x: Math.max(0, Math.min(window.innerWidth - bounds.width, event.clientX - drag.offsetX)),
      y: Math.max(0, Math.min(window.innerHeight - bounds.height, event.clientY - drag.offsetY))
    });
  };

  const endPlayerDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return <TrackPlayerContext.Provider value={{ currentTrack, isPlaying, isLoading, currentTime, duration, queueIndex, queueLength, playTrack, playQueue, togglePlayback, closePlayer }}>
    {children}
    {currentTrack ? <>{isPlayerMinimized ? <button type="button" onClick={() => setIsPlayerMinimized(false)} className="fixed bottom-[74px] right-[10px] z-[71] flex h-11 items-center gap-2 rounded-full bg-pink px-4 text-sm font-semibold text-white shadow-[0_0_18px_rgba(209,74,139,0.35)] transition hover:-translate-y-0.5" aria-label="Show track player"><Play className="h-4 w-4" />Show player</button> : <div
      className="fixed bottom-[74px] right-[10px] z-[71] w-[calc(100%-20px)] max-w-[720px] touch-none"
      style={playerPosition ? { left: playerPosition.x, top: playerPosition.y, right: "auto", bottom: "auto" } : undefined}
      onPointerDown={startPlayerDrag}
      onPointerMove={movePlayerDrag}
      onPointerUp={endPlayerDrag}
      onPointerCancel={endPlayerDrag}
      onClickCapture={(event) => { if (didDragRef.current) { event.preventDefault(); event.stopPropagation(); didDragRef.current = false; } }}
    >
      <div className="relative aspect-[28/15] w-full">
        <img src="/player/for-cassette-base.png" alt="" className="absolute inset-0 h-full w-full" draggable={false} />
        <div className="absolute left-[15.7%] top-[14.2%] h-[14.5%] w-[45%] overflow-hidden text-[#131827]">
          <p className="absolute left-[1.3%] right-[1.3%] top-[10%] truncate font-display text-[clamp(12px,2.6vw,25px)] font-semibold leading-[1.08]">{currentTrack.title}</p>
          <p className="absolute left-[1.3%] right-[1.3%] top-[48%] truncate text-[clamp(9px,1.7vw,17px)] font-light leading-[1.05]">{currentTrack.artistName || "Fully Open Records"}</p>
        </div>
        <img src="/player/for-cassette-reel-left.png" alt="" className="absolute left-[17.9%] top-[30.1%] z-10 w-[22.15%]" style={{ animation: "cassette-reel-spin 1.45s linear infinite", animationPlayState: isPlaying ? "running" : "paused" }} draggable={false} />
        <img src="/player/for-cassette-reel-right.png" alt="" className="absolute left-[59.35%] top-[30.1%] z-10 w-[22.15%]" style={{ animation: "cassette-reel-spin 1.45s linear infinite", animationPlayState: isPlaying ? "running" : "paused" }} draggable={false} />
        <button type="button" onClick={togglePlayback} className="absolute inset-0 z-20 cursor-pointer" aria-label={isPlaying ? "Pause track" : "Play track"} />
      </div>
      <div className="mt-2 flex items-center justify-end gap-2 rounded-xl border border-white/10 bg-[rgba(8,4,16,0.88)] p-2 text-white shadow-lg backdrop-blur-xl">
        <button type="button" onPointerDown={(event) => startScanning(-1, event)} onPointerUp={endScanning} onPointerCancel={endScanning} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition hover:border-pink/40" aria-label="Rewind at 10 times speed"><Rewind className="h-4 w-4" /><span className="sr-only">Rewind 10 times</span></button>
        <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={togglePlayback} className="flex h-11 w-11 items-center justify-center rounded-full bg-pink text-white shadow-[0_0_18px_rgba(209,74,139,0.35)] transition hover:-translate-y-0.5" aria-label={isPlaying ? "Pause track" : "Play track"}>{isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}</button>
        <button type="button" onPointerDown={(event) => startScanning(1, event)} onPointerUp={endScanning} onPointerCancel={endScanning} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition hover:border-pink/40" aria-label="Fast forward at 10 times speed"><FastForward className="h-4 w-4" /><span className="sr-only">Fast forward 10 times</span></button>
        <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => setIsPlayerMinimized(true)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition hover:border-pink/40" aria-label="Hide track player"><EyeOff className="h-4 w-4" /></button>
        <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={closePlayer} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition hover:border-pink/40" aria-label="Close track player"><X className="h-4 w-4" /></button>
      </div>
    </div>}</> : null}
  </TrackPlayerContext.Provider>;
}

export function useTrackPlayer() { const context = useContext(TrackPlayerContext); if (!context) throw new Error("useTrackPlayer must be used within TrackPlayerProvider"); return context; }

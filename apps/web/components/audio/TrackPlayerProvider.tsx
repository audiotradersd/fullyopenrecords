"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
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
    {currentTrack ? <div className="fixed bottom-[74px] left-1/2 z-[71] w-[calc(100%-20px)] max-w-[720px] -translate-x-1/2">
      <div className="relative aspect-[28/15] w-full">
        <img src="/player/for-cassette-base.png" alt="" className="absolute inset-0 h-full w-full" draggable={false} />
        <div className="absolute left-[15.7%] top-[14.2%] h-[14.5%] w-[45%] overflow-hidden px-[1.3%] pt-[1.1%] text-[#131827]">
          <p className="truncate font-display text-[clamp(13px,3.1vw,31px)] font-semibold leading-[1.08]">{currentTrack.title}</p>
          <p className="mt-[1.7%] truncate text-[clamp(9px,2.15vw,21px)] leading-[1.05]">{currentTrack.artistName || "Fully Open Records"}</p>
        </div>
        <img src="/player/for-cassette-reel-left.png" alt="" className="absolute left-[17.9%] top-[30.1%] z-10 w-[22.15%]" style={{ animation: "cassette-reel-spin 1.45s linear infinite", animationPlayState: isPlaying ? "running" : "paused" }} draggable={false} />
        <img src="/player/for-cassette-reel-right.png" alt="" className="absolute left-[59.35%] top-[30.1%] z-10 w-[22.15%]" style={{ animation: "cassette-reel-spin 1.45s linear infinite", animationPlayState: isPlaying ? "running" : "paused" }} draggable={false} />
        <button type="button" onClick={togglePlayback} className="absolute inset-0 z-20 cursor-pointer" aria-label={isPlaying ? "Pause track" : "Play track"} />
        <button type="button" onClick={closePlayer} className="absolute right-[1%] top-[1%] z-30 h-[8%] w-[5%]" aria-label="Close track player" />
      </div>
    </div> : null}
  </TrackPlayerContext.Provider>;
}

export function useTrackPlayer() { const context = useContext(TrackPlayerContext); if (!context) throw new Error("useTrackPlayer must be used within TrackPlayerProvider"); return context; }

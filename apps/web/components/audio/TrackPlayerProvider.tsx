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
    {currentTrack ? <div className="fixed bottom-[74px] left-1/2 z-[71] w-[calc(100%-20px)] max-w-[680px] -translate-x-1/2">
      <div className="relative aspect-[1.78] w-full select-none rounded-[7%] border border-[#e2b7ea]/40 bg-[linear-gradient(135deg,rgba(7,12,26,0.98),rgba(18,6,26,0.92)_45%,rgba(7,13,25,0.98))] shadow-[0_0_24px_rgba(59,157,255,0.24),0_0_34px_rgba(209,74,139,0.25),inset_0_0_0_2px_rgba(179,205,255,0.12)]">
        <div className="absolute inset-[2.5%] rounded-[6%] border border-white/15 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_8px,rgba(255,255,255,0.045)_9px,transparent_10px)] opacity-80" />
        {[["left-[3%] top-[5%]"], ["right-[3%] top-[5%]"], ["bottom-[5%] left-[3%]"], ["bottom-[5%] right-[3%]"]].map(([position]) => <span key={position} className={`absolute ${position} h-[5%] w-[5%] rounded-full border border-white/40 bg-[radial-gradient(circle_at_45%_42%,#f5f0ea_0_10%,#3a3445_12%_35%,#090b14_37%)] shadow-[0_0_6px_rgba(255,255,255,0.25)]`} />)}
        <div className="absolute left-[10%] right-[10%] top-[12%] h-[25%] overflow-hidden rounded-sm border border-[#a89ca0] bg-[linear-gradient(135deg,#f3e8df,#d9cfca_55%,#eee1d9)] shadow-[inset_0_0_18px_rgba(50,35,40,0.18)]">
          <div className="absolute inset-x-[12%] bottom-[20%] border-b border-[#322f39]/65" />
          <div className="absolute left-[4%] top-[20%] flex h-[58%] aspect-square items-center justify-center rounded-sm bg-[#202331] text-[clamp(13px,3vw,32px)] font-semibold text-[#e8dfd8]">A</div>
          <div className="absolute left-[16%] right-[26%] top-[18%] min-w-0"><p className="truncate font-display text-[clamp(13px,3.6vw,34px)] font-semibold leading-none text-[#131827]">{currentTrack.title}</p><p className="mt-[4%] truncate text-[clamp(9px,2.4vw,23px)] leading-none text-[#292c3a]">{currentTrack.artistName || "Fully Open Records"}</p></div>
          <p className="absolute bottom-[18%] right-[4%] text-[clamp(5px,1vw,11px)] uppercase tracking-[0.12em] text-[#34313a]">High bias · FOR</p>
        </div>
        <div className="absolute left-[10%] right-[10%] top-[40%] bottom-[20%] overflow-hidden rounded-[4%] border border-pink/30 bg-[linear-gradient(180deg,#070b14,#171025_45%,#060912)] shadow-[inset_0_0_24px_rgba(209,74,139,0.26)]">
          <div className="absolute inset-x-[10%] top-[45%] h-[12%] rounded-full bg-[linear-gradient(90deg,#17121d,#51213f_45%,#13234a)] opacity-85" />
          {["left-[15%]", "right-[15%]"].map((position) => <div key={position} className={`absolute ${position} top-[9%] z-10 aspect-square w-[27%] rounded-full border border-[#f6e6e8]/75 bg-[radial-gradient(circle,#080914_0_13%,#c1b1bc_14%_20%,#221827_21%_44%,#eedde4_45%_50%,#110e18_51%_100%)] shadow-[0_0_15px_rgba(241,157,193,0.42)]`} style={{ animation: "cassette-reel-spin 1.45s linear infinite", animationPlayState: isPlaying ? "running" : "paused" }}><div className="absolute inset-[24%] rounded-full bg-[repeating-conic-gradient(from_0deg,#f2c5dd_0deg_14deg,#26162b_15deg_44deg)] opacity-80" /><div className="absolute inset-[42%] rounded-full border border-white/50 bg-[#080a12]" /></div>)}
          <div className="absolute left-1/2 top-[16%] z-20 h-[62%] w-[18%] -translate-x-1/2 rounded-[45%] border-x border-pink/30 bg-[linear-gradient(90deg,rgba(7,8,14,.9),rgba(87,27,71,.55),rgba(8,13,26,.9))]" />
        </div>
        <div className="absolute bottom-[8%] left-[30%] right-[30%] h-[6%] overflow-hidden rounded-full bg-black/55"><div className="h-full bg-[linear-gradient(90deg,#3b9dff,#d14a8b)]" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} /></div>
        <button type="button" onClick={togglePlayback} className="absolute bottom-[4%] left-[12%] z-30 flex h-[12%] aspect-square items-center justify-center rounded-full border border-pink/60 bg-[#1a1021]/95 text-white shadow-[0_0_12px_rgba(209,74,139,.55)]" aria-label={isPlaying ? "Pause track" : "Play track"}>{isLoading ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : isPlaying ? <Pause className="h-[45%] w-[45%]" /> : <Play className="ml-[5%] h-[45%] w-[45%]" />}</button>
        <button type="button" onClick={closePlayer} className="absolute bottom-[4%] right-[12%] z-30 flex h-[12%] aspect-square items-center justify-center rounded-full border border-white/25 bg-[#10101a]/90 text-fog transition hover:text-white" aria-label="Close track player"><X className="h-[45%] w-[45%]" /></button>
        <div className="absolute bottom-[5%] left-[43%] right-[43%] z-30 flex justify-between text-[clamp(5px,1vw,10px)] text-white/70"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
      </div>
    </div> : null}
  </TrackPlayerContext.Provider>;
}

export function useTrackPlayer() { const context = useContext(TrackPlayerContext); if (!context) throw new Error("useTrackPlayer must be used within TrackPlayerProvider"); return context; }

"use client";

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { Heart, Pause, Play } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";

type RadioPayload = {
  streamUrl?: string;
  nowPlaying?: string;
  host?: string;
};

const EQ_BARS = [
  12, 18, 26, 34, 20, 28, 40, 22,
  16, 30, 24, 38, 18, 32, 44, 26,
  14, 22, 36, 28, 18, 34, 24, 42,
  16, 26, 38, 20, 30, 24, 40, 18
] as const;

function parseTrack(raw: unknown, fallbackArtist?: string) {
  const value = typeof raw === "string" ? raw : String(raw ?? "");

  if (value.includes(" - ")) {
    const [artist, title] = value.split(" - ", 2);
    return { artist: artist.trim(), title: title.trim() };
  }
  if (value.includes(" — ")) {
    const [artist, title] = value.split(" — ", 2);
    return { artist: artist.trim(), title: title.trim() };
  }
  return {
    artist: fallbackArtist?.trim() || "Fully Open Radio",
    title: value || "Fully Open Radio"
  };
}

function FallbackEq({ active }: { active: boolean }) {
  return (
    <div className="flex h-[52px] w-full items-end justify-between gap-[2px]">
      {EQ_BARS.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className="min-w-0 flex-1 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(255,186,220,0.98),rgba(255,93,177,0.95),rgba(209,74,139,0.92))] shadow-[0_0_14px_rgba(255,93,177,0.85)]"
          style={{
            height: active ? `${height}px` : "8px",
            opacity: active ? 1 : 0.45,
            transformOrigin: "bottom center",
            animation: active
              ? `equalizerPulse ${680 + index * 70}ms ease-in-out ${index * 90}ms infinite alternate`
              : "none"
          }}
        />
      ))}
    </div>
  );
}

function GraphicEq({
  active,
  analyzerReady,
  containerRef
}: {
  active: boolean;
  analyzerReady: boolean;
  containerRef: RefObject<HTMLDivElement>;
}) {
  return (
    <div className="hidden min-w-[360px] flex-1 justify-center md:flex lg:min-w-[520px]" aria-hidden="true">
      <div className="relative h-[60px] w-full max-w-[600px] overflow-hidden rounded-xl border border-pink/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-2 py-1 shadow-[0_0_24px_rgba(255,93,177,0.18)]">
        {!analyzerReady ? (
          <div className="absolute inset-1">
            <FallbackEq active={active} />
          </div>
        ) : null}
        <div
          ref={containerRef}
          className={`relative z-[1] h-full w-full origin-bottom scale-y-[3.8] transition-opacity duration-300 ${analyzerReady ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </div>
  );
}

export default function RadioPlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const eqContainerRef = useRef<HTMLDivElement | null>(null);
  const analyzerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [radio, setRadio] = useState<RadioPayload>({
    streamUrl: "",
    nowPlaying: "Fully Open Radio"
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analyzerReady, setAnalyzerReady] = useState(false);
  const [saveState, setSaveState] = useState<string | null>(null);
  const { user, openAuth } = useAuth();

  useEffect(() => {
    let active = true;

    async function loadRadio() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        void response;
      } catch {
        // no-op: keeps the provider warm on initial mount.
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "https://api.fullyopenrecords.com"}/radio`, {
          cache: "no-store"
        });
        if (!response.ok) return;
        const payload = (await response.json()) as RadioPayload;
        if (!active) return;

        setRadio(payload);
      } catch {
        // Radio metadata failure should not break the shell player.
      }
    }

    void loadRadio();
    const timer = window.setInterval(loadRadio, 15000);
    return () => {
      active = false;
      window.clearInterval(timer);
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    return () => {
      analyzerRef.current?.destroy?.();
      analyzerRef.current = null;
      audioContextRef.current?.close?.().catch(() => undefined);
      audioContextRef.current = null;
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [radio.streamUrl]);

  async function attachAnalyzer(audio: HTMLAudioElement) {
    if (!eqContainerRef.current || typeof window === "undefined") {
      setAnalyzerReady(false);
      return;
    }

    try {
      const { default: AudioMotionAnalyzer } = await import("audiomotion-analyzer");
      if (!audioContextRef.current) {
        audioContextRef.current = new window.AudioContext();
      }

      await audioContextRef.current.resume();
      analyzerRef.current?.destroy?.();

      analyzerRef.current = new AudioMotionAnalyzer(eqContainerRef.current, {
        audioCtx: audioContextRef.current,
        source: audio,
        mode: 5,
        maxFPS: 60,
        maxFreq: 14000,
        minFreq: 30,
        smoothing: 0.58,
        showScaleX: false,
        showScaleY: false,
        showPeaks: true,
        showBgColor: false,
        overlay: true,
        reflexRatio: 0,
        linearAmplitude: true,
        linearBoost: 2.2,
        ansiBands: false,
        ledBars: true,
        loRes: false,
        gradient: "prism",
        channelLayout: "single",
        alphaBars: true,
        outlineBars: false,
        roundBars: true,
        barSpace: 0.12,
        gravity: 2.4,
        weightingFilter: "D"
      });

      analyzerRef.current.registerGradient("for-bright", {
        bgColor: "#09040f",
        colorStops: [
          { pos: 0, color: "#ffffff" },
          { pos: 0.12, color: "#fff2fb" },
          { pos: 0.28, color: "#ffd0ea" },
          { pos: 0.48, color: "#f2a7c4" },
          { pos: 0.7, color: "#ff5db1" },
          { pos: 0.88, color: "#d14a8b" },
          { pos: 1, color: "#8b4dff" }
        ]
      });
      analyzerRef.current.gradient = "for-bright";
      analyzerRef.current.reflexBright = 0;
      analyzerRef.current.bgAlpha = 0.18;
      analyzerRef.current.fillAlpha = 1;
      analyzerRef.current.lineWidth = 0;
      analyzerRef.current.maxFreq = 14000;
      analyzerRef.current.minDecibels = -95;
      analyzerRef.current.maxDecibels = -8;
      analyzerRef.current.volume = 1.9;
      analyzerRef.current.peakHoldTime = 80;
      analyzerRef.current.peakFadeTime = 250;

      setAnalyzerReady(true);
    } catch {
      setAnalyzerReady(false);
    }
  }

  function createLiveAudio() {
    if (!radio.streamUrl) return null;

    setAnalyzerReady(false);
    analyzerRef.current?.destroy?.();
    const audio = new Audio(radio.streamUrl);
    audio.crossOrigin = "anonymous";
    audio.preload = "none";
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("ended", () => setIsPlaying(false));
    audioRef.current = audio;
    return audio;
  }

  async function togglePlayback() {
    try {
      setIsLoading(true);
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
        return;
      }

      audioRef.current?.pause();
      const liveAudio = createLiveAudio();
      if (!liveAudio) return;
      void attachAnalyzer(liveAudio);
      await liveAudio.play();
      setIsPlaying(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function favouriteCurrentTrack() {
    if (!user) {
      openAuth("register", "listener");
      return;
    }

    const track = parseTrack(radio.nowPlaying ?? "Fully Open Radio", radio.host);
    const response = await fetch("/api/account/favourites/current", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: track.title,
        artistName: track.artist
      })
    });

    const payload = (await response.json()) as { alreadyFavourited?: boolean; error?: string };

    if (response.status === 401) {
      openAuth("register", "listener");
      return;
    }

    setSaveState(
      response.ok ? (payload.alreadyFavourited ? "Saved already" : "Saved to favourites") : payload.error ?? "Could not save"
    );
    window.setTimeout(() => setSaveState(null), 1800);
  }

  const track = parseTrack(radio.nowPlaying ?? "Fully Open Radio", radio.host);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] border-t border-white/10 bg-[rgba(8,4,16,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="min-w-0 flex-1">
          <p className="font-meta text-[10px] uppercase tracking-[0.26em] text-fog">Now Playing</p>
          <div className="mt-1 flex min-w-0 items-center gap-3">
            <div className="hidden h-10 w-10 shrink-0 rounded-lg bg-[linear-gradient(135deg,#3A1B5C,#D14A8B)] md:block" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{track.artist}</p>
              <p className="truncate text-sm text-fog">{track.title}</p>
            </div>
          </div>
        </div>

        <GraphicEq active={isPlaying || isLoading} analyzerReady={analyzerReady} containerRef={eqContainerRef} />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void togglePlayback()}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-pink text-white shadow-[0_0_18px_rgba(209,74,139,0.35)] transition hover:-translate-y-0.5"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="ml-0.5 h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => void favouriteCurrentTrack()}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:border-pink/40"
            aria-label="Favourite current track"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>
      {saveState ? (
        <div className="border-t border-white/10 px-4 py-2 text-center text-xs text-fog md:px-6">
          {saveState}
        </div>
      ) : null}
    </div>
  );
}

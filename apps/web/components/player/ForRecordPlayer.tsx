type ForRecordPlayerProps = {
  playing: boolean;
};

/** Presentational only: playback state is owned by RadioPlayerBar's audio element. */
export default function ForRecordPlayer({ playing }: ForRecordPlayerProps) {
  return (
    <div className="for-record-player relative h-11 w-11 shrink-0" aria-hidden="true">
      <div className="absolute inset-[2px] rounded-full shadow-[0_0_9px_rgba(59,157,255,0.68)]">
        <img
          src="/radio/for-vinyl-approved.png"
          alt=""
          className={`for-vinyl h-full w-full rounded-full object-cover ${playing ? "for-vinyl-playing" : ""}`}
        />
      </div>
      <svg viewBox="0 0 56 56" className="absolute -right-[16%] -top-[13%] z-10 h-[116%] w-[116%] overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="for-tonearm-metal" x1="0" x2="1">
            <stop offset="0" stopColor="#596878" />
            <stop offset="0.38" stopColor="#f5f8fb" />
            <stop offset="0.7" stopColor="#9eabb8" />
            <stop offset="1" stopColor="#edf2f7" />
          </linearGradient>
          <radialGradient id="for-tonearm-pivot">
            <stop offset="0" stopColor="#f7fafc" />
            <stop offset="0.42" stopColor="#9da9b5" />
            <stop offset="0.7" stopColor="#374151" />
            <stop offset="1" stopColor="#101722" />
          </radialGradient>
        </defs>
        <circle cx="43" cy="10" r="7.6" fill="#111722" stroke="#748292" strokeWidth="1.4" />
        <circle cx="43" cy="10" r="4.3" fill="url(#for-tonearm-pivot)" stroke="#d9e2ec" strokeOpacity=".55" strokeWidth=".7" />
        <path d="M42.5 14 C39 20, 40.5 30, 30 41" fill="none" stroke="#151c25" strokeWidth="4" strokeLinecap="round" />
        <path d="M42.5 14 C39 20, 40.5 30, 30 41" fill="none" stroke="url(#for-tonearm-metal)" strokeWidth="2.05" strokeLinecap="round" />
        <g transform="rotate(-39 28 42)">
          <rect x="24.4" y="38.6" width="7.1" height="5.8" rx="1" fill="url(#for-tonearm-metal)" stroke="#f5f7fa" strokeOpacity=".55" strokeWidth=".45" />
          <path d="M26.4 44.2 L25.5 46.6" stroke="#e9eff5" strokeWidth=".8" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

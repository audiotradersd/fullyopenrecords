type HistoryItem = {
  id: number;
  artistName: string;
  title: string;
  coverImage?: string | null;
  playedAt: string;
};

export default function RecentPlays({ items }: { items: HistoryItem[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[rgba(12,6,22,0.78)] p-6 shadow-[0_18px_42px_rgba(0,0,0,0.28)] backdrop-blur-md">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-fog">Recently Played</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Track History</h2>
        </div>
        <p className="text-xs uppercase tracking-[0.18em] text-fog">Live from D1</p>
      </div>

      <div className="space-y-3">
        {items.length ? (
          items.map((item, index) => (
            <div
              key={`${item.id}-${item.playedAt}`}
              className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
            >
              {item.coverImage ? (
                <img
                  src={item.coverImage}
                  alt={`${item.artistName} cover`}
                  className="h-14 w-14 rounded-xl object-cover"
                />
              ) : (
                <div
                  className="cosmic-artwork h-14 w-14 rounded-xl"
                  style={{ filter: `hue-rotate(${index * 21}deg)` }}
                  aria-hidden="true"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{item.artistName}</p>
                <p className="truncate text-sm text-fog">{item.title}</p>
              </div>
              <p className="hidden text-xs uppercase tracking-[0.18em] text-fog sm:block">
                {new Date(item.playedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-fog">Track history will appear here as the station plays.</p>
        )}
      </div>
    </div>
  );
}

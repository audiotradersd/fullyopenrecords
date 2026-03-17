import { PlayCircle } from "lucide-react";

const tracks = ["Signal Fade", "Broken Circuits", "Echo Chamber"];

export default function ArtistSongList() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm font-semibold text-white">Song List</p>
      <div className="mt-3 space-y-2 text-sm text-fog">
        {tracks.map((track) => (
          <div
            key={track}
            className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2"
          >
            <span>{track}</span>
            <PlayCircle className="h-4 w-4 text-pink" />
          </div>
        ))}
      </div>
    </div>
  );
}

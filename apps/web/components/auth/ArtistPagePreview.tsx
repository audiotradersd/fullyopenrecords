import { CalendarDays, ListMusic, PlayCircle, Video } from "lucide-react";

export default function ArtistPagePreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[rgba(20,8,30,0.72)] backdrop-blur-md">
      <div className="h-28 bg-[radial-gradient(circle_at_20%_20%,rgba(209,74,139,0.3),transparent_30%),linear-gradient(135deg,rgba(58,27,92,0.95),rgba(110,24,86,0.78),rgba(27,12,41,0.95))]" />
      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end gap-4">
          <div className="h-16 w-16 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#4a205f,#d14a8b)]" />
          <div className="pb-1">
            <p className="text-xl font-semibold text-white">Your Band</p>
            <p className="text-sm text-fog">Public artist URL: `/artist/your-band-name`</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-white">
              <ListMusic className="h-4 w-4 text-pink" />
              <p className="text-sm font-semibold">Song List</p>
            </div>
            <div className="mt-3 space-y-2 text-sm text-fog">
              <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                <span>Track One</span>
                <PlayCircle className="h-4 w-4 text-pink" />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                <span>Track Two</span>
                <PlayCircle className="h-4 w-4 text-pink" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-white">
              <CalendarDays className="h-4 w-4 text-pink" />
              <p className="text-sm font-semibold">Upcoming Gigs</p>
            </div>
            <p className="mt-3 text-sm text-fog">Promote your next show, session, or label night.</p>
            <div className="mt-3 rounded-lg bg-white/[0.03] px-3 py-2 text-sm text-fog">
              Progress • 12.05
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-white">
            <Video className="h-4 w-4 text-pink" />
            <p className="text-sm font-semibold">Video Section</p>
          </div>
          <div className="mt-3 h-24 rounded-xl bg-[linear-gradient(135deg,rgba(209,74,139,0.22),rgba(58,27,92,0.5))]" />
        </div>
      </div>
    </div>
  );
}

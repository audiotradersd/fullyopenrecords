import {
  CalendarDays,
  Link2,
  Mic2,
  Music4,
  Radio,
  Video
} from "lucide-react";
const artistBenefits = [
  { icon: Radio, label: "Get selected for airplay on Fully Open Radio" },
  { icon: Mic2, label: "Create your own dedicated artist page" },
  { icon: Music4, label: "Upload songs and releases" },
  { icon: Video, label: "Upload videos and photos" },
  { icon: CalendarDays, label: "Promote gigs and events" },
  { icon: Link2, label: "Link to social platforms" }
];

export default function ArtistBenefits() {
  return (
    <div>
      <p className="font-meta text-xs uppercase tracking-[0.28em] text-pink">Benefits</p>
      <h2 className="mt-4 text-3xl font-semibold text-white">Why join as an artist</h2>
      <div className="mt-8 grid gap-4">
        {artistBenefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.label}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md transition duration-200 hover:bg-white/10"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink/15 text-pink">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-base text-white">{benefit.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

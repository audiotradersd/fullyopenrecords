import ArtistGigCard from "./ArtistGigCard";
import ArtistSongList from "./ArtistSongList";
import ArtistBioSection from "./ArtistBioSection";

export default function ArtistPreviewCard() {
  return (
    <div>
      <p className="font-meta text-xs uppercase tracking-[0.24em] text-fog">Example Artist Page Preview</p>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 shrink-0 rounded-full border border-white/10 bg-[linear-gradient(135deg,#4a205f,#d14a8b)]" />
          <div className="min-w-0">
            <p className="font-meta text-[11px] uppercase tracking-[0.24em] text-pink">Example Band Page</p>
            <p className="text-2xl font-semibold text-white">Stone!?</p>
            <p className="mt-1 text-sm text-fog">Industrial / Experimental Rock</p>
            <p className="mt-1 text-sm text-fog">Brighton, UK</p>
            <p className="mt-2 text-sm text-pink">Example URL: /artist/stone</p>
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ArtistSongList />
            <ArtistGigCard />
          </div>
          <ArtistBioSection />
        </div>
      </div>
    </div>
  );
}

import { Section } from "@fully-open-records/ui";
import { RadioPlayer } from "../../components/RadioPlayer";
import RecentPlays from "../../components/radio/RecentPlays";
import { getRadio, getRadioHistory } from "../../lib/api";


export default async function RadioPage() {
  const [radio, history] = await Promise.all([getRadio(), getRadioHistory()]);

  return (
    <Section className="max-w-5xl">
      <h1 className="font-display text-5xl">Radio</h1>
      <p className="mt-4 text-fog">
        Live stream player with custom track history stored in D1 from the Citrus metadata feed.
      </p>
      <div className="mt-8">
        <RadioPlayer
          streamUrl={String(radio.streamUrl)}
          nowPlaying={String(radio.nowPlaying)}
          metadataUrl={String(radio.metadataUrl ?? "")}
        />
      </div>
      <div className="mt-8">
        <RecentPlays
          items={history.map((item) => ({
            id: Number(item.id),
            artistName: String(item.artistName ?? ""),
            title: String(item.title ?? ""),
            coverImage: item.coverImage ? String(item.coverImage) : null,
            playedAt: String(item.playedAt ?? "")
          }))}
        />
      </div>
    </Section>
  );
}

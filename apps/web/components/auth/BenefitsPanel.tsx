"use client";

import { Heart, Headphones, Mic2, Radio, Save, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import ArtistBenefits from "./ArtistBenefits";

type AccountType = "listener" | "artist";

const listenerBenefits = [
  { icon: Headphones, label: "Unlimited radio streaming" },
  { icon: Heart, label: "Favourite tracks" },
  { icon: Radio, label: "Follow artists" },
  { icon: Mic2, label: "Access exclusive artist content" },
  { icon: Save, label: "Save releases and playlists" }
];

export default function BenefitsPanel({ selected, onJoin }: { selected: AccountType; onJoin?: (type: AccountType) => void }) {

  return (
    <section className="py-8">
      <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
        {selected === "artist" ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
            <div className="rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(58,27,92,0.42),rgba(18,8,28,0.72))] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink/15 text-pink">
                <Mic2 className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-white">Built for airplay and discovery</h3>
              <p className="mt-4 text-base leading-7 text-fog">
                Create your artist page, upload tracks, and put your music in front of listeners through the Fully Open catalogue and curated radio consideration.
              </p>
              <div className="mt-8">
                <Button onClick={() => onJoin?.("artist")}>Join as Artist</Button>
              </div>
            </div>
            <ArtistBenefits />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
            <div className="rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(58,27,92,0.42),rgba(18,8,28,0.72))] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink/15 text-pink">
                <ImageIcon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-white">Built for discovery</h3>
              <p className="mt-4 text-base leading-7 text-fog">
                Join to keep track of favourite songs, follow artists you discover on the station, and build your own thread through the Fully Open catalogue.
              </p>
              <div className="mt-8">
                <Button onClick={() => onJoin?.("listener")}>Join as Listener</Button>
              </div>
            </div>
            <div>
              <p className="font-meta text-xs uppercase tracking-[0.28em] text-pink">Benefits</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Why join as a listener</h2>
              <div className="mt-8 grid gap-4">
                {listenerBenefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={benefit.label}
                      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4"
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
          </div>
        )}
      </div>
    </section>
  );
}

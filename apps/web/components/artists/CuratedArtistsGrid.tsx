"use client";

import { useState } from "react";
import { ArtistCard } from "../Cards";

export default function CuratedArtistsGrid({ artists }: { artists: Array<Record<string, unknown>> }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? artists : artists.slice(0, 10);
  return <><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{visible.map((artist) => <ArtistCard key={String(artist.id ?? artist.slug)} artist={artist} />)}</div>{artists.length > 10 && !expanded ? <div className="mt-7 text-center"><button onClick={() => setExpanded(true)} className="border-b border-[#74c8ff] pb-2 text-sm font-medium text-[#9bd8ff]">View All Featured Artists →</button></div> : null}</>;
}

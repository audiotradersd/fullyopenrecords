"use client";

import { Heart, Share2 } from "lucide-react";
import { useState } from "react";

export default function ArtistHeroActions({
  url,
  name
}: {
  url: string;
  name: string;
}) {
  const [message, setMessage] = useState<string | null>(null);

  async function sharePage() {
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setMessage("Link copied");
    } catch {
      setMessage("Share unavailable");
    }

    window.setTimeout(() => setMessage(null), 1800);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-pink px-5 text-sm font-medium text-white shadow-[0_0_18px_rgba(209,74,139,0.35)] transition duration-200 hover:-translate-y-0.5"
      >
        <Heart className="h-4 w-4" />
        Follow
      </button>
      <button
        type="button"
        onClick={() => void sharePage()}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-5 text-sm font-medium text-white transition duration-200 hover:bg-white/[0.08]"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>
      {message ? <span className="text-sm text-fog">{message}</span> : null}
    </div>
  );
}

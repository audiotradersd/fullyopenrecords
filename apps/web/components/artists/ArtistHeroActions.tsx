"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { trackEvent } from "../../lib/analytics";
import { CreateShareButton } from "../share/CreateShare";
import { useAuth } from "../auth/AuthProvider";

export default function ArtistHeroActions({
  url,
  name,
  slug,
  image,
  tagline,
}: {
  url: string;
  name: string;
  slug: string;
  image?: string | null;
  tagline?: string | null;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [following, setFollowing] = useState(false); const [count, setCount] = useState(0); const [canFollow, setCanFollow] = useState(true); const [pending, setPending] = useState(false); const [followAfterLogin, setFollowAfterLogin] = useState(false);
  const { user, loading, openAuth } = useAuth();
  async function loadFollow() { const response = await fetch(`/api/artists/${slug}/follow`, { cache: "no-store" }); if (response.ok) { const data = await response.json(); setFollowing(data.following); setCount(data.followerCount); setCanFollow(data.canFollow); } }
  useEffect(() => { void loadFollow(); }, [slug, user?.id]);
  useEffect(() => { if (!user || !followAfterLogin) return; setFollowAfterLogin(false); void (async () => { const response = await fetch(`/api/artists/${slug}/follow`, { method: "POST" }); const data = await response.json(); if (response.ok) { setFollowing(true); setCount(data.followerCount); } })(); }, [user, followAfterLogin, slug]);
  async function toggleFollow() { if (!user) { setFollowAfterLogin(true); openAuth("login"); return; } if (!canFollow) { setMessage("This is your artist page."); return; } setPending(true); const response = await fetch(`/api/artists/${slug}/follow`, { method: following ? "DELETE" : "POST" }); const data = await response.json(); setPending(false); if (!response.ok) { setMessage(data.error ?? "Could not update follow."); return; } setFollowing(data.following); setCount(data.followerCount); trackEvent(data.following ? "artist_followed" : "artist_unfollowed", { artist_name: name }); }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => void toggleFollow()}
        disabled={loading || pending}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-pink px-5 text-sm font-medium text-white shadow-[0_0_18px_rgba(59,157,255,0.38)] transition duration-200 hover:-translate-y-0.5"
      >
        <Heart className={`h-4 w-4 ${following ? "fill-current" : ""}`} />
        {following ? "Following" : "Follow"}{count ? ` · ${count}` : ""}
      </button>
      <CreateShareButton content={{ contentType: "artist", artistName: name, title: name, subtitle: tagline ?? undefined, image, cta: `DISCOVER ${name}`, url }} label="Share" />
      {message ? <span className="text-sm text-fog">{message}</span> : null}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../auth/AuthProvider";
import Container from "../layout/Container";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type Favourite = {
  id: number;
  title: string;
  artistName: string;
  coverImage?: string | null;
  createdAt: string;
};

export default function ListenerAccount() {
  const { user, loading } = useAuth();
  const [favourites, setFavourites] = useState<Favourite[]>([]);

  useEffect(() => {
    if (!user) return;
    void fetch("/api/account/favourites", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => setFavourites(Array.isArray(payload) ? payload : []));
  }, [user]);

  if (loading) {
    return (
      <Container>
        <section className="py-20">
          <p className="text-fog">Loading account…</p>
        </section>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <section className="py-20">
          <Card className="p-8 text-center">
            <h1 className="text-3xl font-semibold text-white">Create a listener account</h1>
            <p className="mt-4 text-fog">
              Save favourites from the radio stream and build your own discovery list.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
              <Link href="/radio">
                <Button variant="outline">Go to Radio</Button>
              </Link>
            </div>
          </Card>
        </section>
      </Container>
    );
  }

  return (
    <Container>
      <section className="py-20">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-fog">Listener Account</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">{user.username}</h1>
          <p className="mt-3 text-fog">Favourite tracks saved from Fully Open Radio.</p>
        </div>

        <div className="grid gap-4">
          {favourites.length ? (
            favourites.map((song) => (
              <Card key={song.id} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-lg font-semibold text-white">{song.title}</p>
                  <p className="mt-1 text-sm text-fog">{song.artistName}</p>
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-fog">
                  Saved {new Date(song.createdAt).toLocaleDateString()}
                </p>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-white">No favourites yet.</p>
              <p className="mt-3 text-fog">
                Start the radio and tap the heart icon to save what is playing.
              </p>
            </Card>
          )}
        </div>
      </section>
    </Container>
  );
}

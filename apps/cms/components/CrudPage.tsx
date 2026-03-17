"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, Panel } from "@fully-open-records/ui";
import { cmsFetch } from "../lib/api";

type CrudPageProps = {
  title: string;
  endpoint: string;
  fields: Array<{ name: string; label: string; placeholder?: string }>;
};

export function CrudPage({ title, endpoint, fields }: CrudPageProps) {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [status, setStatus] = useState("");

  async function load() {
    const data = await cmsFetch<Array<Record<string, unknown>>>(endpoint);
    setItems(data);
  }

  useEffect(() => {
    load().catch(() => setStatus("Load failed"));
  }, [endpoint]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: Record<string, unknown> = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );

    if ("price" in payload) payload.price = Number(payload.price);
    if ("inventory" in payload) payload.inventory = Number(payload.inventory);
    if ("featured" in payload) payload.featured = payload.featured === "on";
    if ("artistId" in payload) payload.artistId = Number(payload.artistId);
    if ("order" in payload) payload.order = Number(payload.order);

    if ("galleryImages" in payload) payload.galleryImages = [String(payload.galleryImages)];
    if ("images" in payload) payload.images = [String(payload.images)];
    if ("genres" in payload) payload.genres = String(payload.genres).split(",").map((item) => item.trim());
    if ("socialLinks" in payload) payload.socialLinks = {};
    if ("streamingLinks" in payload) payload.streamingLinks = {};
    if ("variants" in payload) payload.variants = [];
    if ("blocks" in payload) payload.blocks = JSON.parse(String(payload.blocks || "[]"));
    if ("published" in payload) payload.published = payload.published === "on";

    await cmsFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    event.currentTarget.reset();
    setStatus("Saved");
    await load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl">{title}</h1>
        <p className="mt-2 text-fog">Custom Next.js admin backed by the edge API.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <label key={field.name} className="grid gap-2 text-sm">
                <span>{field.label}</span>
                <input
                  name={field.name}
                  placeholder={field.placeholder}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                />
              </label>
            ))}
            <Button type="submit">Save</Button>
            {status ? <p className="text-sm text-fog">{status}</p> : null}
          </form>
        </Panel>
        <Panel>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={String(item.id)} className="rounded-2xl border border-white/10 p-4">
                <pre className="overflow-auto text-xs text-fog">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

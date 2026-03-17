"use client";

import Image from "next/image";
import { useState } from "react";

type Photo = {
  imageUrl: string;
  alt?: string | null;
};

export default function ArtistGallery({ photos }: { photos: Photo[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {photos.map((photo, index) => (
          <button
            key={`${photo.imageUrl}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:border-pink/40"
          >
            <Image
              src={photo.imageUrl}
              alt={photo.alt || "Artist photo"}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              unoptimized
            />
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <button
          type="button"
          onClick={() => setActiveIndex(null)}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-6"
        >
          <div className="relative h-[80vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black">
            <Image
              src={photos[activeIndex].imageUrl}
              alt={photos[activeIndex].alt || "Artist photo"}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized
            />
          </div>
        </button>
      ) : null}
    </>
  );
}

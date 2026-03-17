"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";

type FeaturedRelease = {
  artist: string;
  title: string;
  genre: string;
  status: string;
};

type HeroProps = {
  release: FeaturedRelease;
};

const slides = [
  {
    key: "listener",
    label: "Listener",
    title: "Discover new artists before the algorithm catches up.",
    copy:
      "Find underground releases, radio cuts and left-field sounds from a scene built for open-minded listeners.",
    primaryHref: "/artists",
    primaryLabel: "Discover Artists",
    secondaryHref: "/releases",
    secondaryLabel: "Browse Releases",
    metaTitle: "For listeners",
    metaCopy: "Fresh artists, radio cuts and scenes worth following.",
    image: "/hero/discover-v2.png",
    cardLabel: "Featured Artist",
    cardTitle: "GRZZLY",
    cardSubtitle: "Sonny Boy EP",
    cardMeta: "Experimental Hip Hop",
    cardStatus: "Featured now"
  },
  {
    key: "band",
    label: "Band",
    title: "Get discovered by a label that actually listens.",
    copy:
      "Send demos, join the community and put your work in front of a platform focused on experimental and underground music.",
    primaryHref: "/submit-music",
    primaryLabel: "Submit Music",
    secondaryHref: "/contact",
    secondaryLabel: "Join Community",
    metaTitle: "For artists",
    metaCopy: "Demos, releases and direct access to the label.",
    image: "/hero/artists-v2.png",
    cardLabel: "Build Your Page",
    cardTitle: "Create your",
    cardSubtitle: "band page",
    cardMeta: "Profiles, links and releases",
    cardStatus: "Get discovered"
  },
  {
    key: "live",
    label: "Listen Live",
    title: "Tune into Fully Open Radio and hear what is happening now.",
    copy:
      "A live stream of new artists, rare selections and community-driven programming running through the site all day.",
    primaryHref: "/radio",
    primaryLabel: "Listen Live",
    secondaryHref: "/faq",
    secondaryLabel: "How It Works",
    metaTitle: "For radio",
    metaCopy: "Live programming, underground selections and new voices.",
    image: "/hero/listen-v2.png",
    cardLabel: "Playing Now",
    cardTitle: "Fully Open",
    cardSubtitle: "Radio",
    cardMeta: "Live stream and metadata",
    cardStatus: "On air"
  }
] as const;

export function Hero({ release }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <section className="cosmic-bg hero-noise">
      <div
        className="mx-auto flex min-h-[250px] w-full max-w-[1200px] items-end px-6 py-3 md:min-h-[290px] md:py-4"
        style={{
          backgroundImage:
            `linear-gradient(90deg, rgba(7,3,16,0.84) 0%, rgba(7,3,16,0.6) 40%, rgba(7,3,16,0.24) 100%), url('${activeSlide.image}')`,
          backgroundPosition: "center top",
          backgroundSize: "cover",
          borderRadius: "18px"
        }}
      >
        <div className="w-full rounded-[18px] border border-white/10 bg-[rgba(8,4,16,0.28)] p-4 backdrop-blur-[2px] md:p-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px] md:items-end">
            <div className="max-w-[620px]">
              <p className="font-meta text-xs uppercase tracking-[0.34em] text-fog">{activeSlide.label}</p>
              <h1 className="mt-2 max-w-[560px] text-[28px] leading-[0.96] text-white md:text-[38px]">
                {activeSlide.title}
              </h1>
              <p className="mt-2 max-w-[560px] text-sm leading-5 text-fog md:text-[15px] md:leading-6">
                {activeSlide.copy}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={activeSlide.primaryHref as Route}
                  className="primary-button inline-flex h-11 items-center justify-center font-meta text-sm font-semibold"
                >
                  {activeSlide.primaryLabel}
                </Link>
                <Link
                  href={activeSlide.secondaryHref as Route}
                  className="inline-flex h-11 items-center justify-center rounded-[10px] border border-white/15 bg-white/[0.03] px-5 font-meta text-sm font-medium text-white"
                >
                  {activeSlide.secondaryLabel}
                </Link>
              </div>
            </div>

            <div className="rounded-[12px] border border-pink/30 bg-[rgba(20,8,30,0.72)] p-3 backdrop-blur-md">
              <p className="font-meta text-[11px] uppercase tracking-[0.24em] text-white/80">{activeSlide.cardLabel}</p>
              <div
                className="cosmic-artwork mt-2 h-[84px] w-full rounded-[8px]"
                aria-label={
                  activeSlide.key === "listener"
                    ? `${release.artist} ${release.title} artwork`
                    : activeSlide.key === "band"
                      ? "Band page promotion artwork"
                      : "Playing now radio artwork"
                }
              />
              <div className="mt-2">
                <p className="text-sm font-semibold text-white">{activeSlide.cardTitle}</p>
                <p className="text-[18px] leading-none text-white">{activeSlide.cardSubtitle}</p>
                <p className="mt-1 text-xs text-fog">{activeSlide.cardMeta}</p>
                <p className="mt-1 text-sm font-semibold text-white">{activeSlide.cardStatus}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-2 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {slides.map((slide, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={slide.key}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={[
                      "rounded-full border px-3 py-2 font-meta text-[11px] uppercase tracking-[0.18em] transition",
                      isActive
                        ? "border-pink/50 bg-pink/20 text-white"
                        : "border-white/10 bg-white/[0.03] text-fog"
                    ].join(" ")}
                  >
                    {slide.label}
                  </button>
                );
              })}
            </div>

            <div className="text-sm text-fog md:text-right">
              <p className="font-meta text-[11px] uppercase tracking-[0.24em] text-white/80">{activeSlide.metaTitle}</p>
              <p className="mt-1 max-w-[320px] md:ml-auto">{activeSlide.metaCopy}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

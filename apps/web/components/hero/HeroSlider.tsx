"use client";

import { useEffect, useState } from "react";
import Container from "../layout/Container";
import BannerSlide, { type BannerSlideData } from "./BannerSlide";

const slides: BannerSlideData[] = [
  {
    key: "listener",
    image: "/hero/discover-v2.png",
    eyebrow: "Listener",
    title: "Discover new artists before the algorithm catches up.",
    copy: "Find underground releases, radio cuts and left-field sounds from a scene built for open-minded listeners.",
    primaryHref: "/artists",
    primaryLabel: "Discover Artists",
    secondaryHref: "/releases",
    secondaryLabel: "Browse Releases",
    sideLabel: "Featured Artist",
    sideTitle: "GRZZLY",
    sideSubtitle: "Sonny Boy EP",
    sideMeta: "Experimental Hip Hop",
    sideStatus: "Featured now"
  },
  {
    key: "band",
    image: "/hero/artists-v2.png",
    eyebrow: "Band",
    title: "Get discovered by a label that actually listens.",
    copy: "Build your band page, connect your releases and put your work in front of a platform focused on underground music.",
    primaryHref: "/submit-music",
    primaryLabel: "Submit Music",
    secondaryHref: "/contact",
    secondaryLabel: "Join Community",
    sideLabel: "Band Page",
    sideTitle: "Create your",
    sideSubtitle: "artist profile",
    sideMeta: "Links, releases and socials",
    sideStatus: "Start building"
  },
  {
    key: "live",
    image: "/hero/listen-v2.png",
    eyebrow: "Listen Live",
    title: "Tune into Fully Open Radio and hear what is happening now.",
    copy: "A live stream of new artists, rare selections and community-driven programming running through the site all day.",
    primaryHref: "/radio",
    primaryLabel: "Listen Live",
    secondaryHref: "/faq",
    secondaryLabel: "How It Works",
    sideLabel: "Playing Now",
    sideTitle: "Fully Open",
    sideSubtitle: "Radio",
    sideMeta: "Live stream and metadata",
    sideStatus: "On air"
  }
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="py-6 md:py-8">
      <Container>
        <BannerSlide slide={slides[index]} />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {slides.map((slide, slideIndex) => {
              const active = slideIndex === index;

              return (
                <button
                  key={slide.key}
                  type="button"
                  onClick={() => setIndex(slideIndex)}
                  className={[
                    "rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.18em] transition",
                    active ? "border-pink/50 bg-pink/20 text-white" : "border-white/10 bg-white/[0.03] text-fog"
                  ].join(" ")}
                >
                  {slide.eyebrow}
                </button>
              );
            })}
          </div>
          <p className="max-w-sm text-sm text-fog">Three core entry points for the site: discover artists, build your page, and listen live.</p>
        </div>
      </Container>
    </section>
  );
}

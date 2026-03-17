"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "../layout/Container";
import Link from "next/link";
import { Button } from "../ui/button";

const banners = [
  {
    image: "/hero/discover-v3.png",
    eyebrow: "Listener",
    title: "Discover new artists before the algorithm catches up.",
    copy: "Find underground releases, radio cuts and left-field sounds from a scene built for open-minded listeners.",
    primaryHref: "/artists",
    primaryLabel: "Discover Artists",
    secondaryHref: "/releases",
    secondaryLabel: "Browse Releases"
  },
  {
    image: "/hero/artists-v3.png",
    eyebrow: "Band",
    title: "Get discovered by listeners by adding your tracks.",
    copy: "Build your band page, add your tracks, and put your music in front of open-minded listeners looking for something new.",
    primaryHref: "/get-heard",
    primaryLabel: "Get Heard",
    secondaryHref: "/contact",
    secondaryLabel: "Join Community"
  },
  {
    image: "/hero/listen-v3.png",
    eyebrow: "Listen Live",
    title: "Tune into Fully Open Radio and hear what is happening now.",
    copy: "A live stream of new artists, rare selections and community-driven programming running through the site all day.",
    primaryHref: "/radio",
    primaryLabel: "Listen Live",
    secondaryHref: "/faq",
    secondaryLabel: "How It Works"
  }
] as const;

export default function BannerSlider() {
  const [index, setIndex] = useState(0);
  const active = banners[index];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[500px] w-full overflow-hidden border-b border-white/10">
      <AnimatePresence mode="wait">
        <motion.img
          key={active.image}
          src={active.image}
          alt=""
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,3,14,0.88)_0%,rgba(8,3,14,0.55)_42%,rgba(8,3,14,0.15)_100%)]" />
      <div className="absolute inset-0 flex items-end">
        <Container>
          <div className="max-w-2xl pb-12">
            <p className="text-xs uppercase tracking-[0.34em] text-fog">{active.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-bold leading-[0.95] text-white md:text-6xl">
              {active.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-neutral-200 md:text-lg">
              {active.copy}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={active.primaryHref}>
                <Button>{active.primaryLabel}</Button>
              </Link>
              <Link href={active.secondaryHref}>
                <Button variant="outline">{active.secondaryLabel}</Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

import Link from "next/link";
import type { Route } from "next";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export type BannerSlideData = {
  key: string;
  image: string;
  eyebrow: string;
  title: string;
  copy: string;
  primaryHref: Route;
  primaryLabel: string;
  secondaryHref: Route;
  secondaryLabel: string;
  sideLabel: string;
  sideTitle: string;
  sideSubtitle: string;
  sideMeta: string;
  sideStatus: string;
};

export default function BannerSlide({ slide }: { slide: BannerSlideData }) {
  return (
    <motion.div
      key={slide.key}
      initial={{ opacity: 0.18, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-white/10"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(7,3,16,0.9) 0%, rgba(7,3,16,0.58) 42%, rgba(7,3,16,0.18) 100%), url('${slide.image}')`,
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
    >
      <div className="grid min-h-[360px] gap-6 p-5 md:min-h-[420px] md:grid-cols-[minmax(0,1fr)_280px] md:items-end md:p-8">
        <div className="max-w-[620px] self-end">
          <p className="font-meta text-xs uppercase tracking-[0.34em] text-fog">{slide.eyebrow}</p>
          <h1 className="mt-3 max-w-[560px] text-[34px] leading-[0.94] text-white md:text-[52px]">
            {slide.title}
          </h1>
          <p className="mt-4 max-w-[560px] text-base leading-7 text-fog md:text-lg">{slide.copy}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={slide.primaryHref}>
              <Button>{slide.primaryLabel}</Button>
            </Link>
            <Link href={slide.secondaryHref}>
              <Button variant="outline">{slide.secondaryLabel}</Button>
            </Link>
          </div>
        </div>

        <Card className="self-end rounded-2xl border-pink/30 bg-[rgba(20,8,30,0.72)]">
          <p className="font-meta text-[11px] uppercase tracking-[0.24em] text-white/80">{slide.sideLabel}</p>
          <div className="cosmic-artwork mt-3 h-[132px] rounded-xl" />
          <div className="mt-4">
            <p className="text-base font-semibold text-white">{slide.sideTitle}</p>
            <p className="text-[22px] leading-none text-white">{slide.sideSubtitle}</p>
            <p className="mt-2 text-sm text-fog">{slide.sideMeta}</p>
            <p className="mt-2 text-base font-semibold text-white">{slide.sideStatus}</p>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

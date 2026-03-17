"use client";

import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

type SpotlightProps = {
  className?: string;
  fill?: string;
};

export function Spotlight({ className, fill = "#A12C6A" }: SpotlightProps) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0.35, scale: 0.9 }}
      animate={{ opacity: [0.28, 0.48, 0.28], scale: [0.95, 1.05, 0.95] }}
      transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      className={twMerge("pointer-events-none absolute h-[24rem] w-[24rem] rounded-full blur-3xl", className)}
      style={{
        background: `radial-gradient(circle, ${fill} 0%, rgba(255,255,255,0) 70%)`
      }}
    />
  );
}

import * as React from "react";
import { twMerge } from "tailwind-merge";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        "rounded-2xl border border-white/10 bg-[rgba(18,8,28,0.72)] p-4 shadow-[0_18px_42px_rgba(0,0,0,0.28)] backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:border-pink/40",
        className
      )}
      {...props}
    />
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

const logoUrl =
  "/for-logo.png";

const links = [
  ["Radio", "/radio"],
  ["Artists", "/artists"],
  ["Releases", "/releases"],
  ["Get Heard", "/get-heard"],
  ["About", "/about"]
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 transition duration-300",
        scrolled
          ? "border-b border-white/10 bg-[rgba(4,2,10,0.96)] backdrop-blur-xl"
          : "bg-[rgba(4,2,10,0.82)] backdrop-blur-md"
      ].join(" ")}
    >
      <div className="mx-auto flex h-[96px] max-w-[1200px] items-center justify-between px-6">
        <Link href={"/" as Route} className="mr-5 flex shrink-0 items-center lg:mr-6">
          <Image
            src={logoUrl}
            alt="Fully Open Records"
            width={210}
            height={58}
            className="h-auto w-[176px] sm:w-[200px] md:w-[224px] lg:w-[252px]"
            priority
          />
        </Link>
        <div className="hidden flex-1 items-center justify-between md:flex">
          <nav className="ml-8 flex items-center gap-6 font-meta text-[13px] uppercase text-fog lg:ml-12 lg:gap-8">
            {links.map(([label, href]) => (
              <Link key={href} href={href as Route}>
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href={"/radio" as Route}
            className="inline-flex h-10 items-center justify-center rounded-[10px] bg-pink px-4 font-meta text-[13px] font-semibold text-white shadow-[0_0_14px_rgba(209,74,139,0.28)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(209,74,139,0.45)]"
          >
            Listen Live
          </Link>
        </div>
        <Link
          href={"/radio" as Route}
          className="inline-flex h-9 items-center justify-center rounded-[10px] border border-white/15 px-3 font-meta text-[11px] uppercase text-white md:hidden"
        >
          Listen
        </Link>
      </div>
    </header>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

const logoUrl =
  "/for-logo.png";

const navLinks = [
  ["About", "/about"],
  ["Radio", "/radio"],
  ["Artists", "/artists"],
  ["Releases", "/releases"],
  ["Get Heard", "/get-heard"]
] as const;

const socialLinks = [
  ["Bandcamp", "https://fullyopenrecords.bandcamp.com"],
  ["Soundcloud", "https://soundcloud.com"],
  ["Instagram", "https://instagram.com"],
  ["YouTube", "https://youtube.com"]
] as const;

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-ink">
      <div className="mx-auto grid min-h-[220px] max-w-[1200px] gap-12 px-6 py-14 text-sm text-fog md:grid-cols-3">
        <div>
          <Image
            src={logoUrl}
            alt="Fully Open Records"
            width={190}
            height={52}
            className="h-auto w-[170px]"
          />
          <p className="mt-5 max-w-xs leading-7 text-fog">
            Independent label and radio platform for underground artists, strange records, and open-minded listeners.
          </p>
        </div>
        <div>
          <p className="font-meta text-xs uppercase tracking-[0.28em] text-white">Fully Open</p>
          <div className="mt-5 space-y-3">
            {navLinks.map(([label, href]) => (
              <Link key={href} href={href as Route} className="block">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-meta text-xs uppercase tracking-[0.28em] text-white">Social</p>
          <div className="mt-5 space-y-3">
            {socialLinks.map(([label, href]) => (
              <a key={href} href={href} className="block" target="_blank" rel="noreferrer">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

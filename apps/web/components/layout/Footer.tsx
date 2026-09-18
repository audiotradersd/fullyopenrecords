import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

const listenerLinks = [
  ["About", "/about"],
  ["Radio", "/radio"],
  ["Artists", "/artists"],
  ["Store", "/store"]
] as const;

const artistLinks = [
  ["Get Started", "/dashboard/getting-started"],
  ["Get Heard", "/get-heard"],
  ["Track Version Control", "/track-version-control"]
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[rgba(4,2,10,0.86)] pb-28 md:pb-24">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-[1fr_auto_auto] md:items-start">
          <div>
            <Image
              src="/new-logo-v2.png"
              alt="Fully Open Records"
              width={1200}
              height={400}
              className="h-16 w-auto object-contain"
            />
            <p className="mt-4 max-w-lg text-sm leading-7 text-fog">
              Independent label, online radio platform, and artist-first space for underground music.
            </p>
          </div>

          <nav className="text-sm text-fog"><p className="font-meta text-xs uppercase tracking-[0.2em] text-white">Listeners</p><div className="mt-4 grid gap-3">{listenerLinks.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-white">{label}</Link>)}</div></nav>
          <nav className="text-sm text-fog"><p className="font-meta text-xs uppercase tracking-[0.2em] text-white">Artists</p><div className="mt-4 grid gap-3">{artistLinks.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-white">{label}</Link>)}</div></nav>
        </div>
      </Container>
    </footer>
  );
}

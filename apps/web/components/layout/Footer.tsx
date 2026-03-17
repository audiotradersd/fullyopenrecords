import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

const footerLinks = [
  ["About", "/about"],
  ["Radio", "/radio"],
  ["Artists", "/artists"],
  ["Releases", "/releases"],
  ["Get Heard", "/get-heard"]
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[rgba(4,2,10,0.86)] pb-28 md:pb-24">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end">
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

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-fog md:justify-end">
            {footerLinks.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}

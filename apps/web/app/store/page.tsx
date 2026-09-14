import Link from "next/link";
import { Disc3, Sparkles } from "lucide-react";
import Container from "../../components/layout/Container";
import { Button } from "../../components/ui/button";
import { pageMetadata } from "../../lib/seo";

const storeImage = "/store/record-store-background.png";

export const metadata = pageMetadata({
  title: "Fully Open Records Store — Coming Soon",
  description: "The Fully Open Records store is coming soon, with records, limited releases and more from independent artists.",
  path: "/store"
});

export default function StorePage() {
  return (
    <section className="relative isolate flex min-h-[calc(100vh-80px)] items-center overflow-hidden bg-[#050912] py-20">
      <div className="absolute inset-0 bg-cover bg-center opacity-55" style={{ backgroundImage: `url(${storeImage})` }} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,7,15,0.97),rgba(4,7,15,0.82)_45%,rgba(4,7,15,0.48))]" />
      <div className="absolute inset-0 bg-[url('/bg/cosmic-blue-v2.png')] bg-cover bg-center opacity-30 mix-blend-screen" />
      <Container>
        <div className="relative z-10 max-w-2xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#5c91bd]/50 bg-[#113253]/80 text-[#8ecbff] shadow-[0_0_24px_rgba(60,151,233,0.22)]"><Disc3 className="h-6 w-6" /></div>
          <p className="mt-7 font-meta text-xs uppercase tracking-[0.3em] text-[#8ecbff]">Coming soon</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[0.98] text-white md:text-7xl">The Fully Open<br />Record Store.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#c6d5e6]">Records, limited releases and future finds from Fully Open&apos;s independent artist community are on their way.</p>
          <p className="mt-4 flex items-center gap-2 text-sm text-[#91abc4]"><Sparkles className="h-4 w-4 text-[#8ecbff]" />Stay close — the first releases are being prepared.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link href="/releases"><Button>Explore releases</Button></Link><Link href="/artists"><Button variant="outline">Discover artists</Button></Link></div>
        </div>
      </Container>
    </section>
  );
}

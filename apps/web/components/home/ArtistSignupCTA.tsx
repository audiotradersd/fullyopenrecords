import Link from "next/link";
import { NotebookPen, Radio, Settings2, UsersRound } from "lucide-react";
import Container from "../layout/Container";
import { Button } from "../ui/button";
import JoinArtistButton from "../auth/JoinArtistButton";

const versions = [["First Jam", "/track-versions/first-jam.jpg"], ["Rehearsal", "/track-versions/rehearsal.jpg"], ["Demo", "/track-versions/demo.jpg"], ["Pre-master", "/track-versions/pre-master.jpg"], ["Master", "/track-versions/master.jpg"]] as const;
const waveformImages = ["/track-versions/wave-first-jam.png", "/track-versions/wave-rehearsal.png", "/track-versions/wave-demo.png", "/track-versions/wave-pre-master.png", "/track-versions/wave-master.png"] as const;

const benefits = [
  { title: "Get Heard", copy: "Share your music on Fully Open Radio.", icon: Radio },
  { title: "Join a Community", copy: "Connect with independent artists worldwide.", icon: UsersRound },
  { title: "Track Every Version", copy: <>Keep every recording, note and idea together with <Link href="/track-version-control" className="text-[#6fb5f2]">Track Version Control.</Link></>, icon: NotebookPen },
  { title: "Show Your Gear", copy: "Keep a record of the instruments and tools behind your music.", icon: Settings2 }
];

function MiniWaveform({ index }: { index: number }) {
  // The individual waveform crops retain the character of the original recording artwork.
  return <img src={waveformImages[index]} alt="" aria-hidden="true" className="h-6 w-full object-fill mix-blend-screen" />;
}

function VersionJourney() {
  return (
    <div className="relative mx-auto w-full max-w-[460px] pb-10 pt-2 lg:py-2">
      <div className="mb-5 pl-14"><p className="font-meta text-[9px] uppercase tracking-[0.22em] text-[#79b9f2]">Track Version Control</p><p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-white">One track. Every version.</p></div>
      <img src="/track-versions/from-first-jam.png" alt="From first jam" className="pointer-events-none absolute -left-16 top-[38px] h-[98px] w-[86px] object-contain mix-blend-screen" />
      <div className="absolute left-[22px] top-[92px] bottom-[48px] w-px bg-[linear-gradient(#86c9ff,rgba(79,155,227,0.42),#86c9ff)] shadow-[0_0_14px_rgba(81,167,255,0.75)]" />
      <div className="space-y-2 pl-12">
        {versions.map(([title, image], index) => (
          <div key={title} className="relative flex min-h-[58px] items-center gap-3 rounded-xl border border-[#658bb3]/55 bg-[linear-gradient(90deg,rgba(7,18,34,0.94),rgba(8,16,29,0.76))] p-2 shadow-[0_12px_28px_rgba(0,0,0,0.3)] backdrop-blur">
            <span className="absolute -left-[28px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 rounded-full border-2 border-white bg-[#3f91de] shadow-[0_0_0_5px_rgba(63,145,222,0.18),0_0_16px_rgba(71,160,247,0.85)]" />
            <span className="absolute -left-3 top-1/2 h-px w-3 -translate-y-1/2 bg-[#86c9ff]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" className="h-[42px] w-[57px] rounded-md border border-white/10 object-cover grayscale" />
            <div className="min-w-0 flex-1"><p className="text-[13px] font-semibold text-white">{title}</p><MiniWaveform index={index} /></div>
          </div>
        ))}
      </div>
      <img src="/track-versions/to-release.png" alt="To release" className="pointer-events-none absolute -bottom-9 -right-12 h-[108px] w-[104px] object-contain mix-blend-screen" />
    </div>
  );
}

function Waveform() {
  return <svg aria-hidden="true" viewBox="0 0 1200 100" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full text-[#397db8]/30" preserveAspectRatio="none"><path d="M0 72 C90 53,150 94,250 72 S410 52,500 73 S670 96,760 72 S930 48,1020 73 S1120 88,1200 62" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M0 82 C100 61,170 105,280 81 S440 60,550 82 S720 107,840 82 S1010 60,1200 84" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60" /></svg>;
}

export default function ArtistSignupCTA() {
  return <section id="artist-cta" className="py-20 md:py-28"><Container><div className="relative overflow-hidden rounded-[2rem] border border-[#4d7faf]/55 bg-[radial-gradient(circle_at_56%_30%,rgba(76,63,149,0.22),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(38,108,172,0.2),transparent_32%),linear-gradient(135deg,rgba(7,12,29,0.96),rgba(5,13,26,0.92))] shadow-[0_28px_70px_rgba(0,0,0,0.38)]"><div className="pointer-events-none absolute inset-0 bg-[url('/bg/cosmic-blue-v2.png')] bg-cover bg-center opacity-25 mix-blend-screen" /><div className="pointer-events-none absolute inset-y-0 left-[37%] hidden w-[31%] bg-[url('/artist-cta-studio.png')] bg-cover bg-center opacity-70 mix-blend-screen lg:block" /><div className="pointer-events-none absolute inset-y-0 left-[29%] hidden w-[48%] bg-[linear-gradient(90deg,rgba(5,13,26,0.98),transparent_35%,rgba(5,13,26,0.9))] lg:block" /><div className="relative grid gap-8 px-6 pb-12 pt-14 md:px-12 md:pt-16 lg:grid-cols-[57%_43%] lg:items-center lg:px-16"><div className="relative z-10 text-center lg:text-left"><div className="flex items-center justify-center gap-4 lg:justify-start"><span className="h-px w-16 bg-[#6893bd]/30" /><p className="font-meta text-xs uppercase tracking-[0.24em] text-[#5fa9ed]">Become an Artist</p><span className="h-px w-16 bg-[#6893bd]/30" /></div><h2 className="mt-9 text-4xl font-semibold leading-tight text-white md:text-6xl">Get Your Music on<br className="hidden md:block" /> Fully Open Radio</h2><p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#b8c9dc] md:text-xl lg:mx-0">Create your artist page, share your music, document how it was made, and get played on Fully Open Radio.</p><p className="mt-5 text-sm text-fog md:text-base">14,327 independent artists. Experimental sounds. Global community.</p><div className="mt-9 flex flex-wrap justify-center gap-4 lg:justify-start"><JoinArtistButton className="h-auto rounded-full px-8 py-4">Create Artist Page</JoinArtistButton><Link href="/get-heard"><Button variant="outline" className="h-auto rounded-full border-[#7193b7]/50 px-8 py-4">Learn More</Button></Link></div></div><VersionJourney /></div><div className="relative grid border-t border-white/10 px-6 py-8 md:grid-cols-2 md:px-12 lg:grid-cols-4 lg:px-16">{benefits.map(({ title, copy, icon: Icon }) => <article key={title} className="flex gap-4 border-white/10 py-5 md:px-6 md:[&:nth-child(odd)]:border-r lg:border-r lg:py-0 lg:last:border-r-0"><Icon className="mt-0.5 h-7 w-7 shrink-0 text-[#69b5f5]" strokeWidth={1.5} /><div><h3 className="text-base font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-fog">{copy}</p></div></article>)}</div><Waveform /></div></Container></section>;
}

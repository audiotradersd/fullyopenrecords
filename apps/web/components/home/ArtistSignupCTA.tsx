import Link from "next/link";
import { CalendarDays, Disc3, Layers3, Radio, Upload } from "lucide-react";
import Container from "../layout/Container";
import { Button } from "../ui/button";
import JoinArtistButton from "../auth/JoinArtistButton";

const versions = [["First Jam", "/track-versions/first-jam.jpg"], ["Rehearsal", "/track-versions/rehearsal.jpg"], ["Demo", "/track-versions/demo.jpg"], ["Pre-master", "/track-versions/pre-master.jpg"], ["Master", "/track-versions/master.jpg"]] as const;
const waveformImages = ["/track-versions/wave-first-jam.png", "/track-versions/wave-rehearsal.png", "/track-versions/wave-demo.png", "/track-versions/wave-pre-master.png", "/track-versions/wave-master.png"] as const;

const benefits = [
  { title: "Upload Your Tracks", copy: "Upload single tracks or bulk upload your back catalogue.", icon: Upload },
  { title: "Track Every Version", copy: "Keep jams, rehearsals, demos, alternate mixes and final masters together with Track Version Control.", icon: Layers3 },
  { title: "Create Releases", copy: "Turn your tracks into singles, EPs and albums with artwork and tracklists.", icon: Disc3 },
  { title: "Add Your Gigs", copy: "Show listeners where you're playing and keep upcoming dates on your artist page.", icon: CalendarDays },
  { title: "Get Heard on Radio", copy: "Submit your music for consideration on Fully Open Radio.", icon: Radio }
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
  return <><div className="relative overflow-hidden border-t border-[#5a8bb8]/50 bg-[linear-gradient(100deg,rgba(5,20,37,0.98),rgba(4,18,35,0.94))] px-6 py-8 md:px-12 md:py-9 lg:px-16"><div className="pointer-events-none absolute inset-0 bg-[url('/bg/cosmic-blue-v2.png')] bg-cover bg-center opacity-20" /><img src="/radio/for-vinyl-approved.png" alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-44 -right-24 hidden h-[430px] w-[430px] rounded-full object-cover opacity-90 md:block" /><div className="relative"><div className="flex flex-wrap items-center gap-5 md:gap-10"><div><p className="bg-[linear-gradient(135deg,#d9efff,#7abaff)] bg-clip-text text-5xl font-bold leading-none text-transparent md:text-7xl">200</p><p className="mt-1 text-2xl font-semibold leading-none text-[#b9dbff] md:text-3xl">TRACKS</p></div><span className="hidden h-16 w-px bg-white/60 md:block" /><div><p className="bg-[linear-gradient(135deg,#e5dcff,#9a84ff)] bg-clip-text text-5xl font-bold leading-none text-transparent md:text-7xl">20</p><p className="mt-1 text-2xl font-semibold leading-none text-[#c2b6ff] md:text-3xl">ALBUMS</p></div><span className="hidden h-16 w-px bg-white/60 md:block" /><p className="bg-[linear-gradient(135deg,#b9fff0,#6ee6d8)] bg-clip-text text-5xl font-bold leading-none text-transparent md:text-7xl">FREE</p></div><p className="mt-3 text-lg font-semibold text-white">Bring your whole catalogue.</p><p className="mt-1 max-w-3xl text-sm text-[#c3d2e5] md:text-base">Releases, demos, alternate versions and your back catalogue — all included with a free artist account.</p><p className="mt-5 font-meta text-sm italic uppercase tracking-[0.12em] text-[#73c5ff]">No 180-minute ceiling. More room for your music.</p></div></div><svg aria-hidden="true" viewBox="0 0 1200 100" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full text-[#397db8]/30" preserveAspectRatio="none"><path d="M0 72 C90 53,150 94,250 72 S410 52,500 73 S670 96,760 72 S930 48,1020 73 S1120 88,1200 62" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M0 82 C100 61,170 105,280 81 S440 60,550 82 S720 107,840 82 S1010 60,1200 84" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-60" /></svg></>;
}

export default function ArtistSignupCTA() {
  return <section id="artist-cta" className="py-20 md:py-28"><Container><div className="relative overflow-hidden rounded-[2rem] border border-[#4d7faf]/55 bg-[radial-gradient(circle_at_56%_30%,rgba(76,63,149,0.22),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(38,108,172,0.2),transparent_32%),linear-gradient(135deg,rgba(7,12,29,0.96),rgba(5,13,26,0.92))] shadow-[0_28px_70px_rgba(0,0,0,0.38)]"><div className="pointer-events-none absolute inset-0 bg-[url('/bg/cosmic-blue-v2.png')] bg-cover bg-center opacity-25 mix-blend-screen" /><div className="pointer-events-none absolute inset-y-0 left-[37%] hidden w-[31%] bg-[url('/artist-cta-studio.png')] bg-cover bg-center opacity-70 mix-blend-screen lg:block" /><div className="pointer-events-none absolute inset-y-0 left-[29%] hidden w-[48%] bg-[linear-gradient(90deg,rgba(5,13,26,0.98),transparent_35%,rgba(5,13,26,0.9))] lg:block" /><div className="relative grid gap-8 px-6 pb-12 pt-14 md:px-12 md:pt-16 lg:grid-cols-[57%_43%] lg:items-center lg:px-16"><div className="relative z-10 text-center lg:text-left"><div className="flex items-center justify-center gap-4 lg:justify-start"><span className="h-px w-16 bg-[#6893bd]/30" /><p className="font-meta text-xs uppercase tracking-[0.24em] text-[#5fa9ed]">Become an Artist</p><span className="h-px w-16 bg-[#6893bd]/30" /></div><h2 className="mt-9 text-4xl font-semibold leading-tight text-white md:text-6xl">More than just<br className="hidden md:block" /> a place to upload.</h2><p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#b8c9dc] md:text-xl lg:mx-0">Upload your music, follow every track from first ideas to final masters, create releases, promote your gigs and get heard on Fully Open Radio.</p><div className="mt-9 flex flex-wrap justify-center gap-4 lg:justify-start"><JoinArtistButton className="h-auto rounded-full px-8 py-4">Create Artist Page</JoinArtistButton><Link href="/dashboard/getting-started"><Button variant="outline" className="h-auto rounded-full border-[#7193b7]/50 px-8 py-4">Learn More</Button></Link></div></div><VersionJourney /></div><div className="relative grid border-t border-white/10 px-6 py-8 md:grid-cols-2 md:px-12 lg:grid-cols-5 lg:px-16">{benefits.map(({ title, copy, icon: Icon }, index) => <article key={title} className="flex gap-4 border-white/10 py-5 md:px-6 md:[&:nth-child(odd)]:border-r lg:border-r lg:px-4 lg:py-0 lg:[&:nth-child(odd)]:border-r lg:last:border-r-0"><span className="font-meta text-sm text-[#5fa9ed]">0{index + 1}</span><div><Icon className="h-6 w-6 text-[#69b5f5]" strokeWidth={1.5} /><h3 className="mt-3 text-base font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-fog">{copy}</p></div></article>)}</div><Waveform /></div></Container></section>;
}

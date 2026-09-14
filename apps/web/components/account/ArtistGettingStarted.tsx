"use client";

import Link from "next/link";
import { Album, BookOpen, CalendarDays, Check, ChevronRight, Cloud, Disc3, FileAudio, Layers3, Music2, Upload, Video } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { artistHelpLinks, artistOnboardingFeatures } from "../../lib/artistOnboarding";
import Container from "../layout/Container";
import { Button } from "../ui/button";

const featureIcons = { upload: Music2, "bulk-upload": Upload, releases: Disc3, video: Video, versions: Layers3, gigs: CalendarDays };

export default function ArtistGettingStarted() {
  const { user, loading } = useAuth();
  const isArtist = user?.accountType === "artist";
  const actionHref = isArtist ? "/artist/dashboard" : "/signup";
  const actionLabel = isArtist ? "Go to my artist page" : "Create your artist page";

  return <main className="overflow-hidden pb-24">
    <section className="relative isolate min-h-[530px] overflow-hidden border-b border-white/10 bg-[#050a16] md:min-h-[590px]">
      <div className="absolute inset-0 bg-[url('/bg/cosmic-blue-v2.png')] bg-cover bg-center opacity-60" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,8,18,0.98)_0%,rgba(4,8,18,0.88)_42%,rgba(4,8,18,0.25)_74%,rgba(4,8,18,0.62)_100%)]" />
      <div className="absolute inset-y-0 right-0 hidden w-[48%] bg-[url('/artist-cta-studio.png')] bg-cover bg-center opacity-90 mix-blend-screen md:block" />
      <div className="absolute inset-y-0 right-0 hidden w-[55%] bg-[linear-gradient(90deg,rgba(4,8,18,0.92),transparent_58%)] md:block" />
      <Container className="relative z-10"><div className="flex min-h-[530px] max-w-2xl flex-col justify-center py-16 md:min-h-[590px]"><p className="font-meta text-xs uppercase tracking-[0.3em] text-[#9fc7f0]">Welcome to Fully Open</p><h1 className="mt-5 text-5xl font-semibold leading-[0.98] text-white sm:text-6xl md:text-7xl">Everything you need<br />to get started.</h1><p className="mt-6 max-w-xl text-base leading-7 text-[#d3dfef] md:text-lg">Thanks for your interest in Fully Open Records — a home for real music, independent artists and open minds. Discover what you can do, from uploading music and creating releases to sharing gigs, tracking your music&apos;s journey and getting heard on Fully Open Radio.</p><div className="mt-8 flex flex-wrap gap-3"><Link href={actionHref}><Button>{loading ? "Get started" : actionLabel}</Button></Link><Link href="/artists"><Button variant="outline">Explore the site</Button></Link></div></div></Container>
    </section>

    <section className="relative bg-[#040b15] py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[url('/bg/cosmic-blue-v2.png')] bg-cover bg-center opacity-[0.16]" />
      <Container className="relative"><div className="max-w-3xl"><p className="font-meta text-xs uppercase tracking-[0.28em] text-[#9fc7f0]">Get started</p><h2 className="mt-3 text-4xl font-semibold leading-tight text-white md:text-5xl">Add your music, your story, your world.</h2><p className="mt-3 text-base leading-7 text-[#c4d1e2] md:text-lg">You don&apos;t have to do everything at once. Here are some quick ways to build your artist page.</p></div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{artistOnboardingFeatures.map((feature) => { const Icon = featureIcons[feature.id]; return <article key={feature.id} id={feature.id} className="scroll-mt-28 rounded-xl border border-[#38526c]/60 bg-[linear-gradient(145deg,rgba(20,37,57,0.72),rgba(7,15,27,0.82))] p-6 shadow-[0_16px_35px_rgba(0,0,0,0.2)]"><div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#5183af]/45 bg-[#143457] text-[#9cd5ff] shadow-[0_0_22px_rgba(58,149,224,0.18)]"><Icon className="h-6 w-6" /></div><h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3><p className="mt-2 min-h-[56px] text-sm leading-6 text-[#c4d1e2]">{feature.description}</p><div className="mt-5 flex flex-wrap gap-3"><Link href={isArtist ? feature.dashboardHref : "/signup"}><Button size="sm" className="normal-case tracking-normal">{isArtist ? feature.actionLabel : "Create an artist page"}</Button></Link><a href={`#help-${feature.id}`}><Button size="sm" variant="outline" className="normal-case tracking-normal">Find out how</Button></a></div></article>; })}</div>
      </Container>
    </section>

    <section className="bg-[#040b15] pb-16"><Container><div className="relative overflow-hidden rounded-2xl border border-[#38526c]/70 bg-[linear-gradient(105deg,rgba(13,27,48,0.92),rgba(7,15,28,0.86))] p-8 md:p-10"><div className="absolute inset-0 bg-[url('/bg/cosmic-blue-v2.png')] bg-cover bg-center opacity-20" /><div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center"><div className="max-w-2xl"><p className="font-meta text-xs uppercase tracking-[0.28em] text-[#9fc7f0]">Coming soon</p><h2 className="mt-3 text-4xl font-semibold text-white">Import from SoundCloud</h2><p className="mt-4 leading-7 text-[#c4d1e2]">Already have a SoundCloud? Soon you&apos;ll be able to import your artist profile, tracks and information instead of entering everything again.</p></div><div className="flex shrink-0 flex-col items-start gap-4 md:items-end"><div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]"><Cloud className="h-8 w-8 text-white" /></div><Button disabled variant="outline">Coming soon</Button></div></div></div></Container></section>

    <section className="bg-[#040b15] pb-8"><Container><div className="rounded-2xl border border-[#38526c]/50 bg-[linear-gradient(145deg,rgba(11,26,44,0.88),rgba(5,13,24,0.92))] p-7 md:grid md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:p-10"><div><p className="font-meta text-xs uppercase tracking-[0.28em] text-[#9fc7f0]">Need help?</p><h2 className="mt-3 text-4xl font-semibold text-white">Visit the Help Centre</h2><p className="mt-3 max-w-lg leading-7 text-[#c4d1e2]">Short, practical steps for the things you&apos;ll do most often in your artist dashboard.</p><a href="#help-upload" className="mt-6 inline-block"><Button><BookOpen className="mr-2 h-4 w-4" />Go to Help Centre</Button></a></div><nav className="mt-8 grid gap-1 border-t border-white/10 pt-6 text-sm md:mt-0 md:border-l md:border-t-0 md:pl-10 md:pt-0">{artistHelpLinks.map(([label, href]) => <a key={label} href={href} className="flex items-center justify-between rounded-lg px-3 py-2 text-[#d3dfef] transition hover:bg-white/[0.06] hover:text-white">{label}<ChevronRight className="h-4 w-4" /></a>)}</nav></div></Container></section>

    <section className="bg-[#040b15] py-14"><Container className="max-w-4xl"><div className="text-center"><FileAudio className="mx-auto h-6 w-6 text-[#9fc7f0]" /><p className="mt-4 font-meta text-xs uppercase tracking-[0.28em] text-[#9fc7f0]">How to</p><h2 className="mt-3 text-4xl font-semibold text-white">Quick answers for your next step.</h2></div><div className="mt-10 space-y-3">{artistOnboardingFeatures.map((feature) => <details key={feature.id} id={`help-${feature.id}`} className="scroll-mt-28 rounded-xl border border-white/10 bg-white/[0.03] p-5"><summary className="cursor-pointer text-lg font-medium text-white">{feature.title}</summary><ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-[#c4d1e2]">{feature.steps.map((step) => <li key={step}>{step}</li>)}</ol><Link href={isArtist ? feature.dashboardHref : "/signup"} className="mt-5 inline-block text-sm font-medium text-[#83c5ff] hover:text-white">{isArtist ? `Open ${feature.title}` : "Create an artist page"} <ChevronRight className="inline h-4 w-4" /></Link></details>)}</div><p className="mt-12 text-center font-meta text-xs uppercase tracking-[0.28em] text-[#69819d]">We&apos;re excited to have you here<br />Real music. Open minds.</p></Container></section>
  </main>;
}

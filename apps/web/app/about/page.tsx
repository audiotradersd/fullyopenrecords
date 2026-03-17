import AboutHero from "../../components/about/AboutHero";
import CommunityCTA from "../../components/about/CommunityCTA";
import FoundersSection from "../../components/about/FoundersSection";
import PhilosophyQuote from "../../components/about/PhilosophyQuote";
import PillarsGrid from "../../components/about/PillarsGrid";
import StoryTimeline from "../../components/about/StoryTimeline";


export default function AboutPage() {
  return (
    <main className="relative overflow-hidden pb-24">
      <div className="pointer-events-none absolute inset-x-0 top-[20%] h-[320px] bg-[radial-gradient(circle_at_50%_50%,rgba(209,74,139,0.12),transparent_70%)]" />
      <AboutHero />
      <PillarsGrid />
      <StoryTimeline />
      <PhilosophyQuote />
      <FoundersSection />
      <CommunityCTA />
    </main>
  );
}

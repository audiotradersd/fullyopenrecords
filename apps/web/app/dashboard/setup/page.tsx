import Link from "next/link";
import type { Route } from "next";
import Container from "../../../components/layout/Container";
import { Button } from "../../../components/ui/button";

export const runtime = "edge";

export default function DashboardSetupPage() {
  return (
    <Container>
      <section className="py-20">
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
          <p className="font-meta text-xs uppercase tracking-[0.28em] text-pink">Artist Onboarding</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Set up your artist page</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-fog">
            Complete your profile, upload your first track, and get your page ready for the Fully Open community.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={"/artist/dashboard" as Route}>
              <Button>Go to Dashboard</Button>
            </Link>
            <Link href={"/artists" as Route}>
              <Button variant="outline">Browse Artists</Button>
            </Link>
          </div>
        </div>
      </section>
    </Container>
  );
}

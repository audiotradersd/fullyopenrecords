"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type AccountType = "listener" | "artist";

function slugifyBandName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function buildListenerUsername(email: string) {
  const local = email.split("@")[0]?.toLowerCase() ?? "listener";
  const base =
    local.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32) || "listener";
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}

function getErrorMessage(payload: unknown): string {
  if (payload && typeof payload === "object") {
    const record = payload as { error?: unknown; issues?: Array<{ message?: unknown }> };
    if (typeof record.error === "string") {
      return record.error;
    }
    if (Array.isArray(record.issues)) {
      const issue = record.issues.find((entry) => typeof entry.message === "string");
      if (typeof issue?.message === "string") {
        return issue.message;
      }
    }
  }

  return "Could not create account.";
}

export default function SignupForm({ selected }: { selected: AccountType }) {
  const router = useRouter();
  const [bandName, setBandName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatedUrl = useMemo(() => {
    const slug = slugifyBandName(bandName);
    return slug ? `/artist/${slug}` : "/artist/your-band-name";
  }, [bandName]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const payload = {
      email,
      password,
      username: selected === "artist" ? bandName.trim() : buildListenerUsername(email),
      accountType: selected
    };

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(getErrorMessage(result));
      return;
    }

    router.push(selected === "artist" ? "/dashboard/setup" : "/");
    router.refresh();
  }

  return (
    <section className="py-8 pb-20">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
          <p className="font-meta text-xs uppercase tracking-[0.28em] text-pink">
            {selected === "artist" ? "Create Artist Account" : "Create Listener Account"}
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {selected === "artist" ? (
              <label className="block">
                <span className="mb-2 block text-sm text-fog">Band Name</span>
                <input
                  value={bandName}
                  onChange={(event) => setBandName(event.target.value)}
                  name="bandName"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-fog/70"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="mb-2 block text-sm text-fog">Email Address</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-fog/70"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-fog">Password</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                name="password"
                type="password"
                minLength={8}
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-fog/70"
              />
            </label>

            {selected === "artist" ? (
              <p className="text-sm text-fog">
                Your artist page will be created at <span className="text-white">{generatedUrl}</span>
              </p>
            ) : null}

            {error ? <p className="text-sm text-pink">{error}</p> : null}

            <Button type="submit" className="mt-4 w-full" disabled={pending}>
              {pending
                ? "Creating account..."
                : selected === "artist"
                  ? "Create Artist Page"
                  : "Join as Listener"}
            </Button>
          </form>
        </div>

        <div className="rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(58,27,92,0.34),rgba(18,8,28,0.72))] p-8 backdrop-blur-md">
          <p className="font-meta text-xs uppercase tracking-[0.24em] text-fog">
            {selected === "artist" ? "Artist onboarding" : "Listener onboarding"}
          </p>
          <h3 className="mt-4 text-3xl font-semibold text-white">
            {selected === "artist" ? "Start building your artist space" : "Start discovering underground music"}
          </h3>
          <p className="mt-4 text-base leading-7 text-fog">
            {selected === "artist"
              ? "After signup you’ll go straight into onboarding so you can complete your profile and upload your first track."
              : "After signup you’ll head straight into the site, ready to listen, save tracks, and follow artists."}
          </p>
        </div>
      </div>
    </section>
  );
}

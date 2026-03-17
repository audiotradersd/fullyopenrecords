"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import SignupHero from "./SignupHero";
import AccountTypeSelector from "./AccountTypeSelector";
import BenefitsPanel from "./BenefitsPanel";

type AccountType = "listener" | "artist";

function getErrorMessage(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const record = value as { error?: unknown; issues?: Array<{ message?: unknown }> };
    if (typeof record.error === "string") return record.error;
    if (Array.isArray(record.issues) && record.issues.length > 0) {
      const msg = record.issues.find((i) => typeof i?.message === "string")?.message;
      if (typeof msg === "string") return msg;
    }
  }
  return "Registration failed";
}

export default function SignupPageContent({
  initialType
}: {
  initialType: AccountType;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<AccountType>(initialType);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  function handleSelect(type: AccountType) {
    setSelected(type);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);

    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      username: String(formData.get("username") ?? ""),
      accountType: selected
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        setError(getErrorMessage(result));
        setPending(false);
        return;
      }

      router.push(selected === "artist" ? "/artist/dashboard" : "/");
    } catch {
      setError("Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <>
      <SignupHero />
      <div className="mx-auto max-w-6xl px-6">
        <AccountTypeSelector selected={selected} onSelect={handleSelect} />
        <BenefitsPanel selected={selected} onJoin={handleSelect} />

        {showForm && (
          <div ref={formRef} className="mx-auto max-w-md py-12">
            <div className="rounded-2xl border border-white/10 bg-[rgba(14,6,24,0.96)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
              <p className="text-xs uppercase tracking-[0.24em] text-fog">Create Account</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Join as {selected === "artist" ? "Artist" : "Listener"}
              </h2>

              <form
                className="mt-6 space-y-4"
                action={async (formData) => {
                  await handleSubmit(formData);
                }}
              >
                <label className="block">
                  <span className="mb-2 block text-sm text-fog">Username</span>
                  <input
                    name="username"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-fog/70"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-fog">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-fog/70"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-fog">Password</span>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-fog/70"
                  />
                </label>

                {error && <p className="text-sm text-pink">{error}</p>}

                <Button type="submit" className="w-full" disabled={pending}>
                  {pending ? "Creating account…" : `Join as ${selected === "artist" ? "Artist" : "Listener"}`}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

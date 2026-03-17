"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Panel } from "@fully-open-records/ui";
import { setToken } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8787"}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setError("Login failed");
      return;
    }

    const data = await response.json();
    setToken(data.token);
    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Panel className="w-full max-w-md">
        <h1 className="font-display text-4xl">Admin login</h1>
        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
          <input name="password" type="password" placeholder="Password" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3" />
          <Button type="submit">Sign in</Button>
          {error ? <p className="text-sm text-ember">{error}</p> : null}
        </form>
      </Panel>
    </div>
  );
}


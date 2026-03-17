"use client";

import { FormEvent, useState } from "react";
import { Button, Panel } from "@fully-open-records/ui";

type FormProps = {
  endpoint: string;
  fields: Array<{ name: string; label: string; type?: string; required?: boolean }>;
};

export function ApiForm({ endpoint, fields }: FormProps) {
  const [status, setStatus] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: Record<string, unknown> = Object.fromEntries(formData.entries());

    if ("rightsConfirmed" in values) {
      values.rightsConfirmed = values.rightsConfirmed === "on";
      values.socials = {};
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8787"}${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      }
    );

    setStatus(response.ok ? "Sent." : "Request failed.");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <Panel>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field.name} className="grid gap-2 text-sm">
            <span>{field.label}</span>
            <input
              name={field.name}
              type={field.type ?? "text"}
              required={field.required}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sand"
            />
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="rightsConfirmed" />
          <span>I confirm I control the rights for this music.</span>
        </label>
        <Button type="submit">Submit</Button>
        {status ? <p className="text-sm text-fog">{status}</p> : null}
      </form>
    </Panel>
  );
}

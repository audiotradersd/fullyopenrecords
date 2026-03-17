"use client";

import { FormEvent, useState } from "react";
import { Button, Panel } from "@fully-open-records/ui";
import { Shell } from "../../components/Shell";
import { getToken } from "../../lib/auth";

export default function MediaPage() {
  const [status, setStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8787"}/admin/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      body: formData
    });

    setStatus(response.ok ? "Uploaded" : "Upload failed");
  }

  return (
    <Shell>
      <div className="space-y-6">
        <h1 className="font-display text-4xl">Media</h1>
        <Panel className="max-w-xl">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <input type="file" name="file" className="text-sm text-fog" />
            <Button type="submit">Upload to R2</Button>
            {status ? <p className="text-sm text-fog">{status}</p> : null}
          </form>
        </Panel>
      </div>
    </Shell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Panel } from "@fully-open-records/ui";
import { Shell } from "../../components/Shell";
import { cmsFetch } from "../../lib/api";

export default function SubmissionsPage() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    cmsFetch<Array<Record<string, unknown>>>("/admin/submissions").then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <Shell>
      <div className="space-y-6">
        <h1 className="font-display text-4xl">Submissions</h1>
        <Panel>
          <div className="space-y-4">
            {items.map((item) => (
              <pre key={String(item.id)} className="overflow-auto rounded-2xl border border-white/10 p-4 text-xs text-fog">
                {JSON.stringify(item, null, 2)}
              </pre>
            ))}
          </div>
        </Panel>
      </div>
    </Shell>
  );
}


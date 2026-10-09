"use client";

import { useEffect, useMemo, useState } from "react";

type Artist = { id: number; name: string; slug: string; email: string; createdAt: string };
type Check = { emailId: string; eligible: boolean; reason: string; priority: number; theme: string };
type Preview = { artist: Artist; state: Record<string, unknown>; selected: { emailId: string; subject: string; triggerReason: string } | null; checks: Check[]; lastContact: string | null; lastEmailId: string | null; sendingEnabled: boolean };
type History = { summary: { lastContact: string | null; lastEmailId: string | null; nextCurrentlyEligible: string | null; unsubscribed: boolean; suppressed: boolean }; history: Array<{ id: number; emailId: string; subject: string; triggerReason: string; sentAt: string | null; sendStatus: string; deliveryStatus: string | null }> };
const date = (value: string | null) => value ? new Date(value).toLocaleString() : "Never";

export default function ArtistEngagementPanel() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [query, setQuery] = useState("");
  const [artistId, setArtistId] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [history, setHistory] = useState<History | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [testId, setTestId] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function loadArtists() {
    const response = await fetch(`/api/admin/artist-engagement/artists?q=${encodeURIComponent(query)}`);
    if (response.ok) setArtists(await response.json());
  }
  useEffect(() => { void loadArtists(); }, []);
  const selectedArtist = useMemo(() => artists.find((artist) => String(artist.id) === artistId), [artists, artistId]);
  async function inspect(id = artistId) {
    if (!id) return;
    setBusy(true); setNotice("");
    try {
      const [dryResponse, historyResponse] = await Promise.all([
        fetch("/api/admin/artist-engagement/dry-run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ artistId: Number(id) }) }),
        fetch(`/api/admin/artist-engagement/history?artistId=${encodeURIComponent(id)}`)
      ]);
      const dryData = await dryResponse.json(); const historyData = await historyResponse.json();
      if (!dryResponse.ok) throw new Error(dryData.error ?? "Unable to evaluate artist.");
      if (!historyResponse.ok) throw new Error(historyData.error ?? "Unable to load contact history.");
      setPreview(dryData); setHistory(historyData); setTestId(dryData.selected?.emailId ?? "");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Request failed."); }
    finally { setBusy(false); }
  }
  async function sendTest(event: React.FormEvent) {
    event.preventDefault();
    if (!artistId || !testId || !testEmail) return;
    if (!confirm(`Send ${testId} to the explicitly supplied test address ${testEmail}?`)) return;
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/artist-engagement/test-send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ artistId: Number(artistId), emailId: testId, testEmail }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Test send failed.");
      setNotice(`Test email sent to ${testEmail}.`); await inspect();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Test send failed."); }
    finally { setBusy(false); }
  }

  return <section className="mt-10 pb-16 text-white">
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-semibold">Artist engagement</h2><p className="mt-1 text-sm text-fog">Live-state evaluation and a concise audit trail. Scheduled sending is {preview?.sendingEnabled ? "enabled" : "disabled"}.</p></div><div className="flex gap-2"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find artist" className="rounded-lg border border-white/10 bg-black/20 px-3 py-2" /><button onClick={() => void loadArtists()} className="rounded-lg border border-white/15 px-3 py-2 text-sm">Search</button></div></div>
      <div className="mt-5 flex flex-wrap gap-2"><select value={artistId} onChange={(event) => { setArtistId(event.target.value); setPreview(null); setHistory(null); }} className="min-w-64 rounded-lg border border-white/10 bg-black/30 px-3 py-2"><option value="">Select an artist</option>{artists.map((artist) => <option key={artist.id} value={artist.id}>{artist.name} — {artist.email}</option>)}</select><button disabled={!artistId || busy} onClick={() => void inspect()} className="rounded-lg bg-pink px-4 py-2 text-sm font-medium text-black disabled:opacity-50">{busy ? "Working…" : "Evaluate current state"}</button></div>
      {notice && <p className="mt-4 rounded-lg border border-white/10 p-3 text-sm">{notice}</p>}
      {preview && <>
        <div className="mt-6 grid gap-3 sm:grid-cols-3"><Summary label="Last contacted" value={history?.summary.lastContact ? `${date(history.summary.lastContact)}` : "Never"} /><Summary label="Last email" value={history?.summary.lastEmailId?.toUpperCase() ?? "—"} /><Summary label="Next currently eligible" value={history?.summary.nextCurrentlyEligible?.toUpperCase() ?? "None"} /></div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2"><section className="rounded-xl border border-white/10 p-4"><h3 className="font-semibold">Current state</h3><pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap text-xs text-fog">{JSON.stringify(preview.state, null, 2)}</pre></section><section className="rounded-xl border border-white/10 p-4"><h3 className="font-semibold">Decision</h3>{preview.selected ? <p className="mt-2 text-sm"><span className="text-lime">Selected: {preview.selected.emailId.toUpperCase()}</span><br />{preview.selected.subject}<br /><span className="text-fog">{preview.selected.triggerReason}</span></p> : <p className="mt-2 text-sm text-fog">No email is currently eligible.</p>}<h4 className="mt-4 text-sm font-medium">Other candidates and suppression reasons</h4><div className="mt-2 max-h-64 space-y-2 overflow-auto">{preview.checks.map((check) => <div key={check.emailId} className="border-t border-white/10 pt-2 text-xs"><span className={check.eligible ? "text-lime" : "text-fog"}>{check.eligible ? "Eligible" : "Suppressed"} · {check.emailId.toUpperCase()}</span><p className="mt-1 text-fog">{check.reason}</p></div>)}</div></section></div>
        <form onSubmit={sendTest} className="mt-5 flex flex-wrap items-end gap-3 rounded-xl border border-white/10 p-4"><label className="text-xs text-fog">Template<select value={testId} onChange={(event) => setTestId(event.target.value)} className="mt-1 block rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white">{preview.checks.map((item) => <option key={item.emailId} value={item.emailId}>{item.emailId}</option>)}</select></label><label className="text-xs text-fog">Explicit test recipient<input required type="email" value={testEmail} onChange={(event) => setTestEmail(event.target.value)} placeholder="you@example.com" className="mt-1 block rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" /></label><button disabled={busy || !selectedArtist} className="rounded-lg border border-pink/50 px-4 py-2 text-sm text-pink disabled:opacity-50">Send test only</button><p className="basis-full text-xs text-fog">Test emails go only to the address entered above. This does not enable scheduled artist sends.</p></form>
        <div className="mt-6 overflow-x-auto rounded-xl border border-white/10"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-white/[0.04] text-fog"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Email ID</th><th className="px-4 py-3">Template / subject</th><th className="px-4 py-3">Trigger / reason</th><th className="px-4 py-3">Delivery status</th></tr></thead><tbody>{history?.history.map((item) => <tr key={item.id} className="border-t border-white/10"><td className="px-4 py-3">{date(item.sentAt)}</td><td className="px-4 py-3">{item.emailId.toUpperCase()}</td><td className="px-4 py-3">{item.subject}</td><td className="px-4 py-3">{item.triggerReason}</td><td className="px-4 py-3">{item.deliveryStatus ?? item.sendStatus}</td></tr>)}</tbody></table></div>
      </>}
    </div>
  </section>;
}

function Summary({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-white/10 p-4"><p className="text-xs text-fog">{label}</p><p className="mt-1 break-words text-sm">{value}</p></div>; }

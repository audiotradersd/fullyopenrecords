"use client";

import { useEffect, useState } from "react";
import ArtistEngagementPanel from "./ArtistEngagementPanel";

type Tab = "Schedules" | "Campaigns" | "Audience" | "History" | "Decisions";
type Slot = {
  id: string;
  campaignId: string;
  day: number;
  time: string;
  enabled: boolean;
  priorityOverride: number | null;
};
type Schedule = {
  id: number;
  name: string;
  status: string;
  scheduleGroup?: string;
  currentRevision: number;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  activatedAt: string | null;
  slots: Slot[];
};
type Campaign = {
  campaignId: string;
  subject: string;
  alias: string;
  theme: string;
  priority: number;
  minRepeatDays: number;
  eligibilityDescription: string;
  enabled: boolean;
  isEvent: boolean;
  lastSent: string | null;
  totalSends: number;
  occurrences: Array<{ scheduleName: string; day: number; time: string }>;
};
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const date = (value: unknown) =>
  typeof value === "string" && value ? new Date(value).toLocaleString() : "—";
const err = (value: unknown) =>
  value &&
  typeof value === "object" &&
  "error" in value &&
  typeof value.error === "string"
    ? value.error
    : "Request failed.";

export default function ArtistEmailAdmin() {
  const [tab, setTab] = useState<Tab>("Schedules");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selected, setSelected] = useState<Schedule | null>(null);
  const [revisions, setRevisions] = useState<Array<Record<string, unknown>>>(
    [],
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [name, setName] = useState("");
  const [history, setHistory] = useState<Record<string, unknown>[]>([]);
  const [decisions, setDecisions] = useState<Record<string, unknown>[]>([]);
  const [audience, setAudience] = useState<Record<string, any> | null>(null);
  const [scheduleCoverage, setScheduleCoverage] = useState<Record<
    string,
    any
  > | null>(null);
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [artistId, setArtistId] = useState("");
  const [dryDate, setDryDate] = useState(
    new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" }),
  );
  const [dryRun, setDryRun] = useState<Record<string, unknown> | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadSchedules() {
    const [scheduleResponse, campaignResponse] = await Promise.all([
      fetch("/api/admin/email/schedules"),
      fetch("/api/admin/email/campaigns"),
    ]);
    if (scheduleResponse.ok) setSchedules(await scheduleResponse.json());
    if (campaignResponse.ok) setCampaigns(await campaignResponse.json());
  }
  async function loadHistory() {
    const response = await fetch("/api/admin/email/history?limit=500");
    if (response.ok) setHistory(await response.json());
  }
  async function loadDecisions() {
    const response = await fetch(
      `/api/admin/email/decisions${dateFilter ? `?date=${encodeURIComponent(dateFilter)}` : ""}`,
    );
    if (response.ok) setDecisions(await response.json());
  }
  async function loadAudience() {
    setBusy(true);
    setNotice("");
    try {
      setAudience(await request("audience"));
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Audience audit failed.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function checkScheduleCoverage(scheduleId: number) {
    setBusy(true);
    setNotice("");
    try {
      setScheduleCoverage(await request(`schedules/${scheduleId}/coverage`));
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Schedule coverage check failed.",
      );
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    void loadSchedules();
    void loadHistory();
    void loadDecisions();
  }, []);

  async function request(path: string, method = "GET", body?: unknown) {
    const response = await fetch(`/api/admin/email/${path}`, {
      method,
      ...(body === undefined
        ? {}
        : {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(err(data));
    return data;
  }
  async function openSchedule(scheduleId: number) {
    setBusy(true);
    setNotice("");
    try {
      const [data, revisionData] = await Promise.all([
        request(`schedules/${scheduleId}`),
        request(`schedules/${scheduleId}/revisions`),
      ]);
      const schedule = data as Schedule;
      setSelected(schedule);
      setSlots(schedule.slots);
      setName(schedule.name);
      setRevisions(revisionData as Array<Record<string, unknown>>);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not open schedule.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function saveSchedule() {
    if (!selected) return;
    setBusy(true);
    setNotice("");
    try {
      const data = await request(`schedules/${selected.id}`, "PUT", {
        name,
        timezone: selected.timezone,
        slots,
      });
      setNotice(
        data.effectiveAt
          ? `Saved revision. It takes effect ${date(data.effectiveAt)}; today’s pinned decisions remain unchanged.`
          : "Saved new schedule revision.",
      );
      await loadSchedules();
      await openSchedule(selected.id);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not save schedule.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function createSchedule() {
    const newName = prompt("Name for the new schedule", "New Schedule");
    if (!newName) return;
    try {
      const data = await request("schedules", "POST", {
        name: newName,
        timezone: "Europe/London",
        slots: [],
      });
      await loadSchedules();
      if (data.schedule?.id) await openSchedule(data.schedule.id);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not create schedule.",
      );
    }
  }
  async function duplicate(schedule: Schedule) {
    const newName = prompt("Name for the copy", `${schedule.name} — Copy`);
    if (!newName) return;
    try {
      const data = await request(`schedules/${schedule.id}/duplicate`, "POST", {
        name: newName,
      });
      await loadSchedules();
      if (data.schedule?.id) await openSchedule(data.schedule.id);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not duplicate schedule.",
      );
    }
  }
  async function activate(schedule: Schedule) {
    let coverage: any = null;
    try {
      coverage = await request(`schedules/${schedule.id}/coverage`);
      setScheduleCoverage(coverage);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not verify schedule coverage.",
      );
      return;
    }
    const warning =
      coverage && Number(coverage.uncoveredBySchedule) > 0
        ? `\n\nCoverage warning: ${coverage.uncoveredBySchedule} contactable artist(s) have no currently applicable campaign in this schedule; ${coverage.scheduleCheckinOnly} rely only on CHECKIN. Review the warnings in Schedules before proceeding.`
        : "";
    if (
      !confirm(
        `Set “${schedule.name}” as the active schedule? The change takes effect at the next Europe/London midnight; already-pinned daily decisions will not change.${warning}`,
      )
    )
      return;
    try {
      const data = await request(
        `schedules/${schedule.id}/activate`,
        "POST",
        {},
      );
      setNotice(
        `Schedule activation saved. Effective ${date(data.effectiveAt)}.`,
      );
      await loadSchedules();
      if (selected?.id === schedule.id) await openSchedule(schedule.id);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not activate schedule.",
      );
    }
  }
  async function archive(schedule: Schedule) {
    if (
      !confirm(
        `Archive “${schedule.name}”? Its revision history will be retained.`,
      )
    )
      return;
    try {
      await request(`schedules/${schedule.id}/archive`, "POST", {});
      if (selected?.id === schedule.id) setSelected(null);
      await loadSchedules();
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not archive schedule.",
      );
    }
  }
  function addSlot(day: number) {
    setSlots((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        campaignId: campaigns[0]?.campaignId ?? "music-01",
        day,
        time: "10:30",
        enabled: true,
        priorityOverride: null,
      },
    ]);
  }
  function editSlot(id: string, changes: Partial<Slot>) {
    setSlots((current) =>
      current.map((slot) => (slot.id === id ? { ...slot, ...changes } : slot)),
    );
  }
  async function updateCampaign(
    campaignId: string,
    patch: Partial<Pick<Campaign, "priority" | "enabled" | "minRepeatDays">>,
  ) {
    try {
      await request(`campaigns/${campaignId}`, "PUT", patch);
      await loadSchedules();
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not update campaign.",
      );
    }
  }
  async function runDryRun(event: React.FormEvent) {
    event.preventDefault();
    setNotice("");
    setDryRun(null);
    try {
      const data = await request("dry-run", "POST", {
        artistId: Number(artistId),
        date: dryDate,
      });
      setDryRun(data);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Dry run failed.");
    }
  }
  async function download(schedule: Schedule, format: "json" | "csv") {
    const response = await fetch(
      `/api/admin/email/schedules/${schedule.id}/export?format=${format}`,
    );
    if (!response.ok) {
      setNotice("Schedule export failed.");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `engagement-schedule-${schedule.id}.${format}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="mt-8 pb-16 text-white">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-lime/30 bg-lime/[0.06] p-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-lime">
            Automated artist sends
          </p>
          <p className="mt-1 text-sm">
            Master send control is disabled. Schedule editing and dry-runs do
            not send email.
          </p>
        </div>
        <span className="rounded-full border border-lime/40 px-3 py-1 text-xs text-lime">
          NOT SENDING
        </span>
      </div>
      <nav className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {(
          [
            "Schedules",
            "Campaigns",
            "Audience",
            "History",
            "Decisions",
          ] as Tab[]
        ).map((item) => (
          <button
            key={item}
            onClick={() => {
              setTab(item);
              if (item === "Audience" && !audience) void loadAudience();
            }}
            className={
              tab === item
                ? "rounded-lg bg-pink px-4 py-2 text-sm font-medium text-black"
                : "rounded-lg px-4 py-2 text-sm text-fog hover:bg-white/[0.06] hover:text-white"
            }
          >
            {item}
          </button>
        ))}
      </nav>
      {notice && (
        <p className="mt-4 rounded-xl border border-white/10 p-3 text-sm text-fog">
          {notice}
        </p>
      )}
      {tab === "Schedules" && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[280px_1fr]">
          <aside className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Schedules</h2>
              <button
                onClick={() => void createSchedule()}
                className="rounded-lg bg-pink px-3 py-2 text-xs font-semibold text-black"
              >
                New
              </button>
            </div>
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className={
                  selected?.id === schedule.id
                    ? "rounded-xl border border-pink/50 bg-white/[0.06] p-4"
                    : "rounded-xl border border-white/10 bg-white/[0.03] p-4"
                }
              >
                <button
                  onClick={() => void openSchedule(schedule.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{schedule.name}</span>
                    <span
                      className={
                        schedule.status === "active"
                          ? "text-xs text-lime"
                          : "text-xs text-fog"
                      }
                    >
                      {schedule.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-fog">
                    Revision {schedule.currentRevision} · edited{" "}
                    {date(schedule.updatedAt)}
                  </p>
                  {schedule.status === "active" && (
                    <p className="mt-2 text-xs text-lime">
                      Active since {date(schedule.activatedAt)}
                    </p>
                  )}
                </button>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => void duplicate(schedule)}
                    className="text-xs text-fog underline"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => void download(schedule, "csv")}
                    className="text-xs text-fog underline"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => void download(schedule, "json")}
                    className="text-xs text-fog underline"
                  >
                    JSON
                  </button>
                  {schedule.status !== "active" && (
                    <button
                      onClick={() => void archive(schedule)}
                      className="text-xs text-fog underline"
                    >
                      Archive
                    </button>
                  )}
                </div>
              </div>
            ))}
          </aside>
          <div>
            {selected ? (
              <>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <label className="block text-xs text-fog">
                      Schedule name
                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="mt-1 block rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-base text-white"
                      />
                    </label>
                    <p className="mt-2 text-xs text-fog">
                      Revision {selected.currentRevision} · group{" "}
                      {selected.scheduleGroup ?? "production"} ·{" "}
                      {selected.timezone} · edits to an active schedule take
                      effect next local day.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={busy}
                      onClick={() => void checkScheduleCoverage(selected.id)}
                      className="rounded-lg border border-amber-300/40 px-3 py-2 text-sm text-amber-200"
                    >
                      Check coverage
                    </button>
                    {selected.status !== "active" && (
                      <button
                        onClick={() => void activate(selected)}
                        className="rounded-lg border border-lime/40 px-3 py-2 text-sm text-lime"
                      >
                        Set as Active
                      </button>
                    )}
                    <button
                      disabled={busy}
                      onClick={() => void saveSchedule()}
                      className="rounded-lg bg-pink px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
                    >
                      Save new revision
                    </button>
                  </div>
                </div>
                {scheduleCoverage &&
                  scheduleCoverage.scheduleId === selected.id && (
                    <div
                      className={`mt-4 rounded-xl border p-4 text-sm ${scheduleCoverage.uncoveredBySchedule ? "border-amber-300/50 bg-amber-300/[0.06]" : "border-lime/30 bg-lime/[0.04]"}`}
                    >
                      <p className="font-semibold">
                        Schedule coverage · {date(scheduleCoverage.generatedAt)}
                      </p>
                      <p className="mt-1 text-fog">
                        Contactable: {scheduleCoverage.contactable} · covered by
                        scheduled campaigns:{" "}
                        {scheduleCoverage.coveredBySchedule} · CHECKIN-only:{" "}
                        {scheduleCoverage.scheduleCheckinOnly} · no current
                        scheduled path: {scheduleCoverage.uncoveredBySchedule} ·
                        deliberately suppressed:{" "}
                        {scheduleCoverage.suppressedOrUnsubscribed}
                      </p>
                      {scheduleCoverage.uncoveredArtists?.length > 0 && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-amber-200">
                            Inspect {scheduleCoverage.uncoveredArtists.length}{" "}
                            uncovered artists
                          </summary>
                          <div className="mt-2 max-h-48 overflow-auto">
                            {scheduleCoverage.uncoveredArtists.map(
                              (artist: any) => (
                                <p key={artist.id}>
                                  {artist.name} · {artist.email} ·{" "}
                                  {artist.bucket} ·{" "}
                                  {artist.specificEligible
                                    .map((item: any) => item.emailId)
                                    .join(", ") || "no specific match"}
                                </p>
                              ),
                            )}
                          </div>
                        </details>
                      )}
                    </div>
                  )}
                <div className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
                  {days.map((day, index) => (
                    <section
                      key={day}
                      className="min-h-56 rounded-xl border border-white/10 bg-white/[0.025] p-3"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{day}</h3>
                        <button
                          onClick={() => addSlot(index + 1)}
                          className="text-xs text-pink"
                        >
                          + slot
                        </button>
                      </div>
                      <div className="mt-3 space-y-3">
                        {slots
                          .filter((slot) => slot.day === index + 1)
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((slot) => {
                            const campaign = campaigns.find(
                              (item) => item.campaignId === slot.campaignId,
                            );
                            return (
                              <div
                                key={slot.id}
                                className="rounded-lg border border-white/10 p-3"
                              >
                                <div className="flex items-center justify-between">
                                  <input
                                    type="time"
                                    value={slot.time}
                                    onChange={(event) =>
                                      editSlot(slot.id, {
                                        time: event.target.value,
                                      })
                                    }
                                    className="rounded bg-black/30 px-2 py-1 text-sm"
                                  />
                                  <label className="flex items-center gap-1 text-xs text-fog">
                                    <input
                                      type="checkbox"
                                      checked={slot.enabled}
                                      onChange={(event) =>
                                        editSlot(slot.id, {
                                          enabled: event.target.checked,
                                        })
                                      }
                                    />
                                    enabled
                                  </label>
                                </div>
                                <select
                                  value={slot.campaignId}
                                  onChange={(event) =>
                                    editSlot(slot.id, {
                                      campaignId: event.target.value,
                                    })
                                  }
                                  className="mt-2 w-full rounded bg-black/30 px-2 py-2 text-xs"
                                >
                                  <option value="">Choose campaign</option>
                                  {campaigns.map((item) => (
                                    <option
                                      key={item.campaignId}
                                      value={item.campaignId}
                                    >
                                      {item.campaignId.toUpperCase()} —{" "}
                                      {item.subject}
                                      {!item.enabled ? " (disabled)" : ""}
                                    </option>
                                  ))}
                                </select>
                                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-fog">
                                  <span>
                                    P{campaign?.priority ?? "?"} ·{" "}
                                    {campaign?.theme ?? "campaign"}
                                  </span>
                                  <label>
                                    Override{" "}
                                    <select
                                      value={slot.priorityOverride ?? ""}
                                      onChange={(event) =>
                                        editSlot(slot.id, {
                                          priorityOverride:
                                            event.target.value === ""
                                              ? null
                                              : Number(event.target.value),
                                        })
                                      }
                                      className="ml-1 rounded bg-black/30 px-1 py-1"
                                    >
                                      <option value="">default</option>
                                      {[0, 1, 2, 3, 4, 5].map((priority) => (
                                        <option key={priority} value={priority}>
                                          P{priority}
                                        </option>
                                      ))}
                                    </select>
                                  </label>
                                </div>
                                {slot.priorityOverride !== null && (
                                  <p className="mt-1 text-xs text-amber-300">
                                    Priority override: P{slot.priorityOverride}
                                  </p>
                                )}
                                <button
                                  onClick={() =>
                                    setSlots((current) =>
                                      current.filter(
                                        (item) => item.id !== slot.id,
                                      ),
                                    )
                                  }
                                  className="mt-2 text-xs text-pink"
                                >
                                  Remove slot
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </section>
                  ))}
                </div>
                <details className="mt-5 rounded-xl border border-white/10 p-4">
                  <summary className="cursor-pointer text-sm font-medium">
                    Revision and activation history ({revisions.length})
                  </summary>
                  <div className="mt-3 space-y-2">
                    {revisions.map((revision) => (
                      <details
                        key={String(revision.id)}
                        className="border-t border-white/10 py-2 text-xs text-fog"
                      >
                        <summary className="grid cursor-pointer gap-1 sm:grid-cols-4">
                          <span>
                            Revision {String(revision.revision)} ·{" "}
                            {String(revision.name)}
                          </span>
                          <span>Saved {date(revision.createdAt)}</span>
                          <span>Active from {date(revision.activeFrom)}</span>
                          <span>Active to {date(revision.activeTo)}</span>
                        </summary>
                        <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap">
                          {JSON.stringify(revision.slots, null, 2)}
                        </pre>
                      </details>
                    ))}
                  </div>
                </details>
              </>
            ) : (
              <p className="rounded-xl border border-dashed border-white/20 p-10 text-center text-sm text-fog">
                Choose a schedule to inspect or edit its weekly calendar.
              </p>
            )}
          </div>
        </div>
      )}
      {tab === "Audience" && (
        <section className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">
                Artist audience & coverage
              </h2>
              <p className="mt-1 max-w-4xl text-xs text-fog">
                {String(
                  audience?.activityDefinition ??
                    "Loading activity definition…",
                )}
              </p>
              <p className="mt-2 max-w-4xl text-xs text-fog">
                Buckets: 0 tracks = No music; 1–2 = Early; 3–9 = Engaged; 10+ =
                Established. A substantial presence can move artists upward: 4+
                distinct profile/content types = Engaged, 7+ = Established.
                These are descriptive states, not a score. Unknown activity is
                kept separate from 180d+ inactivity.
              </p>
            </div>
            <button
              onClick={() => void loadAudience()}
              className="rounded-lg border border-white/15 px-3 py-2 text-sm"
            >
              Refresh audit
            </button>
          </div>
          {audience && (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Contactable artists", audience.coverage.contactable],
                  [
                    "Qualifies at least one campaign",
                    audience.coverage.qualifiesAtLeastOneCampaign,
                  ],
                  [
                    "Specific campaign eligible",
                    audience.coverage.qualifiesSpecificCampaign,
                  ],
                  [
                    "CHECKIN fallback only",
                    audience.coverage.checkinFallbackOnly,
                  ],
                  ["No campaign path", audience.coverage.orphaned],
                  [
                    "No campaign applicable now",
                    audience.coverage.noCampaignCurrentlyApplicable,
                  ],
                  [
                    "Temporarily cadence-blocked",
                    audience.coverage.currentlyCadenceBlocked,
                  ],
                  [
                    "Suppressed / unsubscribed",
                    audience.coverage.suppressedOrUnsubscribed,
                  ],
                  ["Never contacted", audience.coverage.neverContacted],
                  [
                    "No contact ≥ 30 / 60 / 90 / 180d",
                    `${audience.coverage.noContact30d} / ${audience.coverage.noContact60d} / ${audience.coverage.noContact90d} / ${audience.coverage.noContact180d}`,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <p className="text-xs text-fog">{String(label)}</p>
                    <p className="mt-1 text-2xl font-semibold text-white">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="bg-white/[0.04] text-fog">
                    <tr>
                      <th className="px-3 py-3">Content state</th>
                      <th className="px-3 py-3">Total</th>
                      <th className="px-3 py-3">Active &lt;30d</th>
                      <th className="px-3 py-3">Inactive 30–89d</th>
                      <th className="px-3 py-3">Inactive 90–179d</th>
                      <th className="px-3 py-3">Inactive 180d+</th>
                      <th className="px-3 py-3">Activity unknown</th>
                      <th className="px-3 py-3">
                        No recorded login or artist action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["no_music", "No music / low engagement"],
                      ["early", "Early engagement"],
                      ["engaged", "Engaged"],
                      ["established", "Established / content-rich"],
                    ].map(([key, label]) => (
                      <tr key={key} className="border-t border-white/10">
                        <td className="px-3 py-3">{label}</td>
                        {[
                          "total",
                          "active_30d",
                          "inactive_30_89d",
                          "inactive_90_179d",
                          "inactive_180d_plus",
                          "activity_unknown",
                          "neverReturned",
                        ].map((metric) => (
                          <td key={metric} className="px-3 py-3">
                            {audience.buckets[key]?.[metric] ?? 0}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <label className="text-xs text-fog">
                  Filter artists
                  <select
                    value={audienceFilter}
                    onChange={(event) => setAudienceFilter(event.target.value)}
                    className="ml-2 rounded bg-black/30 px-3 py-2 text-sm text-white"
                  >
                    <option value="all">All</option>
                    {[
                      "campaign_covered",
                      "checkin_fallback",
                      "cadence_blocked",
                      "suppressed",
                      "orphaned",
                      "checkin_pending",
                    ].map((value) => (
                      <option key={value} value={value}>
                        {value.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </label>
                <span className="text-xs text-fog">
                  {audience.artists.length} artists audited · generated{" "}
                  {date(audience.generatedAt)}
                </span>
              </div>
              <div className="space-y-2">
                {audience.artists
                  .filter(
                    (artist: any) =>
                      audienceFilter === "all" ||
                      artist.coverageStatus === audienceFilter,
                  )
                  .map((artist: any) => (
                    <details
                      key={artist.id}
                      className={`rounded-xl border p-4 ${artist.coverageStatus === "orphaned" ? "border-pink/50 bg-pink/[0.04]" : "border-white/10 bg-white/[0.02]"}`}
                    >
                      <summary className="cursor-pointer text-sm">
                        <strong>{artist.name}</strong>{" "}
                        <span className="text-fog">
                          · {artist.email} ·{" "}
                          {artist.bucket.replaceAll("_", " ")} ·{" "}
                          {artist.coverageStatus.replaceAll("_", " ")} ·{" "}
                          {artist.trackCount} tracks ·{" "}
                          {artist.daysSinceContact === null
                            ? "never contacted"
                            : `${artist.daysSinceContact}d since contact`}
                        </span>
                      </summary>
                      <div className="mt-3 grid gap-3 text-xs text-fog sm:grid-cols-2 lg:grid-cols-3">
                        <p>
                          Last meaningful activity:{" "}
                          {date(artist.lastMeaningfulActivity)}
                          <br />
                          Last login: {date(artist.lastLogin)}
                        </p>
                        <p>
                          Albums/releases: {artist.albumCount}/
                          {artist.releaseCount} · Videos: {artist.videoCount} ·
                          Photos: {artist.photoCount} · Press:{" "}
                          {artist.pressCount} · Versions: {artist.versionCount}
                        </p>
                        <p>
                          Bio/image/social: {artist.bioPresent ? "yes" : "no"}/
                          {artist.profileImagePresent ? "yes" : "no"}/
                          {artist.socialLinkCount}
                        </p>
                        <p>
                          Eligible campaigns:{" "}
                          {artist.specificEligible
                            .map(
                              (item: any) =>
                                `${item.emailId.toUpperCase()} (P${item.priority})`,
                            )
                            .join(", ") || "none"}
                        </p>
                        <p>
                          Cadence-blocked:{" "}
                          {artist.cadenceBlockedCampaigns
                            .map(
                              (item: any) =>
                                `${item.emailId.toUpperCase()}: ${item.reason}`,
                            )
                            .join("; ") || "none"}
                        </p>
                        <p>
                          CHECKIN applies:{" "}
                          {artist.checkinEligible ? "yes" : "no"} · Next
                          possible:{" "}
                          {artist.nextPossibleCampaign ?? "none currently"} ·
                          Suppression:{" "}
                          {artist.suppressionReason ??
                            (artist.unsubscribe ? "unsubscribed" : "none")}
                        </p>
                        <p className="sm:col-span-2 lg:col-span-3">
                          Recent engagement:{" "}
                          {artist.recentEmails
                            .map(
                              (item: any) =>
                                `${item.emailId.toUpperCase()} · ${date(item.sentAt)}`,
                            )
                            .join("; ") || "no recorded sends"}
                        </p>
                      </div>
                    </details>
                  ))}
              </div>
            </>
          )}
        </section>
      )}
      {tab === "Campaigns" && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-white/[0.04] text-fog">
              <tr>
                {[
                  "Email ID / name",
                  "Template alias",
                  "Priority",
                  "Theme",
                  "Eligibility",
                  "Repeat days",
                  "Occurrences",
                  "Last sent",
                  "Total sends",
                  "Enabled",
                ].map((label) => (
                  <th key={label} className="px-3 py-3">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr
                  key={campaign.campaignId}
                  className="border-t border-white/10"
                >
                  <td className="px-3 py-3">
                    <strong>{campaign.campaignId.toUpperCase()}</strong>
                    <p className="text-xs text-fog">{campaign.subject}</p>
                  </td>
                  <td className="px-3 py-3">{campaign.alias}</td>
                  <td className="px-3 py-3">
                    <select
                      value={campaign.priority}
                      onChange={(event) =>
                        void updateCampaign(campaign.campaignId, {
                          priority: Number(event.target.value),
                        })
                      }
                      className="rounded bg-black/30 px-2 py-1"
                    >
                      {[0, 1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>
                          P{value}
                        </option>
                      ))}
                    </select>
                    {campaign.isEvent && (
                      <p className="text-[10px] text-amber-300">
                        transactional
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-3">{campaign.theme}</td>
                  <td className="max-w-xs px-3 py-3 text-xs text-fog">
                    {campaign.eligibilityDescription}
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      min="0"
                      max="36500"
                      value={campaign.minRepeatDays}
                      onChange={(event) =>
                        void updateCampaign(campaign.campaignId, {
                          minRepeatDays: Number(event.target.value),
                        })
                      }
                      className="w-20 rounded bg-black/30 px-2 py-1"
                    />
                  </td>
                  <td className="px-3 py-3">
                    {campaign.occurrences
                      .map(
                        (item) =>
                          `${days[item.day - 1]?.slice(0, 3)} ${item.time}`,
                      )
                      .join(", ") || "—"}
                  </td>
                  <td className="px-3 py-3">{date(campaign.lastSent)}</td>
                  <td className="px-3 py-3">{campaign.totalSends}</td>
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={campaign.enabled}
                      onChange={(event) =>
                        void updateCampaign(campaign.campaignId, {
                          enabled: event.target.checked,
                        })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "History" && (
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Sent and attempted messages
            </h2>
            <button
              onClick={() => void loadHistory()}
              className="text-xs text-pink underline"
            >
              Refresh
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-white/[0.04] text-fog">
                <tr>
                  {[
                    "Date",
                    "Artist",
                    "Email",
                    "Trigger/reason",
                    "Status",
                    "Postmark ID",
                    "Schedule / revision",
                  ].map((label) => (
                    <th key={label} className="px-3 py-3">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr
                    key={String(item.id ?? index)}
                    className="border-t border-white/10"
                  >
                    <td className="px-3 py-3">
                      {date(item.sent_at ?? item.created_at)}
                    </td>
                    <td className="px-3 py-3">
                      {String(item.artist_name ?? "")}
                      <p className="text-xs text-fog">
                        {String(item.artist_email ?? "")}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      {String(item.email_id ?? "").toUpperCase()}
                      {typeof item.template_alias === "string" && (
                        <p className="text-xs text-fog">
                          Template: {String(item.template_alias)}
                        </p>
                      )}
                    </td>
                    <td className="max-w-sm px-3 py-3 text-xs text-fog">
                      {String(item.trigger_reason ?? "")}
                    </td>
                    <td className="px-3 py-3">
                      {String(item.delivery_status ?? item.send_status ?? "")}
                    </td>
                    <td className="px-3 py-3 text-xs">
                      {String(item.postmark_message_id ?? "—")}
                    </td>
                    <td className="px-3 py-3">
                      {item.schedule_name
                        ? `${String(item.schedule_name)} · r${String(item.schedule_revision)}`
                        : "event/test"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {tab === "Decisions" && (
        <section className="mt-6">
          <form
            onSubmit={runDryRun}
            className="flex flex-wrap items-end gap-3 rounded-xl border border-white/10 p-4"
          >
            <label className="text-xs text-fog">
              Artist ID
              <input
                required
                type="number"
                min="1"
                value={artistId}
                onChange={(event) => setArtistId(event.target.value)}
                className="mt-1 block rounded bg-black/30 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="text-xs text-fog">
              Local date
              <input
                required
                type="date"
                value={dryDate}
                onChange={(event) => setDryDate(event.target.value)}
                className="mt-1 block rounded bg-black/30 px-3 py-2 text-sm text-white"
              />
            </label>
            <button className="rounded-lg bg-pink px-4 py-2 text-sm font-medium text-black">
              Dry-run full day
            </button>
            <label className="ml-auto text-xs text-fog">
              Decision date
              <input
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="ml-2 rounded bg-black/30 px-2 py-2 text-sm text-white"
              />
            </label>
            <button
              type="button"
              onClick={() => void loadDecisions()}
              className="rounded-lg border border-white/15 px-3 py-2 text-sm"
            >
              Load audit
            </button>
          </form>
          {dryRun && (
            <pre className="mt-4 max-h-[34rem] overflow-auto rounded-xl border border-white/10 bg-black/20 p-4 text-xs text-fog">
              {JSON.stringify(dryRun, null, 2)}
            </pre>
          )}
          <div className="mt-5 space-y-3">
            {decisions.map((decision, index) => (
              <details
                key={String(decision.id ?? index)}
                className="rounded-xl border border-white/10 p-4"
              >
                <summary className="cursor-pointer text-sm">
                  <strong>
                    {String(
                      decision.artist_name ?? `Artist ${decision.artist_id}`,
                    )}
                  </strong>{" "}
                  · {String(decision.local_date)} ·{" "}
                  {String(decision.selected_campaign_id ?? "no winner")} ·{" "}
                  {String(decision.status)} ·{" "}
                  {String(decision.schedule_name ?? "Schedule")} r
                  {String(decision.schedule_revision)}
                </summary>
                <pre className="mt-3 overflow-auto text-xs text-fog">
                  {String(decision.candidates ?? "")}
                </pre>
                <p className="mt-2 text-xs text-fog">
                  {String(
                    decision.winner_reason ??
                      decision.revalidation_reason ??
                      "",
                  )}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

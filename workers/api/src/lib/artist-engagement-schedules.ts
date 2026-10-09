import {
  deliverEngagement,
  evaluateCampaignSet,
  loadArtistEngagementState,
  loadEngagementCampaignDefinitions,
  type Candidate,
} from "./artist-engagement";
import type { Env } from "../types";

export const DEFAULT_ENGAGEMENT_TIMEZONE = "Europe/London";
const MAX_CAMPAIGN_SLOTS_PER_DAY = 2;
const DAY_MS = 86_400_000;

export type CampaignSlot = {
  id: string;
  campaignId: string;
  day: number;
  time: string;
  enabled: boolean;
  priorityOverride: number | null;
};
type Revision = {
  id: number;
  scheduleId: number;
  revision: number;
  nameSnapshot: string;
  timezone: string;
  slots: CampaignSlot[];
  activeFrom: string | null;
  activeTo: string | null;
  createdAt: string;
};
type EvaluatedCandidate = {
  campaignId: string;
  name: string;
  templateAlias: string;
  subject: string;
  priority: number;
  theme: string;
  day: number;
  time: string;
  slotId: string;
  eligible: boolean;
  reason: string;
  lastEmailAt: string | null;
  lastThemeAt: string | null;
  qualifiedSince: string | null;
  triggerKey: string | null;
  eventCandidate?: Candidate;
};

function localParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const pick = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "00";
  const weekdayName = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    weekday: "short",
  }).format(date);
  const weekday =
    (
      { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 } as Record<
        string,
        number
      >
    )[weekdayName] ?? 1;
  return {
    date: `${pick("year")}-${pick("month")}-${pick("day")}`,
    hour: pick("hour"),
    minute: pick("minute"),
    weekday,
  };
}

function localDateTimeToUtc(localDate: string, time: string, timezone: string) {
  const [year, month, day] = localDate.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const desired = Date.UTC(year, month - 1, day, hour, minute);
  let guess = desired;
  for (let i = 0; i < 3; i += 1) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(guess));
    const get = (type: string) =>
      Number(parts.find((part) => part.type === type)?.value ?? 0);
    const rendered = Date.UTC(
      get("year"),
      get("month") - 1,
      get("day"),
      get("hour"),
      get("minute"),
    );
    guess += desired - rendered;
  }
  return new Date(guess).toISOString();
}

function nextLocalMidnight(now: Date, timezone: string) {
  const today = localParts(now, timezone).date;
  const tomorrow = new Date(Date.parse(`${today}T00:00:00Z`) + DAY_MS)
    .toISOString()
    .slice(0, 10);
  return localDateTimeToUtc(tomorrow, "00:00", timezone);
}

function parseSlots(value: unknown): CampaignSlot[] {
  if (Array.isArray(value)) return value as CampaignSlot[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as CampaignSlot[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function rowRevision(row: Record<string, unknown>): Revision {
  return {
    id: Number(row.id),
    scheduleId: Number(row.scheduleId),
    revision: Number(row.revision),
    nameSnapshot: String(row.nameSnapshot),
    timezone: String(row.timezone),
    slots: parseSlots(row.slots),
    activeFrom: typeof row.activeFrom === "string" ? row.activeFrom : null,
    activeTo: typeof row.activeTo === "string" ? row.activeTo : null,
    createdAt: String(row.createdAt ?? ""),
  };
}

function validateSlots(
  slots: CampaignSlot[],
  definitions: Record<string, { enabled: boolean; isEvent: boolean }>,
) {
  if (!Array.isArray(slots)) return "Slots must be a list.";
  const ids = new Set<string>();
  const dailyCounts = new Map<number, number>();
  for (const slot of slots) {
    if (!slot || typeof slot.id !== "string" || !slot.id || ids.has(slot.id))
      return "Every slot needs a unique ID.";
    ids.add(slot.id);
    if (!definitions[slot.campaignId])
      return `Unknown campaign: ${slot.campaignId}.`;
    if (!Number.isInteger(slot.day) || slot.day < 1 || slot.day > 7)
      return `Invalid weekday for ${slot.id}.`;
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(slot.time))
      return `Invalid local time for ${slot.id}.`;
    if (typeof slot.enabled !== "boolean")
      return `Slot ${slot.id} needs an enabled state.`;
    if (
      slot.priorityOverride !== null &&
      (!Number.isInteger(slot.priorityOverride) ||
        slot.priorityOverride < 0 ||
        slot.priorityOverride > 5)
    )
      return `Priority override for ${slot.id} must be between 0 and 5.`;
    if (slot.priorityOverride === 0 && !definitions[slot.campaignId].isEvent)
      return `Priority 0 is reserved for genuine event campaigns (${slot.campaignId} is not one).`;
    if (slot.enabled)
      dailyCounts.set(slot.day, (dailyCounts.get(slot.day) ?? 0) + 1);
  }
  for (const [day, count] of dailyCounts)
    if (count > MAX_CAMPAIGN_SLOTS_PER_DAY)
      return `Weekday ${day} has more than ${MAX_CAMPAIGN_SLOTS_PER_DAY} enabled slots.`;
  return null;
}

export async function listEngagementSchedules(
  env: Env,
): Promise<Array<Record<string, unknown> & { slots: CampaignSlot[] }>> {
  const result = await env.DB.prepare(
    `SELECT s.id,s.name,s.status,s.schedule_group AS scheduleGroup,s.current_revision AS currentRevision,s.timezone,s.created_at AS createdAt,s.updated_at AS updatedAt,s.activated_at AS activatedAt,s.deactivated_at AS deactivatedAt,r.slots FROM artist_engagement_schedules s LEFT JOIN artist_engagement_schedule_revisions r ON r.schedule_id=s.id AND r.revision=s.current_revision ORDER BY CASE s.status WHEN 'active' THEN 0 WHEN 'inactive' THEN 1 ELSE 2 END,s.name`,
  ).all<Record<string, unknown>>();
  return (result.results ?? []).map((row) => ({
    ...row,
    slots: parseSlots(row.slots),
  })) as Array<Record<string, unknown> & { slots: CampaignSlot[] }>;
}

type ScheduleWithRevision = Record<string, unknown> & { slots: CampaignSlot[] };
export async function getEngagementSchedule(
  env: Env,
  scheduleId: number,
): Promise<ScheduleWithRevision | null> {
  const row = await env.DB.prepare(
    `SELECT s.id,s.name,s.status,s.schedule_group AS scheduleGroup,s.current_revision AS currentRevision,s.timezone,s.created_at AS createdAt,s.updated_at AS updatedAt,s.activated_at AS activatedAt,s.deactivated_at AS deactivatedAt,r.id AS revisionId,r.slots,r.active_from AS activeFrom,r.active_to AS activeTo,r.created_at AS revisionCreatedAt FROM artist_engagement_schedules s JOIN artist_engagement_schedule_revisions r ON r.schedule_id=s.id AND r.revision=s.current_revision WHERE s.id=?`,
  )
    .bind(scheduleId)
    .first<Record<string, unknown>>();
  if (!row) return null;
  return { ...row, slots: parseSlots(row.slots) } as ScheduleWithRevision;
}

export async function listScheduleRevisions(env: Env, scheduleId: number) {
  const result = await env.DB.prepare(
    `SELECT id,schedule_id AS scheduleId,revision,name_snapshot AS name,timezone,active_from AS activeFrom,active_to AS activeTo,created_at AS createdAt,slots FROM artist_engagement_schedule_revisions WHERE schedule_id=? ORDER BY revision DESC`,
  )
    .bind(scheduleId)
    .all<Record<string, unknown>>();
  return (result.results ?? []).map((row) => ({
    ...row,
    slots: parseSlots(row.slots),
  }));
}

async function validateScheduleForActivation(env: Env, slots: CampaignSlot[]) {
  const definitions = await loadEngagementCampaignDefinitions(env);
  const error = validateSlots(slots, definitions);
  if (error) return error;
  if (!slots.some((slot) => slot.enabled))
    return "An active schedule needs at least one enabled slot.";
  for (const slot of slots.filter((item) => item.enabled))
    if (!definitions[slot.campaignId]?.enabled)
      return `${slot.campaignId} is disabled in Campaigns.`;
  return null;
}

async function insertRevision(
  env: Env,
  scheduleId: number,
  revision: number,
  name: string,
  timezone: string,
  slots: CampaignSlot[],
  activeFrom: string | null,
) {
  return env.DB.prepare(
    `INSERT INTO artist_engagement_schedule_revisions(schedule_id,revision,name_snapshot,timezone,slots,active_from,created_at) VALUES(?,?,?,?,?,?,?) RETURNING id`,
  )
    .bind(
      scheduleId,
      revision,
      name,
      timezone,
      JSON.stringify(slots),
      activeFrom,
      new Date().toISOString(),
    )
    .first<{ id: number }>();
}

export async function createEngagementSchedule(
  env: Env,
  input: {
    name: string;
    timezone?: string;
    scheduleGroup?: string;
    slots?: CampaignSlot[];
  },
) {
  const name = input.name.trim();
  if (!name) return { error: "Schedule name is required." };
  const timezone = input.timezone ?? DEFAULT_ENGAGEMENT_TIMEZONE;
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: timezone });
  } catch {
    return { error: "Unknown timezone." };
  }
  const slots = input.slots ?? [];
  const definitions = await loadEngagementCampaignDefinitions(env);
  const validation = validateSlots(slots, definitions);
  if (validation) return { error: validation };
  const scheduleGroup = input.scheduleGroup?.trim() || "production";
  const row = await env.DB.prepare(
    `INSERT INTO artist_engagement_schedules(name,status,schedule_group,current_revision,timezone) VALUES(?,'inactive',?,1,?) RETURNING id`,
  )
    .bind(name, scheduleGroup, timezone)
    .first<{ id: number }>();
  if (!row) return { error: "Could not create schedule." };
  await insertRevision(env, row.id, 1, name, timezone, slots, null);
  return { schedule: await getEngagementSchedule(env, row.id) };
}

export async function saveEngagementSchedule(
  env: Env,
  scheduleId: number,
  input: { name?: string; timezone?: string; slots: CampaignSlot[] },
  now = new Date(),
) {
  const current = await getEngagementSchedule(env, scheduleId);
  if (!current) return { error: "Schedule not found." };
  const name = input.name?.trim() || String(current.name);
  const timezone = input.timezone ?? String(current.timezone);
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: timezone });
  } catch {
    return { error: "Unknown timezone." };
  }
  const definitions = await loadEngagementCampaignDefinitions(env);
  const validation = validateSlots(input.slots, definitions);
  if (validation) return { error: validation };
  const revision = Number(current.currentRevision) + 1;
  const effectiveAt =
    current.status === "active" ? nextLocalMidnight(now, timezone) : null;
  await env.DB.batch([
    env.DB.prepare(
      `UPDATE artist_engagement_schedule_revisions SET active_to=? WHERE schedule_id=? AND revision=? AND active_to IS NULL`,
    ).bind(effectiveAt, scheduleId, current.currentRevision),
    env.DB.prepare(
      `INSERT INTO artist_engagement_schedule_revisions(schedule_id,revision,name_snapshot,timezone,slots,active_from,created_at) VALUES(?,?,?,?,?,?,?)`,
    ).bind(
      scheduleId,
      revision,
      name,
      timezone,
      JSON.stringify(input.slots),
      effectiveAt,
      now.toISOString(),
    ),
    env.DB.prepare(
      `UPDATE artist_engagement_schedules SET name=?,timezone=?,current_revision=?,updated_at=? WHERE id=?`,
    ).bind(name, timezone, revision, now.toISOString(), scheduleId),
  ]);
  return {
    schedule: await getEngagementSchedule(env, scheduleId),
    effectiveAt,
  };
}

export async function duplicateEngagementSchedule(
  env: Env,
  scheduleId: number,
  name?: string,
) {
  const source = await getEngagementSchedule(env, scheduleId);
  if (!source) return { error: "Schedule not found." };
  return createEngagementSchedule(env, {
    name: name?.trim() || `${source.name} — Copy`,
    timezone: String(source.timezone),
    scheduleGroup: String(source.scheduleGroup ?? "production"),
    slots: source.slots as CampaignSlot[],
  });
}

export async function activateEngagementSchedule(
  env: Env,
  scheduleId: number,
  now = new Date(),
) {
  const target = await getEngagementSchedule(env, scheduleId);
  if (!target) return { error: "Schedule not found." };
  const slots = target.slots as CampaignSlot[];
  const validation = await validateScheduleForActivation(env, slots);
  if (validation) return { error: validation };
  if (target.status === "active")
    return { schedule: target, effectiveAt: null };
  const activeAt = nextLocalMidnight(now, String(target.timezone));
  const scheduleGroup = String(target.scheduleGroup ?? "production");
  const active = await env.DB.prepare(
    `SELECT r.schedule_id AS id,r.revision FROM artist_engagement_schedule_revisions r JOIN artist_engagement_schedules s ON s.id=r.schedule_id WHERE s.schedule_group=? AND r.active_from<=? AND (r.active_to IS NULL OR r.active_to>?) ORDER BY r.active_from DESC LIMIT 1`,
  )
    .bind(scheduleGroup, now.toISOString(), now.toISOString())
    .first<{ id: number; revision: number }>();
  const targetRevision = Number(target.currentRevision) + 1;
  if (active) {
    await env.DB.batch([
      // Close every still-open revision, including one edited earlier today
      // whose activation is pending. This avoids overlapping effective ranges.
      env.DB.prepare(
        `UPDATE artist_engagement_schedule_revisions SET active_to=? WHERE schedule_id=? AND active_to IS NULL`,
      ).bind(activeAt, active.id),
      env.DB.prepare(
        `UPDATE artist_engagement_schedules SET status='inactive',deactivated_at=?,updated_at=? WHERE id=?`,
      ).bind(activeAt, now.toISOString(), active.id),
      env.DB.prepare(
        `UPDATE artist_engagement_schedules SET status='active',current_revision=?,activated_at=?,deactivated_at=NULL,updated_at=? WHERE id=?`,
      ).bind(targetRevision, activeAt, now.toISOString(), scheduleId),
      env.DB.prepare(
        `INSERT INTO artist_engagement_schedule_revisions(schedule_id,revision,name_snapshot,timezone,slots,active_from,created_at) VALUES(?,?,?,?,?,?,?)`,
      ).bind(
        scheduleId,
        targetRevision,
        target.name,
        target.timezone,
        JSON.stringify(slots),
        activeAt,
        now.toISOString(),
      ),
    ]);
  } else {
    await env.DB.batch([
      env.DB.prepare(
        `UPDATE artist_engagement_schedules SET status='active',current_revision=?,activated_at=?,deactivated_at=NULL,updated_at=? WHERE id=?`,
      ).bind(targetRevision, activeAt, now.toISOString(), scheduleId),
      env.DB.prepare(
        `INSERT INTO artist_engagement_schedule_revisions(schedule_id,revision,name_snapshot,timezone,slots,active_from,created_at) VALUES(?,?,?,?,?,?,?)`,
      ).bind(
        scheduleId,
        targetRevision,
        target.name,
        target.timezone,
        JSON.stringify(slots),
        activeAt,
        now.toISOString(),
      ),
    ]);
  }
  return {
    schedule: await getEngagementSchedule(env, scheduleId),
    effectiveAt: activeAt,
  };
}

export async function archiveEngagementSchedule(
  env: Env,
  scheduleId: number,
  now = new Date(),
) {
  const row = await env.DB.prepare(
    `SELECT status FROM artist_engagement_schedules WHERE id=?`,
  )
    .bind(scheduleId)
    .first<{ status: string }>();
  if (!row) return false;
  if (row.status === "active") return false;
  await env.DB.prepare(
    `UPDATE artist_engagement_schedules SET status='archived',updated_at=?,deactivated_at=? WHERE id=?`,
  )
    .bind(now.toISOString(), now.toISOString(), scheduleId)
    .run();
  return true;
}

export async function getScheduleExport(env: Env, scheduleId: number) {
  const schedule = await getEngagementSchedule(env, scheduleId);
  if (!schedule) return null;
  const definitions = await loadEngagementCampaignDefinitions(env);
  const slots = schedule.slots as CampaignSlot[];
  const campaigns = Object.fromEntries(
    Object.entries(definitions).map(([id, def]) => [id, def]),
  );
  return {
    schedule: {
      id: schedule.id,
      name: schedule.name,
      status: schedule.status,
      revision: schedule.currentRevision,
      timezone: schedule.timezone,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
      activatedAt: schedule.activatedAt,
    },
    slots: slots.map((slot) => ({
      campaignId: slot.campaignId,
      campaignName: campaigns[slot.campaignId]?.subject ?? slot.campaignId,
      day: slot.day,
      dayName: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ][slot.day - 1],
      time: slot.time,
      timezone: schedule.timezone,
      priority:
        slot.priorityOverride ?? campaigns[slot.campaignId]?.priority ?? null,
      priorityOverride: slot.priorityOverride,
      category: campaigns[slot.campaignId]?.theme ?? "",
      minRepeatDays: campaigns[slot.campaignId]?.minRepeatDays ?? null,
      enabled: slot.enabled,
      slotId: slot.id,
    })),
  };
}

async function getRevisionAt(
  env: Env,
  now: Date,
  scheduleGroup = "production",
) {
  const rows = await env.DB.prepare(
    `SELECT r.*,r.schedule_id AS scheduleId,r.name_snapshot AS nameSnapshot,r.active_from AS activeFrom,r.active_to AS activeTo,r.created_at AS createdAt FROM artist_engagement_schedule_revisions r JOIN artist_engagement_schedules s ON s.id=r.schedule_id WHERE s.schedule_group=? AND r.active_from<=? AND (r.active_to IS NULL OR r.active_to>?) ORDER BY r.active_from DESC LIMIT 1`,
  )
    .bind(scheduleGroup, now.toISOString(), now.toISOString())
    .all<Record<string, unknown>>();
  return rows.results?.[0] ? rowRevision(rows.results[0]) : null;
}

export async function pinDailySchedule(env: Env, now = new Date()) {
  const active = await getRevisionAt(env, now);
  if (!active)
    throw new Error(
      "No active artist engagement schedule revision covers the current time.",
    );
  const date = localParts(now, active.timezone).date;
  const scheduleGroup = "production";
  await env.DB.prepare(
    `INSERT OR IGNORE INTO artist_engagement_daily_schedules(local_date,schedule_group,timezone,schedule_id,schedule_revision,created_at) VALUES(?,?,?,?,?,?)`,
  )
    .bind(
      date,
      scheduleGroup,
      active.timezone,
      active.scheduleId,
      active.revision,
      now.toISOString(),
    )
    .run();
  const pinned = await env.DB.prepare(
    `SELECT d.local_date AS localDate,d.schedule_group AS scheduleGroup,d.timezone,d.schedule_id AS scheduleId,d.schedule_revision AS scheduleRevision,r.slots,r.name_snapshot AS nameSnapshot FROM artist_engagement_daily_schedules d JOIN artist_engagement_schedule_revisions r ON r.schedule_id=d.schedule_id AND r.revision=d.schedule_revision WHERE d.local_date=? AND d.schedule_group=?`,
  )
    .bind(date, scheduleGroup)
    .first<Record<string, unknown>>();
  if (!pinned) throw new Error(`Could not pin schedule for ${date}.`);
  return {
    localDate: String(pinned.localDate),
    scheduleGroup: String(pinned.scheduleGroup),
    timezone: String(pinned.timezone),
    scheduleId: Number(pinned.scheduleId),
    revision: Number(pinned.scheduleRevision),
    name: String(pinned.nameSnapshot),
    slots: parseSlots(pinned.slots),
  };
}

export function compareDailyCandidates<
  T extends {
    priority: number;
    lastEmailAt: string | null;
    lastThemeAt: string | null;
    qualifiedSince: string | null;
    campaignId: string;
    time: string;
    slotId: string;
  },
>(a: T, b: T) {
  if (a.priority !== b.priority) return a.priority - b.priority;
  const oldestFirst = (left: string | null, right: string | null) =>
    (left ?? "0000").localeCompare(right ?? "0000");
  return (
    oldestFirst(a.lastEmailAt, b.lastEmailAt) ||
    oldestFirst(a.lastThemeAt, b.lastThemeAt) ||
    oldestFirst(a.qualifiedSince, b.qualifiedSince) ||
    a.campaignId.localeCompare(b.campaignId) ||
    a.time.localeCompare(b.time) ||
    a.slotId.localeCompare(b.slotId)
  );
}

export function isStillEligible(
  checks: Array<{ emailId: string; eligible: boolean }>,
  campaignId: string,
) {
  return checks.some((check) => check.emailId === campaignId && check.eligible);
}

export function priorityZeroOverridesPendingNurture(
  status: string,
  sendTimeIsFuture: boolean,
) {
  return status === "selected" && sendTimeIsFuture;
}

async function getEligibilityAge(
  env: Env,
  artistId: number,
  campaignId: string,
  eligible: boolean,
  now: Date,
) {
  const nowString = now.toISOString();
  if (!eligible) {
    await env.DB.prepare(
      `INSERT INTO artist_engagement_eligibility(artist_id,campaign_id,first_qualified_at,last_evaluated_at,currently_eligible) VALUES(?,?,?, ?,0) ON CONFLICT(artist_id,campaign_id) DO UPDATE SET last_evaluated_at=excluded.last_evaluated_at,currently_eligible=0`,
    )
      .bind(artistId, campaignId, nowString, nowString)
      .run();
    return null;
  }
  await env.DB.prepare(
    `INSERT INTO artist_engagement_eligibility(artist_id,campaign_id,first_qualified_at,last_evaluated_at,currently_eligible) VALUES(?,?,?,?,1) ON CONFLICT(artist_id,campaign_id) DO UPDATE SET first_qualified_at=CASE WHEN currently_eligible=1 THEN first_qualified_at ELSE excluded.first_qualified_at END,last_evaluated_at=excluded.last_evaluated_at,currently_eligible=1`,
  )
    .bind(artistId, campaignId, nowString, nowString)
    .run();
  const row = await env.DB.prepare(
    `SELECT first_qualified_at AS firstQualifiedAt FROM artist_engagement_eligibility WHERE artist_id=? AND campaign_id=?`,
  )
    .bind(artistId, campaignId)
    .first<{ firstQualifiedAt: string }>();
  return row?.firstQualifiedAt ?? nowString;
}

function recentSentAt(
  history: Array<{
    emailId: string;
    theme: string;
    sentAt: string | null;
    category: string;
  }>,
  emailId: string,
  theme?: string,
) {
  const row = history.find(
    (item) =>
      item.sentAt && (theme ? item.theme === theme : item.emailId === emailId),
  );
  return row?.sentAt ?? null;
}

async function evaluateAndStoreArtist(
  env: Env,
  artistId: number,
  day: Awaited<ReturnType<typeof pinDailySchedule>>,
  now: Date,
) {
  const today = new Date(`${day.localDate}T12:00:00Z`);
  const weekday = localParts(today, day.timezone).weekday;
  const slots = day.slots.filter((slot) => slot.day === weekday);
  const definitions = await loadEngagementCampaignDefinitions(env);
  const enabledCampaignIds = Object.entries(definitions)
    .filter(([, definition]) => definition.enabled)
    .map(([campaignId]) => campaignId);
  const evaluated = enabledCampaignIds.length
    ? await evaluateCampaignSet(env, artistId, enabledCampaignIds, now)
    : null;
  const allCandidates =
    evaluated && !("error" in evaluated) ? evaluated.candidates : [];
  const checks = evaluated && !("error" in evaluated) ? evaluated.checks : [];
  const contactHistory =
    evaluated && !("error" in evaluated)
      ? (evaluated.contactHistory as Array<{
          emailId: string;
          theme: string;
          sentAt: string | null;
          category: string;
        }>)
      : [];
  const checkFor = (campaignId: string) =>
    checks.find((item: any) => item.emailId === campaignId);
  const candidateFor = (campaignId: string) =>
    allCandidates.find((item: Candidate) => item.emailId === campaignId);
  const qualificationAges = new Map<string, string | null>();
  for (const [campaignId, definition] of Object.entries(definitions)) {
    const check = checkFor(campaignId);
    const eligible = Boolean(
      definition.enabled && check?.eligible && candidateFor(campaignId),
    );
    qualificationAges.set(
      campaignId,
      await getEligibilityAge(env, artistId, campaignId, eligible, now),
    );
  }
  const audit: EvaluatedCandidate[] = [];
  for (const slot of slots) {
    const def = definitions[slot.campaignId];
    if (!slot.enabled || !def?.enabled) {
      audit.push({
        campaignId: slot.campaignId,
        name: def?.subject ?? slot.campaignId,
        templateAlias: def?.alias ?? slot.campaignId,
        subject: def?.subject ?? slot.campaignId,
        priority: slot.priorityOverride ?? def?.priority ?? 5,
        theme: def?.theme ?? "unknown",
        day: slot.day,
        time: slot.time,
        slotId: slot.id,
        eligible: false,
        reason: !slot.enabled
          ? "Slot is disabled in the schedule."
          : "Campaign is disabled.",
        lastEmailAt: null,
        lastThemeAt: null,
        qualifiedSince: null,
        triggerKey: null,
      });
      continue;
    }
    const check = checkFor(slot.campaignId);
    const candidate = candidateFor(slot.campaignId);
    const eligible = Boolean(check?.eligible && candidate);
    const qualifiedSince = qualificationAges.get(slot.campaignId) ?? null;
    audit.push({
      campaignId: slot.campaignId,
      name: def.subject,
      templateAlias: candidate?.alias ?? def.alias,
      subject: def.subject,
      priority: slot.priorityOverride ?? def.priority,
      theme: def.theme,
      day: slot.day,
      time: slot.time,
      slotId: slot.id,
      eligible,
      reason: check?.reason ?? "Campaign was not eligible under current state.",
      lastEmailAt: recentSentAt(contactHistory, slot.campaignId),
      lastThemeAt: recentSentAt(contactHistory, slot.campaignId, def.theme),
      qualifiedSince,
      triggerKey: candidate?.triggerKey ?? null,
      eventCandidate: candidate,
    });
  }
  const candidates = audit
    .filter((item) => item.eligible)
    .sort(compareDailyCandidates);
  const winner = candidates[0] ?? null;
  const auditComplete = audit.map((item) => ({
    ...item,
    eventCandidate: undefined,
    resolution: !item.eligible
      ? `Suppressed — ${item.reason}`
      : winner?.slotId === item.slotId
        ? candidates.length > 1 && item.priority === winner.priority
          ? "Winner — deterministic tie-break."
          : "Winner — lowest numeric campaign priority."
        : `Suppressed — ${winner ? (item.priority === winner.priority ? `equal-priority tie lost to ${winner.campaignId} under deterministic recency/qualification/ID ordering.` : `higher-priority campaign ${winner.campaignId} selected for artist today.`) : "no winner"}`,
  }));
  const payload = await env.DB.prepare(
    `SELECT name,email FROM artists JOIN users ON users.id=artists.user_id WHERE artists.id=?`,
  )
    .bind(artistId)
    .first<{ name: string; email: string }>();
  if (!payload) return;
  const sentAt = winner
    ? localDateTimeToUtc(day.localDate, winner.time, day.timezone)
    : null;
  const status = winner ? "selected" : "no_candidate";
  await env.DB.prepare(
    `INSERT OR IGNORE INTO artist_engagement_daily_decisions(artist_id,local_date,timezone,schedule_id,schedule_revision,candidates,selected_campaign_id,selected_slot_id,selected_send_at,winner_reason,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  )
    .bind(
      artistId,
      day.localDate,
      day.timezone,
      day.scheduleId,
      day.revision,
      JSON.stringify({ artist: payload.name, considered: auditComplete }),
      winner?.campaignId ?? null,
      winner?.slotId ?? null,
      sentAt,
      winner
        ? candidates.length > 1 &&
          candidates[0].priority === candidates[1].priority
          ? "Priority tie resolved by email/theme recency, qualification duration, then campaign ID."
          : "Lowest numeric campaign priority among eligible campaigns."
        : null,
      status,
      now.toISOString(),
      now.toISOString(),
    )
    .run();
}

async function readHistory(env: Env, artistId: number) {
  const result = await env.DB.prepare(
    `SELECT email_id AS emailId,theme,sent_at AS sentAt,category FROM artist_engagement_email_history WHERE artist_id=? AND send_status='sent' AND category IN ('nurture','event') ORDER BY sent_at DESC,id DESC LIMIT 500`,
  )
    .bind(artistId)
    .all<{
      emailId: string;
      theme: string;
      sentAt: string | null;
      category: string;
    }>();
  return result.results ?? [];
}

async function revalidateAndSend(
  env: Env,
  decision: Record<string, unknown>,
  now: Date,
) {
  const artistId = Number(decision.artistId);
  const campaignId = String(decision.selectedCampaignId);
  const date = String(decision.localDate);
  const at = new Date(now);
  const auditJson =
    typeof decision.candidates === "string"
      ? (JSON.parse(decision.candidates) as {
          considered?: EvaluatedCandidate[];
        })
      : (decision.candidates as { considered?: EvaluatedCandidate[] });
  const selectedSlot = auditJson.considered?.find(
    (candidate) => candidate.slotId === decision.selectedSlotId,
  );
  if (!selectedSlot) return;
  const reevaluated = await evaluateCampaignSet(
    env,
    artistId,
    [campaignId],
    at,
  );
  const valid =
    !("error" in reevaluated) &&
    isStillEligible(reevaluated.checks, campaignId) &&
    reevaluated.candidates.some(
      (candidate) => candidate.emailId === campaignId,
    );
  if (!valid) {
    await env.DB.prepare(
      `UPDATE artist_engagement_daily_decisions SET status='stale',revalidated_at=?,revalidation_reason=?,updated_at=? WHERE id=? AND status='selected'`,
    )
      .bind(
        at.toISOString(),
        `No longer eligible immediately before send: ${reevaluated && !("error" in reevaluated) ? (reevaluated.checks.find((check: any) => check.emailId === campaignId)?.reason ?? "eligibility failed") : "artist state unavailable"}`,
        at.toISOString(),
        decision.id,
      )
      .run();
    return;
  }
  const { results: stateRows } = await env.DB.prepare(
    `SELECT id FROM artists WHERE id=?`,
  )
    .bind(artistId)
    .all<{ id: number }>();
  if (!stateRows?.length) return;
  const state = await loadArtistEngagementState(env, artistId);
  if (!state) return;
  const candidate = reevaluated.candidates.find(
    (item: Candidate) => item.emailId === campaignId,
  )!;
  const claimed = await env.DB.prepare(
    `UPDATE artist_engagement_daily_decisions SET status='sending',revalidated_at=?,revalidation_reason='Eligibility valid at send time.',updated_at=? WHERE id=? AND status='selected' RETURNING id`,
  )
    .bind(at.toISOString(), at.toISOString(), decision.id)
    .first<{ id: number }>();
  if (!claimed) return;
  const category = candidate.priority === 0 ? "event" : "nurture";
  const delivered = await deliverEngagement(
    env,
    state,
    candidate,
    state.email,
    category,
    category === "nurture" ? date : null,
    {
      scheduleId: Number(decision.scheduleId),
      revision: Number(decision.scheduleRevision),
      slotId: String(decision.selectedSlotId),
      decisionId: Number(decision.id),
    },
  );
  await env.DB.prepare(
    `UPDATE artist_engagement_daily_decisions SET status=?,send_history_id=?,revalidation_reason=?,updated_at=? WHERE id=?`,
  )
    .bind(
      delivered.ok ? "sent" : delivered.skipped ? "suppressed" : "failed",
      "historyId" in delivered ? delivered.historyId : null,
      delivered.ok
        ? "Eligibility valid; Postmark accepted message."
        : (delivered.error ?? "Send failed."),
      at.toISOString(),
      decision.id,
    )
    .run();
}

async function sendPriorityZeroEvents(
  env: Env,
  artistRows: Array<{ id: number }>,
  today: string,
  now: Date,
) {
  const sent: string[] = [];
  for (const artist of artistRows) {
    const evaluated = await evaluateCampaignSet(
      env,
      artist.id,
      ["radio-selected-01", "feature-selected-01"],
      now,
    );
    if ("error" in evaluated) continue;
    for (const candidate of evaluated.candidates) {
      if (candidate.priority !== 0 || !candidate.triggerKey) continue;
      const state = await loadArtistEngagementState(env, artist.id);
      if (!state) continue;
      // A pending nurture choice yields to a true transactional selection. A
      // nurture already sent is not a reason to withhold the event notice.
      const pending = await env.DB.prepare(
        `SELECT id,status,selected_send_at AS selectedSendAt FROM artist_engagement_daily_decisions WHERE artist_id=? AND local_date=?`,
      )
        .bind(artist.id, today)
        .first<{ id: number; status: string; selectedSendAt: string | null }>();
      if (
        pending &&
        priorityZeroOverridesPendingNurture(
          pending.status,
          Boolean(
            pending.selectedSendAt &&
            pending.selectedSendAt > now.toISOString(),
          ),
        )
      ) {
        await env.DB.prepare(
          `UPDATE artist_engagement_daily_decisions SET status='suppressed_by_event',revalidation_reason=?,updated_at=? WHERE id=? AND status='selected'`,
        )
          .bind(
            `Suppressed by priority-0 ${candidate.emailId} event.`,
            now.toISOString(),
            pending.id,
          )
          .run();
      }
      const result = await deliverEngagement(
        env,
        state,
        candidate,
        state.email,
        "event",
        null,
      );
      if (result.ok) sent.push(candidate.emailId);
    }
  }
  return sent;
}

export async function runArtistEngagementScheduleTick(
  env: Env,
  now = new Date(),
) {
  if (env.ARTIST_ENGAGEMENT_ENABLED !== "true")
    return { enabled: false, skipped: true };
  const day = await pinDailySchedule(env, now);
  const artistResult = await env.DB.prepare(
    `SELECT a.id FROM artists a JOIN users u ON u.id=a.user_id WHERE u.account_type='artist' AND u.active=1 ORDER BY a.id`,
  ).all<{ id: number }>();
  const missing = artistResult.results ?? [];
  let evaluated = 0;
  for (const artist of missing) {
    const already = await env.DB.prepare(
      `SELECT 1 AS present FROM artist_engagement_daily_decisions WHERE artist_id=? AND local_date=?`,
    )
      .bind(artist.id, day.localDate)
      .first();
    if (!already) {
      await evaluateAndStoreArtist(env, artist.id, day, now);
      evaluated += 1;
    }
  }
  const artistRows = missing.map((artist) => ({ id: artist.id }));
  const priorityEventsSent = await sendPriorityZeroEvents(
    env,
    artistRows,
    day.localDate,
    now,
  );
  const current = localParts(now, day.timezone);
  const due = await env.DB.prepare(
    `SELECT * FROM artist_engagement_daily_decisions WHERE local_date=? AND status='selected' AND selected_send_at<=? ORDER BY selected_send_at,id`,
  )
    .bind(
      day.localDate,
      localDateTimeToUtc(
        day.localDate,
        `${current.hour}:${current.minute}`,
        day.timezone,
      ),
    )
    .all<Record<string, unknown>>();
  let dueProcessed = 0;
  for (const row of due.results ?? []) {
    const selectedSendAt = String(row.selected_send_at ?? "");
    // Exact local minute only: missed slots go stale instead of sending late.
    const expectedLocal = localParts(new Date(selectedSendAt), day.timezone);
    if (
      expectedLocal.date !== current.date ||
      `${expectedLocal.hour}:${expectedLocal.minute}` !==
        `${current.hour}:${current.minute}`
    ) {
      await env.DB.prepare(
        `UPDATE artist_engagement_daily_decisions SET status='stale',revalidation_reason='Selected send minute was missed; no catch-up email is sent.',updated_at=? WHERE id=? AND status='selected'`,
      )
        .bind(now.toISOString(), row.id)
        .run();
      continue;
    }
    await revalidateAndSend(env, row, now);
    dueProcessed += 1;
  }
  return {
    enabled: true,
    skipped: false,
    localDate: day.localDate,
    scheduleId: day.scheduleId,
    revision: day.revision,
    evaluated,
    dueProcessed,
    priorityEventsSent,
    syncBounces: current.hour === "02" && current.minute === "11",
  };
}

export async function dryRunDailyEngagement(
  env: Env,
  artistId: number,
  requestedDate: string,
  now = new Date(),
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(requestedDate) ||
    Number.isNaN(Date.parse(`${requestedDate}T00:00:00Z`))
  )
    return { error: "Date must be YYYY-MM-DD." };
  const revision = await env.DB.prepare(
    `SELECT d.schedule_id AS scheduleId,d.schedule_revision AS revision,d.timezone,r.name_snapshot AS scheduleName,r.slots FROM artist_engagement_daily_schedules d JOIN artist_engagement_schedule_revisions r ON r.schedule_id=d.schedule_id AND r.revision=d.schedule_revision WHERE d.local_date=?`,
  )
    .bind(requestedDate)
    .first<Record<string, unknown>>();
  const current = await getRevisionAt(env, now);
  const timezoneHint = String(
    revision?.timezone ?? current?.timezone ?? DEFAULT_ENGAGEMENT_TIMEZONE,
  );
  const dateInstant = new Date(
    localDateTimeToUtc(requestedDate, "12:00", timezoneHint),
  );
  const active = revision ?? (await getRevisionAt(env, dateInstant));
  if (!active) return { error: "No active schedule is configured." };
  const timezone = String(active.timezone);
  const date = requestedDate;
  const allSlots = parseSlots(active.slots).filter(
    (slot) =>
      slot.day === localParts(new Date(`${date}T12:00:00Z`), timezone).weekday,
  );
  const definitions = await loadEngagementCampaignDefinitions(env);
  const slots = allSlots.filter(
    (slot) => definitions[slot.campaignId]?.enabled,
  );
  const evaluated = slots.length
    ? await evaluateCampaignSet(
        env,
        artistId,
        [...new Set(slots.map((slot) => slot.campaignId))],
        now,
      )
    : null;
  if (!evaluated)
    return {
      artistId,
      date,
      schedule: {
        id: active.scheduleId,
        name: active.nameSnapshot,
        revision: active.revision,
        timezone,
      },
      considered: [],
      winner: null,
      finalStatus: "no_candidate",
      sendingEnabled: env.ARTIST_ENGAGEMENT_ENABLED === "true",
    };
  if ("error" in evaluated) return evaluated;
  const history = evaluated.contactHistory as Array<{
    emailId: string;
    theme: string;
    sentAt: string | null;
    category: string;
  }>;
  const candidates = await Promise.all(
    slots.map(async (slot) => {
      const check = evaluated.checks.find(
        (item: any) => item.emailId === slot.campaignId,
      );
      const candidate = evaluated.candidates.find(
        (item: Candidate) => item.emailId === slot.campaignId,
      );
      const def = definitions[slot.campaignId];
      const eligible = Boolean(
        slot.enabled && def.enabled && check?.eligible && candidate,
      );
      const qualification = eligible
        ? await env.DB.prepare(
            `SELECT first_qualified_at AS firstQualifiedAt,currently_eligible AS currentlyEligible FROM artist_engagement_eligibility WHERE artist_id=? AND campaign_id=?`,
          )
            .bind(artistId, slot.campaignId)
            .first<{ firstQualifiedAt: string; currentlyEligible: number }>()
        : null;
      return {
        campaignId: slot.campaignId,
        templateAlias: candidate?.alias ?? def.alias,
        name: def.subject,
        priority: slot.priorityOverride ?? def.priority,
        day: slot.day,
        time: slot.time,
        slotId: slot.id,
        eligible,
        reason: !slot.enabled
          ? "Slot is disabled in the schedule."
          : !def.enabled
            ? "Campaign is disabled."
            : (check?.reason ?? "Not eligible."),
        lastEmailAt: recentSentAt(history, slot.campaignId),
        lastThemeAt: recentSentAt(history, slot.campaignId, def.theme),
        qualifiedSince: qualification?.currentlyEligible
          ? qualification.firstQualifiedAt
          : eligible
            ? now.toISOString()
            : (null as string | null),
      };
    }),
  );
  const eligible = candidates
    .filter((candidate) => candidate.eligible)
    .sort(compareDailyCandidates);
  const winner = eligible[0] ?? null;
  return {
    artist: evaluated.artist,
    date,
    schedule: {
      id: active.scheduleId,
      name: active.nameSnapshot,
      revision: active.revision,
      timezone,
    },
    state: evaluated.state,
    considered: candidates.map((item) => ({
      ...item,
      resolution: !item.eligible
        ? `Suppressed — ${item.reason}`
        : item.slotId === winner?.slotId
          ? "Winner — lowest numeric priority; ties resolved by email recency, theme recency, qualification duration, then ID."
          : `Suppressed — ${winner?.campaignId} wins the daily selection.`,
    })),
    winner,
    finalStatus: winner ? "selected (dry run; no send)" : "no_candidate",
    sendingEnabled: env.ARTIST_ENGAGEMENT_ENABLED === "true",
  };
}

export async function listDailyEngagementDecisions(env: Env, date?: string) {
  const result = await env.DB.prepare(
    `SELECT d.*,a.name AS artist_name,u.email AS artist_email,r.name_snapshot AS schedule_name FROM artist_engagement_daily_decisions d JOIN artists a ON a.id=d.artist_id JOIN users u ON u.id=a.user_id LEFT JOIN artist_engagement_schedule_revisions r ON r.schedule_id=d.schedule_id AND r.revision=d.schedule_revision ${date ? "WHERE d.local_date=?" : ""} ORDER BY d.local_date DESC,d.created_at DESC LIMIT 500`,
  )
    .bind(...(date ? [date] : []))
    .all<Record<string, unknown>>();
  return result.results ?? [];
}

export async function listEngagementEmailHistory(env: Env, limit = 500) {
  const result = await env.DB.prepare(
    `SELECT h.*,a.name AS artist_name,u.email AS artist_email,r.name_snapshot AS schedule_name FROM artist_engagement_email_history h JOIN artists a ON a.id=h.artist_id JOIN users u ON u.id=a.user_id LEFT JOIN artist_engagement_schedule_revisions r ON r.schedule_id=h.schedule_id AND r.revision=h.schedule_revision ORDER BY h.created_at DESC LIMIT ?`,
  )
    .bind(Math.min(Math.max(limit, 1), 1000))
    .all<Record<string, unknown>>();
  return result.results ?? [];
}

export async function getEngagementCampaignAdminList(env: Env) {
  const [definitions, schedules, historyRows] = await Promise.all([
    loadEngagementCampaignDefinitions(env),
    listEngagementSchedules(env),
    env.DB.prepare(
      `SELECT email_id AS emailId,MAX(sent_at) AS lastSent,COUNT(*) AS totalSends FROM artist_engagement_email_history WHERE send_status='sent' AND category IN ('nurture','event') GROUP BY email_id`,
    ).all<{ emailId: string; lastSent: string | null; totalSends: number }>(),
  ]);
  const sends = new Map(
    (historyRows.results ?? []).map((row) => [row.emailId, row]),
  );
  const occurrences = new Map<
    string,
    Array<{
      scheduleId: number;
      scheduleName: string;
      revision: number;
      day: number;
      time: string;
      enabled: boolean;
    }>
  >();
  for (const schedule of schedules)
    for (const slot of schedule.slots as CampaignSlot[]) {
      const current = occurrences.get(slot.campaignId) ?? [];
      current.push({
        scheduleId: Number(schedule.id),
        scheduleName: String(schedule.name),
        revision: Number(schedule.currentRevision),
        day: slot.day,
        time: slot.time,
        enabled: slot.enabled,
      });
      occurrences.set(slot.campaignId, current);
    }
  return Object.entries(definitions)
    .map(([campaignId, definition]) => ({
      campaignId,
      ...definition,
      lastSent: sends.get(campaignId)?.lastSent ?? null,
      totalSends: Number(sends.get(campaignId)?.totalSends ?? 0),
      occurrences: occurrences.get(campaignId) ?? [],
    }))
    .sort(
      (a, b) =>
        a.priority - b.priority || a.campaignId.localeCompare(b.campaignId),
    );
}

export async function setCampaignDefinition(
  env: Env,
  campaignId: string,
  patch: { priority?: number; enabled?: boolean; minRepeatDays?: number },
) {
  const definition = (await loadEngagementCampaignDefinitions(env))[campaignId];
  if (!definition) return { error: "Unknown campaign ID." };
  if (
    patch.priority !== undefined &&
    (!Number.isInteger(patch.priority) ||
      patch.priority < 0 ||
      patch.priority > 5)
  )
    return { error: "Priority must be between 0 and 5." };
  if (patch.priority === 0 && !definition.isEvent)
    return {
      error:
        "Priority 0 is reserved for genuine event/transactional campaigns.",
    };
  if (
    patch.minRepeatDays !== undefined &&
    (!Number.isInteger(patch.minRepeatDays) ||
      patch.minRepeatDays < 0 ||
      patch.minRepeatDays > 36500)
  )
    return { error: "Repeat interval must be between 0 and 36500 days." };
  const sets: string[] = [];
  const values: unknown[] = [];
  if (patch.priority !== undefined) {
    sets.push("priority=?");
    values.push(patch.priority);
  }
  if (patch.enabled !== undefined) {
    sets.push("enabled=?");
    values.push(Number(patch.enabled));
  }
  if (patch.minRepeatDays !== undefined) {
    sets.push("min_repeat_days=?");
    values.push(patch.minRepeatDays);
  }
  if (!sets.length) return { error: "No changes supplied." };
  sets.push("updated_at=?");
  values.push(new Date().toISOString(), campaignId);
  await env.DB.prepare(
    `UPDATE artist_engagement_campaigns SET ${sets.join(",")} WHERE campaign_id=?`,
  )
    .bind(...values)
    .run();
  return {
    campaign: (await loadEngagementCampaignDefinitions(env))[campaignId],
  };
}

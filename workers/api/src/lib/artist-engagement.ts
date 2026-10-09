import { and, desc, eq, gte, isNotNull, lt, ne } from "drizzle-orm";
import {
  accountEmailNotifications,
  artistEngagementEmailHistory,
  artistEngagementOpportunities,
  artistEngagementPreferences,
  artists,
  users,
} from "@fully-open-records/db/src/schema";
import { getDb } from "./db";
import { signArtistUnsubscribeToken } from "./auth";
import type { Env } from "../types";

export type EngagementEmailDefinition = {
  alias: string;
  subject: string;
  theme: string;
  category: "nurture" | "positive";
  priority: 0 | 1 | 2 | 3 | 4 | 5;
  minRepeatDays: number;
  eligibilityDescription: string;
  enabled: boolean;
  isEvent: boolean;
};

// Canonical bootstrap policy. Runtime campaign values are stored in D1 and
// editable from Email → Campaigns; priorities are defined here only once.
export const ENGAGEMENT_EMAILS: Record<string, EngagementEmailDefinition> = {
  "music-01": {
    alias: "music-01",
    subject: "The world wants to hear you",
    theme: "music-start",
    category: "nurture",
    priority: 1,
    minRepeatDays: 14,
    eligibilityDescription: "No tracks uploaded yet.",
    enabled: true,
    isEvent: false,
  },
  "music-02": {
    alias: "music-02",
    subject: "We've heard the first ones. What else have you got?",
    theme: "music-next",
    category: "nurture",
    priority: 1,
    minRepeatDays: 14,
    eligibilityDescription: "One or two tracks uploaded.",
    enabled: true,
    isEvent: false,
  },
  "catalogue-01": {
    alias: "catalogue-01",
    subject: "Bring more of your world",
    theme: "catalogue",
    category: "nurture",
    priority: 2,
    minRepeatDays: 60,
    eligibilityDescription:
      "Three to nine tracks; encourage a broader catalogue.",
    enabled: true,
    isEvent: false,
  },
  "bio-01": {
    alias: "bio-01",
    subject: "Tell the world about yourself",
    theme: "profile-bio",
    category: "nurture",
    priority: 4,
    minRepeatDays: 60,
    eligibilityDescription: "Artist bio is missing.",
    enabled: true,
    isEvent: false,
  },
  "image-01": {
    alias: "image-01",
    subject: "Put a face to the music",
    theme: "profile-image",
    category: "nurture",
    priority: 4,
    minRepeatDays: 60,
    eligibilityDescription: "Artist profile image is missing.",
    enabled: true,
    isEvent: false,
  },
  "release-01": {
    alias: "release-01",
    subject: "Got an EP or album?",
    theme: "release",
    category: "nurture",
    priority: 2,
    minRepeatDays: 60,
    eligibilityDescription: "Has tracks but no album or release.",
    enabled: true,
    isEvent: false,
  },
  "version-01": {
    alias: "version-01",
    subject: "Working on a song right now?",
    theme: "version-control",
    category: "nurture",
    priority: 2,
    minRepeatDays: 60,
    eligibilityDescription: "Has tracks but no Track Version Control history.",
    enabled: true,
    isEvent: false,
  },
  "version-02": {
    alias: "version-02",
    subject: "Don't lose the good bits",
    theme: "version-control",
    category: "nurture",
    priority: 3,
    minRepeatDays: 90,
    eligibilityDescription: "Has versions, none added in the last 45 days.",
    enabled: true,
    isEvent: false,
  },
  "gig-01": {
    alias: "gig-01",
    subject: "Playing anywhere soon?",
    theme: "live-shows",
    category: "nurture",
    priority: 3,
    minRepeatDays: 60,
    eligibilityDescription: "No future gigs listed.",
    enabled: true,
    isEvent: false,
  },
  "gig-02": {
    alias: "gig-02",
    subject: "What's next?",
    theme: "live-shows",
    category: "nurture",
    priority: 3,
    minRepeatDays: 60,
    eligibilityDescription: "Has past gigs but no future gigs.",
    enabled: true,
    isEvent: false,
  },
  "video-01": {
    alias: "video-01",
    subject: "Got something worth watching?",
    theme: "video",
    category: "nurture",
    priority: 3,
    minRepeatDays: 60,
    eligibilityDescription: "No artist videos listed.",
    enabled: true,
    isEvent: false,
  },
  "photo-01": {
    alias: "photo-01",
    subject: "Show us more",
    theme: "photos",
    category: "nurture",
    priority: 5,
    minRepeatDays: 75,
    eligibilityDescription: "No gallery photos listed.",
    enabled: true,
    isEvent: false,
  },
  "social-01": {
    alias: "social-01",
    subject: "Help people find you everywhere",
    theme: "social-links",
    category: "nurture",
    priority: 4,
    minRepeatDays: 75,
    eligibilityDescription: "One or fewer social/music links.",
    enabled: true,
    isEvent: false,
  },
  "checkin-01": {
    alias: "checkin-01",
    subject: "A note from Fully Open",
    theme: "general-checkin",
    category: "nurture",
    priority: 4,
    minRepeatDays: 60,
    eligibilityDescription:
      "A non-deficiency check-in for contactable artists without a more relevant eligible campaign, after 60 days without ordinary engagement contact.",
    enabled: true,
    isEvent: false,
  },
  "press-01": {
    alias: "press-01",
    subject: "Got something people have said about you?",
    theme: "press",
    category: "nurture",
    priority: 5,
    minRepeatDays: 90,
    eligibilityDescription: "No press/features listed.",
    enabled: true,
    isEvent: false,
  },
  "return-01": {
    alias: "return-01",
    subject: "Come back in — there's more to see",
    theme: "return",
    category: "nurture",
    priority: 2,
    minRepeatDays: 90,
    eligibilityDescription:
      "No reliable historic login baseline; currently not eligible.",
    enabled: false,
    isEvent: false,
  },
  "return-02": {
    alias: "return-02",
    subject: "Come see what's happening",
    theme: "return",
    category: "nurture",
    priority: 2,
    minRepeatDays: 90,
    eligibilityDescription: "Last successful login 30–89 days ago.",
    enabled: true,
    isEvent: false,
  },
  "return-03": {
    alias: "return-03",
    subject: "Look what's been happening",
    theme: "return",
    category: "nurture",
    priority: 2,
    minRepeatDays: 120,
    eligibilityDescription: "Last successful login at least 90 days ago.",
    enabled: true,
    isEvent: false,
  },
  "fresh-01": {
    alias: "fresh-01",
    subject: "What are you making at the moment?",
    theme: "fresh-work",
    category: "nurture",
    priority: 3,
    minRepeatDays: 60,
    eligibilityDescription: "No content added or updated in 45 days.",
    enabled: true,
    isEvent: false,
  },
  "firsttrack-01": {
    alias: "firsttrack-01",
    subject: "You're in",
    theme: "first-track",
    category: "nurture",
    priority: 1,
    minRepeatDays: 36500,
    eligibilityDescription:
      "Exactly one track, uploaded in the last three days.",
    enabled: true,
    isEvent: false,
  },
  "active-01": {
    alias: "active-01",
    subject: "Now look what else you can do",
    theme: "next-features",
    category: "nurture",
    priority: 3,
    minRepeatDays: 90,
    eligibilityDescription: "At least three tracks added in the last 30 days.",
    enabled: true,
    isEvent: false,
  },
  "listen-01": {
    alias: "listen-01",
    subject: "People are listening",
    theme: "listener-traction",
    category: "positive",
    priority: 2,
    minRepeatDays: 30,
    eligibilityDescription:
      "At least 100 recorded plays; disabled until reliable play telemetry exists.",
    enabled: false,
    isEvent: false,
  },
  "tracklisten-01": {
    alias: "tracklisten-01",
    subject: "This one's getting heard",
    theme: "track-traction",
    category: "positive",
    priority: 2,
    minRepeatDays: 30,
    eligibilityDescription:
      "At least 25 plays on a track; disabled until reliable play telemetry exists.",
    enabled: false,
    isEvent: false,
  },
  "invite-01": {
    alias: "invite-01",
    subject: "Know someone making great music?",
    theme: "invite",
    category: "nurture",
    priority: 4,
    minRepeatDays: 180,
    eligibilityDescription:
      "At least three tracks and account older than 30 days.",
    enabled: true,
    isEvent: false,
  },
  "share-01": {
    alias: "share-01",
    subject: "Your Fully Open page is made to be shared",
    theme: "share",
    category: "nurture",
    priority: 3,
    minRepeatDays: 30,
    eligibilityDescription: "Has music and at least one useful page detail.",
    enabled: true,
    isEvent: false,
  },
  "disc-01": {
    alias: "disc-01",
    subject: "Put your music in the room",
    theme: "discovery",
    category: "nurture",
    priority: 2,
    minRepeatDays: 90,
    eligibilityDescription: "Has at least one track.",
    enabled: true,
    isEvent: false,
  },
  "radio-edu-01": {
    alias: "radio-edu-01",
    subject: "How music gets on Fully Open Radio",
    theme: "radio-education",
    category: "nurture",
    priority: 3,
    minRepeatDays: 120,
    eligibilityDescription: "Has at least one track.",
    enabled: true,
    isEvent: false,
  },
  "feature-01": {
    alias: "feature-01",
    subject: "We just built this",
    theme: "feature-launch",
    category: "nurture",
    priority: 4,
    minRepeatDays: 90,
    eligibilityDescription: "Matches an active Fully Open feature opportunity.",
    enabled: true,
    isEvent: false,
  },
  "vinyl-opp-01": {
    alias: "vinyl-opp-01",
    subject: "We're putting together the next Fully Open vinyl",
    theme: "vinyl-opportunity",
    category: "positive",
    priority: 0,
    minRepeatDays: 36500,
    eligibilityDescription:
      "Matches a real, active vinyl opportunity requiring artist contact.",
    enabled: true,
    isEvent: true,
  },
  "radio-new-01": {
    alias: "radio-new-01",
    subject: "Something new is playing",
    theme: "radio-news",
    category: "nurture",
    priority: 3,
    minRepeatDays: 90,
    eligibilityDescription: "Matches an active Fully Open Radio announcement.",
    enabled: true,
    isEvent: false,
  },
  "whatson-01": {
    alias: "whatson-01",
    subject: "What's happening at Fully Open",
    theme: "fully-open-roundup",
    category: "nurture",
    priority: 4,
    minRepeatDays: 90,
    eligibilityDescription: "Matches an active Fully Open event or roundup.",
    enabled: true,
    isEvent: false,
  },
  "radio-selected-01": {
    alias: "radio-selected-01",
    subject: "Your music has been selected for Fully Open Radio",
    theme: "radio-selection",
    category: "positive",
    priority: 0,
    minRepeatDays: 36500,
    eligibilityDescription: "New genuine Radio selection event.",
    enabled: true,
    isEvent: true,
  },
  "feature-selected-01": {
    alias: "feature-selected-01",
    subject: "We've chosen your music for a Fully Open feature",
    theme: "feature-selection",
    category: "positive",
    priority: 0,
    minRepeatDays: 36500,
    eligibilityDescription: "New genuine Featured Artist selection event.",
    enabled: true,
    isEvent: true,
  },
};

const MEANINGFUL_EVENTS = [
  "artist.profile.updated",
  "artist.profile.claimed",
  "artist.song.created",
  "artist.song.updated",
  "artist.song.deleted",
  "artist.album.created",
  "artist.album.updated",
  "artist.release.created",
  "artist.release.updated",
  "artist.release.deleted",
  "artist.gig.created",
  "artist.video.created",
  "artist.photo.created",
  "artist.photo.deleted",
  "artist.video.deleted",
  "artist.press.created",
  "artist.track_version.created",
  "artist.track_version.deleted",
  "artist.media.uploaded",
  "artist.master_audio.uploaded",
];
const DAY = 86_400_000;
const DEFAULT_COOLDOWN_DAYS = 7;
const ACTIVITY_COOLDOWN_DAYS = 10;
const OPPORTUNITY_EMAILS = new Set([
  "feature-01",
  "vinyl-opp-01",
  "radio-new-01",
  "whatson-01",
]);

export type EngagementState = {
  artistId: number;
  userId: number;
  name: string;
  slug: string;
  email: string;
  active: boolean;
  createdAt: string;
  bioPresent: boolean;
  profileImagePresent: boolean;
  genrePresent: boolean;
  genres: string[];
  locationPresent: boolean;
  location: string;
  socialLinkCount: number;
  trackCount: number;
  recentTrackCount: number;
  albumCount: number;
  releaseCount: number;
  futureGigCount: number;
  pastGigCount: number;
  videoCount: number;
  photoCount: number;
  pressCount: number;
  versionCount: number;
  lastTrackUpload: string | null;
  lastVersion: string | null;
  lastContentAddition: string | null;
  lastLogin: string | null;
  lastMeaningfulActivity: string | null;
  totalTrackPlays: number;
  highestTrackPlayCount: number;
  topTrackTitle: string | null;
};
export type State = EngagementState;

type HistoryItem = {
  id: number;
  emailId: string;
  category: string;
  theme: string;
  sentAt: string | null;
  triggerReason: string;
  stateSnapshot: Record<string, unknown>;
  sendStatus: string;
  deliveryStatus: string;
  postmarkMessageId: string | null;
  error: string | null;
  triggerKey: string | null;
  templateAlias?: string | null;
};

export type Candidate = {
  emailId: string;
  alias: string;
  subject: string;
  theme: string;
  category: "nurture" | "positive";
  priority: number;
  triggerReason: string;
  triggerKey: string | null;
  opportunityId: number | null;
  opportunityTitle?: string | null;
};

type Opportunity = {
  id: number;
  emailId: string;
  title: string;
  description: string;
  category: string;
  audience: Record<string, unknown> | null;
  startsAt: string;
  endsAt: string;
};

export type CandidateCheck = {
  emailId: string;
  eligible: boolean;
  reason: string;
  priority: number;
  theme: string;
};

function daysSince(value: string | null, now: Date) {
  if (!value) return null;
  const date = Date.parse(value);
  return Number.isFinite(date)
    ? Math.floor((now.getTime() - date) / DAY)
    : null;
}

function asBool(value: unknown) {
  return value === true || value === 1 || value === "1";
}
function asCount(value: unknown) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}
function parseJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function loadStates(env: Env, artistId?: number): Promise<State[]> {
  const now = new Date().toISOString();
  const recent = new Date(Date.now() - 30 * DAY).toISOString();
  const eventList = MEANINGFUL_EVENTS.map((event) => `'${event}'`).join(",");
  const query = `WITH
    song_stats AS (SELECT artist_id, COUNT(*) AS track_count, SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS recent_track_count, MAX(created_at) AS last_track_upload, MAX(updated_at) AS last_track_update, SUM(play_count) AS total_plays, MAX(play_count) AS highest_track_plays FROM songs GROUP BY artist_id),
    album_stats AS (SELECT artist_id, COUNT(*) AS album_count, MAX(created_at) AS last_album_add FROM albums GROUP BY artist_id),
    release_stats AS (SELECT artist_id, COUNT(*) AS release_count, MAX(created_at) AS last_release_add FROM releases GROUP BY artist_id),
    gig_stats AS (SELECT artist_id, SUM(CASE WHEN date(event_date) >= date(?) THEN 1 ELSE 0 END) AS future_gigs, SUM(CASE WHEN date(event_date) < date(?) THEN 1 ELSE 0 END) AS past_gigs, MAX(created_at) AS last_gig_add FROM gigs GROUP BY artist_id),
    video_stats AS (SELECT artist_id, COUNT(*) AS video_count, MAX(created_at) AS last_video_add FROM videos GROUP BY artist_id),
    photo_stats AS (SELECT artist_id, COUNT(*) AS photo_count, MAX(created_at) AS last_photo_add FROM photos GROUP BY artist_id),
    press_stats AS (SELECT artist_id, COUNT(*) AS press_count, MAX(created_at) AS last_press_add FROM press_items GROUP BY artist_id),
    version_stats AS (SELECT s.artist_id, COUNT(*) AS version_count, MAX(v.created_at) AS last_version FROM track_versions v JOIN songs s ON s.id = v.song_id GROUP BY s.artist_id),
    logins AS (SELECT user_id, MAX(created_at) AS last_login FROM flow_events WHERE event_type='auth.login.succeeded' GROUP BY user_id),
    meaningful AS (SELECT activity.artist_id,MAX(activity.at) AS last_meaningful FROM (
      SELECT artist_id,created_at AS at FROM flow_events WHERE event_type IN (${eventList}) AND artist_id IS NOT NULL
      UNION ALL SELECT a.id AS artist_id,l.last_login AS at FROM artists a JOIN logins l ON l.user_id=a.user_id
    ) activity GROUP BY activity.artist_id)
    SELECT a.id AS artistId, u.id AS userId, a.name AS name, a.slug AS slug, u.email AS email, u.active AS active, u.created_at AS createdAt,
      CASE WHEN length(trim(coalesce(a.bio,''))) > 0 AND a.bio <> 'New artist profile coming soon.' THEN 1 ELSE 0 END AS bioPresent,
      CASE WHEN length(trim(coalesce(a.profile_image,''))) > 0 THEN 1 ELSE 0 END AS profileImagePresent,
      CASE WHEN length(trim(coalesce(a.genres,''))) > 2 THEN 1 ELSE 0 END AS genrePresent,
      CASE WHEN length(trim(coalesce(a.location,''))) > 0 THEN 1 ELSE 0 END AS locationPresent,
      a.genres AS genres, a.location AS location,
      a.social_links AS socialLinks,
      coalesce(ss.track_count,0) AS trackCount, coalesce(ss.recent_track_count,0) AS recentTrackCount, coalesce(al.album_count,0) AS albumCount, coalesce(rs.release_count,0) AS releaseCount,
      coalesce(gs.future_gigs,0) AS futureGigCount, coalesce(gs.past_gigs,0) AS pastGigCount, coalesce(vs.video_count,0) AS videoCount,
      coalesce(ps.photo_count,0) AS photoCount, coalesce(pr.press_count,0) AS pressCount, coalesce(vrs.version_count,0) AS versionCount,
      ss.last_track_upload AS lastTrackUpload, vrs.last_version AS lastVersion,
      (SELECT MAX(value) FROM (SELECT ss.last_track_upload AS value UNION ALL SELECT al.last_album_add UNION ALL SELECT rs.last_release_add UNION ALL SELECT gs.last_gig_add UNION ALL SELECT vs.last_video_add UNION ALL SELECT ps.last_photo_add UNION ALL SELECT pr.last_press_add UNION ALL SELECT vrs.last_version)) AS lastContentAddition,
      lg.last_login AS lastLogin, me.last_meaningful AS lastMeaningfulActivity,
      coalesce(ss.total_plays,0) AS totalTrackPlays, coalesce(ss.highest_track_plays,0) AS highestTrackPlayCount,
      (SELECT title FROM songs WHERE artist_id=a.id ORDER BY play_count DESC, id DESC LIMIT 1) AS topTrackTitle
    FROM artists a JOIN users u ON u.id=a.user_id
    LEFT JOIN song_stats ss ON ss.artist_id=a.id LEFT JOIN album_stats al ON al.artist_id=a.id LEFT JOIN release_stats rs ON rs.artist_id=a.id LEFT JOIN gig_stats gs ON gs.artist_id=a.id
    LEFT JOIN video_stats vs ON vs.artist_id=a.id LEFT JOIN photo_stats ps ON ps.artist_id=a.id LEFT JOIN press_stats pr ON pr.artist_id=a.id
    LEFT JOIN version_stats vrs ON vrs.artist_id=a.id LEFT JOIN meaningful me ON me.artist_id=a.id LEFT JOIN logins lg ON lg.user_id=u.id
    WHERE u.account_type='artist' ${artistId === undefined ? "" : "AND a.id=?"}`;
  const result = await env.DB.prepare(query)
    .bind(
      ...(artistId === undefined
        ? [recent, now, now]
        : [recent, now, now, artistId]),
    )
    .all<Record<string, unknown>>();
  return (result.results ?? []).map((row) => mapStateRow(row));
}

function mapStateRow(row: Record<string, unknown>): State {
  const socialLinks = parseJson(row.socialLinks);
  const genres = parseJson(row.genres);
  const socialLinkCount =
    socialLinks && typeof socialLinks === "object"
      ? Object.values(socialLinks as Record<string, unknown>).filter(
          (value) => typeof value === "string" && value.trim(),
        ).length
      : 0;
  return {
    artistId: asCount(row.artistId),
    userId: asCount(row.userId),
    name: String(row.name ?? "Artist"),
    slug: String(row.slug ?? ""),
    email: String(row.email ?? ""),
    active: asBool(row.active),
    createdAt: String(row.createdAt ?? ""),
    bioPresent: asBool(row.bioPresent),
    profileImagePresent: asBool(row.profileImagePresent),
    genrePresent: asBool(row.genrePresent),
    genres: Array.isArray(genres)
      ? genres.filter((value): value is string => typeof value === "string")
      : [],
    locationPresent: asBool(row.locationPresent),
    location: String(row.location ?? ""),
    socialLinkCount,
    trackCount: asCount(row.trackCount),
    recentTrackCount: asCount(row.recentTrackCount),
    albumCount: asCount(row.albumCount),
    releaseCount: asCount(row.releaseCount),
    futureGigCount: asCount(row.futureGigCount),
    pastGigCount: asCount(row.pastGigCount),
    videoCount: asCount(row.videoCount),
    photoCount: asCount(row.photoCount),
    pressCount: asCount(row.pressCount),
    versionCount: asCount(row.versionCount),
    lastTrackUpload:
      typeof row.lastTrackUpload === "string" ? row.lastTrackUpload : null,
    lastVersion: typeof row.lastVersion === "string" ? row.lastVersion : null,
    lastContentAddition:
      typeof row.lastContentAddition === "string"
        ? row.lastContentAddition
        : null,
    lastLogin: typeof row.lastLogin === "string" ? row.lastLogin : null,
    lastMeaningfulActivity:
      typeof row.lastMeaningfulActivity === "string"
        ? row.lastMeaningfulActivity
        : null,
    totalTrackPlays: asCount(row.totalTrackPlays),
    highestTrackPlayCount: asCount(row.highestTrackPlayCount),
    topTrackTitle:
      typeof row.topTrackTitle === "string" ? row.topTrackTitle : null,
  };
}
async function loadState(env: Env, artistId: number): Promise<State | null> {
  return (await loadStates(env, artistId))[0] ?? null;
}
export async function loadArtistEngagementState(env: Env, artistId: number) {
  return loadState(env, artistId);
}

async function loadHistory(env: Env, artistId: number): Promise<HistoryItem[]> {
  const db = getDb(env);
  const [rows, welcomeRows] = await Promise.all([
    db
      .select()
      .from(artistEngagementEmailHistory)
      .where(eq(artistEngagementEmailHistory.artistId, artistId))
      .orderBy(
        desc(artistEngagementEmailHistory.sentAt),
        desc(artistEngagementEmailHistory.id),
      )
      .limit(100),
    db
      .select({
        id: accountEmailNotifications.id,
        sentAt: accountEmailNotifications.sentAt,
        deliveryStatus: accountEmailNotifications.deliveryStatus,
        postmarkMessageId: accountEmailNotifications.postmarkMessageId,
      })
      .from(accountEmailNotifications)
      .innerJoin(users, eq(accountEmailNotifications.userId, users.id))
      .innerJoin(artists, eq(artists.userId, users.id))
      .where(
        and(
          eq(accountEmailNotifications.notificationType, "artist_getting_started"),
          eq(accountEmailNotifications.status, "sent"),
          isNotNull(accountEmailNotifications.sentAt),
          eq(artists.id, artistId),
        ),
      ),
  ]);
  const welcomeHistory: HistoryItem[] = welcomeRows.flatMap((row) =>
    row.sentAt
      ? [
          {
            id: -row.id,
            emailId: "artist-getting-started",
            category: "nurture",
            theme: "artist-welcome",
            sentAt: row.sentAt,
            triggerReason: "Existing artist getting-started email.",
            stateSnapshot: {},
            sendStatus: "sent",
            deliveryStatus: row.deliveryStatus,
            postmarkMessageId: row.postmarkMessageId,
            error: null,
            triggerKey: null,
          },
        ]
      : [],
  );
  return [...(rows as HistoryItem[]), ...welcomeHistory].sort(
    (a, b) => (b.sentAt ?? "").localeCompare(a.sentAt ?? ""),
  );
}

async function loadOpportunities(env: Env, now: Date): Promise<Opportunity[]> {
  const rows = await getDb(env)
    .select()
    .from(artistEngagementOpportunities)
    .where(
      and(
        eq(artistEngagementOpportunities.active, true),
        lt(
          artistEngagementOpportunities.startsAt,
          new Date(now.getTime() + 1).toISOString(),
        ),
        gte(artistEngagementOpportunities.endsAt, now.toISOString()),
      ),
    );
  return rows.map((row) => ({
    ...row,
    audience:
      row.audience && typeof row.audience === "object" ? row.audience : null,
  }));
}

function audienceMatches(
  audience: Record<string, unknown> | null,
  state: State,
) {
  if (!audience) return true;
  const checks: Array<[string, number]> = [
    ["minTracks", state.trackCount],
    ["minAlbums", state.albumCount + state.releaseCount],
    ["minVideos", state.videoCount],
  ];
  for (const [key, value] of checks)
    if (Number.isFinite(Number(audience[key])) && value < Number(audience[key]))
      return false;
  for (const [key, value] of [
    ["maxTracks", state.trackCount],
    ["maxAlbums", state.albumCount + state.releaseCount],
  ] as Array<[string, number]>) {
    if (Number.isFinite(Number(audience[key])) && value > Number(audience[key]))
      return false;
  }
  if (audience.requireBio === true && !state.bioPresent) return false;
  if (audience.requireProfileImage === true && !state.profileImagePresent)
    return false;
  if (audience.requireGenre === true && !state.genrePresent) return false;
  if (audience.requireLocation === true && !state.locationPresent) return false;
  if (Array.isArray(audience.genres) && audience.genres.length) {
    const genres = new Set(
      state.genres.map((genre) => genre.toLocaleLowerCase()),
    );
    if (
      !audience.genres.some(
        (genre) =>
          typeof genre === "string" && genres.has(genre.toLocaleLowerCase()),
      )
    )
      return false;
  }
  if (Array.isArray(audience.locations) && audience.locations.length) {
    const location = state.location.toLocaleLowerCase();
    if (
      !audience.locations.some(
        (value) =>
          typeof value === "string" &&
          location.includes(value.toLocaleLowerCase()),
      )
    )
      return false;
  }
  return true;
}

function snapshot(state: State) {
  return {
    bioPresent: state.bioPresent,
    profileImagePresent: state.profileImagePresent,
    genrePresent: state.genrePresent,
    genres: state.genres,
    locationPresent: state.locationPresent,
    location: state.location,
    socialLinkCount: state.socialLinkCount,
    trackCount: state.trackCount,
    recentTrackCount: state.recentTrackCount,
    albumCount: state.albumCount,
    releaseCount: state.releaseCount,
    futureGigCount: state.futureGigCount,
    pastGigCount: state.pastGigCount,
    videoCount: state.videoCount,
    photoCount: state.photoCount,
    pressCount: state.pressCount,
    versionCount: state.versionCount,
    lastTrackUpload: state.lastTrackUpload,
    lastVersion: state.lastVersion,
    lastContentAddition: state.lastContentAddition,
    lastLogin: state.lastLogin,
    lastMeaningfulActivity: state.lastMeaningfulActivity,
    totalTrackPlays: state.totalTrackPlays,
    highestTrackPlayCount: state.highestTrackPlayCount,
  };
}

function baseEligibility(
  emailId: string,
  state: State,
  now: Date,
): string | null {
  const daysSinceJoin = daysSince(state.createdAt, now) ?? 0;
  const daysSinceTrack = daysSince(state.lastTrackUpload, now);
  const daysSinceVersion = daysSince(state.lastVersion, now);
  switch (emailId) {
    case "music-01":
      return state.trackCount === 0
        ? null
        : "Artist already has at least one track.";
    case "music-02":
      return state.trackCount >= 1 && state.trackCount <= 2
        ? null
        : "Requires 1–2 tracks.";
    case "catalogue-01":
      return state.trackCount >= 3 && state.trackCount <= 9
        ? null
        : "Requires 3–9 tracks.";
    case "bio-01":
      return !state.bioPresent ? null : "Bio is already present.";
    case "image-01":
      return !state.profileImagePresent
        ? null
        : "Profile image is already present.";
    case "release-01":
      return state.trackCount > 0 && state.albumCount + state.releaseCount === 0
        ? null
        : "Requires tracks and no release/album.";
    case "version-01":
      return state.trackCount > 0 && state.versionCount === 0
        ? null
        : "Requires tracks with no versions yet.";
    case "version-02":
      return state.trackCount > 0 &&
        state.versionCount > 0 &&
        (daysSinceVersion === null || daysSinceVersion >= 45)
        ? null
        : "Requires tracks and no version added in the last 45 days.";
    case "gig-01":
      return state.futureGigCount === 0
        ? null
        : "A future gig is already listed.";
    case "gig-02":
      return state.pastGigCount > 0 && state.futureGigCount === 0
        ? null
        : "Requires past gigs and no future gig.";
    case "video-01":
      return state.videoCount === 0 ? null : "A video is already present.";
    case "photo-01":
      return state.photoCount === 0
        ? null
        : "Gallery photos are already present.";
    case "social-01":
      return state.socialLinkCount <= 1
        ? null
        : "Social/music links are not sparse.";
    case "press-01":
      return state.pressCount === 0
        ? null
        : "Press/features are already present.";
    case "return-01":
      return "Successful-login history is incomplete for legacy accounts; no-login status cannot be established reliably.";
    case "return-02": {
      const d = daysSince(state.lastLogin, now);
      return d !== null && d >= 30 && d < 90
        ? null
        : "Requires last successful login 30–89 days ago.";
    }
    case "return-03": {
      const d = daysSince(state.lastLogin, now);
      return d !== null && d >= 90
        ? null
        : "Requires last successful login at least 90 days ago.";
    }
    case "fresh-01":
      return (daysSince(state.lastContentAddition, now) ??
        daysSince(state.createdAt, now) ??
        0) >= 45
        ? null
        : "Content was added in the last 45 days.";
    case "firsttrack-01":
      return state.trackCount === 1 &&
        daysSinceTrack !== null &&
        daysSinceTrack <= 3
        ? null
        : "Requires a first track uploaded within the last 3 days.";
    case "active-01":
      return state.recentTrackCount >= 3
        ? null
        : "Requires at least 3 tracks added in the last 30 days.";
    // songs.play_count is not updated by the application today, so it is not
    // trustworthy enough to trigger a positive listening claim.
    case "listen-01":
    case "tracklisten-01":
      return "Reliable track-listening telemetry is not currently recorded.";
    case "invite-01":
      return state.trackCount >= 3 && daysSinceJoin >= 30
        ? null
        : "Requires 3+ tracks and an artist account at least 30 days old.";
    case "share-01":
      return state.trackCount > 0 &&
        (state.bioPresent ||
          state.profileImagePresent ||
          state.socialLinkCount > 0)
        ? null
        : "Requires music and at least one useful page detail.";
    case "checkin-01":
      return null;
    case "disc-01":
      return state.trackCount > 0 ? null : "Requires at least one track.";
    case "radio-edu-01":
      return state.trackCount > 0 ? null : "Requires at least one track.";
    case "feature-01":
    case "vinyl-opp-01":
    case "radio-new-01":
    case "whatson-01":
      return "No active matching Fully Open opportunity is configured.";
    case "radio-selected-01":
    case "feature-selected-01":
      return "No new matching selection event is recorded.";
    default:
      return "Unknown email ID.";
  }
}

async function loadSpecialTriggers(env: Env, state: State, now: Date) {
  const [opportunityRows, selectionRows] = await Promise.all([
    loadOpportunities(env, now),
    env.DB.prepare(
      `SELECT id, event_type AS eventType, created_at AS createdAt FROM flow_events WHERE artist_id=? AND event_type IN ('artist.radio_selection.created','artist.feature_selection.created') AND created_at>=? ORDER BY id DESC LIMIT 20`,
    )
      .bind(state.artistId, new Date(now.getTime() - 14 * DAY).toISOString())
      .all<{ id: number; eventType: string; createdAt: string }>(),
  ]);
  const opportunities = opportunityRows.filter((row) =>
    audienceMatches(row.audience, state),
  );
  return { opportunities, selectionEvents: selectionRows.results ?? [] };
}

export async function loadEngagementCampaignDefinitions(
  env: Env,
): Promise<Record<string, EngagementEmailDefinition>> {
  const rows = await env.DB.prepare(
    "SELECT campaign_id AS campaignId,name,template_alias AS alias,subject,priority,category,theme,eligibility_description AS eligibilityDescription,min_repeat_days AS minRepeatDays,enabled,is_event AS isEvent FROM artist_engagement_campaigns",
  ).all<Record<string, unknown>>();
  const definitions: Record<string, EngagementEmailDefinition> = {};
  for (const row of rows.results ?? []) {
    const fallback = ENGAGEMENT_EMAILS[String(row.campaignId)];
    if (!fallback) continue;
    const priority = Number(row.priority);
    if (!Number.isInteger(priority) || priority < 0 || priority > 5) continue;
    definitions[String(row.campaignId)] = {
      ...fallback,
      alias: String(row.alias),
      subject: String(row.subject),
      theme: String(row.theme),
      category: String(row.category) === "positive" ? "positive" : "nurture",
      priority: priority as EngagementEmailDefinition["priority"],
      minRepeatDays: Math.max(
        0,
        Number(row.minRepeatDays) || fallback.minRepeatDays,
      ),
      eligibilityDescription: String(
        row.eligibilityDescription ?? fallback.eligibilityDescription,
      ),
      enabled: row.enabled === 1 || row.enabled === true,
      isEvent: row.isEvent === 1 || row.isEvent === true,
    };
  }
  return definitions;
}

function eligibilityChecks(
  state: State,
  history: HistoryItem[],
  prefs: typeof artistEngagementPreferences.$inferSelect | undefined,
  special: Awaited<ReturnType<typeof loadSpecialTriggers>>,
  now: Date,
  definitions = ENGAGEMENT_EMAILS,
  onlyCampaignIds?: Set<string>,
) {
  const sentHistory = history.filter(
    (item) =>
      item.sendStatus === "sent" && item.category !== "test" && item.sentAt,
  );
  const lastSent = sentHistory[0] ?? null;
  const lastNurture =
    sentHistory.find((item) => item.category === "nurture") ?? null;
  const lastNurtureDays = daysSince(lastNurture?.sentAt ?? null, now);
  const lastMeaningfulDays = daysSince(state.lastMeaningfulActivity, now);
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
  const globalSuppression = !state.active
    ? "Artist account is inactive."
    : !emailLooksValid
      ? "Artist email address is missing or invalid."
      : prefs?.nurtureUnsubscribedAt
        ? "Artist opted out of engagement email."
        : prefs?.emailSuppressedAt
          ? `Email suppressed: ${prefs.emailSuppressedReason ?? "delivery issue"}.`
          : null;
  const candidates: Candidate[] = [];
  const checks: CandidateCheck[] = [];
  const add = (candidate: Candidate, already: string | null) => {
    const def = ENGAGEMENT_EMAILS[candidate.emailId];
    let reason = globalSuppression ?? already;
    if (
      !reason &&
      candidate.category === "nurture" &&
      lastNurtureDays !== null &&
      lastNurtureDays < DEFAULT_COOLDOWN_DAYS
    )
      reason = `Nurture cooldown: last nurture email was ${lastNurtureDays} day(s) ago; wait ${DEFAULT_COOLDOWN_DAYS} days.`;
    if (
      !reason &&
      candidate.category === "nurture" &&
      lastMeaningfulDays !== null &&
      lastMeaningfulDays < ACTIVITY_COOLDOWN_DAYS
    )
      reason = `Meaningful artist activity ${lastMeaningfulDays} day(s) ago; wait ${ACTIVITY_COOLDOWN_DAYS} days after activity.`;
    if (
      !reason &&
      candidate.category === "nurture" &&
      lastSent?.theme === candidate.theme
    )
      reason = `Same theme as the previous email (${candidate.theme}).`;
    const previous = sentHistory.find(
      (item) => item.emailId === candidate.emailId,
    );
    const repeatDays = def.minRepeatDays;
    const age = daysSince(previous?.sentAt ?? null, now);
    if (
      !reason &&
      candidate.category === "nurture" &&
      age !== null &&
      age < repeatDays
    )
      reason = `Same email sent ${age} day(s) ago; repeat interval is ${repeatDays} days.`;
    if (
      !reason &&
      candidate.triggerKey &&
      history.some(
        (item) =>
          item.triggerKey === candidate.triggerKey &&
          item.sendStatus !== "failed",
      )
    )
      reason =
        "This specific event/opportunity already has a contact-history record.";
    if (reason)
      checks.push({
        emailId: candidate.emailId,
        eligible: false,
        reason,
        priority: candidate.priority,
        theme: candidate.theme,
      });
    else {
      candidates.push(candidate);
      checks.push({
        emailId: candidate.emailId,
        eligible: true,
        reason: candidate.triggerReason,
        priority: candidate.priority,
        theme: candidate.theme,
      });
    }
  };

  for (const [emailId, def] of Object.entries(definitions)) {
    if (onlyCampaignIds && !onlyCampaignIds.has(emailId)) continue;
    if (!def.enabled) {
      checks.push({
        emailId,
        eligible: false,
        reason: "Campaign is disabled.",
        priority: def.priority,
        theme: def.theme,
      });
      continue;
    }
    // The safety-net is evaluated only after all specific campaigns so it can
    // never outrank a currently useful state/event message merely by object order.
    if (emailId === "checkin-01") continue;
    if (OPPORTUNITY_EMAILS.has(emailId)) {
      const matches = special.opportunities.filter(
        (opportunity) => opportunity.emailId === emailId,
      );
      if (!matches.length) {
        checks.push({
          emailId,
          eligible: false,
          reason:
            baseEligibility(emailId, state, now) ??
            "No active matching Fully Open opportunity is configured.",
          priority: def.priority,
          theme: def.theme,
        });
        continue;
      }
      for (const opportunity of matches)
        add(
          {
            emailId,
            alias: def.alias,
            subject: def.subject,
            theme: def.theme,
            category:
              def.isEvent || opportunity.category === "positive"
                ? "positive"
                : "nurture",
            priority: def.priority,
            triggerReason: opportunity.description,
            triggerKey: `opportunity:${opportunity.id}`,
            opportunityId: opportunity.id,
            opportunityTitle: opportunity.title,
          },
          null,
        );
      continue;
    }
    if (emailId === "radio-selected-01" || emailId === "feature-selected-01") {
      const eventType =
        emailId === "radio-selected-01"
          ? "artist.radio_selection.created"
          : "artist.feature_selection.created";
      const matches = special.selectionEvents.filter(
        (item) => item.eventType === eventType,
      );
      if (!matches.length) {
        checks.push({
          emailId,
          eligible: false,
          reason: "No new matching selection event is recorded.",
          priority: def.priority,
          theme: def.theme,
        });
        continue;
      }
      for (const event of matches)
        add(
          {
            emailId,
            alias: def.alias,
            subject: def.subject,
            theme: def.theme,
            category: "positive",
            priority: def.priority,
            triggerReason:
              eventType === "artist.radio_selection.created"
                ? "A track was newly approved for Fully Open Radio."
                : "An artist was newly selected for an editorial feature.",
            triggerKey: `${eventType}:${event.id}`,
            opportunityId: null,
          },
          null,
        );
      continue;
    }
    const trigger = baseEligibility(emailId, state, now);
    if (trigger !== null && trigger !== "") {
      checks.push({
        emailId,
        eligible: false,
        reason: trigger,
        priority: def.priority,
        theme: def.theme,
      });
      continue;
    }
    const category = def.category;
    add(
      {
        emailId,
        alias: def.alias,
        subject: def.subject,
        theme: def.theme,
        category,
        priority: def.priority,
        triggerReason: trigger || `Current artist state matches ${emailId}.`,
        triggerKey:
          emailId === "firsttrack-01"
            ? `firsttrack:${state.artistId}:${state.lastTrackUpload}`
            : null,
        opportunityId: null,
      },
      null,
    );
  }

  const checkin = definitions["checkin-01"];
  if ((!onlyCampaignIds || onlyCampaignIds.has("checkin-01")) && checkin) {
    const contactAge = daysSince(lastNurture?.sentAt ?? state.createdAt, now);
    let reason: string | null = !checkin.enabled
      ? "Campaign is disabled."
      : globalSuppression;
    if (!reason && contactAge !== null && contactAge < checkin.minRepeatDays)
      reason = `CHECKIN fallback waits ${checkin.minRepeatDays} days since the last ordinary contact (or account creation).`;
    if (
      !reason &&
      lastMeaningfulDays !== null &&
      lastMeaningfulDays < ACTIVITY_COOLDOWN_DAYS
    )
      reason = `Meaningful artist activity ${lastMeaningfulDays} day(s) ago; wait ${ACTIVITY_COOLDOWN_DAYS} days before any nurture message.`;
    const otherEligible = onlyCampaignIds
      ? eligibilityChecks(
          state,
          history,
          prefs,
          special,
          now,
          definitions,
          new Set(
            Object.keys(definitions).filter(
              (emailId) => emailId !== "checkin-01",
            ),
          ),
        ).candidates
      : candidates;
    const betterCandidate = otherEligible.find(
      (candidate) =>
        candidate.emailId !== "checkin-01" &&
        candidate.priority <= checkin.priority,
    );
    if (!reason && betterCandidate)
      reason = `More relevant campaign ${betterCandidate.emailId} is currently eligible.`;
    const eligible = !reason;
    checks.push({
      emailId: "checkin-01",
      eligible,
      reason:
        reason ??
        "No higher-value specific campaign is currently eligible; stale-contact fallback applies.",
      priority: checkin.priority,
      theme: checkin.theme,
    });
    if (eligible) {
      const previousCheckins = history.filter(
        (item) => item.emailId === "checkin-01" && item.sendStatus === "sent",
      ).length;
      const alias = previousCheckins % 2 === 0 ? "checkin-01" : "checkin-02";
      candidates.push({
        emailId: "checkin-01",
        alias,
        subject: checkin.subject,
        theme: checkin.theme,
        category: "nurture",
        priority: checkin.priority,
        triggerReason:
          "Contactable artist has had no ordinary engagement contact for at least 60 days and no more relevant current campaign applies.",
        triggerKey: null,
        opportunityId: null,
      });
    }
  }

  if (globalSuppression) {
    for (const check of checks) {
      if (check.eligible) {
        check.eligible = false;
        check.reason = globalSuppression;
      }
    }
    candidates.length = 0;
  }
  return {
    candidates: candidates.sort((a, b) => a.priority - b.priority),
    checks,
    lastSent,
    lastNurture,
  };
}

export function previewEngagementState(
  state: EngagementState,
  history: HistoryItem[] = [],
  now = new Date(),
  prefs?: typeof artistEngagementPreferences.$inferSelect,
) {
  const evaluation = eligibilityChecks(
    state,
    history,
    prefs,
    { opportunities: [], selectionEvents: [] },
    now,
  );
  return {
    selected: evaluation.candidates[0] ?? null,
    checks: evaluation.checks.sort(
      (a, b) =>
        Number(b.eligible) - Number(a.eligible) || a.priority - b.priority,
    ),
  };
}

export type ArtistEngagementPreview = {
  artist: { id: number; name: string; slug: string; email: string };
  state: Record<string, unknown>;
  selected: Candidate | null;
  otherEligible: Candidate[];
  checks: CandidateCheck[];
  contactHistory: HistoryItem[];
  lastContact: string | null;
  lastEmailId: string | null;
  lastTheme: string | null;
  lastNurtureContact: string | null;
  evaluatedAt: string;
  sendingEnabled: boolean;
};

export async function dryRunArtistEngagement(
  env: Env,
  artistId: number,
  onlyCampaignIds?: string[],
  at = new Date(),
): Promise<ArtistEngagementPreview | { artistId: number; error: string }> {
  const now = at;
  const state = await loadState(env, artistId);
  if (!state) return { artistId, error: "Artist account not found." };
  const db = getDb(env);
  const [history, preferences] = await Promise.all([
    loadHistory(env, artistId),
    db
      .select()
      .from(artistEngagementPreferences)
      .where(eq(artistEngagementPreferences.artistId, artistId))
      .limit(1)
      .then((rows) => rows[0]),
  ]);
  const definitions = await loadEngagementCampaignDefinitions(env);
  const special = await loadSpecialTriggers(env, state, now);
  const evaluation = eligibilityChecks(
    state,
    history,
    preferences,
    special,
    now,
    definitions,
    onlyCampaignIds ? new Set(onlyCampaignIds) : undefined,
  );
  const lastContact = evaluation.lastSent?.sentAt ?? null;
  return {
    artist: {
      id: state.artistId,
      name: state.name,
      slug: state.slug,
      email: state.email,
    },
    state: snapshot(state),
    lastContact,
    lastEmailId: evaluation.lastSent?.emailId ?? null,
    lastTheme: evaluation.lastSent?.theme ?? null,
    lastNurtureContact: evaluation.lastNurture?.sentAt ?? null,
    selected: evaluation.candidates[0] ?? null,
    otherEligible: evaluation.candidates.slice(1),
    contactHistory: history,
    checks: evaluation.checks.sort(
      (a, b) =>
        Number(b.eligible) - Number(a.eligible) || a.priority - b.priority,
    ),
    evaluatedAt: now.toISOString(),
    sendingEnabled: env.ARTIST_ENGAGEMENT_ENABLED === "true",
  };
}

export async function evaluateCampaignSet(
  env: Env,
  artistId: number,
  campaignIds: string[],
  at = new Date(),
): Promise<
  | { error: string; artistId: number }
  | (ArtistEngagementPreview & { candidates: Candidate[] })
> {
  const preview = await dryRunArtistEngagement(env, artistId, campaignIds, at);
  if ("error" in preview) return preview;
  const candidates = [preview.selected, ...preview.otherEligible].filter(
    (candidate): candidate is Candidate => Boolean(candidate),
  );
  return { ...preview, candidates };
}

function audienceBucket(state: State) {
  if (state.trackCount === 0) return "no_music";
  const kinds = [
    state.albumCount + state.releaseCount > 0,
    state.bioPresent,
    state.profileImagePresent,
    state.genrePresent || state.locationPresent,
    state.socialLinkCount > 0,
    state.futureGigCount + state.pastGigCount > 0,
    state.videoCount > 0,
    state.photoCount > 0,
    state.pressCount > 0,
    state.versionCount > 0,
  ].filter(Boolean).length;
  if (state.trackCount >= 10 || kinds >= 7) return "established";
  if (state.trackCount >= 3 || kinds >= 4) return "engaged";
  return "early";
}

function activityBucket(state: State, now: Date) {
  const days = daysSince(state.lastMeaningfulActivity, now);
  if (days === null) return "activity_unknown";
  if (days < 30) return "active_30d";
  if (days < 90) return "inactive_30_89d";
  if (days < 180) return "inactive_90_179d";
  return "inactive_180d_plus";
}

/** A bulk-read, same-rules coverage audit for Admin and schedule health checks. */
export async function getArtistEngagementAudience(
  env: Env,
  at = new Date(),
  scheduleId?: number,
) {
  const [
    states,
    historyRows,
    welcomeRows,
    preferenceRows,
    definitions,
    opportunities,
    eventRows,
    schedules,
  ] = await Promise.all([
    loadStates(env),
    getDb(env)
      .select()
      .from(artistEngagementEmailHistory)
      .where(
        and(
          eq(artistEngagementEmailHistory.sendStatus, "sent"),
          ne(artistEngagementEmailHistory.category, "test"),
        ),
      )
      .orderBy(desc(artistEngagementEmailHistory.sentAt)),
    getDb(env)
      .select({
        id: accountEmailNotifications.id,
        artistId: artists.id,
        sentAt: accountEmailNotifications.sentAt,
        deliveryStatus: accountEmailNotifications.deliveryStatus,
        postmarkMessageId: accountEmailNotifications.postmarkMessageId,
      })
      .from(accountEmailNotifications)
      .innerJoin(users, eq(accountEmailNotifications.userId, users.id))
      .innerJoin(artists, eq(artists.userId, users.id))
      .where(
        and(
          eq(accountEmailNotifications.notificationType, "artist_getting_started"),
          eq(accountEmailNotifications.status, "sent"),
          isNotNull(accountEmailNotifications.sentAt),
        ),
      ),
    getDb(env).select().from(artistEngagementPreferences),
    loadEngagementCampaignDefinitions(env),
    loadOpportunities(env, at),
    env.DB.prepare(
      `SELECT id,artist_id AS artistId,event_type AS eventType,created_at AS createdAt FROM flow_events WHERE event_type IN ('artist.radio_selection.created','artist.feature_selection.created') AND created_at>=? ORDER BY id DESC`,
    )
      .bind(new Date(at.getTime() - 14 * DAY).toISOString())
      .all<{
        id: number;
        artistId: number | null;
        eventType: string;
        createdAt: string;
      }>(),
    env.DB.prepare(
      `SELECT id,name,status,current_revision AS currentRevision FROM artist_engagement_schedules`,
    ).all<{
      id: number;
      name: string;
      status: string;
      currentRevision: number;
    }>(),
  ]);
  const historiesByArtist = new Map<number, HistoryItem[]>();
  for (const row of historyRows) {
    const history = historiesByArtist.get(row.artistId) ?? [];
    history.push(row as unknown as HistoryItem);
    historiesByArtist.set(row.artistId, history);
  }
  for (const row of welcomeRows) {
    if (!row.sentAt) continue;
    const history = historiesByArtist.get(row.artistId) ?? [];
    history.push({
      id: -row.id,
      emailId: "artist-getting-started",
      category: "nurture",
      theme: "artist-welcome",
      sentAt: row.sentAt,
      triggerReason: "Existing artist getting-started email.",
      stateSnapshot: {},
      sendStatus: "sent",
      deliveryStatus: row.deliveryStatus,
      postmarkMessageId: row.postmarkMessageId,
      error: null,
      triggerKey: null,
    });
    historiesByArtist.set(row.artistId, history);
  }
  const preferences = new Map(preferenceRows.map((row) => [row.artistId, row]));
  const eventsByArtist = new Map<
    number,
    Array<{ id: number; eventType: string; createdAt: string }>
  >();
  for (const event of eventRows.results ?? [])
    if (event.artistId !== null) {
      const events = eventsByArtist.get(event.artistId) ?? [];
      events.push({
        id: event.id,
        eventType: event.eventType,
        createdAt: event.createdAt,
      });
      eventsByArtist.set(event.artistId, events);
    }
  const selectedSchedule =
    scheduleId === undefined
      ? null
      : (schedules.results?.find((schedule) => schedule.id === scheduleId) ??
        null);
  const selectedScheduleSlots = selectedSchedule
    ? await env.DB.prepare(
        `SELECT slots FROM artist_engagement_schedule_revisions WHERE schedule_id=? AND revision=?`,
      )
        .bind(scheduleId, selectedSchedule.currentRevision)
        .first<{ slots: string }>()
    : null;
  const scheduledIds = selectedScheduleSlots
    ? new Set(
        (
          (parseJson(selectedScheduleSlots.slots) as Array<{
            campaignId: string;
            enabled: boolean;
          }>) ?? []
        )
          .filter((slot) => slot.enabled)
          .map((slot) => slot.campaignId),
      )
    : null;
  const rows = states.map((state) => {
    const history = historiesByArtist.get(state.artistId) ?? [];
    const pref = preferences.get(state.artistId);
    const special = {
      opportunities: opportunities.filter((row) =>
        audienceMatches(row.audience, state),
      ),
      selectionEvents: eventsByArtist.get(state.artistId) ?? [],
    };
    const result = eligibilityChecks(
      state,
      history,
      pref,
      special,
      at,
      definitions,
    );
    const contactable =
      state.active &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email) &&
      !pref?.nurtureUnsubscribedAt &&
      !pref?.emailSuppressedAt;
    const specific = result.checks.filter(
      (check) => check.eligible && check.emailId !== "checkin-01",
    );
    const checkinEligible = result.checks.some(
      (check) => check.emailId === "checkin-01" && check.eligible,
    );
    const lastOrdinary = result.lastNurture?.sentAt ?? null;
    const daysSinceContact = daysSince(lastOrdinary, at);
    const wasEverContacted = history.some(
      (item) => item.category === "nurture" && item.sentAt,
    );
    const cadenceBlockedCampaigns = result.checks
      .filter(
        (check) =>
          !check.eligible &&
          /(cooldown|repeat interval|Same theme|Meaningful artist activity|fallback waits)/i.test(
            check.reason,
          ),
      )
      .map((check) => ({ emailId: check.emailId, reason: check.reason }));
    let coverageStatus: string;
    if (!contactable)
      coverageStatus =
        pref?.nurtureUnsubscribedAt || pref?.emailSuppressedAt
          ? "suppressed"
          : "not_contactable";
    else if (specific.length) coverageStatus = "campaign_covered";
    else if (checkinEligible) coverageStatus = "checkin_fallback";
    else if (cadenceBlockedCampaigns.length) coverageStatus = "cadence_blocked";
    else if (
      daysSinceContact === null &&
      daysSince(state.createdAt, at) !== null &&
      daysSince(state.createdAt, at)! < 60
    )
      coverageStatus = "checkin_pending";
    else coverageStatus = "orphaned";
    const scheduledSpecific = scheduledIds
      ? specific.filter((check) => scheduledIds.has(check.emailId))
      : specific;
    const scheduleCovered =
      scheduledSpecific.length > 0 ||
      (Boolean(scheduledIds?.has("checkin-01")) && checkinEligible);
    const lastContact =
      history.find((item) => item.category === "nurture" && item.sentAt)
        ?.sentAt ?? null;
    return {
      id: state.artistId,
      name: state.name,
      email: state.email,
      slug: state.slug,
      bucket: audienceBucket(state),
      activity: activityBucket(state, at),
      trackCount: state.trackCount,
      albumCount: state.albumCount,
      releaseCount: state.releaseCount,
      videoCount: state.videoCount,
      photoCount: state.photoCount,
      pressCount: state.pressCount,
      versionCount: state.versionCount,
      bioPresent: state.bioPresent,
      profileImagePresent: state.profileImagePresent,
      socialLinkCount: state.socialLinkCount,
      lastMeaningfulActivity: state.lastMeaningfulActivity,
      lastLogin: state.lastLogin,
      neverReturnedAfterRegistration:
        !state.lastLogin && !state.lastMeaningfulActivity,
      active: state.active,
      contactable,
      suppressed: Boolean(
        pref?.nurtureUnsubscribedAt || pref?.emailSuppressedAt,
      ),
      unsubscribe: Boolean(pref?.nurtureUnsubscribedAt),
      suppressionReason: pref?.emailSuppressedReason ?? null,
      lastContact,
      daysSinceContact: daysSinceContact,
      everContacted: wasEverContacted,
      specificEligible: specific.map((check) => ({
        emailId: check.emailId,
        priority: check.priority,
        reason: check.reason,
      })),
      cadenceBlockedCampaigns,
      checkinEligible,
      coverageStatus,
      scheduleCovered,
      recentEmails: history
        .filter((item) => item.sentAt)
        .slice(0, 8)
        .map((item) => ({
          emailId: item.emailId,
          sentAt: item.sentAt,
          category: item.category,
        })),
      nextPossibleCampaign: result.candidates[0]?.emailId ?? null,
      allCampaignChecks: result.checks,
      state,
    };
  });
  const buckets = ["no_music", "early", "engaged", "established"];
  const activities = [
    "active_30d",
    "inactive_30_89d",
    "inactive_90_179d",
    "inactive_180d_plus",
    "activity_unknown",
  ];
  const byBucket = Object.fromEntries(
    buckets.map((bucket) => {
      const inBucket = rows.filter((row) => row.bucket === bucket);
      return [
        bucket,
        {
          total: inBucket.length,
          neverReturned: inBucket.filter(
            (row) => row.neverReturnedAfterRegistration,
          ).length,
          ...Object.fromEntries(
            activities.map((activity) => [
              activity,
              inBucket.filter((row) => row.activity === activity).length,
            ]),
          ),
        },
      ];
    }),
  );
  const contactable = rows.filter((row) => row.contactable);
  const countStatus = (status: string) =>
    rows.filter((row) => row.coverageStatus === status).length;
  const coverage = {
    totalArtists: rows.length,
    contactable: contactable.length,
    qualifiesAtLeastOneCampaign: contactable.filter(
      (row) => row.specificEligible.length > 0 || row.checkinEligible,
    ).length,
    qualifiesSpecificCampaign: contactable.filter(
      (row) => row.specificEligible.length > 0,
    ).length,
    currentlyCadenceBlocked: contactable.filter(
      (row) => row.coverageStatus === "cadence_blocked",
    ).length,
    suppressedOrUnsubscribed: countStatus("suppressed"),
    notContactable: countStatus("not_contactable"),
    noCampaignCurrentlyApplicable: contactable.filter(
      (row) =>
        row.specificEligible.length === 0 &&
        !row.checkinEligible &&
        row.coverageStatus !== "cadence_blocked",
    ).length,
    checkinFallbackOnly: contactable.filter(
      (row) => row.coverageStatus === "checkin_fallback",
    ).length,
    checkinPending: contactable.filter(
      (row) => row.coverageStatus === "checkin_pending",
    ).length,
    orphaned: contactable.filter((row) => row.coverageStatus === "orphaned")
      .length,
    neverContacted: contactable.filter((row) => !row.everContacted).length,
    noContact30d: contactable.filter(
      (row) => row.daysSinceContact === null || row.daysSinceContact >= 30,
    ).length,
    noContact60d: contactable.filter(
      (row) => row.daysSinceContact === null || row.daysSinceContact >= 60,
    ).length,
    noContact90d: contactable.filter(
      (row) => row.daysSinceContact === null || row.daysSinceContact >= 90,
    ).length,
    noContact180d: contactable.filter(
      (row) => row.daysSinceContact === null || row.daysSinceContact >= 180,
    ).length,
    scheduleId: selectedSchedule?.id ?? null,
    scheduleName: selectedSchedule?.name ?? null,
    coveredBySchedule: scheduledIds
      ? contactable.filter((row) => row.scheduleCovered).length
      : null,
    uncoveredBySchedule: scheduledIds
      ? contactable.filter((row) => !row.scheduleCovered).length
      : null,
    scheduleCheckinOnly: scheduledIds
      ? contactable.filter(
          (row) =>
            row.scheduleCovered &&
            row.specificEligible.length === 0 &&
            row.checkinEligible,
        ).length
      : null,
  };
  return {
    generatedAt: at.toISOString(),
    activityDefinition:
      "Last meaningful activity is the latest successful auth.login.succeeded or latest recorded artist profile/content/version event (profile edits/claims; track/release/gig/video/photo/press/Version Control actions; media uploads). Public page views and registration are excluded. ‘Never returned’ means no successful-login or meaningful artist-action event is recorded; successful-login tracking starts with this release, so older login dates cannot be reconstructed. Legacy imported content has no reliable historic edit time unless a corresponding flow event exists.",
    buckets: byBucket,
    coverage,
    artists: rows.map(
      ({ allCampaignChecks: _checks, state: _state, ...row }) => row,
    ),
  };
}

function templateModel(
  env: Env,
  state: State,
  unsubscribeToken: string,
  candidate: Candidate,
) {
  const artistPageUrl = new URL(
    `/artist/${encodeURIComponent(state.slug)}`,
    env.SITE_URL,
  ).toString();
  const dashboardUrl = new URL("/artist/dashboard", env.SITE_URL).toString();
  return {
    artist_name: state.name,
    track_title: state.topTrackTitle ?? "your track",
    opportunity_title: candidate.opportunityTitle ?? "",
    opportunity_details: candidate.triggerReason,
    opportunity_url: new URL("/radio", env.SITE_URL).toString(),
    dashboard_url: dashboardUrl,
    artist_page_url: artistPageUrl,
    upload_url: new URL("/artist/dashboard", env.SITE_URL).toString(),
    release_url: new URL("/artist/dashboard", env.SITE_URL).toString(),
    versions_url: new URL("/artist/dashboard", env.SITE_URL).toString(),
    gigs_url: new URL("/artist/dashboard", env.SITE_URL).toString(),
    video_url: new URL("/artist/dashboard", env.SITE_URL).toString(),
    photo_url: new URL("/artist/dashboard", env.SITE_URL).toString(),
    social_url: artistPageUrl,
    share_url: artistPageUrl,
    discover_url: new URL("/radio", env.SITE_URL).toString(),
    radio_url: new URL("/radio", env.SITE_URL).toString(),
    invite_url: new URL("/signup?accountType=artist", env.SITE_URL).toString(),
    unsubscribe_url: new URL(
      `/artist-email/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`,
      env.SITE_URL,
    ).toString(),
  };
}

async function sendPostmark(
  env: Env,
  to: string,
  candidate: Candidate,
  model: Record<string, unknown>,
) {
  const response = await fetch(
    "https://api.postmarkapp.com/email/withTemplate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": env.POSTMARK_SERVER_TOKEN,
      },
      body: JSON.stringify({
        From: env.POSTMARK_ARTIST_EMAIL_FROM ?? env.POSTMARK_FROM_EMAIL,
        To: to,
        TemplateAlias: candidate.alias,
        TemplateModel: model,
        MessageStream: "outbound",
        Headers: [
          { Name: "List-Unsubscribe", Value: `<${model.unsubscribe_url}>` },
          {
            Name: "List-Unsubscribe-Post",
            Value: "List-Unsubscribe=One-Click",
          },
        ],
      }),
    },
  );
  const responseBody = (await response.json().catch(() => ({}))) as {
    MessageID?: unknown;
    ErrorCode?: unknown;
  };
  return response.ok && typeof responseBody.MessageID === "string"
    ? { ok: true as const, messageId: responseBody.MessageID }
    : {
        ok: false as const,
        error: `Postmark request failed (${response.status}, code ${String(responseBody.ErrorCode ?? "unknown")}).`,
      };
}

async function reserveHistory(
  env: Env,
  state: State,
  candidate: Candidate,
  category: string,
  evaluationDate: string | null,
  attemptKey: string,
  sendStatus: string,
  schedule?: {
    scheduleId: number;
    revision: number;
    slotId: string | null;
    decisionId: number | null;
  },
) {
  const db = getDb(env);
  try {
    const result = await db
      .insert(artistEngagementEmailHistory)
      .values({
        artistId: state.artistId,
        emailId: candidate.emailId,
        category,
        theme: candidate.theme,
        triggerReason: candidate.triggerReason,
        stateSnapshot: snapshot(state),
        sendStatus,
        evaluationDate,
        attemptKey,
        triggerKey: candidate.triggerKey,
        templateAlias: candidate.alias,
        scheduleId: schedule?.scheduleId ?? null,
        scheduleRevision: schedule?.revision ?? null,
        scheduleSlotId: schedule?.slotId ?? null,
        dailyDecisionId: schedule?.decisionId ?? null,
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoNothing()
      .returning({ id: artistEngagementEmailHistory.id });
    return result[0]?.id ?? null;
  } catch {
    return null;
  }
}

export async function deliverEngagement(
  env: Env,
  state: State,
  candidate: Candidate,
  target: string,
  category: string,
  evaluationDate: string | null,
  schedule?: {
    scheduleId: number;
    revision: number;
    slotId: string | null;
    decisionId: number | null;
  },
) {
  const attemptKey =
    category === "event" && candidate.triggerKey
      ? `event:${candidate.triggerKey}`
      : evaluationDate
        ? `${state.artistId}:${evaluationDate}:${category}`
        : `test:${state.artistId}:${crypto.randomUUID()}`;
  const historyId = await reserveHistory(
    env,
    state,
    candidate,
    category,
    evaluationDate,
    attemptKey,
    "sending",
    schedule,
  );
  if (!historyId)
    return {
      ok: false,
      skipped: true,
      error: "An email attempt for this artist/day or event already exists.",
    };
  const token = await signArtistUnsubscribeToken(
    env.JWT_SECRET,
    state.artistId,
  );
  const model = templateModel(env, state, token, candidate);
  const result = await sendPostmark(env, target, candidate, model);
  const now = new Date().toISOString();
  await getDb(env)
    .update(artistEngagementEmailHistory)
    .set({
      sendStatus: result.ok
        ? category === "test"
          ? "test_sent"
          : "sent"
        : "failed",
      sentAt: result.ok ? now : null,
      postmarkMessageId: result.ok ? result.messageId : null,
      error: result.ok ? null : result.error,
      updatedAt: now,
    })
    .where(eq(artistEngagementEmailHistory.id, historyId));
  return { ...result, historyId };
}

export async function sendTestEngagementEmail(
  env: Env,
  artistId: number,
  emailId: string,
  testAddress: string,
) {
  const candidateDef = (await loadEngagementCampaignDefinitions(env))[emailId];
  if (!candidateDef) return { ok: false, error: "Unknown email ID." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testAddress))
    return { ok: false, error: "Enter an explicit, valid test email address." };
  const state = await loadState(env, artistId);
  if (!state) return { ok: false, error: "Artist account not found." };
  if (!env.POSTMARK_SERVER_TOKEN || !env.POSTMARK_FROM_EMAIL)
    return { ok: false, error: "Postmark is not configured." };
  const candidate: Candidate = {
    emailId,
    alias: candidateDef.alias,
    subject: candidateDef.subject,
    theme: candidateDef.theme,
    category: candidateDef.category,
    priority: candidateDef.priority,
    triggerReason: "Admin-requested test to the explicitly supplied address.",
    triggerKey: null,
    opportunityId: null,
  };
  const result = await deliverEngagement(
    env,
    state,
    candidate,
    testAddress,
    "test",
    null,
  );
  return { ...result, artistId, emailId, testAddress };
}

export async function getArtistEngagementHistory(env: Env, artistId: number) {
  const state = await loadState(env, artistId);
  if (!state) return null;
  const db = getDb(env);
  const [history, preferences] = await Promise.all([
    loadHistory(env, artistId),
    db
      .select()
      .from(artistEngagementPreferences)
      .where(eq(artistEngagementPreferences.artistId, artistId))
      .limit(1)
      .then((rows) => rows[0]),
  ]);
  const sent = history.filter(
    (item) =>
      item.sendStatus === "sent" && item.category !== "test" && item.sentAt,
  );
  const lastSent = sent[0] ?? null;
  const lastNurture = sent.find((item) => item.category === "nurture") ?? null;
  const dryRun = await dryRunArtistEngagement(env, artistId);
  return {
    artist: {
      id: state.artistId,
      name: state.name,
      slug: state.slug,
      email: state.email,
    },
    summary: {
      lastContact: lastSent?.sentAt ?? null,
      lastEmailId: lastSent?.emailId ?? null,
      lastTheme: lastSent?.theme ?? null,
      lastNurtureContact: lastNurture?.sentAt ?? null,
      nextCurrentlyEligible: !("error" in dryRun)
        ? ((dryRun.selected as Candidate | null)?.emailId ?? null)
        : null,
      unsubscribed: Boolean(preferences?.nurtureUnsubscribedAt),
      suppressed: Boolean(preferences?.emailSuppressedAt),
    },
    history: history.map((item) => ({
      ...item,
      subject: ENGAGEMENT_EMAILS[item.emailId]?.subject ?? item.emailId,
    })),
  };
}

export async function syncArtistEngagementHardBounces(env: Env) {
  const db = getDb(env);
  const sent = await db
    .select({
      id: artistEngagementEmailHistory.id,
      artistId: artistEngagementEmailHistory.artistId,
      postmarkMessageId: artistEngagementEmailHistory.postmarkMessageId,
    })
    .from(artistEngagementEmailHistory)
    .where(
      and(
        eq(artistEngagementEmailHistory.sendStatus, "sent"),
        ne(artistEngagementEmailHistory.deliveryStatus, "hard_bounced"),
        isNotNull(artistEngagementEmailHistory.postmarkMessageId),
      ),
    );
  if (!sent.length) return { checked: 0, hardBounced: 0 };
  const ids = sent
    .map((row) => row.postmarkMessageId)
    .filter((value): value is string => Boolean(value));
  const response = await fetch(
    "https://api.postmarkapp.com/bounces?type=HardBounce&count=500&offset=0",
    {
      headers: {
        Accept: "application/json",
        "X-Postmark-Server-Token": env.POSTMARK_SERVER_TOKEN,
      },
    },
  );
  if (!response.ok)
    throw new Error(`Postmark hard-bounce lookup returned ${response.status}.`);
  const data = (await response.json()) as {
    Bounces?: Array<{
      ID?: unknown;
      MessageID?: unknown;
      Description?: unknown;
      Details?: unknown;
    }>;
  };
  const matches = (data.Bounces ?? []).filter(
    (bounce) =>
      typeof bounce.MessageID === "string" && ids.includes(bounce.MessageID),
  );
  const now = new Date().toISOString();
  for (const bounce of matches) {
    const messageId = bounce.MessageID as string;
    const rows = sent.filter((item) => item.postmarkMessageId === messageId);
    const detail =
      [bounce.Description, bounce.Details]
        .filter((value): value is string => typeof value === "string")
        .join(" ")
        .slice(0, 2000) || null;
    await db
      .update(artistEngagementEmailHistory)
      .set({
        deliveryStatus: "hard_bounced",
        postmarkBounceId: typeof bounce.ID === "number" ? bounce.ID : null,
        deliveryDetails: detail,
        deliveryCheckedAt: now,
        updatedAt: now,
      })
      .where(eq(artistEngagementEmailHistory.postmarkMessageId, messageId));
    for (const row of rows)
      await db
        .insert(artistEngagementPreferences)
        .values({
          artistId: row.artistId,
          emailSuppressedAt: now,
          emailSuppressedReason: "Postmark hard bounce",
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: artistEngagementPreferences.artistId,
          set: {
            emailSuppressedAt: now,
            emailSuppressedReason: "Postmark hard bounce",
            updatedAt: now,
          },
        });
  }
  return { checked: ids.length, hardBounced: matches.length };
}

export async function unsubscribeArtistEngagement(env: Env, artistId: number) {
  const now = new Date().toISOString();
  await getDb(env)
    .insert(artistEngagementPreferences)
    .values({ artistId, nurtureUnsubscribedAt: now, updatedAt: now })
    .onConflictDoUpdate({
      target: artistEngagementPreferences.artistId,
      set: { nurtureUnsubscribedAt: now, updatedAt: now },
    });
  return { ok: true };
}

export async function getArtistEngagementArtists(env: Env, query: string) {
  const rows = await getDb(env)
    .select({
      id: artists.id,
      name: artists.name,
      slug: artists.slug,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(artists)
    .innerJoin(users, eq(artists.userId, users.id))
    .where(and(eq(users.accountType, "artist"), eq(users.active, true)))
    .orderBy(artists.name)
    .limit(300);
  const term = query.trim().toLowerCase();
  return term
    ? rows.filter((row) =>
        `${row.name} ${row.slug} ${row.email}`.toLowerCase().includes(term),
      )
    : rows;
}

export async function getArtistEngagementOpportunities(env: Env) {
  return getDb(env)
    .select()
    .from(artistEngagementOpportunities)
    .orderBy(desc(artistEngagementOpportunities.startsAt));
}

export async function createArtistEngagementOpportunity(
  env: Env,
  input: {
    emailId: string;
    title: string;
    description: string;
    category: "nurture" | "positive";
    startsAt: string;
    endsAt: string;
    audience?: Record<string, unknown> | null;
  },
) {
  if (!OPPORTUNITY_EMAILS.has(input.emailId))
    return { error: "This email ID is not an opportunity template." };
  if (Date.parse(input.startsAt) >= Date.parse(input.endsAt))
    return { error: "End time must be after start time." };
  const [created] = await getDb(env)
    .insert(artistEngagementOpportunities)
    .values({ ...input, active: true })
    .returning();
  return { opportunity: created };
}

export async function deactivateArtistEngagementOpportunity(
  env: Env,
  id: number,
) {
  const [updated] = await getDb(env)
    .update(artistEngagementOpportunities)
    .set({ active: false, updatedAt: new Date().toISOString() })
    .where(eq(artistEngagementOpportunities.id, id))
    .returning({ id: artistEngagementOpportunities.id });
  return Boolean(updated);
}

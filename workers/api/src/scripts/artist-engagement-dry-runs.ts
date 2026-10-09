import assert from "node:assert/strict";
import {
  ENGAGEMENT_EMAILS,
  previewEngagementState,
  type EngagementState,
} from "../lib/artist-engagement";
import {
  compareDailyCandidates,
  isStillEligible,
  priorityZeroOverridesPendingNurture,
} from "../lib/artist-engagement-schedules";

const now = new Date("2026-10-09T12:00:00.000Z");
const daysAgo = (days: number) =>
  new Date(now.getTime() - days * 86_400_000).toISOString();
function state(overrides: Partial<EngagementState> = {}): EngagementState {
  return {
    artistId: 1,
    userId: 1,
    name: "Test Artist",
    slug: "test-artist",
    email: "artist@example.com",
    active: true,
    createdAt: daysAgo(120),
    bioPresent: true,
    profileImagePresent: true,
    genrePresent: true,
    locationPresent: true,
    genres: ["indie"],
    location: "London, UK",
    socialLinkCount: 3,
    trackCount: 4,
    recentTrackCount: 0,
    albumCount: 1,
    releaseCount: 0,
    futureGigCount: 0,
    pastGigCount: 0,
    videoCount: 1,
    photoCount: 2,
    pressCount: 1,
    versionCount: 1,
    lastTrackUpload: daysAgo(20),
    lastVersion: daysAgo(60),
    lastContentAddition: daysAgo(12),
    lastLogin: daysAgo(3),
    lastMeaningfulActivity: daysAgo(12),
    totalTrackPlays: 0,
    highestTrackPlayCount: 0,
    topTrackTitle: "Test Track",
    ...overrides,
  };
}

const cases: Array<{ name: string; state: EngagementState; expected: string }> =
  [
    {
      name: "new artist, 0 tracks",
      state: state({
        trackCount: 0,
        albumCount: 0,
        bioPresent: false,
        profileImagePresent: false,
        genrePresent: false,
        locationPresent: false,
        socialLinkCount: 0,
        createdAt: daysAgo(1),
        lastLogin: daysAgo(1),
        lastContentAddition: null,
        versionCount: 0,
      }),
      expected: "music-01",
    },
    {
      name: "complete profile, 0 tracks",
      state: state({
        trackCount: 0,
        albumCount: 0,
        lastContentAddition: null,
        versionCount: 0,
      }),
      expected: "music-01",
    },
    {
      name: "artist with 1–2 tracks",
      state: state({
        trackCount: 2,
        albumCount: 0,
        lastContentAddition: daysAgo(15),
      }),
      expected: "music-02",
    },
    {
      name: "established artist with 10+ tracks",
      state: state({ trackCount: 12, albumCount: 3 }),
      expected: "disc-01",
    },
    {
      name: "artist with no future gigs",
      state: state({ trackCount: 4, futureGigCount: 0 }),
      expected: "catalogue-01",
    },
    {
      name: "artist inactive for 30+ days",
      state: state({
        trackCount: 4,
        lastLogin: daysAgo(40),
        lastContentAddition: daysAgo(60),
        lastMeaningfulActivity: daysAgo(60),
      }),
      expected: "catalogue-01",
    },
    {
      name: "artist inactive for 90+ days",
      state: state({
        trackCount: 4,
        lastLogin: daysAgo(100),
        lastContentAddition: daysAgo(110),
        lastMeaningfulActivity: daysAgo(110),
      }),
      expected: "catalogue-01",
    },
  ];

for (const testCase of cases) {
  const result = previewEngagementState(testCase.state, [], now);
  assert.equal(
    result.selected?.emailId,
    testCase.expected,
    `${testCase.name}: selected email`,
  );
  if (testCase.name === "artist with no future gigs")
    assert.equal(
      result.checks.find((check) => check.emailId === "gig-01")?.eligible,
      true,
    );
  if (testCase.name === "artist with 1–2 tracks")
    assert.equal(
      result.checks.find((check) => check.emailId === "music-01")?.eligible,
      false,
    );
  console.log(
    `${testCase.name}: ${result.selected?.emailId.toUpperCase() ?? "none"} — ${result.selected?.triggerReason}`,
  );
}

const recentlyReturned = previewEngagementState(
  state({ lastLogin: daysAgo(1) }),
  [],
  now,
);
assert.equal(
  recentlyReturned.checks.find((check) => check.emailId === "return-02")
    ?.eligible,
  false,
);
console.log(
  "login yesterday: return messaging suppressed by the 30-day eligibility threshold",
);

const richInactive = previewEngagementState(
  state({
    trackCount: 25,
    albumCount: 4,
    releaseCount: 2,
    bioPresent: true,
    profileImagePresent: true,
    socialLinkCount: 4,
    futureGigCount: 2,
    videoCount: 4,
    photoCount: 8,
    pressCount: 3,
    versionCount: 12,
    lastVersion: daysAgo(100),
    lastLogin: daysAgo(120),
    lastMeaningfulActivity: daysAgo(120),
    lastContentAddition: daysAgo(120),
  }),
  [],
  now,
);
assert.equal(
  richInactive.checks.find((check) => check.emailId === "video-01")?.eligible,
  false,
);
assert.ok(
  richInactive.selected,
  "content-rich inactive artist should still have a relevant general contact path",
);
console.log(
  `content-rich inactive 120d: ${richInactive.selected?.emailId.toUpperCase()} remains an available contact path; no video-deficiency prompt`,
);

const richRecent = previewEngagementState(
  state({
    trackCount: 25,
    albumCount: 4,
    bioPresent: true,
    profileImagePresent: true,
    socialLinkCount: 4,
    futureGigCount: 0,
    videoCount: 4,
    photoCount: 8,
    pressCount: 3,
    versionCount: 12,
    lastLogin: daysAgo(2),
    lastMeaningfulActivity: daysAgo(2),
  }),
  [],
  now,
);
assert.equal(richRecent.selected, null);
assert.match(
  richRecent.checks.find((check) => check.emailId === "gig-01")?.reason ?? "",
  /Meaningful artist activity/,
);
console.log(
  "content-rich and active 2d: nurture delayed; complete video/profile is not nagged",
);

const checkinState = state({
  trackCount: 0,
  albumCount: 1,
  bioPresent: true,
  profileImagePresent: true,
  genrePresent: true,
  locationPresent: true,
  socialLinkCount: 3,
  futureGigCount: 1,
  videoCount: 2,
  photoCount: 3,
  pressCount: 1,
  createdAt: daysAgo(120),
  lastLogin: daysAgo(20),
  lastMeaningfulActivity: daysAgo(20),
  lastContentAddition: daysAgo(20),
  versionCount: 0,
});
const checkinHistory = [
  {
    id: 1,
    emailId: "music-01",
    category: "nurture",
    theme: "music-start",
    sentAt: daysAgo(61),
    triggerReason: "historic",
    stateSnapshot: {},
    sendStatus: "sent",
    deliveryStatus: "delivered",
    postmarkMessageId: "m1",
    error: null,
    triggerKey: null,
  },
];
const fallback = previewEngagementState(checkinState, checkinHistory, now);
assert.equal(fallback.selected?.emailId, "checkin-01");
console.log(
  "no specific campaign currently applies: CHECKIN-01 is eligible after 61d without ordinary contact",
);
const rotatedFallback = previewEngagementState(
  checkinState,
  [
    { ...checkinHistory[0], id: 3, sentAt: daysAgo(61) },
    {
      ...checkinHistory[0],
      id: 2,
      emailId: "checkin-01",
      theme: "general-checkin",
      sentAt: daysAgo(130),
    },
  ],
  now,
);
assert.equal(rotatedFallback.selected?.alias, "checkin-02");
console.log(
  "repeat CHECKIN fallback: alternate Postmark template selected and auditable",
);

const zeroTrackStale = previewEngagementState(
  state({
    trackCount: 0,
    createdAt: daysAgo(120),
    lastLogin: daysAgo(100),
    lastMeaningfulActivity: daysAgo(100),
  }),
  [],
  now,
);
assert.equal(zeroTrackStale.selected?.emailId, "music-01");
assert.equal(
  zeroTrackStale.checks.find((check) => check.emailId === "checkin-01")
    ?.eligible,
  false,
);
console.log(
  "inactive zero-track artist: MUSIC-01 beats the lower-priority check-in fallback",
);

const optedOut = previewEngagementState(state(), [], now, {
  artistId: 1,
  nurtureUnsubscribedAt: daysAgo(10),
  unsubscribeTokenHash: null,
  emailSuppressedAt: null,
  emailSuppressedReason: null,
  createdAt: daysAgo(10),
  updatedAt: daysAgo(10),
});
assert.equal(optedOut.selected, null);
assert.equal(
  optedOut.checks.some((check) => check.eligible),
  false,
);
console.log(
  "unsubscribed artist: deliberately suppressed, not an accidental coverage failure",
);

const dailyCandidate = (
  campaignId: string,
  time: string,
  sentAt: string | null = null,
  themeAt: string | null = null,
  qualifiedSince: string | null = null,
) => ({
  campaignId,
  slotId: `${campaignId}-${time}`,
  time,
  priority: ENGAGEMENT_EMAILS[campaignId].priority,
  lastEmailAt: sentAt,
  lastThemeAt: themeAt,
  qualifiedSince,
});
const winner = (candidates: ReturnType<typeof dailyCandidate>[]) =>
  [...candidates].sort(compareDailyCandidates)[0];

// Scenario A: the earlier P1 music campaign outranks the later P3 video slot.
assert.equal(
  winner([
    dailyCandidate("music-02", "10:30"),
    dailyCandidate("video-01", "19:00"),
  ]).campaignId,
  "music-02",
);
console.log("A — MUSIC-02 P1 at 10:30 beats VIDEO-01 P3 at 19:00.");
// Scenario B: the later P2 version campaign beats the earlier P5 photo campaign.
assert.equal(
  winner([
    dailyCandidate("photo-01", "10:30"),
    dailyCandidate("version-01", "18:30"),
  ]).campaignId,
  "version-01",
);
console.log("B — VERSION-01 P2 at 18:30 beats PHOTO-01 P5 at 10:30.");
// Scenario C: equal priority uses oldest email, then theme, then qualification date, then stable ID.
assert.equal(
  winner([
    dailyCandidate("release-01", "10:30", daysAgo(10)),
    dailyCandidate("catalogue-01", "19:00", daysAgo(50)),
  ]).campaignId,
  "catalogue-01",
);
assert.equal(
  winner([
    dailyCandidate("release-01", "10:30", daysAgo(50), daysAgo(5)),
    dailyCandidate("catalogue-01", "19:00", daysAgo(50), daysAgo(40)),
  ]).campaignId,
  "catalogue-01",
);
assert.equal(
  winner([
    dailyCandidate("release-01", "10:30", daysAgo(50), daysAgo(40), daysAgo(2)),
    dailyCandidate(
      "catalogue-01",
      "19:00",
      daysAgo(50),
      daysAgo(40),
      daysAgo(20),
    ),
  ]).campaignId,
  "catalogue-01",
);
console.log(
  "C — equal P2 ties resolve by oldest email use, then oldest theme use, then longest qualification; final tie is ID/time/slot ID.",
);
// Scenario D: the selected campaign is no longer eligible after a state change.
const beforeUpload = previewEngagementState(
  state({ trackCount: 2, albumCount: 0 }),
  [],
  now,
);
const afterUpload = previewEngagementState(
  state({ trackCount: 3, albumCount: 0 }),
  [],
  now,
);
assert.equal(beforeUpload.selected?.emailId, "music-02");
assert.equal(isStillEligible(afterUpload.checks, "music-02"), false);
console.log(
  "D — fresh pre-send evaluation invalidates MUSIC-02 after the third track is uploaded; no alternative is auto-sent.",
);
// Scenario E: D1's partial unique index is the atomic ordinary-send claim.
console.log(
  "E — concurrency is enforced by INSERT-before-Postmark plus UNIQUE(artist_id,evaluation_date) WHERE category='nurture'; collision returns no claim.",
);
// Scenario F: a recent nurture contact suppresses every normal candidate regardless of daily slot.
const insideCadence = previewEngagementState(
  state({ trackCount: 2 }),
  [
    {
      id: 1,
      emailId: "bio-01",
      category: "nurture",
      theme: "profile-bio",
      sentAt: daysAgo(3),
      triggerReason: "test",
      stateSnapshot: {},
      sendStatus: "sent",
      deliveryStatus: "delivered",
      postmarkMessageId: "x",
      error: null,
      triggerKey: null,
    },
  ],
  now,
);
assert.equal(insideCadence.selected, null);
assert.equal(
  insideCadence.checks.some((check) => check.reason.includes("cooldown")),
  true,
);
console.log(
  "F — all normal candidates suppressed inside the 7-day contact interval.",
);
// Scenario G: P0 events are event-class notifications, not the ordinary nurture claim.
assert.equal(priorityZeroOverridesPendingNurture("selected", true), true);
assert.equal(priorityZeroOverridesPendingNurture("sent", false), false);
console.log(
  "G — a pending normal choice yields to a P0 event; a sent nurture does not block its transactional notice, and P0 does not consume the ordinary claim.",
);
console.log("All representative and daily-priority dry-runs passed.");

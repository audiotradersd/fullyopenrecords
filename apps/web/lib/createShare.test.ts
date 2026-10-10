import assert from "node:assert/strict";
import test from "node:test";
import {
  buildShareSvg,
  createAttributedShareUrl,
  deriveShareCopy,
  loadShareArtwork,
  SHARE_DESIGNS,
  SHARE_FORMATS,
  shareArtworkForRecord,
  type ShareContentType,
  type ShareDesign,
  type ShareFormat,
  type ShareableContent,
} from "./createShare";
import { curatedReleaseFallbacks } from "./curatedReleaseFallbacks";

test("every visual template generates artwork at each social format", () => {
  for (const template of SHARE_DESIGNS) {
    const contentType = template.types[0] as ShareContentType;
    const content: ShareableContent = {
      contentType,
      artistName: "Lhea Blueviolet & The Long Names",
      title: "An Unusually Long Release Title for a Test",
      subtitle: "An editorial supporting line",
      image: "https://fullyopenrecords.com/media/artwork.jpg?x=1&y=2",
      date: "09 Oct 2026",
      venue: "The Joiners",
      location: "Southampton",
      cta: "LISTEN ON FULLY OPEN RECORDS",
      url: "https://fullyopenrecords.com/artist/test#track-22",
    };
    for (const format of SHARE_FORMATS) {
      const svg = buildShareSvg(
        content,
        template.id as ShareDesign,
        format.id as ShareFormat,
      );
      assert.match(svg, new RegExp(`width="${format.width}"`));
      assert.match(svg, new RegExp(`height="${format.height}"`));
      if (template.id === "type-only") assert.doesNotMatch(svg, /<image href=/);
      else
        assert.match(
          svg,
          /<image href="https:\/\/fullyopenrecords\.com\/media\/artwork\.jpg\?x=1&amp;y=2"/,
        );
      assert.match(svg, /Lhea Blueviolet &amp; The Long Names/);
      assert.match(
        svg,
        template.id === "editorial"
          ? /READ MORE/
          : template.id === "gig-poster"
            ? /GIG DETAILS/
            : /LISTEN (?:NOW|ON FULLY OPEN RECORDS)/,
      );
      assert.doesNotMatch(svg, /<script/i);
    }
  }
});

test("poster copy follows FOR release types, track context and release dates", () => {
  const jackIssues = curatedReleaseFallbacks["jack-issues"];
  const jackCopy = deriveShareCopy({
    contentType: "release",
    releaseType: String(jackIssues.type),
    artistName: String(jackIssues.artistName),
    title: String(jackIssues.title),
    date: String(jackIssues.releaseDate),
    cta: "LISTEN ON FULLY OPEN RECORDS",
    url: "https://fullyopenrecords.com/artist/stone#album-1",
  });
  assert.deepEqual(jackCopy, {
    eyebrow: "NEW ALBUM",
    releaseLabel: "ALBUM",
    statusLabel: "OUT NOW",
    ctaLabel: "LISTEN ON FULLY OPEN RECORDS",
    supportingMetadata: "",
  });

  const jackPoster = buildShareSvg({
    contentType: "release",
    releaseType: String(jackIssues.type),
    artistName: String(jackIssues.artistName),
    title: String(jackIssues.title),
    date: String(jackIssues.releaseDate),
    cta: "LISTEN ON FULLY OPEN RECORDS",
    url: "https://fullyopenrecords.com/artist/stone#album-1",
  }, "artwork-hero", "square");
  assert.match(jackPoster, /NEW ALBUM/);
  assert.doesNotMatch(jackPoster, /NEW SINGLE/);
  assert.ok(jackPoster.indexOf("JACK ISSUES") < jackPoster.indexOf("STONE!?") );
  for (const design of SHARE_DESIGNS.filter((item) => item.types.includes("release"))) {
    const poster = buildShareSvg({
      contentType: "release", releaseType: String(jackIssues.type),
      artistName: String(jackIssues.artistName), title: String(jackIssues.title),
      date: String(jackIssues.releaseDate), cta: "LISTEN ON FULLY OPEN RECORDS",
      url: "https://fullyopenrecords.com/artist/stone#album-1",
    }, design.id, "square");
    assert.match(poster, /NEW ALBUM/, `${design.id} should use the album label`);
    assert.doesNotMatch(poster, /NEW SINGLE/, `${design.id} must not call Jack Issues a single`);
  }

  const epCopy = deriveShareCopy({
    contentType: "release", releaseType: "EP", artistName: "Cinder Static",
    title: "Night Index", date: "2025-11-14", cta: "LISTEN NOW", url: "https://fullyopenrecords.com/",
  });
  assert.equal(epCopy.eyebrow, "NEW EP");
  assert.equal(epCopy.statusLabel, "OUT NOW");

  const upcomingAlbum = deriveShareCopy({
    contentType: "release", releaseType: "Album", artistName: "Artist",
    title: "Upcoming", date: "2099-10-23", cta: "LISTEN NOW", url: "https://fullyopenrecords.com/",
  });
  assert.equal(upcomingAlbum.statusLabel, "OUT 23 OCT 2099");

  const futureSingle = deriveShareCopy({
    contentType: "release", releaseType: "Single", artistName: "Artist",
    title: "Future", date: "2099-10-23", cta: "LISTEN NOW", url: "https://fullyopenrecords.com/",
  });
  assert.equal(futureSingle.eyebrow, "NEW SINGLE");
  assert.equal(futureSingle.statusLabel, "OUT 23 OCT 2099");

  const albumTrack = deriveShareCopy({
    contentType: "track", parentReleaseType: "Album", parentReleaseTitle: "Jack Issues",
    artistName: "Stone!?", title: "Kodiak", date: "2026-03-30", cta: "LISTEN NOW",
    url: "https://fullyopenrecords.com/artist/stone#track-1",
  });
  assert.equal(albumTrack.eyebrow, "NOW PLAYING");
  assert.equal(albumTrack.supportingMetadata, "FROM THE ALBUM JACK ISSUES");
  assert.equal(albumTrack.statusLabel, "LISTEN NOW");

  const actualGig = deriveShareCopy({
    contentType: "gig", artistName: "Stone!?", title: "TEST", venue: "TEST",
    location: "Chichester", date: "2026-10-23", cta: "VIEW GIG DETAILS",
    url: "https://fullyopenrecords.com/artist/stone#gig-11",
  });
  assert.deepEqual(actualGig, {
    eyebrow: "LIVE", releaseLabel: "GIG", statusLabel: "LIVE 23 OCT 2026",
    ctaLabel: "GIG DETAILS", supportingMetadata: "TEST · Chichester",
  });
  const gigPoster = buildShareSvg({
    contentType: "gig", artistName: "Stone!?", title: "TEST", venue: "TEST",
    location: "Chichester", date: "2026-10-23", cta: "VIEW GIG DETAILS",
    url: "https://fullyopenrecords.com/artist/stone#gig-11",
  }, "gig-poster", "square");
  assert.match(gigPoster, /23 OCT 2026/);
  assert.doesNotMatch(gigPoster, /DOORS 7:30PM/);

  const actualPress = deriveShareCopy({
    contentType: "press", artistName: "I ERROR", title: "I ERROR – Making an Album with Hardware",
    subtitle: "Polyend", cta: "READ ON FULLY OPEN RECORDS",
    url: "https://fullyopenrecords.com/artist/i-error#press-1",
  });
  assert.equal(actualPress.eyebrow, "ARTIST NEWS");
  assert.equal(actualPress.ctaLabel, "READ MORE");
  assert.equal(actualPress.supportingMetadata, "Polyend");

  const actualArtist = deriveShareCopy({
    contentType: "artist", artistName: "Stone!?", title: "Stone!?", cta: "DISCOVER STONE!?",
    url: "https://fullyopenrecords.com/artist/stone",
  });
  assert.equal(actualArtist.ctaLabel, "DISCOVER STONE!?");
});

test("release descriptions are editorial in Story only across release templates", () => {
  const description = "Jack Issues is the 10-track debut album from groove metal trio Stone!?, delivering a punch of heavy riffs, locked-in rhythms, and raw, stripped-down aggression. Built on thick guitar tones, pounding drums, and bass lines that hit like concrete, the record leans into groove over flash, every track designed to lock into a riff and grind forward. The album moves between crushing mid-tempo stompers and sharp bursts of controlled chaos, with jagged riffs, stop-start rhythms, and hooks that hit hard without losing the grit. Lyrically and sonically, Jack Issues circles themes of pressure, frustration, and dark humour, channelled through blunt, no-nonsense songwriting. Across ten tracks, Stone!? carve out a sound rooted in groove metal and 90s alternative heaviness - tight, confrontational, and built for volume.";
  const release: ShareableContent = {
    contentType: "release",
    releaseType: "Album",
    artistName: "Stone!?",
    title: "Jack Issues",
    description,
    date: "2026-03-09",
    image: "https://fully-open-records-api.sbdownes.workers.dev/media/artists/stone/albums/covers/1773318736884-jack-issues-cover.png",
    cta: "LISTEN ON FULLY OPEN RECORDS",
    url: "https://fullyopenrecords.com/artist/stone#album-1",
  };

  const releaseDesigns = SHARE_DESIGNS.filter((item) => item.types.includes("release"));
  for (const design of releaseDesigns) {
    const story = buildShareSvg(release, design.id, "story");
    assert.match(story, /NEW ALBUM/, `${design.id} uses the real release type`);
    assert.match(story, /STONE!?/);
    assert.match(story, /JACK/);
    assert.match(story, /ISSUES/);
    assert.match(story, /OUT NOW/);
    assert.match(story, /FULLY OPEN RECORDS/);
    assert.match(story, /built for volume/,
      `${design.id} retains the end of the release description instead of truncating it`);
    for (const format of ["square", "portrait", "landscape"] as const) {
      assert.doesNotMatch(
        buildShareSvg(release, design.id, format),
        /10-track debut album from groove metal trio/,
        `${design.id} keeps long description copy out of ${format}`,
      );
    }
  }
});

test("share artwork follows the FOR release, track, event, press and profile records", () => {
  const jackCover = "https://fully-open-records-api.sbdownes.workers.dev/media/artists/stone/albums/covers/jack.png";
  const trackCover = "https://fully-open-records-api.sbdownes.workers.dev/media/artists/stone/songs/covers/kodiak.png";
  const pressImage = "https://fully-open-records-api.sbdownes.workers.dev/media/artists/i-error/press/feature.png";
  const profileImage = "https://fully-open-records-api.sbdownes.workers.dev/media/artists/stone/profile.png";
  const albums = [{ id: 1, coverArt: jackCover }, { id: 2, coverArt: "other-release.png" }];
  const artist = { profileImage, heroImage: "hero.png" };

  assert.equal(shareArtworkForRecord("release", { id: 1, coverArt: jackCover }, [], artist), jackCover);
  assert.equal(shareArtworkForRecord("track", { albumId: 1, coverImage: "" }, albums, artist), jackCover);
  assert.equal(shareArtworkForRecord("track", { albumId: 1, coverImage: trackCover }, albums, artist), trackCover);
  assert.equal(shareArtworkForRecord("release", { id: 3, coverArt: "" }, [], artist), profileImage);
  assert.equal(shareArtworkForRecord("gig", { id: 4, title: "Live" }, [], artist), profileImage);
  assert.equal(shareArtworkForRecord("press", { featureImage: pressImage }, [], artist), pressImage);
  assert.equal(shareArtworkForRecord("press", { featureImage: "" }, [], artist), profileImage);
  assert.equal(shareArtworkForRecord("artist", {}, [], artist), profileImage);
});

test("storage keys and failed image requests are rejected instead of exported as broken images", async () => {
  await assert.rejects(
    loadShareArtwork("artists/stone/albums/covers/jack-issues.png"),
    /storage key, not a public URL/,
  );
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("missing", { status: 404 });
  try {
    await assert.rejects(
      loadShareArtwork("https://media.example.test/jack-issues.png"),
      /Artwork request failed \(404\)/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("share link retains the FOR content destination and adds attribution", () => {
  const shared = new URL(
    createAttributedShareUrl(
      "https://fullyopenrecords.com/artist/test#album-5",
      "release",
    ),
  );
  assert.equal(shared.origin, "https://fullyopenrecords.com");
  assert.equal(shared.pathname, "/artist/test");
  assert.equal(shared.hash, "#album-5");
  assert.equal(shared.searchParams.get("utm_source"), "fullyopenrecords");
  assert.equal(shared.searchParams.get("utm_medium"), "artist_share");
  assert.equal(shared.searchParams.get("utm_campaign"), "release");
  assert.equal(shared.searchParams.get("utm_content"), "create_share");
});

test("share links cannot redirect away from Fully Open", () => {
  assert.throws(() =>
    createAttributedShareUrl("https://attacker.example/path", "artist"),
  );
});

test("missing artwork gets an intentional prompt composition", () => {
  const content: ShareableContent = {
    contentType: "track",
    artistName: "Artist",
    title: "Track",
    cta: "LISTEN ON FULLY OPEN RECORDS",
    url: "https://fullyopenrecords.com/artist/artist#track-1",
  };
  assert.match(
    buildShareSvg(content, "artwork-hero", "square"),
    /ARTWORK REQUIRED/,
  );
  assert.doesNotMatch(
    buildShareSvg(content, "type-only", "square"),
    /ARTWORK REQUIRED/,
  );
});

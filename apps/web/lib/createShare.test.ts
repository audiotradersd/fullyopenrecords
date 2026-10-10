import assert from "node:assert/strict";
import test from "node:test";
import {
  buildShareSvg,
  createAttributedShareUrl,
  loadShareArtwork,
  SHARE_DESIGNS,
  SHARE_FORMATS,
  shareArtworkForRecord,
  type ShareContentType,
  type ShareDesign,
  type ShareFormat,
  type ShareableContent,
} from "./createShare";

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
          : /LISTEN ON FULLY OPEN RECORDS/,
      );
      assert.doesNotMatch(svg, /<script/i);
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

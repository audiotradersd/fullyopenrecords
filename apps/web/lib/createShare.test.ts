import assert from "node:assert/strict";
import test from "node:test";
import {
  buildShareSvg,
  createAttributedShareUrl,
  SHARE_DESIGNS,
  SHARE_FORMATS,
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
      assert.match(svg, /LISTEN ON FULLY OPEN RECORDS/);
      assert.doesNotMatch(svg, /<script/i);
    }
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
    /UPLOAD ARTWORK/,
  );
  assert.doesNotMatch(
    buildShareSvg(content, "type-only", "square"),
    /UPLOAD ARTWORK/,
  );
});

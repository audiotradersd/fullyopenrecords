import fs from "node:fs/promises";
import path from "node:path";

type CsvRow = {
  Artist?: string;
  Track?: string;
  Album?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function escapeSql(value: string) {
  return value.replace(/'/g, "''");
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function parseCsv(content: string) {
  const lines = content.trim().split(/\r?\n/);
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce<Record<string, string>>((row, header, index) => {
      row[header] = values[index] ?? "";
      return row;
    }, {});
  }) as CsvRow[];
}

async function main() {
  const csvPath = process.argv[2] ?? path.resolve(process.cwd(), "artists_tracks.csv");
  const outPath =
    process.argv[3] ??
    path.resolve(process.cwd(), "infra/migrations/0006_artists_tracks_import.sql");

  const csv = await fs.readFile(csvPath, "utf8");
  const rows = parseCsv(csv)
    .map((row) => ({
      artist: row.Artist?.trim() ?? "",
      track: row.Track?.trim() ?? "",
      album: row.Album?.trim() ?? ""
    }))
    .filter((row) => row.artist && row.track);

  const artists = [...new Set(rows.map((row) => row.artist))].sort((a, b) => a.localeCompare(b));
  const songs = new Map<string, { artist: string; track: string; album: string; slug: string }>();

  for (const row of rows) {
    const key = `${row.artist}:::${row.track}`.toLowerCase();
    if (!songs.has(key)) {
      songs.set(key, {
        artist: row.artist,
        track: row.track,
        album: row.album,
        slug: slugify(`${row.artist}-${row.track}`)
      });
    }
  }

  const statements: string[] = [
    "-- Generated from artists_tracks.csv",
    "-- Idempotent artist + song import for Fully Open Records"
  ];

  for (const artistName of artists) {
    const slug = slugify(artistName) || `artist-${artistName.length}`;
    const bio = `${artistName} artist profile imported from the current station catalog.`;

    statements.push(`
INSERT INTO artists (
  name,
  slug,
  bio,
  hero_image,
  profile_image,
  banner_image,
  location,
  social_links,
  gallery_images,
  genres,
  plan,
  admin_override,
  featured
)
SELECT
  '${escapeSql(artistName)}',
  '${escapeSql(slug)}',
  '${escapeSql(bio)}',
  '',
  '',
  '',
  '',
  '{}',
  '[]',
  '[]',
  'free',
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE slug = '${escapeSql(slug)}'
);`.trim());
  }

  for (const song of songs.values()) {
    const artistSlug = slugify(song.artist) || `artist-${song.artist.length}`;

    statements.push(`
INSERT INTO songs (
  artist_id,
  artist_name,
  title,
  slug,
  audio_url,
  duration,
  cover_image,
  is_radio_eligible,
  radio_selected,
  approved_for_radio,
  play_count
)
SELECT
  (SELECT id FROM artists WHERE slug = '${escapeSql(artistSlug)}' LIMIT 1),
  '${escapeSql(song.artist)}',
  '${escapeSql(song.track)}',
  '${escapeSql(song.slug)}',
  NULL,
  NULL,
  NULL,
  1,
  0,
  0,
  0
WHERE NOT EXISTS (
  SELECT 1 FROM songs
  WHERE artist_name = '${escapeSql(song.artist)}'
    AND title = '${escapeSql(song.track)}'
);`.trim());
  }

  await fs.writeFile(outPath, `${statements.join("\n\n")}\n`, "utf8");

  console.log(
    JSON.stringify(
      {
        csvPath,
        outPath,
        artists: artists.length,
        songs: songs.size
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

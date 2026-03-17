import { seedArtists, seedFaqs, seedPages, seedProducts, seedReleases } from "../seed-data";

// This script is intentionally lightweight so it can be adapted to local or remote D1 seeding.
async function main() {
  console.log("Seed payload prepared.");
  console.log(
    JSON.stringify(
      {
        artists: seedArtists,
        releases: seedReleases,
        products: seedProducts,
        faq: seedFaqs,
        pages: seedPages
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


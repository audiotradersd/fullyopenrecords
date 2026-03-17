import fs from "node:fs/promises";

// Squarespace exports vary by template, so this provides a controlled bootstrap point.
async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    throw new Error("Pass the Squarespace export JSON path as the first argument.");
  }

  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);
  console.log(
    JSON.stringify(
      {
        pages: parsed?.pages ?? [],
        products: parsed?.products ?? [],
        posts: parsed?.posts ?? []
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


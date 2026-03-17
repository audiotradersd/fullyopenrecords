import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "../../infra/migrations/generated",
  dialect: "sqlite",
  dbCredentials: {
    url: "./local.db"
  }
});


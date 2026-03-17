import { drizzle } from "drizzle-orm/d1";
import * as schema from "@fully-open-records/db/src/schema";
import type { Env } from "../types";

export function getDb(env: Env) {
  return drizzle(env.DB, { schema });
}

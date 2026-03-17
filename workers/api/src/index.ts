import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { csrfGuard } from "./middleware/csrf";
import { syncRadioHistory } from "./lib/radio";
import { adminRouter } from "./routes/admin";
import { publicRouter } from "./routes/public";
import type { AppVariables, Env } from "./types";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  })
);
app.use("*", csrfGuard);

app.get("/", (c) =>
  c.json({
    name: "fully-open-records-api",
    status: "ok"
  })
);

app.route("/", publicRouter);
app.route("/admin", adminRouter);

export default {
  fetch: app.fetch,
  async scheduled(_: ScheduledController, env: Env) {
    try {
      await syncRadioHistory(env);
    } catch (error) {
      console.error("radio sync failed", error);
    }
  }
};

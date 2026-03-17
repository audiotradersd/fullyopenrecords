import { createMiddleware } from "hono/factory";
import type { Env } from "../types";

export const csrfGuard = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(c.req.method)) {
    return next();
  }

  if (c.req.path === "/stripe/webhook") {
    return next();
  }

  const origin = c.req.header("Origin");
  const hasAuthorization = Boolean(c.req.header("Authorization"));
  const allowedOrigins = [
    c.env.SITE_URL,
    "https://fullyopenrecords.com",
    "https://www.fullyopenrecords.com",
    "https://fully-open-records-web.pages.dev",
    "http://localhost:3000",
    "http://localhost:3001"
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return c.json({ error: "Origin not allowed" }, 403);
  }

  // Cookie-authenticated browser writes must present an allowed Origin.
  if (!hasAuthorization && !origin) {
    return c.json({ error: "Origin required" }, 403);
  }

  return next();
});

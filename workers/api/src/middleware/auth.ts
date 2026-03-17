import { createMiddleware } from "hono/factory";
import { resolveSessionUser } from "../lib/session";
import { verifyAdminJwt } from "../lib/auth";
import type { AppVariables, Env } from "../types";

export const optionalUser = createMiddleware<{ Bindings: Env; Variables: AppVariables }>(
  async (c, next) => {
    const user = await resolveSessionUser(c);
    if (user) {
      c.set("user", user);
    }
    await next();
  }
);

export const requireUser = createMiddleware<{ Bindings: Env; Variables: AppVariables }>(
  async (c, next) => {
    const user = await resolveSessionUser(c);

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("user", user);
    await next();
  }
);

export const requireArtist = createMiddleware<{ Bindings: Env; Variables: AppVariables }>(
  async (c, next) => {
    const user = await resolveSessionUser(c);

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (user.accountType !== "artist") {
      return c.json({ error: "Artist account required" }, 403);
    }

    c.set("user", user);
    await next();
  }
);

export const requireAdmin = createMiddleware<{ Bindings: Env; Variables: AppVariables }>(
  async (c, next) => {
  const header = c.req.header("Authorization");
  const token = header?.replace("Bearer ", "");

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    await verifyAdminJwt(c.env.JWT_SECRET, token);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
  }
);

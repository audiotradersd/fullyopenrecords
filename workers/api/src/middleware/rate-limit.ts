import { createMiddleware } from "hono/factory";

// Cloudflare WAF and bot rules should handle most abuse; this guards hot form endpoints locally.
const hits = new Map<string, { count: number; expiresAt: number }>();

export const rateLimit = createMiddleware(async (c, next) => {
  const key = c.req.header("cf-connecting-ip") ?? "unknown";
  const now = Date.now();
  const current = hits.get(key);

  if (!current || current.expiresAt < now) {
    hits.set(key, { count: 1, expiresAt: now + 60_000 });
    return next();
  }

  if (current.count > 20) {
    return c.json({ error: "Rate limit exceeded" }, 429);
  }

  current.count += 1;
  return next();
});


import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiProxy, WEB_SESSION_COOKIE, WEB_SESSION_MAX_AGE_SECONDS } from "../../../../lib/server-api";

export const runtime = "edge";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await apiProxy("/auth/register", {
    method: "POST",
    body: JSON.stringify(body)
  });

  const raw = await response.text();
  let payload: Record<string, unknown> = {};

  try {
    payload = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    payload = {
      error: raw || "Internal Server Error"
    };
  }

  if (!response.ok) {
    return NextResponse.json(payload, { status: response.status });
  }

  const sessionToken = typeof payload.sessionToken === "string" ? payload.sessionToken : "";

  cookies().set(WEB_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: "/",
    maxAge: WEB_SESSION_MAX_AGE_SECONDS
  });

  return NextResponse.json({ user: payload.user });
}

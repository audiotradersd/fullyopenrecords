import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiProxy, WEB_SESSION_COOKIE, WEB_SESSION_MAX_AGE_SECONDS } from "../../../../lib/server-api";

export const runtime = "edge";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await apiProxy("/auth/login", {
    method: "POST",
    body: JSON.stringify(body)
  });

  const payload = await response.json();
  if (!response.ok) {
    return NextResponse.json(payload, { status: response.status });
  }

  cookies().set(WEB_SESSION_COOKIE, payload.sessionToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: "/",
    maxAge: WEB_SESSION_MAX_AGE_SECONDS
  });

  return NextResponse.json({ user: payload.user });
}

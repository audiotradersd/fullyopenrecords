import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, apiProxy } from "../../../../lib/server-api";
export const runtime = "edge";
export async function POST(request: Request) {
  const response = await apiProxy("/admin/login", { method: "POST", body: JSON.stringify(await request.json()) });
  const payload = await response.json();
  if (!response.ok) return NextResponse.json(payload, { status: response.status });
  cookies().set(ADMIN_SESSION_COOKIE, payload.token, { httpOnly: true, sameSite: "strict", secure: true, path: "/", maxAge: 60 * 60 * 8 });
  return NextResponse.json({ ok: true });
}

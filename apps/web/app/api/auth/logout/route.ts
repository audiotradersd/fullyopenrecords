import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiProxy, WEB_SESSION_COOKIE } from "../../../../lib/server-api";

export const runtime = "edge";

export async function POST() {
  const token = cookies().get(WEB_SESSION_COOKIE)?.value;
  await apiProxy("/auth/logout", {
    method: "POST"
  }, token);

  cookies().delete(WEB_SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}

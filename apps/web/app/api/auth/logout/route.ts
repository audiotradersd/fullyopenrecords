import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiProxy, WEB_SESSION_COOKIE } from "../../../../lib/server-api";


export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(WEB_SESSION_COOKIE)?.value;
  await apiProxy("/auth/logout", {
    method: "POST"
  }, token);

  cookieStore.delete(WEB_SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, apiProxy } from "../../../../../lib/server-api";

export async function POST() {
  const response = await apiProxy("/admin/account-notifications/backfill", { method: "POST" }, (await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  return NextResponse.json(await response.json(), { status: response.status });
}

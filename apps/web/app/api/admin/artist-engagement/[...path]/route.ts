import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, apiProxy } from "../../../../../lib/server-api";

async function proxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const suffix = path.map(encodeURIComponent).join("/");
  const query = request.nextUrl.search;
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
  const response = await apiProxy(`/admin/artist-engagement/${suffix}${query}`, {
    method: request.method,
    ...(body ? { body } : {})
  }, (await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  return NextResponse.json(await response.json().catch(() => ({})), { status: response.status });
}

export const GET = proxy;
export const POST = proxy;
export const DELETE = proxy;

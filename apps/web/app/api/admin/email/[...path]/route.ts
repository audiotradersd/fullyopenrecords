import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, apiProxy } from "../../../../../lib/server-api";

async function proxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const suffix = path.map(encodeURIComponent).join("/");
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
  const response = await apiProxy(`/admin/email/${suffix}${request.nextUrl.search}`, {
    method: request.method,
    ...(body ? { body } : {})
  }, (await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  const contentType = response.headers.get("Content-Type") ?? "application/json; charset=utf-8";
  const disposition = response.headers.get("Content-Disposition");
  return new NextResponse(await response.text(), { status: response.status, headers: { "Content-Type": contentType, ...(disposition ? { "Content-Disposition": disposition } : {}) } });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;

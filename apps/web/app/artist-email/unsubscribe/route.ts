import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "../../../lib/server-api";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const response = await apiProxy(`/artist-email/unsubscribe?token=${encodeURIComponent(token)}`);
  return new NextResponse(await response.text(), { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") ?? "text/html; charset=utf-8" } });
}

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const contentType = request.headers.get("Content-Type") ?? "application/x-www-form-urlencoded";
  const response = await apiProxy(`/artist-email/unsubscribe?token=${encodeURIComponent(token)}`, {
    method: "POST", body: await request.text(), headers: { "Content-Type": contentType }
  });
  if (response.status === 204) return new NextResponse(null, { status: 204 });
  return new NextResponse(await response.text(), { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") ?? "text/html; charset=utf-8" } });
}

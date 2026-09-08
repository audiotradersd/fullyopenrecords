import { NextResponse } from "next/server";
import { apiProxy, getSessionToken } from "../../../../../lib/server-api";

export async function GET() {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const response = await apiProxy("/artist/me/track-versions", undefined, token);
  return NextResponse.json(await response.json(), { status: response.status });
}

export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const response = await apiProxy("/artist/me/track-versions", { method: "POST", body: JSON.stringify(await request.json()) }, token);
  return NextResponse.json(await response.json(), { status: response.status });
}

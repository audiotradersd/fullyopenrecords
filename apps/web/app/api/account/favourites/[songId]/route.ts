import { NextResponse } from "next/server";
import { apiProxy, getSessionToken } from "../../../../../lib/server-api";

export const runtime = "edge";

export async function DELETE(_: Request, { params }: { params: { songId: string } }) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const response = await apiProxy(`/account/favourites/${params.songId}`, { method: "DELETE" }, token);
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

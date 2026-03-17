import { NextResponse } from "next/server";
import { apiProxy, getSessionToken } from "../../../../../lib/server-api";


export async function DELETE(_: Request, { params }: { params: Promise<{ songId: string }> }) {
  const { songId } = await params;
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const response = await apiProxy(`/account/favourites/${songId}`, { method: "DELETE" }, token);
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

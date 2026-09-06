import { NextResponse } from "next/server";
import { apiProxy, getSessionToken } from "../../../../../../lib/server-api";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getSessionToken(); const { id } = await params;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const response = await apiProxy(`/artist/me/track-versions/${id}`, { method: "PUT", body: JSON.stringify(await request.json()) }, token);
  return NextResponse.json(await response.json(), { status: response.status });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getSessionToken(); const { id } = await params;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const response = await apiProxy(`/artist/me/track-versions/${id}`, { method: "DELETE" }, token);
  return NextResponse.json(await response.json(), { status: response.status });
}

import { NextResponse } from "next/server";
import { apiProxy, getSessionToken } from "../../../../../lib/server-api";


export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const response = await apiProxy(
    "/artist/me/gigs",
    {
      method: "POST",
      body: JSON.stringify(await request.json())
    },
    token
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

export async function DELETE(request: Request) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { id?: number };
  if (!Number.isInteger(body.id) || !body.id || body.id < 1) {
    return NextResponse.json({ error: "Gig id required" }, { status: 400 });
  }
  const response = await apiProxy(`/artist/me/gigs/${body.id}`, { method: "DELETE" }, token);
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  return NextResponse.json(payload, { status: response.status });
}

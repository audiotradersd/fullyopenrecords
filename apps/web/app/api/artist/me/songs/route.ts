import { NextResponse } from "next/server";
import { apiProxy, getSessionToken } from "../../../../../lib/server-api";

export const runtime = "edge";

export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const response = await apiProxy(
    "/artist/me/songs",
    {
      method: "POST",
      body: JSON.stringify(await request.json())
    },
    token
  );
  const text = await response.text();
  if (!response.ok) {
    console.error("artist song create failed", { status: response.status, body: text });
  }
  const payload = text ? JSON.parse(text) : {};
  return NextResponse.json(payload, { status: response.status });
}

export async function PUT(request: Request) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { id?: number };
  if (!body.id) {
    return NextResponse.json({ error: "Track id required" }, { status: 400 });
  }

  const response = await apiProxy(
    `/artist/me/songs/${body.id}`,
    {
      method: "PUT",
      body: JSON.stringify(body)
    },
    token
  );
  const text = await response.text();
  if (!response.ok) {
    console.error("artist song update failed", { status: response.status, body: text });
  }
  const payload = text ? JSON.parse(text) : {};
  return NextResponse.json(payload, { status: response.status });
}

export async function DELETE(request: Request) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { id?: number };
  if (!body.id) {
    return NextResponse.json({ error: "Track id required" }, { status: 400 });
  }

  const response = await apiProxy(
    `/artist/me/songs/${body.id}`,
    {
      method: "DELETE"
    },
    token
  );

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  return NextResponse.json(payload, { status: response.status });
}

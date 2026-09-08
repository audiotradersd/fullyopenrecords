import { NextResponse } from "next/server";
import { apiProxy, getSessionToken } from "../../../../../lib/server-api";


export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const response = await apiProxy(
    "/artist/me/photos",
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
  if (!body.id) return NextResponse.json({ error: "Photo id required" }, { status: 400 });

  const response = await apiProxy(`/artist/me/photos/${body.id}`, { method: "DELETE" }, token);
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

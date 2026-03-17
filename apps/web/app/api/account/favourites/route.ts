import { NextResponse } from "next/server";
import { apiProxy, getSessionToken } from "../../../../lib/server-api";

export const runtime = "edge";

export async function GET() {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const response = await apiProxy("/account/favourites", undefined, token);
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const response = await apiProxy(
    "/account/favourites",
    {
      method: "POST",
      body: JSON.stringify(await request.json())
    },
    token
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

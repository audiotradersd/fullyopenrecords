import { NextResponse } from "next/server";
import { apiProxy, getSessionToken } from "../../../../../lib/server-api";


export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const response = await apiProxy(
    "/artist/me/videos",
    {
      method: "POST",
      body: JSON.stringify(await request.json())
    },
    token
  );
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

import { NextResponse } from "next/server";
import { apiProxy, getSessionToken } from "../../../../../lib/server-api";


async function toJsonResponse(response: Response) {
  const text = await response.text();

  try {
    return NextResponse.json(JSON.parse(text), { status: response.status });
  } catch {
    return NextResponse.json(
      { error: text || "Request failed." },
      { status: response.status }
    );
  }
}

export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const response = await apiProxy(
    "/account/favourites/current",
    {
      method: "POST",
      body: JSON.stringify(await request.json())
    },
    token
  );
  return toJsonResponse(response);
}

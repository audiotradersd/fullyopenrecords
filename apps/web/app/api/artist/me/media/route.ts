import { NextResponse } from "next/server";
import { getApiBaseUrl, getSessionToken } from "../../../../../lib/server-api";


async function toJsonResponse(response: Response) {
  const text = await response.text();

  if (!response.ok) {
    console.error("artist media upload failed", { status: response.status, body: text });
  }

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
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const contentType = request.headers.get("content-type");
    const body = await request.arrayBuffer();

    const response = await fetch(`${getApiBaseUrl()}/artist/me/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(contentType ? { "Content-Type": contentType } : {})
      },
      body
    });

    return toJsonResponse(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload proxy failed."
      },
      { status: 500 }
    );
  }
}

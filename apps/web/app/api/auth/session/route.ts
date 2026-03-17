import { NextResponse } from "next/server";
import { apiProxy, getSessionToken } from "../../../../lib/server-api";


export async function GET() {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ user: null });
  }

  const response = await apiProxy("/auth/session", undefined, token);
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

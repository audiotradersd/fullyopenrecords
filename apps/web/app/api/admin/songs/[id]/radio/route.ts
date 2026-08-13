import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, apiProxy } from "../../../../../../lib/server-api";

export const runtime = "edge";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await apiProxy(`/admin/songs/${id}/radio`, { method: "PUT", body: JSON.stringify(await request.json()) }, cookies().get(ADMIN_SESSION_COOKIE)?.value);
  return NextResponse.json(await response.json(), { status: response.status });
}

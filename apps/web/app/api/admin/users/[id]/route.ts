import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, apiProxy } from "../../../../../lib/server-api";


export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await apiProxy(`/admin/users/${id}`, { method: "DELETE" }, (await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  return NextResponse.json(await response.json(), { status: response.status });
}

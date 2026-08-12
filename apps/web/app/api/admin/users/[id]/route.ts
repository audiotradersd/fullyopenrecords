import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, apiProxy } from "../../../../../lib/server-api";

export const runtime = "edge";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const response = await apiProxy(`/admin/users/${params.id}`, { method: "DELETE" }, cookies().get(ADMIN_SESSION_COOKIE)?.value);
  return NextResponse.json(await response.json(), { status: response.status });
}

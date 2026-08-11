import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, apiProxy } from "../../../../../../lib/server-api";
export const runtime = "edge";
export async function POST(_request: Request, { params }: { params: { id: string } }) { const response = await apiProxy(`/admin/songs/${params.id}/approve`, { method: "POST" }, cookies().get(ADMIN_SESSION_COOKIE)?.value); return NextResponse.json(await response.json(), { status: response.status }); }

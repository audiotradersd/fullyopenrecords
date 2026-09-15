import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, apiProxy } from "../../../../lib/server-api";
export async function GET() { const response = await apiProxy("/admin/artist-tiers", undefined, (await cookies()).get(ADMIN_SESSION_COOKIE)?.value); return NextResponse.json(await response.json(), { status: response.status }); }
export async function POST(request: Request) { const response = await apiProxy("/admin/artist-tiers", { method: "POST", body: JSON.stringify(await request.json()) }, (await cookies()).get(ADMIN_SESSION_COOKIE)?.value); return NextResponse.json(await response.json(), { status: response.status }); }

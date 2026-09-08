import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, apiProxy } from "../../../../../../lib/server-api";
export async function PUT(request: Request, { params }: { params: Promise<{ slotKey: string }> }) { const { slotKey } = await params; const response = await apiProxy(`/admin/editorial/artists/${slotKey}`, { method: "PUT", body: JSON.stringify(await request.json()) }, (await cookies()).get(ADMIN_SESSION_COOKIE)?.value); return NextResponse.json(await response.json(), { status: response.status }); }

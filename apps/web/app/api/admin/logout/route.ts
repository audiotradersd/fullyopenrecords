import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "../../../../lib/server-api";
export async function POST() { (await cookies()).set(ADMIN_SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 }); return NextResponse.json({ ok: true }); }

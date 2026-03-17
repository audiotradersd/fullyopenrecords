import { cookies } from "next/headers";

export const WEB_SESSION_COOKIE = "for_web_session";
export const WEB_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_BASE_URL ?? "https://api.fullyopenrecords.com";

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function getSessionToken() {
  return (await cookies()).get(WEB_SESSION_COOKIE)?.value;
}

export async function apiProxy(
  path: string,
  init?: RequestInit,
  token?: string | null
) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fullyopenrecords.com";
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  return response;
}

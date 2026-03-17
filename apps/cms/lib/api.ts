import { getToken } from "./auth";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8787";

export async function cmsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`CMS request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}


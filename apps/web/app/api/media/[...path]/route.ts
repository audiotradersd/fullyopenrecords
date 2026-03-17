import { getApiBaseUrl } from "../../../../lib/server-api";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const target = `${getApiBaseUrl()}/media/${params.path.join("/")}`;
  const response = await fetch(target, {
    headers: {
      ...(request.headers.get("range") ? { Range: request.headers.get("range") as string } : {})
    },
    cache: "no-store"
  });

  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", "*");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export async function HEAD(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const target = `${getApiBaseUrl()}/media/${params.path.join("/")}`;
  const response = await fetch(target, {
    method: "HEAD",
    headers: {
      ...(request.headers.get("range") ? { Range: request.headers.get("range") as string } : {})
    },
    cache: "no-store"
  });

  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", "*");
  return new Response(null, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

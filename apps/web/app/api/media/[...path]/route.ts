import { getApiBaseUrl } from "../../../../lib/server-api";


export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const target = `${getApiBaseUrl()}/media/${path.join("/")}`;
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
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const target = `${getApiBaseUrl()}/media/${path.join("/")}`;
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

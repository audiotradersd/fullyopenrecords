import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: repoRoot,
  async redirects() {
    return [{ source: "/release/:slug", destination: "/releases/:slug", permanent: true }];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.squarespace-cdn.com" },
      { protocol: "https", hostname: "static1.squarespace.com" },
      { protocol: "https", hostname: "api.fullyopenrecords.com" },
      { protocol: "https", hostname: "fully-open-records-api.sbdownes.workers.dev" }
    ]
  }
};

export default nextConfig;

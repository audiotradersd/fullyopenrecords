/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  images: {
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

import type { NextConfig } from "next";

const rawBackend =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://sitecraft-ai-aorg.onrender.com"
    : "http://localhost:5000");

const backendUrl = rawBackend.replace(/\/api\/?$/, "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

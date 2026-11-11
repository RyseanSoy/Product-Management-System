import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tudublin11.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/ec7ulxcg/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8090",
        pathname: "/api/files/**",
      },
    ],
  },

  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "fuzzy-funicular-9656x5v6g397qr-3000.app.github.dev",
        "*.app.github.dev",
      ],
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // Permanent, path-preserving apex → canonical www redirect (domain must be added in Vercel).
  async redirects() {
    return [{
      source: "/:path*",
      has: [{ type: "host" as const, value: "vyntexusa.com" }],
      destination: "https://www.vyntexusa.com/:path*",
      permanent: true,
    }];
  },

  // Logo is served from /public. No remote image hosts are used yet.
  images: {
    remotePatterns: [],
  },

  
};

export default config;

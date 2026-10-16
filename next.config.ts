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
    }, {
      source: "/es/industrias/professional-services", destination: "/es/industrias/servicios-profesionales", permanent: true,
    }, {
      source: "/es/industrias/home-services", destination: "/es/industrias/servicios-para-el-hogar", permanent: true,
    }, {
      source: "/es/industrias/restaurants-retail", destination: "/es/industrias/restaurantes-y-tiendas", permanent: true,
    }, {
      source: "/es/industrias/beauty-wellness", destination: "/es/industrias/belleza-y-bienestar", permanent: true,
    }, {
      source: "/es/industrias/startups", destination: "/es/industrias/empresas-nuevas", permanent: true,
    }, {
      source: "/es/industrias/multilingual-businesses", destination: "/es/industrias/negocios-bilingues", permanent: true,
    }];
  },

  // Logo is served from /public. No remote image hosts are used yet.
  images: {
    remotePatterns: [],
  },

  
};

export default config;

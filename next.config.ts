import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/articoli',
        destination: '/articles',
        permanent: true,
      },
      {
        source: '/articoli/:slug',
        destination: '/articles/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

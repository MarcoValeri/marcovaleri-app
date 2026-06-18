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
      {
        source: '/chi-sono',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/contatti',
        destination: '/contact',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

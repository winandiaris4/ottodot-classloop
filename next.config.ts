import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    staleTimes: {
      dynamic: 300,
      static: 600,
    },
  },
};

export default nextConfig;

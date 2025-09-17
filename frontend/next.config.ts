import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/', destination: '/index.html' },
      { source: '/registro', destination: '/registro.html' },
    ];
  },
};

export default nextConfig;

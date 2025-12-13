import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Silence the turbopack webpack config warning
  },
  serverExternalPackages: ['pino', 'pino-pretty'],
  // Exclude test files and non-JS files from build
  transpilePackages: ['@stacks/connect'],
};

export default nextConfig;

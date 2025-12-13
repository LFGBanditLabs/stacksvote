import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  // Exclude test files and non-JS files from build
  transpilePackages: ['@stacks/connect'],
};

export default nextConfig;

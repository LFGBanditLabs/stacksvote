import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly disable Turbopack
  experimental: {
    // @ts-ignore - turbo is valid but not in types
    turbo: false,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  serverExternalPackages: ['pino', 'pino-pretty', 'lokijs', 'encoding'],
  transpilePackages: ['@stacks/connect', '@walletconnect/universal-provider'],
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveExtensions: [
        '.mdx',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.mjs',
        '.json',
      ],
    },
  },
  serverExternalPackages: ['pino', 'pino-pretty', 'lokijs', 'encoding'],
  transpilePackages: ['@stacks/connect', '@walletconnect/universal-provider'],
};

export default nextConfig;

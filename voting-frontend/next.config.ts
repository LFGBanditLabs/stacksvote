import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino', 'pino-pretty', 'lokijs', 'encoding'],
  transpilePackages: ['@stacks/connect', '@walletconnect/universal-provider'],
};

export default nextConfig;

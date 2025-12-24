/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack for compatibility
  turbo: false,
  
  // Enable strict mode
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: [],
  },
  
  // Environment variables available on client side
  env: {
    NEXT_PUBLIC_APP_NAME: 'Stacks Voting',
  },
  
  // Webpack configuration
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;

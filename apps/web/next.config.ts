import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  transpilePackages: [
    '@moonlight/shared',
    '@moonlight/ai',
    '@moonlight/video',
    '@moonlight/subtitles',
    '@moonlight/ui',
  ],
};

export default nextConfig;

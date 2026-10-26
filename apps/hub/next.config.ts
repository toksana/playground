import type { NextConfig } from 'next';

// The halloween zone is a separate Vercel project; the hub proxies /halloween to it.
const HALLOWEEN_URL = process.env.HALLOWEEN_URL ?? 'http://localhost:3001';

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['@playground/shared'],
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  rewrites: async () => [
    { source: '/halloween', destination: `${HALLOWEEN_URL}/halloween` },
    {
      source: '/halloween/:path+',
      destination: `${HALLOWEEN_URL}/halloween/:path+`,
    },
  ],
};

export default nextConfig;

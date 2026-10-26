import type { NextConfig } from 'next';
import { BASE_PATH } from './src/lib/basePath';

const nextConfig: NextConfig = {
  basePath: BASE_PATH,
  cacheComponents: true,
  partialPrefetching: true,
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
};

export default nextConfig;

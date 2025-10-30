import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aeiouly.s3.ap-southeast-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        port: '',
        pathname: '/**',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        port: '',
        pathname: '/**',
        hostname: 'i.ytimg.com',
      },
    ],
  },
};

export default nextConfig;

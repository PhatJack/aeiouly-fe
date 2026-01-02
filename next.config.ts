import type { NextConfig } from 'next';

const apiUrl = process.env.NEXT_PUBLIC_DJANGO_SERVER_URL_DEFAULT || 'http://localhost:8000';

const target = apiUrl.replace(/\/api\/v1$/, '').replace(/\/api$/, '') || 'http://localhost:8000';

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
      {
        protocol: 'https',
        hostname: 'xsgames.co',
        port: '',
        pathname: '/randomusers/assets/avatars/**',
      },
      {
        protocol: 'https',
        hostname: 'i1.sndcdn.com',
        port: '',
        pathname: '/artworks-**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${target}/api/v1/:path*`,
      },
      {
        source: '/online/ws/:path*',
        destination: `${target}/online/ws/:path*`,
      },
    ];
  },
};

export default nextConfig;

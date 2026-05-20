/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'meeynailshop-api.onrender.com',
      },
    ],
  },
  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const defaultBackend = isProduction ? 'https://meeynailshop-api.onrender.com' : 'http://localhost:3001';
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || defaultBackend)
      .replace(/\/api\/?$/, '')
      .replace(/\/$/, '');
      
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${apiUrl}/uploads/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/connexion',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig

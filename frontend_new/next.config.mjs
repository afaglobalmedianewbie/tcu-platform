/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://backend:3000'}/api/:path*`,
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/portal',
        destination: '/login',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;

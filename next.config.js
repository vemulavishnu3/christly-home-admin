/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
      {
        source: '/churches',
        destination: '/admin/churches',
        permanent: false,
      },
      {
        source: '/churches/verify',
        destination: '/admin/churches/verify',
        permanent: false,
      },
      {
        source: '/churches/new',
        destination: '/admin/churches/new',
        permanent: false,
      },
      {
        source: '/audit-logs',
        destination: '/admin/audit-logs',
        permanent: false,
      },
    ];
  },
}

module.exports = nextConfig

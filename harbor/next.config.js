/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/api/academy-documents': ['./academy-documents/private/**/*'],
    '/api/academy-videos': ['./academy-videos/private/**/*'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/academy-documents/customer/:file*',
          destination: '/api/academy-documents?file=:file*',
        },
        {
          source: '/academy-videos/:file*',
          destination: '/api/academy-videos?file=:file*',
        },
      ],
    };
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

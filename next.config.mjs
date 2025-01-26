/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.pexels.com',
        port: '',
        pathname: '/photo/**',
      },
      {
        protocol: 'https',
        hostname: 'player.vimeo.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'v.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

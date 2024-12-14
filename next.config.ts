import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/5.x/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Add other domains here as needed
      },
    ],
    dangerouslyAllowSVG: true,
  }
};

export default nextConfig;

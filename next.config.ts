import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn3.iconfinder.com",
      },
    ],
  },
};

export default nextConfig;

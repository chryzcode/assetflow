import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  images: {
    domains: ["ipfs.io", "gateway.pinata.cloud"], // Allow IPFS images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ipfs.io", // Supports ipfs.io and subdomains
        pathname: "/**", // Allow all paths
      },
      {
        protocol: "https",
        hostname: "**.gateway.pinata.cloud", // Alternative IPFS gateway
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

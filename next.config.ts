import type { NextConfig } from "next";
import path from "path";

function getConfiguredR2Hostname() {
  const baseUrl = process.env.R2_PUBLIC_BASE_URL;
  if (!baseUrl) return null;
  try {
    return new URL(baseUrl).hostname;
  } catch {
    return null;
  }
}

const configuredR2Hostname = getConfiguredR2Hostname();

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "resolutionrealtygroup.com"
      },
      {
        protocol: "https",
        hostname: "www.resolutionrealtygroup.com"
      },
      {
        protocol: "https",
        hostname: "*.r2.dev"
      },
      ...(configuredR2Hostname
        ? [
            {
              protocol: "https" as const,
              hostname: configuredR2Hostname
            }
          ]
        : [])
    ]
  },
  async redirects() {
    return [
      { source: "/blog", destination: "/blogs/", permanent: true },
      { source: "/blog/", destination: "/blogs/", permanent: true },
      { source: "/contact", destination: "/contact-us-texas-real-estate/", permanent: true },
      { source: "/contact/", destination: "/contact-us-texas-real-estate/", permanent: true },
      { source: "/terms", destination: "/terms-and-conditions/", permanent: true },
      { source: "/terms/", destination: "/terms-and-conditions/", permanent: true }
    ];
  },
  turbopack: {
    root: path.resolve(__dirname)
  }
};

export default nextConfig;

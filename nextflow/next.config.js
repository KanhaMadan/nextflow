/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.transloadit.com", "uploadcare.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ["@trigger.dev/sdk"],
  },
};

module.exports = nextConfig;

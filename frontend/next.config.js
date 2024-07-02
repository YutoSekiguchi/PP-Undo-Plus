/** @type {import('next').NextConfig} */

const dotenv = require('dotenv');
dotenv.config();

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    API_URL: process.env.MODE === 'production' ? process.env.API_URL_PROD : process.env.API_URL_DEV,
    FILE_SERVER_URL: process.env.MODE === 'production' ? process.env.FILE_SERVER_URL_PROD : process.env.FILE_SERVER_URL_DEV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    VERSION: process.env.VERSION,
    // APP_PASS: process.env.APP_PASS,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
});

module.exports = nextConfig
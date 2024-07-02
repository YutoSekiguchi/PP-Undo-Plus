/** @type {import('next').NextConfig} */

const dotenv = require('dotenv');
dotenv.config();

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

// const withTM = require('next-transpile-modules')(['pdfjs-dist']);

const nextConfig = withPWA({
  reactStrictMode: true,
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
  },
  // TODO: pdf読み取りがおかしいので確認
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /pdf\.worker\.min\.mjs$/,
        type: 'javascript/auto',
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'static/js/',
            publicPath: '/_next/static/js/',
          },
        },
      });

      config.output.globalObject = 'self';
    }

    return config;
  },
});

module.exports = nextConfig;

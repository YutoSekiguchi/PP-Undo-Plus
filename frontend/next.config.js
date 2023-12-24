/** @type {import('next').NextConfig} */

const dotenv = require('dotenv');
dotenv.config();

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  env: {
    API_URL: process.env.MODE=="production" ? process.env.API_URL_PROD : process.env.API_URL_DEV,
    VERSION: process.env.VERSION,
    // APP_PASS: process.env.APP_PASS,
  },
}

module.exports = nextConfig
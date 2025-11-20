/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['findminigolf.com'],
    unoptimized: process.env.NODE_ENV === 'development'
  }
}

module.exports = nextConfig
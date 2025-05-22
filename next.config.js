/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    port: 3050
  },
  images: {
    domains: ['res.cloudinary.com']
  }
}

module.exports = nextConfig


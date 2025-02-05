/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '**.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'gravatar.com',
      },
      {
        protocol: 'https',
        hostname: '**.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'giphy.com',
      },
      {
        protocol: 'https',
        hostname: '**.giphy.com',
      },
      {
        protocol: 'https',
        hostname: 'media.giphy.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      }
    ],
  },
}

module.exports = nextConfig 
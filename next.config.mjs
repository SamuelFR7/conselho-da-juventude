!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig

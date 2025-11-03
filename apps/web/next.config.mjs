import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  transpilePackages: ['@slidesai/domain'],
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(dirname, 'src')
    return config
  },
}

export default nextConfig

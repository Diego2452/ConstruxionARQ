/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/nuevo', // <--- Agrega esto para que Next.js sepa que está en esa subcarpeta
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },               // simple
  experimental: { optimizeCss: true },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
  }
};
export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PRODUCTION INTEGRATION POINT - Images:
  // Product media in this prototype is rendered as inline branded SVG placeholders.
  // In production, serve owner-uploaded media from secure cloud object storage behind a
  // CDN, add that host to `images.remotePatterns`, and use next/image so the
  // thumbnail / standard / large / mobile renditions are delivered as WebP or AVIF.
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
};

export default nextConfig;

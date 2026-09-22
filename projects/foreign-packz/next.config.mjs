/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This prototype has no server: no database, no payment provider, no POS. It builds to
  // plain static files so it can be previewed on any static host. A production build would
  // drop this and render on a server, because age gating, inventory checks, order
  // persistence and every permission check must happen server-side.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // PRODUCTION INTEGRATION POINT - Images:
  // Product media in this prototype is rendered as inline branded SVG placeholders.
  // In production, serve owner-uploaded media from secure cloud object storage behind a
  // CDN, add that host to `images.remotePatterns`, and use next/image so the
  // thumbnail / standard / large / mobile renditions are delivered as WebP or AVIF.
};

export default nextConfig;

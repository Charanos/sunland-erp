import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // 90 is the hero-art tier. At AVIF, 90 is visually indistinguishable from
    // 100 on photographic content while costing roughly half the bytes, and
    // these heroes are `priority` so they sit directly on Largest Contentful
    // Paint. 75 stays for incidental imagery, 100 for the few places that
    // genuinely need it. Next rejects any quality not listed here, so this
    // array is the allowlist rather than a hint.
    qualities: [75, 90, 100],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

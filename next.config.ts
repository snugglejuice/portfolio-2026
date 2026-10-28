import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export to `out/` for GitHub Pages (marionseminel.ch).
  output: "export",
  // Pages has no image optimizer, so serve next/image sources as-is.
  images: { unoptimized: true },
  experimental: {
    // Morphs the /work accordion visual into the project hero on navigation.
    viewTransition: true,
  },
};

export default nextConfig;

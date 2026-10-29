import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export to `out/` for GitHub Pages (marionseminel.ch).
  output: "export",
  images: {
    // Pages has no image optimizer: a custom loader points next/image's
    // srcset at pre-generated copies (see lib/imageLoader.ts).
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    // The widths copies exist for (scripts/generate-image-variants.mjs),
    // then the larger originals.
    deviceSizes: [560, 750, 1200, 1920, 2560],
  },
  experimental: {
    // Morphs the /work accordion visual into the project hero on navigation.
    viewTransition: true,
  },
};

export default nextConfig;

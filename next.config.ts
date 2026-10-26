import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Morphs the /work accordion visual into the project hero on navigation.
    viewTransition: true,
  },
};

export default nextConfig;

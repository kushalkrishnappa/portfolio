import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The listing moved from /blog to /blogs; keep old links working.
      { source: "/blog", destination: "/blogs", permanent: true },
    ];
  },
};

export default nextConfig;

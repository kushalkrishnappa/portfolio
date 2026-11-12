import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // The OG card is also embedded by URL in the email signature. Next serves
      // metadata images as immutable for a year, which would freeze Gmail's
      // proxied copy; an hour lets a redesign reach the signature.
      {
        source: "/opengraph-image",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, must-revalidate" }],
      },
    ];
  },
  async redirects() {
    return [
      // The listing moved from /blog to /blogs; keep old links working.
      { source: "/blog", destination: "/blogs", permanent: true },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: "export",
  output: "export", // This ensures only static HTML files are generated
  distDir: "build",
};

export default nextConfig;

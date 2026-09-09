import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimales, eigenständiges Deployment-Bundle für den Docker-Runtime-Stage
  // (.next/standalone) — siehe Dockerfile.
  output: "standalone",
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // ⚠️ Ignorar errores de TypeScript durante la producción
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

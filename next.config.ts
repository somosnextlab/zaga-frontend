import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuración para paquetes externos del servidor
  serverExternalPackages: ['@supabase/ssr'],
  
  // Configuración de webpack para manejar variables de entorno
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Durante el build del servidor, asegurar que las variables estén disponibles
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  
  // Configuración para el build
  typescript: {
    // Ignorar errores de TypeScript durante el build si es necesario
    ignoreBuildErrors: false,
  },
  
  // Configuración de output para Vercel
  output: 'standalone',
};

export default nextConfig;

import packageJson from './package.json' with { type: 'json' };
const { version } = packageJson;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para paquetes externos del servidor
  serverExternalPackages: ['@supabase/ssr'],
  
  // Output optimizado para Vercel
  output: 'standalone',
  
  // Variables de entorno disponibles en el cliente
  env: {
    version,
  },
  
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
};

export default nextConfig;

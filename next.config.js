/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para paquetes externos del servidor
  serverExternalPackages: ['@supabase/ssr'],
  
  // Output optimizado para Vercel
  output: 'standalone',
  
  // Configuración experimental para mejor performance
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  
  // Configuración de webpack para optimización de bundle
  webpack: (config, { isServer, dev }) => {
    if (isServer) {
      // Durante el build del servidor, asegurar que las variables estén disponibles
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Optimizaciones para bundle splitting
    if (!isServer && !dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Chunk para vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Chunk para componentes de UI
          ui: {
            test: /[\\/]app[\\/]components[\\/]ui[\\/]/,
            name: 'ui-components',
            chunks: 'all',
            priority: 8,
          },
          // Chunk para componentes de autenticación
          auth: {
            test: /[\\/]app[\\/]components[\\/]auth[\\/]/,
            name: 'auth-components',
            chunks: 'all',
            priority: 7,
          },
          // Chunk para componentes core
          core: {
            test: /[\\/]app[\\/]components[\\/]core[\\/]/,
            name: 'core-components',
            chunks: 'all',
            priority: 6,
          },
          // Chunk para páginas de autenticación
          authPages: {
            test: /[\\/]app[\\/]auth[\\/]/,
            name: 'auth-pages',
            chunks: 'all',
            priority: 5,
          },
          // Chunk para dashboards
          dashboards: {
            test: /[\\/]app[\\/]\(admin\)|\(private\)[\\/]/,
            name: 'dashboards',
            chunks: 'all',
            priority: 4,
          },
          // Chunk para utilidades
          utils: {
            test: /[\\/]app[\\/]lib[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 3,
          },
        },
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

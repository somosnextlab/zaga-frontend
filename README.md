# 🏦 Zaga Frontend

Frontend de la aplicación Zaga, una plataforma de préstamos desarrollada con Next.js 15 y Supabase Auth.

## 🚀 Características

- **Autenticación segura** con Supabase Auth
- **Control de acceso basado en roles** (Admin/Cliente)
- **Dashboard diferenciado** según el tipo de usuario
- **API wrapper** con JWT automático
- **Diseño responsive** y moderno
- **Componentes reutilizables** y escalables

## 🛠️ Tecnologías

- **Framework:** Next.js 15 (App Router)
- **Autenticación:** Supabase Auth
- **Estilos:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Lenguaje:** TypeScript
- **Formateo:** Prettier
- **Linting:** ESLint

## 📁 Estructura del Proyecto

```
zaga-frontend/
├── app/                          # App Router de Next.js
│   ├── (admin)/                  # Rutas del panel administrativo
│   │   └── adminDashboard/       # Dashboard de administrador
│   ├── (private)/                # Rutas del panel de cliente
│   │   └── userDashboard/        # Dashboard de cliente
│   ├── auth/                     # Autenticación
│   │   ├── login/               # Página de login
│   │   └── signout/             # Ruta de logout
│   ├── lib/                     # Utilidades y configuración
│   │   ├── constants/           # Constantes (rutas, etc.)
│   │   ├── supabase/            # Cliente Supabase
│   │   ├── types/               # Tipos TypeScript
│   │   └── utils/               # Funciones utilitarias
│   └── prestamos/               # Página de préstamos
├── components/                   # Componentes reutilizables
│   ├── core/                    # Componentes principales
│   │   ├── DashboardLayout.tsx  # Layout común para dashboards
│   │   ├── StatCard.tsx         # Tarjeta de estadísticas
│   │   ├── QuickActions.tsx     # Acciones rápidas
│   │   ├── footer.tsx           # Footer
│   │   └── loan-simulator.tsx   # Simulador de préstamos
│   └── ui/                      # Componentes UI (shadcn/ui)
├── lib/                         # Utilidades globales
│   ├── api.ts                   # Wrapper para API con JWT
│   ├── supabaseClient.ts        # Cliente Supabase
│   └── utils.ts                 # Utilidades generales
└── middleware.ts                # Middleware de autenticación
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 🔐 Autenticación

### Roles de Usuario

- **Admin:** Acceso completo al sistema, gestión de usuarios y préstamos
- **Cliente:** Acceso a su panel personal, visualización de préstamos propios

### Flujo de Autenticación

1. **Login:** Usuario ingresa credenciales en `/auth/login`
2. **Verificación:** Supabase valida las credenciales
3. **Redirección:** Según el rol (`user_metadata.role`):
   - Admin → `/adminDashboard`
   - Cliente → `/userDashboard`
4. **JWT:** Token incluido automáticamente en todas las requests al backend

## 🎨 Componentes Principales

### DashboardLayout

Layout común para ambos dashboards con:

- Header con información del usuario
- Indicador de rol
- Área de contenido personalizable

### StatCard

Tarjeta reutilizable para mostrar estadísticas:

- Icono personalizable
- Título y valor
- Colores configurables

### QuickActions

Componente para acciones rápidas:

- Grid responsive
- Iconos y títulos personalizables
- Número de columnas configurable

## 🔌 API Integration

### apiFetch

Wrapper que automáticamente:

- Incluye JWT en el header `Authorization`
- Maneja errores 401 (redirección a login)
- Proporciona funciones helper: `apiGet`, `apiPost`, `apiPut`

```typescript
// Ejemplo de uso
const response = await apiGet('/prestamos');
const data = await parseApiResponse<PrestamosResponse>(response);
```

## 🛡️ Seguridad

- **Middleware:** Protección de rutas en el servidor
- **JWT:** Tokens seguros para autenticación
- **RLS:** Row Level Security en Supabase
- **Validación:** Validación de tipos con TypeScript

## 📱 Responsive Design

- **Mobile-first:** Diseño optimizado para móviles
- **Breakpoints:** Adaptación a diferentes tamaños de pantalla
- **Touch-friendly:** Interfaz táctil optimizada

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage

# Tests una sola vez
npm run test:single
```

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Variables de Entorno en Producción

Asegúrate de configurar las mismas variables de entorno en tu plataforma de deployment.

## 📋 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linting con ESLint
- `npm test` - Ejecutar tests
- `npm run test:coverage` - Tests con coverage

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad de NextLab.

## 🆘 Soporte

Para soporte técnico, contacta al equipo de desarrollo de NextLab.

---

**Desarrollado con ❤️ por NextLab**

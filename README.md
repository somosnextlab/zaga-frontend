# 🏦 Zaga Frontend

Plataforma de préstamos desarrollada con Next.js 15, Supabase Auth y Tailwind CSS.

## 🚀 Características

- **Autenticación segura** con Supabase Auth y roles (Admin/Cliente)
- **Dashboard diferenciado** según tipo de usuario
- **API wrapper** con JWT automático
- **Diseño responsive** con shadcn/ui
- **Componentes reutilizables** siguiendo principios SOLID

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15 (App Router)
- **Autenticación:** Supabase Auth
- **Estilos:** Tailwind CSS + SCSS
- **UI:** shadcn/ui
- **Lenguaje:** TypeScript
- **Testing:** Jest + React Testing Library

## 📁 Estructura del Proyecto

```
zaga-frontend/
├── app/                          # App Router de Next.js
│   ├── (admin)/                  # Panel administrativo
│   ├── (private)/                # Panel de cliente
│   ├── auth/                     # Autenticación (login, register, etc.)
│   ├── api/                      # API Routes
│   ├── components/               # Componentes reutilizables
│   │   ├── auth/                 # Componentes de autenticación
│   │   ├── core/                 # Componentes principales
│   │   └── ui/                   # Componentes UI (shadcn/ui)
│   ├── lib/                      # Utilidades y configuración
│   │   ├── auth/                 # Lógica de autenticación
│   │   ├── constants/            # Constantes
│   │   ├── hooks/                # Hooks personalizados
│   │   ├── services/             # Servicios
│   │   ├── supabase/             # Cliente Supabase
│   │   └── utils/                # Utilidades
│   ├── prestamos/                # Página de préstamos
│   ├── api.ts                    # Wrapper API con JWT
│   └── page.tsx                  # Página principal
├── docs/                         # Documentación
├── middleware.ts                 # Middleware de autenticación
└── package.json                  # Dependencias
```

## ⚙️ Configuración

### Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Instalación

```bash
npm install          # Instalar dependencias
npm run dev          # Desarrollo
npm run build        # Producción
npm run start        # Servidor producción
```

## 🔐 Autenticación

**Roles:** Admin (acceso completo) | Cliente (panel personal)

**Flujo:**
1. Login en `/auth/login`
2. Supabase valida credenciales
3. Redirección según rol: Admin → `/adminDashboard` | Cliente → `/userDashboard`
4. JWT automático en todas las requests

## 🏗️ Arquitectura

### Estructura de Componentes (SOLID)
```
ComponentName/
├── ComponentName.tsx           # Componente principal
├── ComponentName.types.ts      # Tipos TypeScript
├── ComponentName.module.scss   # Estilos SCSS
└── __test__/                   # Tests
    └── ComponentName.test.tsx
```

### Convenciones
- **Componentes**: PascalCase (`DashboardLayout`)
- **Archivos**: PascalCase para componentes, camelCase para utilidades
- **Tests**: `[nombre].test.tsx`

## 🎨 Componentes Principales

- **DashboardLayout**: Layout común con header y área de contenido
- **StatCard**: Tarjeta de estadísticas reutilizable
- **QuickActions**: Grid de acciones rápidas responsive

## 🔌 API Integration

```typescript
// Uso del wrapper API
const response = await apiGet('/prestamos');
const data = await parseApiResponse<PrestamosResponse>(response);
```

**Características:**
- JWT automático en headers
- Manejo de errores 401
- Funciones helper: `apiGet`, `apiPost`, `apiPut`

## 🧪 Testing

**Estado:** ✅ Lint | ✅ Build | ⚠️ Tests (configuración actualizada)

```bash
npm test                    # Ejecutar tests
npm run test:coverage       # Tests con coverage
```

**Framework:** Jest + React Testing Library

## 🚀 Deployment

```bash
npm i -g vercel
vercel
```

## 📋 Scripts

- `npm run dev` - Desarrollo
- `npm run build` - Producción
- `npm run lint` - ESLint
- `npm test` - Tests

## 🔄 Cambios Recientes

### ✅ Reestructuración Completa
- `components/` y `lib/` movidos dentro de `app/`
- Componentes anidados con archivos `.types.ts` y `.module.scss`
- Imports actualizados para nueva estructura
- Lint limpio y build exitoso
- Archivos duplicados eliminados

### 🚧 En Progreso
- Tests: Mocks actualizados, ajustes menores pendientes

---

**Desarrollado con ❤️ por NextLab**

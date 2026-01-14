# 🏦 Zaga Frontend

Plataforma de préstamos personales con Next.js 15, Supabase Auth y shadcn/ui.

## 🚀 Inicio Rápido

```bash
npm install           # Instalar dependencias
npm run dev           # Desarrollo (con Turbopack)
npm run build         # Build de producción
npm test              # Ejecutar tests
```

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15 (App Router)
- **Autenticación:** Supabase Auth
- **UI:** shadcn/ui + Tailwind CSS
- **Estilos:** SCSS
- **Testing:** Jest + React Testing Library

## ⚙️ Configuración

### Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Estructura del Proyecto

```
app/
├── (admin)/          # Panel administrativo
├── auth/             # Login (admin)
├── api/              # API Routes
├── components/        # Componentes (auth, core, ui)
├── lib/              # Utilidades (auth, supabase, api)
└── page.tsx          # Landing page
```

## 🔐 Autenticación

Sistema de roles con Supabase:
- **Admin**: `/adminDashboard`

El proxy redirige automáticamente según el rol del usuario.

## 🏗️ Arquitectura

### Convenciones SOLID
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.types.ts
├── ComponentName.module.scss
└── __test__/
    └── ComponentName.test.tsx
```

### Nomenclatura
- Componentes: PascalCase
- Archivos: PascalCase (componentes) / camelCase (utils)
- Tests: `[nombre].test.tsx`

## 🔌 API

Wrapper API con JWT automático:
```typescript
import { apiGet, parseApiResponse } from '@/utils/api';

const response = await apiGet('/prestamos');
const data = await parseApiResponse<PrestamosResponse>(response);
```

## 📦 Scripts

- `dev` - Desarrollo con Turbopack
- `build` - Build de producción
- `start` - Servidor de producción
- `lint` - ESLint
- `test` - Tests en watch
- `test:coverage` - Tests con coverage

## 🚀 Deployment

```bash
npm i -g vercel
vercel
```

---

**Desarrollado por NextLab**
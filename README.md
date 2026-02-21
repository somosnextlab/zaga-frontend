# 🏦 Zaga Frontend

Plataforma de préstamos personales con Next.js (App Router) y shadcn/ui.

## 🚀 Inicio Rápido

```bash
npm install           # Instalar dependencias
npm run dev           # Desarrollo (con Turbopack)
npm run build         # Build de producción
npm test              # Ejecutar tests
```

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **UI:** shadcn/ui + Tailwind CSS
- **Estilos:** SCSS
- **Testing:** Jest + React Testing Library

## ⚙️ Configuración

### Variables de Entorno

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_TERMS_ACCEPT_MOCK_TOKEN=
```

### Estructura del Proyecto

```
app/
├── (admin)/          # Panel administrativo
├── auth/             # Rutas de autenticación (actualmente en mantenimiento)
├── api/              # API Routes
├── components/        # Componentes (auth, core, ui)
├── terms/            # Términos y aceptación por token
└── page.tsx          # Landing page
```

## 🔐 Autenticación

El flujo de autenticación/admin **está temporalmente en mantenimiento** mientras se migra la solución de auth.

- **Rutas afectadas:** `/auth/*`, `/adminDashboard` (muestran aviso de mantenimiento).
- **API afectada:** `/api/auth` responde `503` (mantenimiento).

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

Helpers de fetch (cliente/servidor) en `app/utils/apiCallUtils/`.

## 📦 Scripts

- `dev` - Desarrollo con Turbopack
- `build` - Build de producción
- `start` - Servidor de producción
- `lint` - ESLint
- `test` - Tests (Jest)
- `test:watch` - Tests en watch
- `test:coverage` - Tests con coverage

## 🚀 Deployment

```bash
npm i -g vercel
vercel
```

---

**Desarrollado por NextLab**
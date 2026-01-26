function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (trimmed.length === 0) return "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

/**
 * Devuelve la base del backend desde `NEXT_PUBLIC_BACKEND_URL`.
 *
 * Reglas:
 * - Si está definida, se trimea y se elimina el trailing slash.
 * - Si NO está definida:
 *   - En desarrollo: lanza un error claro para detectarlo rápido.
 *   - En otros entornos (test/production): devuelve `null` para fallar controladamente
 *     en el flujo que la consuma (manteniendo el UX existente).
 */
export function getBackendBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "Falta la variable de entorno NEXT_PUBLIC_BACKEND_URL. Configurala para construir los endpoints del backend (por ejemplo: https://.../).",
      );
    }
    return null;
  }

  return trimmed.replace(/\/+$/, "");
}

/**
 * Construye una URL absoluta al backend, evitando doble slash.
 *
 * Si `NEXT_PUBLIC_BACKEND_URL` no está definida, devuelve un path relativo
 * (p. ej. `/consents/accept`) para que el request falle de forma controlada
 * (manteniendo el mensaje de UX existente).
 */
export function buildBackendUrl(path: string): string {
  const normalizedPath = normalizePath(path);
  const base = getBackendBaseUrl();
  if (!base) return normalizedPath;
  return `${base}${normalizedPath}`;
}


/**
 * Placeholder (MVP): Reemplazar por el número oficial (solo dígitos + código de país).
 * Si existe `NEXT_PUBLIC_ZAGA_WHATSAPP_NUMBER`, se usa ese valor.
 */
export const ZAGA_WHATSAPP_NUMBER: string =
  process.env.NEXT_PUBLIC_ZAGA_WHATSAPP_NUMBER ?? "<NUMERO_OFICIAL_ZAGA>";

export const ZAGA_WHATSAPP_URL: string = `https://wa.me/${ZAGA_WHATSAPP_NUMBER}`;


export const CONSENTS_ACCEPT_ENDPOINT = "https://api.zaga.com.ar/consents/accept" as const;

/**
 * Mock token (solo desarrollo): permite previsualizar el estado "con token"
 * sin pasar query param manualmente.
 *
 * Uso: definir `NEXT_PUBLIC_TERMS_ACCEPT_MOCK_TOKEN` en `.env.local`.
 */
export const MOCK_ACCEPT_TOKEN: string =
  process.env.NODE_ENV === "development"
    ? (process.env.NEXT_PUBLIC_TERMS_ACCEPT_MOCK_TOKEN ?? "").trim()
    : "";
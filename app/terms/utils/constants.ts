import { buildWhatsAppLink, ZAGA_WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { buildBackendUrl } from "./backend";

/**
 * WhatsApp oficial de ZAGA.
 * - El número vive en `lib/whatsapp.ts` (single source of truth)
 * - Se mantiene este export para compatibilidad local del módulo `/terms`
 */
export { ZAGA_WHATSAPP_NUMBER };
export const ZAGA_WHATSAPP_URL: string = buildWhatsAppLink("");


export const CONSENTS_ACCEPT_ENDPOINT: string = buildBackendUrl("/consents/accept");

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

export const CONSENTS_GET_BY_TOKEN_ENDPOINT = (token: string): string =>
  buildBackendUrl(`/consents/${token}`);
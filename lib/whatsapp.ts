/**
 * Helpers de WhatsApp para ZAGA.
 */

export const ZAGA_WHATSAPP_NUMBER: string = "5493513532986";

/**
 * Construye un link de WhatsApp (wa.me) con el mensaje prellenado.
 * Usa `encodeURIComponent` para asegurar encoding correcto y evitar links rotos.
 */
export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${ZAGA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}


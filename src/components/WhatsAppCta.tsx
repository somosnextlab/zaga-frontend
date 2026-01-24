"use client";

import * as React from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export interface WhatsAppCtaProps {
  /** Texto del CTA */
  label: string;
  /** Mensaje a prellenar en el chat */
  message: string;
  className?: string;
}

/**
 * CTA reutilizable para abrir WhatsApp de forma segura.
 */
export function WhatsAppCta({
  label,
  message,
  className,
}: WhatsAppCtaProps): React.JSX.Element {
  return (
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {label}
    </a>
  );
}


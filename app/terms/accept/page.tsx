"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/Button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card/card";
import { WhatsAppCta } from "@/src/components/WhatsAppCta";
import { TermsContent } from "../_components/TermsContent";
import styles from "./termsAcceptPage.module.scss";
import { acceptConsent, getTokenFromSearchParams } from "../utils/functions";
import type { SubmissionStatus } from "../types/terms.types";
import { CONSENTS_ACCEPT_ENDPOINT, MOCK_ACCEPT_TOKEN } from "../utils/constants";


export default function TermsAcceptPage(): React.JSX.Element {
  const searchParams = useSearchParams();
  const token = React.useMemo((): string | null => {
    const urlToken = getTokenFromSearchParams(searchParams);
    if (urlToken) return urlToken;
    return MOCK_ACCEPT_TOKEN.length > 0 ? MOCK_ACCEPT_TOKEN : null;
  }, [searchParams]);

  const [status, setStatus] = React.useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const isTycFlow = Boolean(token) && status !== "success";

  const getUserFriendlyErrorMessage = React.useCallback((error: unknown): string => {
    // Errores típicos de red en navegadores (fetch) -> mensaje no técnico
    const raw =
      error instanceof Error ? error.message : typeof error === "string" ? error : "";

    const normalized = raw.toLowerCase();
    const isNetworkError =
      normalized.includes("failed to fetch") ||
      normalized.includes("networkerror") ||
      normalized.includes("load failed") ||
      normalized.includes("fetch") && normalized.includes("failed");

    if (isNetworkError) {
      return "No pudimos conectarnos para registrar tu aceptación. Por favor, intentá nuevamente más tarde o solicitá un nuevo link por WhatsApp.";
    }

    // Si el backend devolvió un mensaje entendible, lo dejamos; si no, fallback amigable.
    if (raw.trim().length > 0) return raw;

    return "No pudimos registrar tu aceptación. Por favor, intentá nuevamente más tarde o solicitá un nuevo link por WhatsApp.";
  }, []);

  const handleAccept = React.useCallback(async (): Promise<void> => {
    if (!token) return;
    if (status === "loading" || status === "success") return;

    setStatus("loading");
    setErrorMessage(null);

    try {
      await acceptConsent(CONSENTS_ACCEPT_ENDPOINT, token);
      setStatus("success");
    } catch (error) {
      setErrorMessage(getUserFriendlyErrorMessage(error));
      setStatus("error");
    }
  }, [getUserFriendlyErrorMessage, status, token]);

  // Importante: el `main` del layout tiene altura fija. Este wrapper habilita scroll.
  return (
    <div
      className={
        isTycFlow ? styles.pageNoScroll : !token ? styles.pageCentered : styles.page
      }
    >
      <div
        className={
          isTycFlow
            ? styles.containerFull
            : !token
              ? styles.containerCentered
              : styles.container
        }
      >
        {!token ? (
          <Card className={`${styles.card} ${styles.cardNarrow}`}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.title}>Link inválido o incompleto</CardTitle>
              <CardDescription className={styles.description}>
                Para aceptar los TyC necesitás un enlace con token.
              </CardDescription>
            </CardHeader>
            <CardContent
              className={`${styles.contentStackSm} ${styles.bodyText} ${styles.contentPaddedTop}`}
            >
              <p>
                Volvé al chat de WhatsApp de ZAGA y solicitá el link correcto
                para continuar.
              </p>
            </CardContent>
          </Card>
        ) : status === "success" ? (
          <Card className={`${styles.card} ${styles.cardNarrow}`}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.title}>¡Listo! Ya registramos tu aceptación.</CardTitle>
              <CardDescription className={styles.description}>
                Podés volver al chat para continuar con el onboarding.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.contentStackSm}>
              <p className={styles.bodyText}>
                Si no se abre automáticamente, volvé al chat de ZAGA y escribí{" "}
                <span className={styles.strong}>OK</span>.
              </p>
            </CardContent>
            <CardFooter className={`${styles.footerRow} ${styles.cardFooter}`}>
              <Button asChild size="lg" className={styles.fullWidthButton}>
                <WhatsAppCta label="Continuar en WhatsApp" message="" />
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className={`${styles.card} ${styles.cardWide} ${styles.cardFixed}`}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.title}>Términos y Condiciones</CardTitle>
              <CardDescription className={styles.description}>
                Leé el texto completo antes de aceptar.
              </CardDescription>
            </CardHeader>

            <CardContent className={styles.contentScrollable}>
              {errorMessage ? (
                <div
                  role="alert"
                  className={styles.alert}
                >
                  <p className={styles.strong}>
                    No pudimos registrar tu aceptación.
                  </p>
                  <p className={styles.alertMessage}>{errorMessage}</p>
                </div>
              ) : null}

              <TermsContent />
            </CardContent>

            <CardFooter className={`${styles.footerBetween} ${styles.cardFooter}`}>
              <Button
                size="lg"
                onClick={handleAccept}
                disabled={status === "loading"}
                className={styles.fullWidthButton}
              >
                {status === "loading"
                  ? "Registrando aceptación..."
                  : "Acepto los Términos y Condiciones"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}


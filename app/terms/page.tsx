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
import { WHATSAPP_MESSAGE_ACCEPT } from "@/app/mocks/messageMocks";
import { acceptConsent, ConsentByTokenResponse, getConsentByToken, getTokenFromSearchParams } from "./utils/functions";
import { TermsContent } from "./_components/TermsContent";
import { SubmissionStatus } from "./types/terms.types";
import { MOCK_ACCEPT_TOKEN, CONSENTS_GET_BY_TOKEN_ENDPOINT, CONSENTS_ACCEPT_ENDPOINT } from "./utils/constants";
import styles from './termsPage.module.scss'

export default function TermsAcceptPage(): React.JSX.Element {
  const searchParams = useSearchParams();

  const token = React.useMemo((): string | null => {
    const urlToken = getTokenFromSearchParams(searchParams);
    if (urlToken) return urlToken;
    return MOCK_ACCEPT_TOKEN.length > 0 ? MOCK_ACCEPT_TOKEN : null;
  }, [searchParams]);

  const [status, setStatus] = React.useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Estado del consentimiento leído desde backend (Fase 3)
  const [consent, setConsent] = React.useState<ConsentByTokenResponse | null>(null);
  const [loadingConsent, setLoadingConsent] = React.useState<boolean>(false);

  const isTycFlow = Boolean(token) && status !== "success";

  const getUserFriendlyErrorMessage = React.useCallback((error: unknown): string => {
    const raw =
      error instanceof Error ? error.message : typeof error === "string" ? error : "";

    const normalized = raw.toLowerCase();
    const isNetworkError =
      normalized.includes("failed to fetch") ||
      normalized.includes("networkerror") ||
      (normalized.includes("fetch") && normalized.includes("failed")) ||
      normalized.includes("load failed");

    if (isNetworkError) {
      return "No pudimos conectarnos para validar/registrar tu aceptación. Por favor, intentá nuevamente más tarde o solicitá un nuevo link por WhatsApp.";
    }

    if (raw.trim().length > 0) return raw;

    return "No pudimos validar/registrar tu aceptación. Por favor, intentá nuevamente más tarde o solicitá un nuevo link por WhatsApp.";
  }, []);

  // Fase 3: validar token y obtener terms_version/status
  React.useEffect(() => {
    let cancelled = false;

    async function run(): Promise<void> {
      if (!token) return;
      setLoadingConsent(true);
      setErrorMessage(null);

      try {
        const endpoint = CONSENTS_GET_BY_TOKEN_ENDPOINT(token);
        const res = await getConsentByToken(endpoint);
        if (!cancelled) setConsent(res);
      } catch (err) {
        if (!cancelled) {
          setConsent(null);
          setErrorMessage(getUserFriendlyErrorMessage(err));
        }
      } finally {
        if (!cancelled) setLoadingConsent(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [token, getUserFriendlyErrorMessage]);

  const handleAccept = React.useCallback(async (): Promise<void> => {
    if (!token) return;
    if (status === "loading" || status === "success") return;

    // Si el token no es válido, no intentamos aceptar
    if (!consent || !consent.is_valid) return;

    setStatus("loading");
    setErrorMessage(null);

    try {
      await acceptConsent(CONSENTS_ACCEPT_ENDPOINT, token);
      setStatus("success");
    } catch (error) {
      setErrorMessage(getUserFriendlyErrorMessage(error));
      setStatus("error");
    }
  }, [getUserFriendlyErrorMessage, status, token, consent]);

  // Render por versión (MVP): hoy solo soportamos 2026-01_v1 con TermsContent mock.
  // Luego, con TyC reales, reemplazás TermsContent por el render del HTML canónico por versión.
  const renderTermsByVersion = React.useCallback((): React.JSX.Element => {
    if (!consent) return <TermsContent />;

    switch (consent.terms_version) {
      case "2026-01_v1":
        return <TermsContent />;
      default:
        // Versión desconocida: no permitimos aceptar algo que no sabemos mostrar correctamente.
        return (
          <div role="alert" className={styles.alert}>
            <p className={styles.strong}>No pudimos mostrar esta versión de TyC.</p>
            <p className={styles.alertMessage}>
              Por favor solicitá un nuevo link por WhatsApp.
            </p>
          </div>
        );
    }
  }, [consent]);

  // Wrapper
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
                <WhatsAppCta label="Continuar en WhatsApp" message={WHATSAPP_MESSAGE_ACCEPT} />
              </Button>
            </CardFooter>
          </Card>
        ) : loadingConsent ? (
          <Card className={`${styles.card} ${styles.cardNarrow}`}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.title}>Validando enlace…</CardTitle>
              <CardDescription className={styles.description}>
                Estamos verificando el token para mostrar la versión correcta.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.contentStackSm}>
              <p className={styles.bodyText}>Un momento, por favor.</p>
            </CardContent>
          </Card>
        ) : consent && !consent.is_valid ? (
          // Token existe pero no es válido (vencido o ya aceptado)
          <Card className={`${styles.card} ${styles.cardNarrow}`}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.title}>
                {consent.status === "ACCEPTED"
                  ? "Este link ya fue utilizado"
                  : "Token inválido o vencido"}
              </CardTitle>
              <CardDescription className={styles.description}>
                {consent.status === "ACCEPTED"
                  ? "La aceptación ya fue registrada."
                  : "El token expiró o no es válido."}
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.contentStackSm}>
              <p className={styles.bodyText}>
                Volvé al chat de WhatsApp de ZAGA y solicitá un nuevo link para continuar.
              </p>
            </CardContent>
            {consent.status === "ACCEPTED" ? (
              <CardFooter className={`${styles.footerRow} ${styles.cardFooter}`}>
                <Button asChild size="lg" className={styles.fullWidthButton}>
                  <WhatsAppCta label="Continuar en WhatsApp" message={WHATSAPP_MESSAGE_ACCEPT} />
                </Button>
              </CardFooter>
            ) : null}
          </Card>
        ) : (
          // Token válido: mostrar TyC por versión y permitir aceptar
          <Card className={`${styles.card} ${styles.cardWide} ${styles.cardFixed}`}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.title}>Términos y Condiciones</CardTitle>
              <CardDescription className={styles.description}>
                Leé el texto completo antes de aceptar.
              </CardDescription>
            </CardHeader>

            <CardContent className={styles.contentScrollable}>
              {errorMessage ? (
                <div role="alert" className={styles.alert}>
                  <p className={styles.strong}>No pudimos validar/registrar tu aceptación.</p>
                  <p className={styles.alertMessage}>{errorMessage}</p>
                </div>
              ) : null}

              {renderTermsByVersion()}
            </CardContent>

            <CardFooter className={`${styles.footerBetween} ${styles.cardFooter}`}>
              <Button
                size="lg"
                onClick={handleAccept}
                disabled={status === "loading" || !consent?.is_valid || consent?.terms_version !== "2026-01_v1"}
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
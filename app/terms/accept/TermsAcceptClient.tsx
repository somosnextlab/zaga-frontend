"use client";

import * as React from "react";
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
import { acceptConsent } from "../utils/functions";
import type { SubmissionStatus } from "../types/terms.types";
import { CONSENTS_ACCEPT_ENDPOINT } from "../utils/constants";
import { WHATSAPP_MESSAGE_ACCEPT } from "@/app/mocks/messageMocks";

type ConsentByTokenResponse = {
  token: string;
  status: "PENDING" | "ACCEPTED";
  terms_version: string;
  terms_url: string | null;
  terms_hash: string | null;
  expires_at: string;
  is_valid: boolean;
};

export default function TermsAcceptClient({
  token,
  consent,
  serverError,
}: {
  token: string | null;
  consent: ConsentByTokenResponse | null;
  serverError: string | null;
}): React.JSX.Element {
  const [status, setStatus] = React.useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(serverError);

  const showSuccess = status === "success";
  const showInvalidNoToken = !token;
  const showServerError = Boolean(token) && !consent && Boolean(errorMessage);

  const showAlreadyAccepted =
    Boolean(consent) && consent?.is_valid === false && consent?.status === "ACCEPTED";

  const showInvalidOrExpired =
    Boolean(consent) && consent?.is_valid === false && consent?.status !== "ACCEPTED";

  const canAccept = Boolean(consent) && consent?.is_valid === true;

  const renderTermsByVersion = React.useCallback((): React.JSX.Element => {
    // MVP: solo esta versión soportada
    if (consent?.terms_version === "2026-01_v1") return <TermsContent />;

    return (
      <div role="alert" className={styles.alert}>
        <p className={styles.strong}>No pudimos mostrar esta versión de TyC.</p>
        <p className={styles.alertMessage}>
          Por favor solicitá un nuevo link por WhatsApp.
        </p>
      </div>
    );
  }, [consent]);

  const handleAccept = React.useCallback(async (): Promise<void> => {
    if (!token) return;
    if (!canAccept) return;
    if (status === "loading" || status === "success") return;

    setStatus("loading");
    setErrorMessage(null);

    try {
      await acceptConsent(CONSENTS_ACCEPT_ENDPOINT, token);
      setStatus("success");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "No pudimos registrar tu aceptación.";
      setErrorMessage(msg);
      setStatus("error");
    }
  }, [token, canAccept, status]);

  return (
    <div className={Boolean(token) && !showSuccess ? styles.pageNoScroll : styles.page}>
      <div className={styles.containerFull}>
        {showInvalidNoToken ? (
          <Card className={`${styles.card} ${styles.cardNarrow}`}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.title}>Link inválido o incompleto</CardTitle>
              <CardDescription className={styles.description}>
                Para aceptar los TyC necesitás un enlace con token.
              </CardDescription>
            </CardHeader>
            <CardContent className={`${styles.contentStackSm} ${styles.bodyText}`}>
              <p>
                Volvé al chat de WhatsApp de ZAGA y solicitá el link correcto para continuar.
              </p>
            </CardContent>
          </Card>
        ) : showSuccess ? (
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
        ) : showAlreadyAccepted ? (
          <Card className={`${styles.card} ${styles.cardNarrow}`}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.title}>Este link ya fue utilizado</CardTitle>
              <CardDescription className={styles.description}>
                La aceptación ya fue registrada.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.contentStackSm}>
              <p className={styles.bodyText}>
                Volvé al chat de WhatsApp de ZAGA para continuar.
              </p>
            </CardContent>
            <CardFooter className={`${styles.footerRow} ${styles.cardFooter}`}>
              <Button asChild size="lg" className={styles.fullWidthButton}>
                <WhatsAppCta label="Continuar en WhatsApp" message={WHATSAPP_MESSAGE_ACCEPT} />
              </Button>
            </CardFooter>
          </Card>
        ) : showInvalidOrExpired || showServerError ? (
          <Card className={`${styles.card} ${styles.cardNarrow}`}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.title}>Token inválido o vencido</CardTitle>
              <CardDescription className={styles.description}>
                No pudimos validar el enlace.
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.contentStackSm}>
              <p className={styles.bodyText}>
                Volvé al chat de WhatsApp de ZAGA y solicitá un nuevo link para continuar.
              </p>
              {errorMessage ? <p className={styles.bodyText}>{errorMessage}</p> : null}
            </CardContent>
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
                <div role="alert" className={styles.alert}>
                  <p className={styles.strong}>No pudimos registrar tu aceptación.</p>
                  <p className={styles.alertMessage}>{errorMessage}</p>
                </div>
              ) : null}

              {renderTermsByVersion()}
            </CardContent>

            <CardFooter className={`${styles.footerBetween} ${styles.cardFooter}`}>
              <Button
                size="lg"
                onClick={handleAccept}
                disabled={!canAccept || status === "loading" || consent?.terms_version !== "2026-01_v1"}
                className={styles.fullWidthButton}
              >
                {status === "loading" ? "Registrando aceptación..." : "Acepto los Términos y Condiciones"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
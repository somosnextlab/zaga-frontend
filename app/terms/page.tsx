import * as React from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card/card";
import { TermsContent } from "./_components/TermsContent";
import { ZAGA_WHATSAPP_URL } from "./utils/constants";
import styles from "./termsPage.module.scss";

export default function TermsPage(): React.JSX.Element {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>Términos y Condiciones</CardTitle>
            <CardDescription className={styles.cardDescription}>
              Lectura pública. Esta página no registra aceptación.
            </CardDescription>
          </CardHeader>

          <CardContent className={styles.cardContent}>
            <TermsContent />
          </CardContent>

          <CardFooter className={styles.cardFooter}>
            <Button
              asChild
              variant="outline"
              size="lg"
              className={styles.ctaButton}
            >
              <a href={ZAGA_WHATSAPP_URL}>Iniciar solicitud por WhatsApp</a>
            </Button>

            <Link href="/" className={styles.backLink}>
              Volver al inicio
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}


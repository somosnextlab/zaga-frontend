"use client";

import React from "react";
import Link from "next/link";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/Button/Button";
import { ROUTES } from "@/app/utils/constants/routes";
import styles from "./styles/notFound.module.scss";

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <div className={styles.notFound__container}>
        <div className={styles.notFound__content}>
          <div className={styles.notFound__iconWrapper}>
            <AlertCircle className={styles.notFound__icon} />
          </div>

          <h1 className={styles.notFound__title}>404</h1>
          <h2 className={styles.notFound__subtitle}>Página no encontrada</h2>

          <p className={styles.notFound__description}>
            Lo sentimos, la página que estás buscando no existe o ha sido
            movida.
          </p>

          <div className={styles.notFound__actions}>
            <Button
              size="lg"
              variant="default"
              className={styles.notFound__button}
              asChild
            >
              <Link href={ROUTES.HOME}>
                <Home className="w-4 h-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

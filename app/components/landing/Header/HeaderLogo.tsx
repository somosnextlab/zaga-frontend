import Link from "next/link";
import Image from "next/image";
import { FC } from "react";
import styles from "./header.module.scss";
import zagaLogoNoBg from "@/app/assets/Logo_ZAGA-no-bg.png";

/**
 * Componente del logo del header
 */
export const HeaderLogo: FC = () => {
  return (
    <Link href="/" className={styles.logoLink} aria-label="Zaga - Inicio">
      <div className={styles.logoContainer}>
        <Image
          src={zagaLogoNoBg}
          alt="Zaga"
          priority
          className={styles.logoImage}
        />
        <span className={styles.logoSubtext}>by NextLab</span>
      </div>
    </Link>
  );
};

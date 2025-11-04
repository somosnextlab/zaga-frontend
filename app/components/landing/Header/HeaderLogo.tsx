import Link from "next/link";
import { FC } from "react";
import styles from "./header.module.scss";

/**
 * Componente del logo del header
 */
export const HeaderLogo: FC = () => {
  return (
    <Link href="/" className={styles.logoLink}>
      <div className={styles.logoContainer}>
        <span className={styles.logoText}>Zaga</span>
        <span className={styles.logoSubtext}>by NextLab</span>
      </div>
    </Link>
  );
};

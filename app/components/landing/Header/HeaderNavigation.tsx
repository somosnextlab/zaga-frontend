import Link from "next/link";
import { FC } from "react";
import { usePathname } from "next/navigation";
import { LANDING_NAVIGATION_ITEMS } from "@/app/utils/constants/routes";
import styles from "./header.module.scss";
import { HeaderNavigationProps } from "./header.types";
import { ThemeSwitcher } from "../../auth/themeSwitcher/ThemeSwitcher";

/**
 * Componente de navegación del header
 */
export const HeaderNavigation: FC<HeaderNavigationProps> = ({
  variant,
  onLinkClick,
}) => {
  const pathname = usePathname();
  const navClassName =
    variant === "desktop" ? styles.desktopNav : styles.mobileNav;

  return (
    <nav className={navClassName}>
      {LANDING_NAVIGATION_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={
            item.href.startsWith("#") && pathname !== "/"
              ? `/${item.href}`
              : item.href
          }
          className={styles.navLink}
          onClick={onLinkClick}
        >
          {item.label}
        </Link>
      ))}
      <ThemeSwitcher />
    </nav>
  );
};

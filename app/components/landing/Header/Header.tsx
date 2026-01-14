"use client";

import { useState, FC } from "react";
import { useHeaderMode } from "@/app/hooks/useHeaderMode";
import { useUserContext } from "@/app/context/UserContext/UserContextContext";
import type { HeaderProps } from "./header.types";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderNavigation } from "./HeaderNavigation";
import { MobileMenuButton } from "./MobileMenuButton";
import { MobileMenu } from "./MobileMenu";
import { useFetchRole } from "./useFetchRole";
import styles from "./header.module.scss";

export const Header: FC<HeaderProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { showLandingNavigation, showProtectedNavigation, isAuthenticated } =
    useHeaderMode();
  const {
    state: { role },
  } = useUserContext();

  // Obtener el rol del usuario si está autenticado
  useFetchRole({ isAuthenticated, role });

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`${styles.header} ${className || ""}`}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <HeaderLogo />

          {showLandingNavigation && <HeaderNavigation variant="desktop" />}

          {showProtectedNavigation && (
            <nav className={styles.desktopNav}>
              {/* Aquí se pueden agregar enlaces para usuarios autenticados */}
            </nav>
          )}

          <MobileMenuButton isOpen={isMenuOpen} onToggle={toggleMenu} />
        </div>

        <MobileMenu
          isOpen={isMenuOpen}
          showLandingNavigation={showLandingNavigation}
          onClose={closeMenu}
        />
      </div>
    </header>
  );
};

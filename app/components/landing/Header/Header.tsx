"use client";

import { useState, FC, useMemo } from "react";
import { useHeaderMode } from "@/app/hooks/useHeaderMode";
import { useUserContext } from "@/app/context/UserContext/UserContextContext";
import { ROUTES } from "@/app/utils/constants/routes";
import { UserRoleEnum } from "@/app/types/user.types";
import { useRouter } from "next/navigation";
import type { HeaderProps } from "./header.types";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderNavigation } from "./HeaderNavigation";
import { HeaderCTAs } from "./HeaderCTAs";
import { MobileMenuButton } from "./MobileMenuButton";
import { MobileMenu } from "./MobileMenu";
import { useFetchRole } from "./useFetchRole";
import styles from "./header.module.scss";

export const Header: FC<HeaderProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    showLandingNavigation,
    showProtectedNavigation,
    mode,
    isAuthenticated,
  } = useHeaderMode();
  const {
    state: { role },
  } = useUserContext();
  const router = useRouter();

  // Obtener el rol del usuario si está autenticado
  useFetchRole({ isAuthenticated, role });

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const handleGoToDashboard = () => {
    if (role === UserRoleEnum.ADMIN) router.push(ROUTES.ADMIN_DASHBOARD);
  };

  // Calcular si se debe mostrar el botón de dashboard
  const showDashboardButtonDesktop = useMemo(
    () => isAuthenticated && mode === "landing" && role === UserRoleEnum.ADMIN,
    [isAuthenticated, mode, role]
  );

  const showDashboardButtonMobile = useMemo(
    () => isAuthenticated && mode === "landing" && role === UserRoleEnum.ADMIN,
    [isAuthenticated, mode, role]
  );

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

          <HeaderCTAs
            variant="desktop"
            showDashboardButton={showDashboardButtonDesktop}
            onDashboardClick={handleGoToDashboard}
          />

          <MobileMenuButton isOpen={isMenuOpen} onToggle={toggleMenu} />
        </div>

        <MobileMenu
          isOpen={isMenuOpen}
          showLandingNavigation={showLandingNavigation}
          showDashboardButton={showDashboardButtonMobile}
          onClose={closeMenu}
          onDashboardClick={handleGoToDashboard}
        />
      </div>
    </header>
  );
};

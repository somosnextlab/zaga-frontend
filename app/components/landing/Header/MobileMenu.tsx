import { FC } from "react";
import { HeaderNavigation } from "./HeaderNavigation";
import { HeaderCTAs } from "./HeaderCTAs";
import styles from "./header.module.scss";
import { MobileMenuProps } from "./header.types";

/**
 * Componente del menú móvil
 */
export const MobileMenu: FC<MobileMenuProps> = ({
  isOpen,
  showLandingNavigation,
  showDashboardButton,
  onClose,
  onDashboardClick,
}) => {
  if (!isOpen) return null;

  const handleDashboardClick = () => {
    onDashboardClick();
    onClose();
  };

  return (
    <div className={styles.mobileMenu}>
      <div className={styles.mobileMenuContent}>
        {showLandingNavigation && (
          <HeaderNavigation variant="mobile" onLinkClick={onClose} />
        )}

        <HeaderCTAs
          variant="mobile"
          showDashboardButton={showDashboardButton}
          onDashboardClickAndClose={handleDashboardClick}
        />
      </div>
    </div>
  );
};

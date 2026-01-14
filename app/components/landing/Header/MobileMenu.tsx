import { FC } from "react";
import { HeaderNavigation } from "./HeaderNavigation";
import styles from "./header.module.scss";
import { MobileMenuProps } from "./header.types";

/**
 * Componente del menú móvil
 */
export const MobileMenu: FC<MobileMenuProps> = ({
  isOpen,
  showLandingNavigation,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.mobileMenu}>
      <div className={styles.mobileMenuContent}>
        {showLandingNavigation && (
          <HeaderNavigation variant="mobile" onLinkClick={onClose} />
        )}
      </div>
    </div>
  );
};

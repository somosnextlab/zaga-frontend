import { FC } from "react";
import { Button } from "../../ui/Button/Button";
import { ThemeSwitcher } from "../../auth/themeSwitcher/ThemeSwitcher";
import { AuthButton } from "../../auth/authButtons/AuthButton";
import styles from "./header.module.scss";
import { HeaderCTAsProps } from "./header.types";

/**
 * Componente de CTAs (Call To Actions) del header
 */
export const HeaderCTAs: FC<HeaderCTAsProps> = ({
  variant,
  showDashboardButton,
  onDashboardClick,
  onDashboardClickAndClose,
}) => {
  const isMobile = variant === "mobile";
  const ctaClassName = isMobile ? styles.mobileCtas : styles.desktopCtas;

  return (
    <div className={ctaClassName}>
      <ThemeSwitcher />
      {showDashboardButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={isMobile ? onDashboardClickAndClose : onDashboardClick}
        >
          Ir al Dashboard
        </Button>
      )}
      <AuthButton />
    </div>
  );
};

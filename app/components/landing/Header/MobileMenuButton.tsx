import { FC } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../../ui/Button/Button";
import styles from "./header.module.scss";
import { MobileMenuButtonProps } from "./header.types";

/**
 * Componente del botón del menú móvil
 */
export const MobileMenuButton: FC<MobileMenuButtonProps> = ({
  isOpen,
  onToggle,
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={styles.mobileMenuButton}
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </Button>
  );
};

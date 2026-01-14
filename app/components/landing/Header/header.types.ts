/**
 * Props del componente Header
 */
export interface HeaderProps {
  className?: string;
}
export interface HeaderCTAsProps {
  variant: "desktop" | "mobile";
}

export interface HeaderNavigationProps {
  variant: "desktop" | "mobile";
  onLinkClick?: () => void;
}

export interface MobileMenuProps {
  isOpen: boolean;
  showLandingNavigation: boolean;
  onClose: () => void;
}

export interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export interface UseFetchRoleParams {
  isAuthenticated: boolean;
  role: string | null;
}

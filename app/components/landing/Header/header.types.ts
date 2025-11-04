/**
 * Props del componente Header
 */
export interface HeaderProps {
  className?: string;
}
export interface HeaderCTAsProps {
  variant: "desktop" | "mobile";
  showDashboardButton: boolean;
  onDashboardClick?: () => void;
  onDashboardClickAndClose?: () => void;
}

export interface HeaderNavigationProps {
  variant: "desktop" | "mobile";
  onLinkClick?: () => void;
}

export interface MobileMenuProps {
  isOpen: boolean;
  showLandingNavigation: boolean;
  showDashboardButton: boolean;
  onClose: () => void;
  onDashboardClick: () => void;
}

export interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export interface UseFetchRoleParams {
  isAuthenticated: boolean;
  role: string | null;
}

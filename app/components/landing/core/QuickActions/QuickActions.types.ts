/**
 * Acción rápida individual
 */
export interface QuickAction {
  title: string;
  icon: string;
  iconBg: string;
  onClick?: () => void;
}

/**
 * Props del componente QuickActions
 */
export interface QuickActionsProps {
  title: string;
  actions: QuickAction[];
  columns?: 2 | 3;
}

import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./Button";

/**
 * Props del componente Button.
 * Extiende las props nativas de un elemento button HTML.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Si es `true`, el botón se renderiza como un Slot de Radix UI,
   * permitiendo que se comporte como otro elemento hijo.
   * Útil para crear botones personalizados con enlaces o elementos personalizados.
   */
  asChild?: boolean;
}
import { Slot } from "radix-ui";
import styles from "./IconButton.module.css";

type IconButtonVariant =
  | "primary"
  | "neutral"
  | "subtle"
  | "transparent"
  | "danger"
  | "subtle-danger";
type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  asChild?: boolean;
  "aria-label": string;
}

export function IconButton({
  variant = "primary",
  size = "md",
  asChild = false,
  className,
  ...props
}: IconButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      className={[styles.button, styles[variant], styles[size], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

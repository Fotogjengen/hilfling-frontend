import { Slot } from "radix-ui";
import { forwardRef } from "react";
import styles from "./Button.module.css";

type ButtonVariant =
  | "primary"
  | "neutral"
  | "subtle"
  | "transparent"
  | "danger"
  | "subtle-danger";
type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", asChild = false, className, ...props },
    ref,
  ) {
    const Comp = asChild ? Slot.Root : "button";
    return (
      <Comp
        ref={ref}
        className={[styles.button, styles[variant], styles[size], className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
);

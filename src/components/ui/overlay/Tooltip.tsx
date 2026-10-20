import { ReactNode, useState } from "react";
import { Tooltip as RadixTooltip } from "radix-ui";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

export function Tooltip({ content, children, disabled }: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <RadixTooltip.Provider delayDuration={200}>
      <RadixTooltip.Root open={open && !disabled} onOpenChange={setOpen}>
        <RadixTooltip.Trigger asChild>
          <span className={styles.trigger} tabIndex={0}>
            {children}
          </span>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content className={styles.content} sideOffset={4}>
            {content}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}

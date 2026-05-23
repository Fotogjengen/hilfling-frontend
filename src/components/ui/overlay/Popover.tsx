import { ComponentProps } from "react";
import { Popover } from "radix-ui";
import styles from "./Popover.module.css";

export function PopoverRoot(props: ComponentProps<typeof Popover.Root>) {
  return <Popover.Root {...props} />;
}

export function PopoverTrigger(props: ComponentProps<typeof Popover.Trigger>) {
  return <Popover.Trigger {...props} />;
}

export function PopoverAnchor(props: ComponentProps<typeof Popover.Anchor>) {
  return <Popover.Anchor {...props} />;
}

export function PopoverContent({
  children,
  scrollable = true,
  ...props
}: ComponentProps<typeof Popover.Content> & { scrollable?: boolean }) {
  return (
    <Popover.Portal>
      <Popover.Content className={styles.content} sideOffset={4} {...props}>
        <div className={scrollable ? styles.scrollArea : undefined}>
          {children}
        </div>
      </Popover.Content>
    </Popover.Portal>
  );
}

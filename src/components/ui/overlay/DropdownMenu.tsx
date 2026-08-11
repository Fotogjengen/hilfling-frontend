import { ComponentProps } from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { ChevronRight } from "lucide-react";
import styles from "./DropdownMenu.module.css";

export function DropdownMenu(
  props: ComponentProps<typeof DropdownMenuPrimitive.Root>,
) {
  return <DropdownMenuPrimitive.Root {...props} />;
}

export function DropdownMenuTrigger(
  props: ComponentProps<typeof DropdownMenuPrimitive.Trigger>,
) {
  return <DropdownMenuPrimitive.Trigger {...props} />;
}

export function DropdownMenuContent({
  className,
  sideOffset = 4,
  align = "start",
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className={[styles.content, className].filter(Boolean).join(" ")}
        sideOffset={sideOffset}
        align={align}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      className={[styles.item, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      className={[styles.label, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={[styles.separator, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function DropdownMenuSub(
  props: ComponentProps<typeof DropdownMenuPrimitive.Sub>,
) {
  return <DropdownMenuPrimitive.Sub {...props} />;
}

export function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={[styles.item, styles.subTrigger, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
      <ChevronRight
        size={16}
        className={styles.subChevron}
        aria-hidden="true"
      />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

export function DropdownMenuSubContent({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        className={[styles.content, className].filter(Boolean).join(" ")}
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

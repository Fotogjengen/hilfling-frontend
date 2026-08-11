import { ComponentProps } from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import styles from "./ToggleTabs.module.css";

export function ToggleTabs(props: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root {...props} />;
}

export function ToggleTabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={[styles.list, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function ToggleTabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={[styles.trigger, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

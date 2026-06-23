import { ComponentProps } from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import styles from "./Tabs.module.css";

export function Tabs(props: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root {...props} />;
}

export function TabsList({
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

export function TabsTrigger({
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

export function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={[styles.content, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

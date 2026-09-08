import { ComponentProps, ReactNode } from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";
import styles from "./Accordion.module.css";

export function Accordion(
  props: ComponentProps<typeof AccordionPrimitive.Root>,
) {
  return <AccordionPrimitive.Root {...props} />;
}

export function AccordionItem(
  props: ComponentProps<typeof AccordionPrimitive.Item>,
) {
  return <AccordionPrimitive.Item {...props} />;
}

interface AccordionTriggerProps
  extends ComponentProps<typeof AccordionPrimitive.Trigger> {
  children: ReactNode;
}

export function AccordionTrigger({
  children,
  className,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        className={[styles.trigger, className].filter(Boolean).join(" ")}
        {...props}
      >
        {children}
        <ChevronDown size={24} className={styles.chevron} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  children,
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={[styles.content, className].filter(Boolean).join(" ")}
      {...props}
    >
      <div className={styles.contentInner}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

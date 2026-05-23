import { ReactNode } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/display/Accordion";
import styles from "./ArchiveBossAccordion.module.css";

interface Props {
  color: string;
  name: string;
  children?: ReactNode;
}

function ArchiveBossAccordion({ color, name, children }: Props) {
  return (
    <Accordion type="single" collapsible className={styles.accordion}>
      <AccordionItem value="item">
        <AccordionTrigger
          className={styles.trigger}
          style={{ "--accordion-color": color } as React.CSSProperties}
        >
          {name}
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default ArchiveBossAccordion;

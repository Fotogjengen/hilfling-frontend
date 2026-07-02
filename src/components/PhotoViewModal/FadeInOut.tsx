import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

export function FadeInOut({
  show,
  className,
  animateOnMount = true,
  children,
}: {
  show: boolean;
  className?: string;
  animateOnMount?: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence initial={animateOnMount}>
      {show && (
        <motion.div
          className={className}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

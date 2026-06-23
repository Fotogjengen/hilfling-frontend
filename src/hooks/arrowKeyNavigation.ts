import { useEffect } from "react";

export const useArrowKeyNavigation = ({
  onNext,
  onPrevious,
  enabled = true,
}: {
  onNext: () => void;
  onPrevious: () => void;
  enabled?: boolean;
}) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        onNext();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        onPrevious();
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrevious, enabled]);
};

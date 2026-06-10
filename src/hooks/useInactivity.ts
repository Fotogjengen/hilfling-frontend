import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type UseInactivityOptions = {
  inactiveDelayMs?: number;
  overrideListeners?: (keyof WindowEventMap)[];
};

const defaultActivityListeners: (keyof WindowEventMap)[] = [
  "click",
  "pointermove",
  "scroll",
  "drag",
  "keypress",
];

export const useInactivity = ({
  inactiveDelayMs = 2000,
  overrideListeners,
}: UseInactivityOptions) => {
  const activityListeners = useMemo(
    () => overrideListeners ?? defaultActivityListeners,
    [overrideListeners],
  );

  const currentTimer = useRef<ReturnType<typeof globalThis.setTimeout>>();
  const [isInactive, setIsInactive] = useState(false);

  const resetTimer = useCallback(() => {
    if (currentTimer.current) {
      clearTimeout(currentTimer.current);
    }

    setIsInactive(false);

    currentTimer.current = globalThis.setTimeout(() => {
      setIsInactive(true);
    }, inactiveDelayMs);
  }, [inactiveDelayMs, overrideListeners]);

  useEffect(() => {
    resetTimer();

    activityListeners.forEach((ev) =>
      globalThis.addEventListener(ev, resetTimer),
    );

    return () => {
      if (currentTimer.current) clearTimeout(currentTimer.current);
      for (const ev of activityListeners) {
        globalThis.removeEventListener(ev, resetTimer);
      }
    };
  }, []);

  return { isInactive };
};

import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

export function useDebounce<T>(
  value: T,
  delay = 300,
): { value: T; isDebouncing: boolean; flush: (value: T) => void } {
  const [debounced, setDebounced] = useState(value);

  const update = useMemo(() => debounce(setDebounced, delay), [delay]);

  useEffect(() => {
    update(value);
    return () => update.cancel();
  }, [value, update]);

  const flush = useCallback(
    (next: T) => {
      update.cancel();
      setDebounced(next);
    },
    [update],
  );

  return { value: debounced, isDebouncing: debounced !== value, flush };
}

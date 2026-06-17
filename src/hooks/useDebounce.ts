import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

export function useDebounce<T>(
  value: T,
  delay = 300,
): { value: T; isDebouncing: boolean } {
  const [debounced, setDebounced] = useState(value);

  const update = useMemo(() => debounce(setDebounced, delay), [delay]);

  useEffect(() => {
    update(value);
    return () => update.cancel();
  }, [value, update]);

  return { value: debounced, isDebouncing: debounced !== value };
}

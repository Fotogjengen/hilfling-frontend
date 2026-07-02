import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = globalThis.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => globalThis.matchMedia(query).matches,
  );
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)");
}

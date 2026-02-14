import { useContext, useEffect, useRef } from "react";
import { AdBannerContext } from "../contexts/AdBannerContext";

const AD_DELAY_MS = 60000;

export function useAdBanner() {
  const {
    showAdBanner,
    setShowAdBanner,
    shouldShowAdBanner,
    setShouldShowAdBanner,
  } = useContext(AdBannerContext);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!shouldShowAdBanner) {
      return;
    }

    timerRef.current = setTimeout(() => {
      setShowAdBanner(true);
    }, AD_DELAY_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const dismissAdBanner = () => {
    setShouldShowAdBanner(false);
    setShowAdBanner(false);
  };

  return { showAdBanner, dismissAdBanner };
}

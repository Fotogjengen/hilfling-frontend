import { useLayoutEffect, type RefObject } from "react";

/**
 * Setter lengden på scroll-animasjonen som en funksjon av hastighet
 */
export default function useMarqueeDuration(
  trackRef: RefObject<HTMLDivElement | null>,
  speedPxPerSecond: number,
) {
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const trackWidth = track.getBoundingClientRect().width;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const distance = trackWidth / 2 + gap / 2;

    track.style.setProperty("--photo-track-offset", `${-distance}px`);
    track.style.setProperty(
      "--photo-track-duration",
      `${distance / speedPxPerSecond}s`,
    );
  }, [trackRef, speedPxPerSecond]);
}

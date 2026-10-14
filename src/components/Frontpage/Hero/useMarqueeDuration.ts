import { useLayoutEffect, type RefObject } from "react";

export default function useMarqueeDuration(
  trackRef: RefObject<HTMLDivElement | null>,
  speedPxPerSecond: number,
) {
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateDuration = () => {
      const trackWidth = track.getBoundingClientRect().width;
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
      const distance = trackWidth / 2 + gap / 2;

      track.style.setProperty(
        "--photo-track-duration",
        `${distance / speedPxPerSecond}s`,
      );
    };

    updateDuration();

    const observer = new ResizeObserver(updateDuration);
    observer.observe(track);

    return () => observer.disconnect();
  }, [trackRef, speedPxPerSecond]);
}

import { RefObject, useEffect } from "react";

const easingFunc = (t: number) => t * (1.5 - 0.5 * t);

/**
 * Starter og stopper scroll-animasjonen
 * til marquee-en smoothly når et bilde hovres over
 */
export default function useMarqueeHover(
  trackRef: RefObject<HTMLElement | null>,
  easeDuration: number,
) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const anim = track.getAnimations()[0];
    if (!anim) return;

    let isPlaying = true;
    let t = 1;
    let raf: number | null = null;
    let last = 0;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      t += (dt / easeDuration) * (isPlaying ? 1 : -1);

      // Noen nettlesere blir cranky hvis t blir for lav
      if (!isPlaying && t < 0.001) t = 0;
      if (isPlaying && t > 0.999) t = 1;

      if (t === 0) {
        anim.pause();
      } else {
        anim.updatePlaybackRate(easingFunc(t));
        if (anim.playState === "paused") anim.play();
      }

      const target = isPlaying ? 1 : 0;
      raf = t !== target ? requestAnimationFrame(tick) : null;
    };

    const setPlayState = (shouldPlay: boolean) => {
      isPlaying = shouldPlay;

      if (raf === null) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const hoverTargets = track.querySelectorAll<HTMLElement>(
      "[data-marquee-hover-target]",
    );
    const onEnter = () => setPlayState(false);
    const onLeave = () => setPlayState(true);

    for (const el of hoverTargets) {
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
    }

    return () => {
      for (const el of hoverTargets) {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
      }
      if (raf !== null) cancelAnimationFrame(raf);
      anim.updatePlaybackRate(1);
    };
  }, [trackRef, easeDuration]);
}

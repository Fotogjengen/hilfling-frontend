import cx from "classnames";
import style from "./PhotoMarquee.module.css";
import { useEffect, useRef } from "react";

type Photo = {
  id: number;
  orientation: "landscape" | "portrait";
};

const photoItems: Photo[] = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  orientation: Math.random() > 0.4 ? "landscape" : "portrait",
}));

// TODO: regn ut animasjonslengde som funksjon av hastighet
export default function PhotoMarquee() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const anim = track.getAnimations()[0];
    if (!anim) return;

    const EASE = 5; // higher = snappier stop/start (per second)
    let target = 1; // desired playback speed
    let current = 1; // actual playback speed
    let raf: number | null = null;
    let last = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      current += (target - current) * (1 - Math.exp(-EASE * dt));
      if (Math.abs(target - current) < 0.001) current = target;

      if (current === 0) {
        anim.pause();
      } else {
        anim.updatePlaybackRate(current);
        if (anim.playState === "paused") anim.play();
      }

      raf = current !== target ? requestAnimationFrame(tick) : null;
    };

    const setTarget = (value: number) => {
      target = value;

      if (raf === null) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const stop = () => setTarget(0);
    const go = () => setTarget(1);

    viewport.addEventListener("pointerenter", stop);
    viewport.addEventListener("pointerleave", go);

    return () => {
      viewport.removeEventListener("pointerenter", stop);
      viewport.removeEventListener("pointerleave", go);

      if (raf !== null) cancelAnimationFrame(raf);

      anim.updatePlaybackRate(1);
    };
  }, []);

  return (
    <>
      <div ref={viewportRef} className={style.viewport}>
        <div ref={trackRef} className={style.track}>
          {[...photoItems, ...photoItems].map((photo, index) => (
            <div
              className={cx(
                style.photoTile,
                photo.orientation === "landscape"
                  ? style.landscape
                  : style.portrait,
              )}
              key={`${photo.id} - ${index}`}
            >
              {photo.id}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

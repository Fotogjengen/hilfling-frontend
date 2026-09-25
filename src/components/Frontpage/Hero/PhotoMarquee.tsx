import cx from "classnames";
import style from "./PhotoMarquee.module.css";
import { useEffect, useRef } from "react";

type Photo = {
  id: number
  orientation: "landscape" | "portrait"
}

// Claude kokte opp denne funksjonen
function getScaleAtPosition(x: number, minValue: number): number {
  const f = x - Math.floor(x);

  const u = f < 0.5 ? f / 0.5 : (1 - f) / 0.5;
  const s = u * u * u * (u * (u * 6 - 15) + 10);

  return 1 - (1 - minValue) * s;
}

function getTrackAnimationDuration(pixelsPerSecond: number, photoTrackHeight: number, photoTrackGap: number, photoItems: Photo[]) {
  const getWidth = (photo: Photo) => (photo.orientation === "landscape" ? 3 / 2 : 2 / 3) * photoTrackHeight
  const sumWidths = (first: number, second: number) => first + second + photoTrackGap;

  return photoItems.map(getWidth).reduce(sumWidths, -photoTrackGap) / pixelsPerSecond;

}

const photoItems: Photo[] = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  orientation: Math.random() > 0.4 ? "landscape" : "portrait",
}));

export default function PhotoMarquee() {
  const photoTrackRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef(0);

  useEffect(() => {
    const track = photoTrackRef.current;
    if (!track) return;

    const pixelsPerSecond = 50
    const photoTrackHeight = track.getBoundingClientRect().height
    const photoTrackGap = 20;
    const trackAnimationDuration = getTrackAnimationDuration(pixelsPerSecond, photoTrackHeight, photoTrackGap, photoItems);
    track.style.setProperty("--photo-track-animation-duration", `${trackAnimationDuration}s`)

    const tick = () => {
      // TODO: les alle height verdiene før vi begynner å skrive til dem
      // for å unngå layout thrashing
      for (const photoTile of track.children) {
        if (!(photoTile instanceof HTMLElement)) return;

        const rect = photoTile.getBoundingClientRect()

        const centerX = (rect.left + rect.right) / (2 * window.innerWidth);

        photoTile.style.setProperty("--photo-tile-scale", getScaleAtPosition(centerX, 0.7).toString());
      }

      animationIdRef.current = requestAnimationFrame(tick);
    }

    animationIdRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationIdRef.current);
  }, []);

  return (
    <>
      <div className={style.viewport}>
        <div ref={photoTrackRef} className={style.track}>
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

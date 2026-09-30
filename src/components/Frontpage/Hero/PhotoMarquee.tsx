import cx from "classnames";
import style from "./PhotoMarquee.module.css";
import { useRef } from "react";
import useMarqueeHover from "./useMarqueeHover";

type Photo = {
  id: number;
  orientation: "landscape" | "portrait";
};

const photoObjects: Photo[] = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  orientation: Math.random() > 0.4 ? "landscape" : "portrait",
}));

// TODO: regn ut animasjonslengde av tracken som funksjon av hastighet
export default function PhotoMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Hvor lang tid (i sek) for tracken å starte/stoppe på hover
  const easeDuration = 0.4;

  useMarqueeHover(trackRef, easeDuration);

  return (
    <>
      <div className={style.marquee}>
        <div ref={trackRef} className={style.track}>
          {[...photoObjects, ...photoObjects].map((photo, index) => (
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

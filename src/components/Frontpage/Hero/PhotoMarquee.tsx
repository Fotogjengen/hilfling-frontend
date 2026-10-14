import style from "./PhotoMarquee.module.css";
import { useRef } from "react";
import useMarqueeHover from "./useMarqueeHover";
import PhotoTile from "./PhotoTile";
import photos from "./Photos";

// TODO: regn ut animasjonslengde av tracken som funksjon av hastighet
export default function PhotoMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Hvor lang tid (i sek) for tracken å starte/stoppe på hover
  const easeDuration = 0.45;

  useMarqueeHover(trackRef, easeDuration);

  return (
    <>
      <div className={style.marquee}>
        <div ref={trackRef} className={style.track}>
          {[...photos, ...photos].map((photo, i) => (
            <PhotoTile
              url={photo.url}
              orientation={photo.orientation}
              label={photo.year.toString()}
              key={i}
            />
          ))}
        </div>
      </div>
    </>
  );
}

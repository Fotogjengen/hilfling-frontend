import style from "./PhotoMarquee.module.css";
import { useRef } from "react";
import useMarqueeHover from "./useMarqueeHover";
import useMarqueeDuration from "./useMarqueeDuration";
import PhotoTile from "./PhotoTile";
import photos from "./Photos";

const HOVER_SPEED_EASE_SECONDS = 0.45;
const SCROLL_SPEED_PX_PER_SECOND = 30;

export default function PhotoMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useMarqueeDuration(trackRef, SCROLL_SPEED_PX_PER_SECOND);
  useMarqueeHover(trackRef, HOVER_SPEED_EASE_SECONDS);

  return (
    <div className={style.marquee}>
      <div ref={trackRef} className={style.track}>
        {[...photos, ...photos].map((photo, i) => (
          <PhotoTile
            url={photo.url}
            orientation={photo.orientation}
            label={photo.year.toString()}
            title={photo.title}
            description={photo.description}
            key={i}
          />
        ))}
      </div>
    </div>
  );
}

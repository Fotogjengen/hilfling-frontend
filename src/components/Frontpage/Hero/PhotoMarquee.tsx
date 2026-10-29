import style from "./PhotoMarquee.module.css";
import { useRef, useState } from "react";
import useMarqueeHover from "./useMarqueeHover";
import useMarqueeDuration from "./useMarqueeDuration";
import PhotoTile from "./PhotoTile";
import photos from "./Photos";
import { shuffle } from "@/utils/shuffle";

const HOVER_SPEED_EASE_SECONDS = 0.45;
const SCROLL_SPEED_PX_PER_SECOND = 30;

export default function PhotoMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [shuffledPhotos] = useState(() => shuffle(photos));

  useMarqueeDuration(trackRef, SCROLL_SPEED_PX_PER_SECOND);
  useMarqueeHover(trackRef, HOVER_SPEED_EASE_SECONDS);

  return (
    <div className={style.marquee}>
      <div ref={trackRef} className={style.track}>
        {[...shuffledPhotos, ...shuffledPhotos].map((photo, i) => (
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

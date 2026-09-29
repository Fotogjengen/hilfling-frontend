import cx from "classnames";
import style from "./PhotoMarquee.module.css";

type Photo = {
  id: number;
  orientation: "landscape" | "portrait";
};

const photoItems: Photo[] = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  orientation: Math.random() > 0.4 ? "landscape" : "portrait",
}));

export default function PhotoMarquee() {
  // TODO: regn ut animasjonslengde som funksjon av hastighet

  return (
    <>
      <div className={style.viewport}>
        <div className={style.track}>
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

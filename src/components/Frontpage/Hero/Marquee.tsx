import cx from "classnames";
import style from "./Marquee.module.css";
import React from "react";

const photos = Array.from({ length: 10 }).map((_, i) => (
  <div
    className={cx(
      style.photo,
      Math.random() > 0.3 ? style.landscape : style.portrait,
    )}
    key={i}
  >
    {i}
  </div>
));

export default function Marquee() {
  const scrollSpeed = 0.15;
  // Litt unøyaktig, siden det ikke tar høyde for at bildene har ulik bredde. Fikser senere
  const scrollDuration = photos.length / scrollSpeed;

  return (
    <>
      <div className={style.marquee}>
        <div
          style={
            { "--scroll-duration": `${scrollDuration}s` } as React.CSSProperties
          }
          className={style.scrollGroup}
        >
          {[...photos, ...photos]}
        </div>
      </div>
    </>
  );
}

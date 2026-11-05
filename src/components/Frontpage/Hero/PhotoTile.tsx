import style from "./PhotoTile.module.css";

type Props = {
  url: string;
  description: string;
  year: string;
};

export default function PhotoTile({ url, description, year }: Props) {
  return (
    <div className={style.tile}>
      <div className={style.photoFrame} data-marquee-hover-target>
        <img src={url} alt={description} className={style.photo} />
        <div className={style.photoOverlay}>
          <span className={style.photoDescription}>{description}</span>
        </div>
      </div>
      <span className={style.label}>{year}</span>
    </div>
  );
}

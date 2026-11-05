import style from "./PhotoTile.module.css";

type Props = {
  url: string;
  label: string;
  title: string;
  description?: string;
};

export default function PhotoTile({
  url,
  label,
  title,
  description,
}: Props) {
  return (
    <div className={style.tile}>
      <div
        className={style.photoFrame}
        data-marquee-hover-target
      >
        <img src={url} alt={description ?? title} className={style.photo} />
        <div className={style.photoOverlay}>
          <strong>{title}</strong>
          {description}
        </div>
      </div>
      <span className={style.label}>{label}</span>
    </div>
  );
}

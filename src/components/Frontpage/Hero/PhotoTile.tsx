import style from "./PhotoTile.module.css";
import cx from "classnames";

type Props = {
  url: string;
  orientation: "landscape" | "portrait";
  label: string;
  title: string;
  description?: string;
};

export default function PhotoTile({
  url,
  orientation,
  label,
  title,
  description,
}: Props) {
  return (
    <div className={style.tile}>
      <div className={cx(style.photoFrame, style[orientation])}>
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

import style from "./PhotoTile.module.css";
import cx from "classnames";

type Props = {
  url: string;
  orientation: "landscape" | "portrait";
  label: string;
};

export default function PhotoTile({ url, orientation, label }: Props) {
  return (
    <div className={style.tile}>
      <img src={url} className={cx(style.photo, style[orientation])} />
      <span className={style.label}>{label}</span>
    </div>
  );
}

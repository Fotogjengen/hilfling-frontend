import styles from "./GuiLogo.module.css";
import { LogoSvg } from "../Guiicons";
import { DefaultProps } from "../../types";
import cx from "classnames";

interface Props extends DefaultProps {
  /** Size of logo, text scales with logo */
  size: number;
  /** What happens when clicking on logo */
  onClick?: () => void;
}

export default function GuiLogo({ size, onClick, className, ...rest }: Props) {
  return (
    <div
      style={{ height: size }}
      className={cx(styles.logo, className)}
      onClick={onClick}
      {...rest}
    >
      <LogoSvg size={size} />
      <p style={{ fontSize: size * 0.7 }} className={styles.name}>
        fotogjengen
      </p>
    </div>
  );
}

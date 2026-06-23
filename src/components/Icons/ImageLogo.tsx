import styles from "./ImageLogo.module.css";
import { DefaultProps } from "../../types";
import cx from "classnames";
import LogoSvg from "@/components/Icons/LogoSvg";

interface Props extends DefaultProps {
  /** Size of logo, text scales with logo */
  size: number;
  /** What happens when clicking on logo */
  onClick?: () => void;
}

export default function ImageLogo({
  size,
  onClick,
  className,
  ...rest
}: Props) {
  return (
    <div
      style={{ height: size }}
      className={cx(styles.logo, className)}
      onClick={onClick}
      {...rest}
    >
      <LogoSvg size={size} />
    </div>
  );
}

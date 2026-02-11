import React, { FC } from "react";
import { DefaultProps } from "../../../../types";
import styles from "./GuiOverflowItem.module.css";

interface Props extends DefaultProps {
  text: string;
  icon: FC;
}

const GuiOverflowMenuItem: FC<Props> = ({ text, icon: Icon }: Props) => {
  return (
    <div className={styles.OverflowMenuItem}>
      <Icon />
      {text}
    </div>
  );
};

export default GuiOverflowMenuItem;

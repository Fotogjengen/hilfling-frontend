import { Typography } from "@mui/material";
import React, { FC, ReactNode } from "react";
import { MotiveDto } from "../../../generated";

import styles from "./MotiveCard.module.css";
interface Props {
  motive: MotiveDto;
  children?: ReactNode;
}

const MotiveCard: FC<Props> = (props: Props) => {
  return (
    <div className={styles.container}>
      <div>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {props?.motive?.categoryDto?.name}
        </Typography>
        <Typography sx={{ mb: 1.5, color: "#ad2f33" }}>
          {props?.motive?.title}
        </Typography>
        <Typography variant="body2">
          Eier: {props?.motive?.eventOwnerDto?.name}
        </Typography>
        <Typography variant="body2">
          Album: {props?.motive?.albumDto?.title}
        </Typography>
        <Typography variant="body2">
          Dato:{" "}
          {props?.motive?.dateCreated
            ? new Date(props.motive.dateCreated).toLocaleDateString()
            : "N/A"}
        </Typography>
      </div>
      {props.children}
    </div>
  );
};

export default MotiveCard;

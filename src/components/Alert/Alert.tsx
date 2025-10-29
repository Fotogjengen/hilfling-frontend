import React, { FC, useEffect } from "react";
import { Collapse, Alert as MUIAlert } from "@mui/material";
import styles from "./Alert.module.css";

//Denne klassen viser en alert melding som forsvinner etter 4 sekunder. Den kan importeres og brukes i andre komponenter.
//Den er for eksempel ofte brukt i API kall for å vise suksess eller feilmeldinger.
interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  message: string;
  severity: "error" | "warning" | "info" | "success";
}

const Alert: FC<Props> = ({ open, setOpen, message, severity }: Props) => {
  useEffect(() => {
    const timeId = setTimeout(() => {
      setOpen(false);
    }, 4000);

    return () => {
      clearTimeout(timeId);
    };
  }, []);

  if (!open) {
    return null;
  }

  return (
    <Collapse in={open} className={styles.collapse}>
      <div onClick={() => setOpen(false)}>
        <MUIAlert severity={severity} sx={{ boxShadow: 4 }}>
          {" "}
          {message}{" "}
        </MUIAlert>
      </div>
    </Collapse>
  );
};

export default Alert;

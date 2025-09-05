import React, { FC } from "react";
import { withStyles } from "@mui/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import styles from "./ArchiveBossAccordion.module.css";
import { DefaultProps } from "../../../types";

interface Props extends DefaultProps {
  color: string;
  name: string;
}

const ArchiveBossAccordion: FC<Props> = ({ color, name, children }) => {
  const AccordionSummary: any = withStyles({
    root: {
      backgroundColor: color,
      padding: "1rem", 
    },
  })(MuiAccordionSummary);

  return (
    <div className={styles.archiveBossAccordion}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore sx = {{color : "white", fontSize : 50}} />}>
          <Typography color = "white"> {name} </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {children}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ArchiveBossAccordion;

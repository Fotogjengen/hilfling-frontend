import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ExpandMore } from "@mui/icons-material";
import styles from "./ArchiveBossAccordion.module.css";
import { DefaultProps } from "../../../types";

interface Props extends DefaultProps {
  color: string;
  name: string;
  children?: React.ReactNode;
}
const StyledAccordionSummary = styled(AccordionSummary)<{ bgColor: string }>(
  ({ bgColor }) => ({
    backgroundColor: bgColor,
    padding: "1rem",
  }),
);

const ArchiveBossAccordion = ({ color, name, children }: Props) => {
  return (
    <div className={styles.archiveBossAccordion}>
      <Accordion>
        <StyledAccordionSummary
          bgColor={color}
          expandIcon={<ExpandMore sx={{ color: "white", fontSize: 50 }} />}
        >
          <Typography color="white">{name}</Typography>
        </StyledAccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ArchiveBossAccordion;

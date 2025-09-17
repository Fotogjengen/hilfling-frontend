import React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import { Grid, Paper, Typography } from "@mui/material";
import VolcanoIcon from '@mui/icons-material/Volcano';
import { Link } from "react-router-dom";

const SpillMeny = () => {
  const IconSize = 100;



  const MainItem = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
  }));

  return (
    
      <h1>Prosjekter laget av de nyeadwdaw mdawjndawjndawjndawnkladwnkladw</h1>
  );
};

export default SpillMeny;

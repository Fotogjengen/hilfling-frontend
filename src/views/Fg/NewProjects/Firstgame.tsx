import React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import { Grid, Paper, Typography } from "@mui/material";
import VolcanoIcon from '@mui/icons-material/Volcano';
import { Link } from "react-router-dom";
import "./Firstgame.css"

const Firstgame = () => {
  const IconSize = 100;



  return (
    <div id="contain">
      <h1 id="game1">Her er game 1</h1>

      <h2>Skriv inn navnet på deltakerne</h2>
    </div>


  );
};

export default Firstgame;

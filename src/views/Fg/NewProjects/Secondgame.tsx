import React, {useState} from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import { getScopedCssBaselineUtilityClass, Grid, Paper, Typography } from "@mui/material";
import VolcanoIcon from '@mui/icons-material/Volcano';
import { Link } from "react-router-dom";
import './Secondgame.css';
import { questions } from './questions';
import { random, set } from "lodash";

const Secondgame = () => {
  const IconSize = 100;

  const [question, setQuestion] = useState<string>("Klar for 100 (120) questions!?!?");
  const [everyTenth, setTenth] = useState<string>("");
  const [splash, setSplashh] = useState<string>("");
  const [nr, setNr] = useState<number>(1);

  function nyttSpørsmål() {
    setNr(nr + 1);
    setQuestion(questions[random(1, 100)]);

    if (nr%10 === 0 ) {
      setTenth(`${nr} spørsmål - 🍻SKÅL🍻`);
    } else {
      setTenth("");
    }

    const randomSplash = random(1, 6);
    if (randomSplash === 1) {
      setSplashh("Splashhhh🎉🎉🎉");
    } else {
      setSplashh("");
    }
  }

  return (
    <div id="secondgame">
      <p id="gameTitle">100 (120) questions</p>
      <div id="container-main">
        <div id="question-container">
          <p>{question}</p>
          <p>{splash}</p>
          <p>{everyTenth}</p>
        </div>
        <div id="qstbutton-container">
          <button id="qstbutton" onClick={nyttSpørsmål}>Neste</button>
        </div>
      </div>
    </div>
  );
};

export default Secondgame;
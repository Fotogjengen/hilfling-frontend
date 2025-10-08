import React, {useState, useMemo} from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import { getScopedCssBaselineUtilityClass, Grid, Paper, Typography } from "@mui/material";
import VolcanoIcon from '@mui/icons-material/Volcano';
import { Link } from "react-router-dom";
import './Secondgame.css';
import { questions } from './questions';
import { random, set } from "lodash";

const Secondgame = () => {
  // const IconSize = 100;

  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array]; // lag en kopi
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]; // bytt plass
    }
    return arr;
  }

  const shuffledQuestions = useMemo(() => shuffleArray(questions), [questions]);

  const [question, setQuestion] = useState<string>("Klar for 100 (120) questions!?!?");
  const [everyTenth, setTenth] = useState<string>("");
  const [splash, setSplashh] = useState<string>("");
  const [nr, setNr] = useState<number>(1);

  function nyttSpørsmål() {
    setNr(nr + 1);
    setQuestion(shuffledQuestions[nr-1]);

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
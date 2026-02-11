import { Link } from "react-router-dom";
import { Button, TextField, Stack } from "@mui/material";
import React, { useState } from "react";
import "./Firstgame.css";

const Firstgame = () => {
  const [players, setPlayers] = useState<string[]>([""]);

  const addInput = () => setPlayers([...players, ""]);
  const handleChange = (i: number, v: string) => {
    const next = [...players];
    next[i] = v;
    setPlayers(next);
  };

  return (
    <div id="contain">
      <h1 id="game1">Her er game 1</h1>
      <h2>Skriv inn navnet på deltakerne</h2>

      <Stack spacing={2} alignItems="center" width="300px">
        {players.map((val, i) => (
          <TextField
            key={i}
            label={`Deltaker ${i + 1}`}
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
          />
        ))}
      </Stack>
      <div id="button-box">
        <Button id="add-button" variant="contained" onClick={addInput}>
          Legg til
        </Button>

        <Link
          to="/fg/firstgamestarts"
          state={{ players }}
          style={{ textDecoration: "none" }}
        >
          <Button id="play-button" variant="contained">
            Start game
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Firstgame;

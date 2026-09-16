import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/input/Button";
import { TextInput } from "@/components/ui/input/TextInput";
import { useState } from "react";
import "./firstgame.css";
import Wheel from "@/components/NewProjects/components/Wheel";
import camera from "@/components/NewProjects/icons/camera.png";

export const Route = createFileRoute(
  "/_fgAuthenticated/fg/projects/kull26/firstgame",
)({
  component: Firstgame,
});

function Firstgame() {
  const [players, setPlayers] = useState<string[]>([""]);
  const [gameStarted, setGameStarted] = useState(false);

  const addInput = () => {
    setPlayers((prev) => [...prev, ""]);
  };

  const handleChange = (i: number, value: string) => {
    setPlayers((prev) =>
      prev.map((player, index) => (index === i ? value : player)),
    );
  };

  const startGame = () => {
    const validPlayers = players.filter((player) => player.trim() !== "");

    if (validPlayers.length > 0) {
      setPlayers(validPlayers);
      setGameStarted(true);
    }
  };

  if (gameStarted) {
    return <FirstGameStarts players={players} />;
  }

  return (
    <div id="contain">
      <h1 id="game1">Her er game 1</h1>
      <h2>Skriv inn navnet på deltakerne</h2>

      <div id="player-inputs">
        {players.map((player, i) => (
          <div className="playerInput" key={i}>
            <TextInput
              label={`Deltaker ${i + 1}`}
              value={player}
              onChange={(e) => handleChange(i, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div id="button-box">
        <Button id="add-button" onClick={addInput}>
          Legg til
        </Button>

        <Button id="play-button" onClick={startGame}>
          Start game
        </Button>
      </div>
    </div>
  );
}

function FirstGameStarts({ players }: { players: string[] }) {
  return (
    <div id="fullsizeDiv">
      <h1 id="game-start-title">Spillet starter!</h1>

      <div id="gameScale">
        <div className="wheelCenter">
          <Wheel participants={players} />

          <img src={camera} alt="Kamera" id="camera" />
        </div>
      </div>
    </div>
  );
}

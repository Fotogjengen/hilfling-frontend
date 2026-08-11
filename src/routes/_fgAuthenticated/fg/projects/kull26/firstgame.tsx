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

  const addInput = () => setPlayers([...players, ""]);
  const handleChange = (i: number, v: string) => {
    const next = [...players];
    next[i] = v;
    setPlayers(next);
  };

  if (gameStarted) {
    return <FirstGameStarts players={players} />;
  }

  return (
    <div id="contain">
      <h1 id="game1">Her er game 1</h1>
      <h2>Skriv inn navnet på deltakerne</h2>

      <div>
        {players.map((val, i) => (
          <TextInput
            key={val || i}
            label={`Deltaker ${i + 1}`}
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
          />
        ))}
      </div>
      <div id="button-box">
        <Button id="add-button" onClick={addInput}>
          Legg til
        </Button>
        <Button id="play-button" onClick={() => setGameStarted(true)}>
          Start game
        </Button>
      </div>
    </div>
  );
}

function FirstGameStarts({ players }: { players: string[] }) {
  return (
    <div id="fullsizeDiv">
      <div id="div2" style={{ textAlign: "center", fontFamily: "Inter" }}>
        <h1>Spillet starter!</h1>

        <div className="wheelCenter">
          <Wheel participants={players} />

          <img src={camera} alt="Kamera" id="camera" />
        </div>
      </div>
    </div>
  );
}

import { Button, Input } from "@mui/material";
import classnames from "classnames";
import styles from "./MarkusProject.module.css";
import React, { useMemo, useRef, useState } from "react";

type ImpostorWord = {
  word: string;
  hint: string;
};

const words: ImpostorWord[] = [
  { word: "Skibolig", hint: "" },
  { word: "Gul bolle", hint: "" },
  { word: "Takshot", hint: "" },
  { word: "I min tid", hint: "" },
  { word: "Fangst", hint: "" },
  { word: "Rocky", hint: "" },
  { word: "Nakensigg", hint: "" },
  { word: "Dahls", hint: "" },
  { word: "Tequilatraktaten", hint: "" },
  { word: "Tormod", hint: "" },
  { word: "Samfundet happy hour", hint: "" },
  { word: "Aqua", hint: "" },
  { word: "ARK", hint: "" },
  { word: "NBB", hint: "" },
  { word: "Loftet", hint: "" },
  { word: "Juvet", hint: "" },
  { word: "Felleshølet", hint: "" },
  { word: "Sosi", hint: "" },
  { word: "Regi", hint: "" },
  { word: "BDSM shot", hint: "" },
  { word: "Festivalen", hint: "" },
  { word: "Flat struktur", hint: "" },
  { word: "Soundboksen til Marius", hint: "" },
  { word: "Mariusen til soundboksen", hint: "" },
];

type GameState = "starting" | "playing" | "guessing" | "ended";

export default function MarkusProject() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>("starting");
  const [playerGuess, setPlayerGuess] = useState<Player | null>(null);

  const [selectedWord, setSelectedWord] = useState(() => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  });

  const newPlayerNameRef = useRef<HTMLInputElement>(null);

  const startGame = () => {
    // shuffle players and assign one as impostor
    const shuffledPlayers = [...players]
      .map((p) => ({ ...p, isImpostor: false }))
      .sort(() => Math.random() - 0.5);
    const impostorIndex = Math.floor(Math.random() * shuffledPlayers.length);
    shuffledPlayers[impostorIndex].isImpostor = true;
    setPlayers(shuffledPlayers);
    setSelectedWord(words[Math.floor(Math.random() * words.length)]);
    setGameState("playing");
    setPlayerGuess(null);
  };

  const handleGameFinish = () => {
    setGameState("guessing");
  };

  const handlePlayerGuess = (guessedPlayer: Player) => {
    setPlayerGuess(guessedPlayer);
    setGameState("ended");
  };

  if (gameState === "starting") {
    return (
      <div className={styles.gameWrapper}>
        <h1>Legg til spillere</h1>
        <div className={styles.addPlayerContainer}>
          <Input placeholder="Navn" inputRef={newPlayerNameRef} />
          <Button
            className={styles.addPlayerButton}
            onClick={() => {
              setPlayers((prev) => [
                ...prev,
                {
                  name:
                    newPlayerNameRef.current?.value ||
                    `Spiller ${prev.length + 1}`,
                  isImpostor: false,
                },
              ]);
              if (newPlayerNameRef.current) {
                newPlayerNameRef.current.value = "";
              }
            }}
          >
            Legg til spiller
          </Button>
        </div>
        <div className={styles.playersList}>
          {players.map((player, index) => (
            <div
              key={player.name + String(index)}
              className={styles.playerItem}
            >
              {player.name}
            </div>
          ))}
        </div>
        <div className={styles.separator} />
        <Button
          disabled={!players.length || players.length < 3}
          onClick={() => {
            startGame();
          }}
        >
          Start spill
        </Button>
      </div>
    );
  }

  if (gameState === "playing") {
    return (
      <div className={styles.gameWrapper}>
        <Game
          players={players}
          selectedWord={selectedWord}
          onGameFinish={handleGameFinish}
        />
      </div>
    );
  }

  if (gameState === "guessing") {
    return (
      <div className={styles.gameWrapper}>
        <h1>Gjett hvem som er Impostor!</h1>
        <div className={styles.playersList}>
          {players.map((player, index) => (
            <div
              onClick={() => {
                handlePlayerGuess(player);
              }}
              key={player.name + String(index)}
              className={styles.playerGuessItem}
            >
              {player.name}
            </div>
          ))}
        </div>
        <Button onClick={() => setGameState("ended")}>Avslutt spill</Button>
      </div>
    );
  }

  return (
    <div className={styles.gameWrapper}>
      {playerGuess ? (
        <>
          <h1>
            {playerGuess.isImpostor
              ? `Riktig! ${playerGuess.name} var Impostor!`
              : `Feil! ${playerGuess.name} var ikke Impostor!`}
          </h1>
          {!playerGuess.isImpostor && (
            <p>Impostor var: {players.find((p) => p.isImpostor)?.name}</p>
          )}
          <h2>Ordet var: {selectedWord.word}</h2>
        </>
      ) : (
        <h1>Spillet er over!</h1>
      )}
      <Button onClick={() => setGameState("starting")}>Spill igjen</Button>
    </div>
  );
}

type Player = {
  name: string;
  isImpostor: boolean;
};

type GameProps = {
  players: Player[];
  selectedWord: ImpostorWord;
  onGameFinish: () => void;
};

function Game({ players, selectedWord, onGameFinish }: GameProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentWordIsRevealed, setCurrentWordIsRevealed] = useState(false);
  const [everyoneHasSeenWord, setEveryoneHasSeenWord] = useState(false);

  const currentPlayer = useMemo(() => {
    return players[currentPlayerIndex];
  }, [currentPlayerIndex, players]);

  if (everyoneHasSeenWord) {
    return (
      <div className={styles.innerGameWrapper}>
        <h1>Alle har sett ordet!</h1>
        <Button onClick={onGameFinish} className={styles.finishGameButton}>
          Trykk når dere er klare til å gjette
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.innerGameWrapper}>
      <h1>{currentPlayer.name}</h1>
      <div
        className={styles.wordContainerWrapper}
        onPointerDown={() => setCurrentWordIsRevealed(true)}
        onPointerUp={() => setCurrentWordIsRevealed(false)}
        onPointerLeave={() => setCurrentWordIsRevealed(false)}
      >
        <div
          className={classnames(styles.wordContainer, {
            [styles.revealed]: currentWordIsRevealed,
          })}
        >
          <span className={styles.clickToReveal}>Trykk for å se ordet</span>
          <div className={styles.wordBack}>
            <InnerWordDisplay
              word={selectedWord}
              isImpostor={currentPlayer.isImpostor}
            />
          </div>
        </div>
      </div>
      <Button
        onClick={() => {
          if (currentPlayerIndex === players.length - 1) {
            setEveryoneHasSeenWord(true);
            return;
          }
          setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
        }}
      >
        Next Player
      </Button>
    </div>
  );
}

function InnerWordDisplay({
  word,
  isImpostor,
}: {
  word: ImpostorWord;
  isImpostor: boolean;
}) {
  if (isImpostor) {
    return (
      <div className={styles.innerWordContainer}>
        <span className={styles.impostorText}>Du er Impostor!</span>
        <span>Hint: {word.hint}</span>
      </div>
    );
  }

  return (
    <div className={styles.innerWordContainer}>
      <h2>{word.word}</h2>
    </div>
  );
}

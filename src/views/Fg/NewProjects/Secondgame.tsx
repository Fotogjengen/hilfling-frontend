import React, { useState, useMemo, useCallback, useEffect } from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import { Grid, Paper, Typography } from "@mui/material";
import VolcanoIcon from "@mui/icons-material/Volcano";
import { Link } from "react-router-dom";
import "./Secondgame.css";
import { questions } from "./questions";
import { random } from "lodash";

interface Droplet {
  id: number;
  x: number;
  y: number;
  angle: number;
  velocity: number;
  life: number; // hvor lenge dråpen har eksistert
  color: string;
}

const Secondgame = () => {
  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const shuffledQuestions = useMemo(() => shuffleArray(questions), [questions]);
  const [question, setQuestion] = useState<string>("Klar for 100 (120) questions!?!?");
  const [everyTenth, setTenth] = useState<string>("");
  const [splash, setSplashh] = useState<string>("");
  const [nr, setNr] = useState<number>(1);

  // -------------------- SPLASH ANIMATION LOGIC --------------------
  const [droplets, setDroplets] = useState<Droplet[]>([]);

  const triggerSplash = useCallback((centerx: number, centery: number, rectwidth: number, rectheight: number,count = 100) => {
    const newDroplets: Droplet[] = Array.from({ length: count }).map((_, i) => {
      const rand = Math.random(); // <--- unikt for hver dråpe
      const x = centerx + (rand - 0.5) * rectwidth;
      const y = 1.7 * centery - Math.sin(rand * Math.PI) * rectheight * 0.7;

      // Startfarge basert på x-posisjon
      const t = (x - (centerx - rectwidth / 2)) / rectwidth;
      const hue = 240 - 240 * t; // blå → rød
      const color = `hsl(${hue}, 100%, 50%)`;
      return {
        id: Date.now() + i,
        x: centerx + (rand - 0.5) * rectwidth, // spres horisontalt rundt midten
        y: 1.7*centery - Math.sin(rand * Math.PI) * rectheight*0.7, // gir “kurve”
        angle: Math.random() * Math.PI *0.5 - Math.PI * 0.75,
        velocity: 300 + Math.random() * 200,
        life: 0,
        color,
      };
    });

    setDroplets((prev) => [...prev, ...newDroplets]);
  }, []);

  const handleAnimationEnd = useCallback((id: number) => {
    setDroplets((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // -------------------- REALISTISK BEVEGELSE --------------------
  useEffect(() => {
    let lastTime = performance.now();
    const gravity = 900; // px/s²

    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setDroplets((prev) =>
        prev
          .map((d) => {
            const vx = (Math.cos(d.angle) * d.velocity)*0.8;
            const vy = (Math.sin(d.angle) * d.velocity + gravity * d.life)*0.8;

            const newX = d.x + vx * dt;
            const newY = d.y + vy * dt;
            const newLife = d.life + dt;

            const t = Math.sin((newX / window.innerWidth) * Math.PI);
            const hue = (240 - 240 * t + newLife * 100) % 360; // fargen “sirkler” mens den flyr
            const color = `hsl(${hue}, 100%, 50%)`;

            return {
              ...d,
              x: newX,
              y: newY,
              life: newLife,
              velocity: d.velocity * 0.98,
              color
            };
          })
          .filter((d) => d.y < window.innerHeight + 100)
      );

      requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);
  // ---------------------------------------------------------------

  function nyttSpørsmål() {
    setNr((prev) => prev + 1);
    setQuestion(shuffledQuestions[nr - 1]);

    if (nr % 10 === 0) {
      setTenth(`${nr} spørsmål - 🍻SKÅL🍻`);
    } else {
      setTenth("");
    }

    const randomSplash = random(1, 2);
    if (randomSplash === 1) {
      setSplashh("Splashhhh🎉🎉🎉");
      const container = document.getElementById("container-main");
      if (container) {
        const rect = container.getBoundingClientRect();
        triggerSplash(
          rect.left + rect.width / 2,
          rect.top-rect.height,
          rect.width,
          rect.height,
        );
      }
    } else {
      setSplashh("");
    }
  }

  return (
    <div id="secondgame">
      <div className="splash-container">
        {droplets.map((d) => (
          <div
            key={d.id}
            className="droplet"
            style={{
              transform: `translate(${d.x}px, ${d.y}px) scale(${1 - d.life / 3})`,
              opacity: Math.max(0, 1 - d.life / 3),
              backgroundColor: d.color,
            }}
            onAnimationEnd={() => handleAnimationEnd(d.id)}
          />
        ))}
      </div>

      <p id="gameTitle">100 questions</p>

      <div id="container-main">
        <div id="question-container">
          <p>{question}</p>
          <p>{splash}</p>
          <p>{everyTenth}</p>
        </div>

        <div id="qstbutton-container">
          <button id="qstbutton" onClick={nyttSpørsmål}>
            Neste
          </button>
        </div>
      </div>
    </div>
  );
};

export default Secondgame;

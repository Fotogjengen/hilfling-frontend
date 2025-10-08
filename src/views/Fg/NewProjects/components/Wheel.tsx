// src/views/Fg/NewProjects/components/Wheel.tsx
import React, { useRef, useEffect, useState } from "react";
import blitzIcon from "../icons/blitz.png";


type Props = { participants: string[] };

const COLORS = ["#cc4629","#cc9a29","#5ecc29","#29cc99","#2985cc","#4629cc","#cc298f","#cc294f"];
const CANVAS_SIZE = 400;


// Robust måte å referere til en fil i samme mappe (fungerer i Vite/Webpack)
const CHALLENGES_URL = new URL("./challenges.txt", import.meta.url).href;

const Wheel: React.FC<Props> = ({ participants }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const [challenges, setChallenges] = useState<string[]>([]);
  const [challenge, setChallenge] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  // Last challenges.txt (én gang)

  
  useEffect(() => {

    fetch(CHALLENGES_URL)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((txt) => {
        const lines = txt
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean); // fjern tomme linjer
        setChallenges(lines);
      })
      .catch(() => setChallenges([]));
  }, []);

  const n = Math.max(1, participants.length);
  const showBlitz = !!winner && !spinning;



  // Tegn hjulet, hentet fra nett
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    const r = Math.min(W, H) / 2;

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    const slice = (2 * Math.PI) / n;

    for (let i = 0; i < n; i++) {
      const a0 = i * slice, a1 = (i + 1) * slice;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, a0, a1);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();

      // Navn i sektor
      ctx.save();
      ctx.rotate(a0 + slice / 2);
      ctx.fillStyle = "#fff";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const label = participants[i] ? capitalize(participants[i]) : "";
      ctx.fillText(label, r * 0.55, 0);
      ctx.restore();
    }

    ctx.restore();
  }, [participants, rotation, n]);

  const capitalize = (s?: string) =>
    (s ?? "").replace(/^\s*(.)/, (_, c: string) => c.toUpperCase());




  // Spin
  const spin = () => {
    if (spinning || participants.length === 0 || showOverlay) return;

    setWinner(null);
    setChallenge(null);
    setSpinning(true);

    const chosenIdx = Math.floor(Math.random() * n);

    const current = ((rotation % 360) + 360) % 360;
    const sliceDeg = 360 / n;
    const chosenCenterDeg = chosenIdx * sliceDeg + sliceDeg / 2;
    const turns = 5;
    const targetDeg =
      turns * 360 + ((360 - chosenCenterDeg) - current + 360) % 360;

    const duration = 3500; //hvor lang tid det skal ta å spinne
    const start = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      setRotation(current + targetDeg * eased);

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        setSpinning(false);
        const w = participants[chosenIdx];
        setWinner(w);

  
        //hente tilfeldig challenges
        if (challenges.length > 0) {
          const idx = Math.floor(Math.random() * challenges.length);
          setChallenge(challenges[idx]);
        } else {
          setChallenge("Ingen challenges tilgjengelig.");
        }
        setShowOverlay(true); // vis boksen foran hjulet
      }
    };

    requestAnimationFrame(tick);
  };



  return (
    <div style={{ textAlign: "center", width: CANVAS_SIZE, margin: "0 auto" }}>
      {/* Canvas + overlegg */}
      <div
        style={{
          position: "relative",
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
          display: "inline-block",
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{ borderRadius: "50%", border: "2px solid #000" }}
        />

        {/* Blitz-ikon på hjulet */}
        {showBlitz && (
          <img
            src={blitzIcon}
            alt="Blitz"
            style={{
              position: "absolute",
              top: "50%",
              left: "90%",
              transform: "translate(-50%, -50%)",
              width: 140,
              height: 140,
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 1,
            }}
          />
        )}

     
        {showOverlay && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3,
            }}
          >
            <div
              style={{
                background: "#ffed47ff",
           
                border: "3px solid #090909ff",
                borderRadius: 0,
                padding: "16px 18px",
                maxWidth: 320,
                margin: 12,
                textAlign: "center",
            
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                {winner ? capitalize(winner) : ""}
              </div>
              <div >
                {challenge}
              </div>
              <button
                onClick={() => setShowOverlay(false)} style={{ width: 50, marginTop: 30}}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Knapper */}
      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 8,
          justifyContent: "center",
        }}
      >
        <button
          onClick={spin}
          disabled={spinning || participants.length === 0 || showOverlay}>
          Spin
        </button>
      </div> 
    </div>
  );
};

export default Wheel;

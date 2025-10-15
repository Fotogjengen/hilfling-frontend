// src/views/Fg/NewProjects/components/Wheel.tsx
import React, { useRef, useEffect, useState } from "react";
import blitzIcon from "../icons/blitz.png";
import blitzSfx from "./sound.mp3";


type Props = { participants: string[] };

const COLORS = ["#cc2c09ff","#000000ff","#676565ff", "#a79f9fff"];
const CANVAS_SIZE = 400;
const CHALLENGES_URL = new URL("./challenges.txt", import.meta.url).href;

const Wheel: React.FC<Props> = ({ participants }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null); // <-- ref til lyd

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [challenge, setChallenge] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showBlitz, setShowBlitz] = useState(false);

  // Last challenges.txt
  useEffect(() => {
    fetch(CHALLENGES_URL)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.text(); })
      .then((txt) => setChallenges(
        txt.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
      ))
      .catch(() => setChallenges([]));
  }, []);

  const n = Math.max(1, participants.length);

  // Tegn hjulet
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

  // Spill av lyd når blitzen vises
  useEffect(() => {
    if (showBlitz && audioRef.current) {
      // restart og spill
      audioRef.current.currentTime = 0;
      // Kan feile i noen nettlesere hvis ingen bruker-handling har skjedd
      audioRef.current.play().catch(() => {/* ignorer */});
    }
  }, [showBlitz]);

  // Spin
  const spin = () => {
    if (spinning || participants.length === 0 || showOverlay) return;

    setWinner(null);
    setChallenge(null);
    setSpinning(true);
    setShowBlitz(false);
    setShowOverlay(false);

    const chosenIdx = Math.floor(Math.random() * n);
    const current = ((rotation % 360) + 360) % 360;
    const sliceDeg = 360 / n;
    const chosenCenterDeg = chosenIdx * sliceDeg + sliceDeg / 2;
    const turns = 5;
    const targetDeg = turns * 360 + ((360 - chosenCenterDeg) - current + 360) % 360;

    const duration = 3500;
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

        if (challenges.length > 0) {
          const idx = Math.floor(Math.random() * challenges.length);
          setChallenge(challenges[idx]);
        } else {
          setChallenge("Ingen challenges tilgjengelig.");
        }
        setShowOverlay(true);
        setShowBlitz(true); 
      }
    };

    requestAnimationFrame(tick);
  };

  return (
    <div style={{ textAlign: "center", width: CANVAS_SIZE, margin: "0 auto" }}>
      {/* skjult lyd-element */}
      <audio ref={audioRef} src={blitzSfx} preload="auto" />

      <div style={{ position: "relative", width: CANVAS_SIZE, height: CANVAS_SIZE, display: "inline-block" }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{ borderRadius: "50%", border: "2px solid #000" }}
        />

        {showBlitz && (
          <img
            src={blitzIcon}
            alt="Blitz"
            style={{
              position: "absolute",
              top: "45%",
              left: "60%",
              transform: "translate(-50%, -50%)",
              width: 500,
              height: 400,
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
            <div>
              <div style={{ fontWeight: 1000, marginBottom: 8 }}>
                {winner ? capitalize(winner) : ""}
              </div>
              <div style={{ width: 200, fontWeight: 100 }}>
                {challenge}
              </div>
              <button
                onClick={() => {
                  setShowOverlay(false);
                  setShowBlitz(false);
                }}
                style={{ width: 80, marginTop: 20 }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center" }}>
        <button onClick={spin} disabled={spinning || participants.length === 0 || showOverlay}>
          Spin
        </button>
      </div>
    </div>
  );
};

export default Wheel;

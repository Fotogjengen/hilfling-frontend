import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FirstGameStarts: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Trygg uthenting (tåler refresh / direkte URL)
  const players = (location.state as { players?: string[] } | undefined)?.players ?? [];

  useEffect(() => {
    if (!players.length) navigate("/fg/firstgame"); //dersom antall spillere er null, ikke spill
  }, [players, navigate]);

  return (
    <div id="div2">
      <h1>Spillet starter...</h1>
      <ul>{players.map((p, i) => <li key={i}>{p}</li>)}</ul>
    </div>

    
  );
};

export default FirstGameStarts;

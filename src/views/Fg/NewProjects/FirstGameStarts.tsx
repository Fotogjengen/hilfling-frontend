import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Wheel from "./components/Wheel";
import camera from "./icons/camera.png";
import "./Firstgame.css";


const FirstGameStarts: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const players = (location.state as { players?: string[] } | undefined)?.players ?? [];

  useEffect(() => {
    if (!players.length) navigate("/fg/firstgame"); 
  }, [players, navigate]);

  return (
    <div id="fullsizeDiv">
    <div id="div2" style={{ textAlign: "center" }}>
      <h1>Spillet starter!</h1>

      <div className="wheelCenter">
      
        <Wheel participants={players} />

        <img src={camera} alt="Kamera" id="camera"/>

      </div>

    </div>
    </div>
  );
};

export default FirstGameStarts;

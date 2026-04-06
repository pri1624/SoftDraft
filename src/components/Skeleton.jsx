import React from "react";
import "../styles/components.css";
import ParticleBackground from "./ParticleBackground";
import { useNavigate } from "react-router-dom";
import "../styles/index.css";
import moon from "../assets/pictures/moon.png";
import sun from "../assets/pictures/sunny.png";
import title from "../assets/pictures/Title.png"

function Skeleton({ isdarkTheme, toggleTheme }) {
  const navigate = useNavigate();

  return (
    <div className={isdarkTheme ? "dark-home" : "light-home"}>
      

      <img className="title" 
      src={title}></img>
      <p className="quote">"Nothing here is permanent"</p>

      <button
        className="start"
        onClick={() => navigate("/upload")}
      >
        Continue
      </button>

      <img
        className="theme-toggle"
        onClick={toggleTheme}
        src={isdarkTheme ? sun : moon}
        alt="theme-toggle"
      />
    </div>
  );
}

export default Skeleton;

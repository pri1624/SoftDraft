import React, { useState, useEffect, useRef } from "react";
import "../styles/journalBackground.css";

function JournalBackground({ onApply }) {
  const canvasRef = useRef();

  const [bgColor, setBgColor] = useState("#fdf6e3");
  const [dotColor, setDotColor] = useState("#444444");
  const [spacing, setSpacing] = useState(24);
  const [dotSize, setDotSize] = useState(1.2);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = dotColor;

    for (let x = spacing / 2; x < width; x += spacing) {
  for (let y = spacing / 2; y < height; y += spacing) {
    ctx.beginPath();
    ctx.arc(x + 0.5, y + 0.5, dotSize, 0, Math.PI * 2);
    ctx.fill();
  }
}
  }, [bgColor, dotColor, spacing, dotSize]);

  const applyBackground = () => {
    const image = canvasRef.current.toDataURL("image/png");
    onApply(image);
  };

  return (
    <div className="bg-panel">
      <h3>Create Background</h3>

      <div className="control-row">
        <label>Background</label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
        />
      </div>

      <div className="control-row">
        <label>Dot Color</label>
        <input
          type="color"
          value={dotColor}
          onChange={(e) => setDotColor(e.target.value)}
        />
      </div>

      <div className="control-row">
        <label>Spacing</label>
        <input
          type="range"
          min="7"
          max="40"
          value={spacing}
          onChange={(e) => setSpacing(Number(e.target.value))}
          style={{ accentColor: bgColor }}
        />
      </div>

      <div className="control-row">
        <label>Dot Size</label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={dotSize}
          onChange={(e) => setDotSize(Number(e.target.value))}
          style={{ accentColor: bgColor }}
        />
      </div>

      <canvas ref={canvasRef} width={800} height={600} className="bg-preview" />

      <button className="apply-btn" onClick={applyBackground}>
        Apply Background
      </button>
    </div>
  );
}

export default JournalBackground;
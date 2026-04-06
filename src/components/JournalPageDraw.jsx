import React, { useRef, useState, useEffect } from "react";
import JournalPage from "./JournalPage";

function JournalPageDraw({ drawTool, drawColor, enabled, canvasState, onDrawEnd }) {

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getCtx = () => canvasRef.current.getContext("2d");

  useEffect(() => {

    const canvas = canvasRef.current;
    const workspace = document.querySelector(".journal-workspace");

    if (!canvas || !workspace) return;

    if (canvas.width !== workspace.clientWidth || canvas.height !== workspace.clientHeight) {
      canvas.width = workspace.clientWidth;
      canvas.height = workspace.clientHeight;
    }

  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvasState) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    const img = new Image();
    img.src = canvasState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }, [canvasState]);

  const startDraw = (e) => {

    if (!enabled) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = getCtx();

    ctx.beginPath();
    ctx.moveTo(x, y);

    setIsDrawing(true);

  };

  const draw = (e) => {

    if (!isDrawing || !enabled) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = getCtx();

    if (drawTool === "eraser") {

      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 20;

    } else {

      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = drawColor;

      if (drawTool === "marker") {
        ctx.lineWidth = 10;
        ctx.globalAlpha = 0.4;
      } else {
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1;
      }

    }

    ctx.lineTo(x, y);
    ctx.stroke();

  };

  const endDraw = () => {

    if (!isDrawing) return;
    setIsDrawing(false);

    const ctx = getCtx();
    ctx.closePath();
    ctx.globalAlpha = 1;

    if (onDrawEnd) {
      onDrawEnd(canvasRef.current.toDataURL());
    }

  };

  return (

    <canvas
      ref={canvasRef}
      className="draw-canvas"
      style={{
      pointerEvents: enabled ? "auto" : "none"
    }}
      onMouseDown={startDraw}
      onMouseMove={draw}
      onMouseUp={endDraw}
      onMouseLeave={endDraw}
    />

  );

}

export default JournalPageDraw;
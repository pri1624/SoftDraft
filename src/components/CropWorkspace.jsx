import React, { useRef, useState } from "react";
import "../styles/cropworkspace.css";
import WorkspaceToolbar from "./WorkspaceToolbar";
import LassoTool from "./LassoTool";

function CropWorkspace({ image, onConfirm, onFinish }) {
  const containerRef = useRef(null);
  const lassoRef = useRef(null);

  const [start, setStart] = useState(null);
  const [rect, setRect] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  if (!image) return <p>Select an image to crop</p>;

  const getRelativePos = (e) => {
    const bounds = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top
    };
  };

  const triggerWarning = () => {
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 2000);
  }; 

  const handleMouseDown = (e) => {
  if (!activeTool) {
    triggerWarning();
    return;
  }

  if (activeTool !== "crop") return;

  const pos = getRelativePos(e);
  setStart(pos);
  setRect({ ...pos, width: 0, height: 0 });
  setDragging(true);
};

  const handleMouseMove = (e) => {
    if (activeTool !== "crop" || !dragging || !start) return;

    const pos = getRelativePos(e);
    setRect({
      x: Math.min(start.x, pos.x),
      y: Math.min(start.y, pos.y),
      width: Math.abs(pos.x - start.x),
      height: Math.abs(pos.y - start.y)
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const confirmCrop = () => {
    if (!rect || rect.width === 0 || rect.height === 0) {
      onConfirm(image);
      setRect(null);
      return;
    }

    const img = new Image();
    img.src = image;

    img.onload = () => {
      const scaleX =
        img.naturalWidth / containerRef.current.clientWidth;
      const scaleY =
        img.naturalHeight / containerRef.current.clientHeight;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = rect.width * scaleX;
      canvas.height = rect.height * scaleY;

      ctx.drawImage(
        img,
        rect.x * scaleX,
        rect.y * scaleY,
        rect.width * scaleX,
        rect.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      onConfirm(canvas.toDataURL());
      setRect(null);
    };
  };

  const handleConfirm = () => {
    if (activeTool === "crop") confirmCrop();
    if (activeTool === "lasso") lassoRef.current?.confirm();
    if (!activeTool) {
    onConfirm(image);
    return;
  }
  };

  return (
    <div>
      <div
        ref={containerRef}
        className={`snip-container ${
          activeTool ? `cursor-${activeTool}` : "cursor-none"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <img src={image} alt="" draggable={false} />

        
        <LassoTool
          ref={lassoRef}
          active={activeTool === "lasso"}
          image={image}
          containerRef={containerRef}
          onConfirm={onConfirm}
        />

        {rect && activeTool === "crop" && (
          <div
            className="snip-rect"
            style={{
              left: rect.x,
              top: rect.y,
              width: rect.width,
              height: rect.height
            }}
          />
        )}
      </div>

      {showWarning && (
      <div className="tool-warning">
        Please select an operation
      </div>
      )}

      <WorkspaceToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        onConfirm={handleConfirm}
        onUndo={() => onConfirm("UNDO")}
        onRedo={() => onConfirm("REDO")}
        onFinish={onFinish} 
      />
    </div>
  );
}

export default CropWorkspace;
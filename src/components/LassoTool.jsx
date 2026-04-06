import React, {useState, forwardRef, useImperativeHandle} from "react";
import "../styles/cutouttray.css";

const LassoTool = forwardRef(function LassoTool(
  { active, image, containerRef, onConfirm },
  ref
) {
  const [lassoPath, setLassoPath] = useState([]);
  const [lassoing, setLassoing] = useState(false);

  useImperativeHandle(ref, () => ({
    confirm
  }));

  if (!active) return null;

  const getRelativePos = (e) => {
    const bounds = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top
    };
  };

  const handleMouseDown = (e) => {
  const pos = getRelativePos(e);
  setLassoPath([pos]);
  setLassoing(true);

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
};

const handleMouseMove = (e) => {
  if (!lassoing) return;
  const pos = getRelativePos(e);
  setLassoPath(prev => [...prev, pos]);
};

const handleMouseUp = () => {
  setLassoing(false);

  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("mouseup", handleMouseUp);
};

  function confirm() {
    if (!lassoPath.length) return;

    const img = new Image();
    img.src = image;

    img.onload = () => {
      const scaleX =
        img.naturalWidth / containerRef.current.clientWidth;
      const scaleY =
        img.naturalHeight / containerRef.current.clientHeight;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.beginPath();
      lassoPath.forEach((p, i) => {
        const x = p.x * scaleX;
        const y = p.y * scaleY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, 0, 0);
      onConfirm(canvas.toDataURL());
      setLassoPath([]);
    };
  }

  return (
    <>
      {/* HIT AREA */}
      <div
        className="lasso-hitbox"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      {/* PREVIEW */}
      {lassoPath.length > 1 && (
        <svg className="lasso-overlay">
          <path
            d={`M ${lassoPath.map(p => `${p.x} ${p.y}`).join(" L ")}`}
            fill="rgba(0,170,255,0.2)"
            stroke="#00aaff"
            strokeWidth="2"
          />
        </svg>
      )}
    </>
  );
});

export default LassoTool;

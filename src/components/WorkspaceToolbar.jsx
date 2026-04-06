import React from "react";
import crop from "../assets/pictures/crop.png";
import lasso from "../assets/pictures/lasso.png";
import undo from "../assets/pictures/undo.png";
import redo from "../assets/pictures/redo.png";

function WorkspaceToolbar({
  activeTool,
  setActiveTool,
  onConfirm,
  onUndo,
  onRedo,
  onFinish
}) {
  return (
    <div className="workspace-toolbar">
      {/* CROP */}
      <button
        type="button"
        className={activeTool === "crop" ? "active icon-btn" : "icon-btn"}
        onClick={() => setActiveTool("crop")}
        title="Crop"
      >
        <img src={crop} alt="Crop tool" />
      </button>

      {/* LASSO */}
      <button
        type="button"
        className={activeTool === "lasso" ? "active icon-btn" : "icon-btn"}
        onClick={() => setActiveTool("lasso")}
        title="Lasso"
      >
        <img src={lasso} alt="Lasso tool" />
      </button>

      {/* CONFIRM */}
      <button
        type="button"
        className="icon-btn-confirm-btn"
        onClick={onConfirm}
        title="Confirm"
      >
        Confirm
      </button>

      {/* FINISH → JOURNAL */}
      <button
        type="button"
        className="icon-btn-finish-btn"
        onClick={onFinish}
        title="Finish"
      >
        Finish
      </button>

      {/* UNDO */}
      <button
        type="button"
        className="icon-btn"
        onClick={onUndo}
        title="Undo"
      >
        <img src={undo} alt="Undo" />
      </button>

      {/* REDO */}
      <button
        type="button"
        className="icon-btn"
        onClick={onRedo}
        title="Redo"
      >
        <img src={redo} alt="Redo" />
      </button>
    </div>
  );
}

export default WorkspaceToolbar;
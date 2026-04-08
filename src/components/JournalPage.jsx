import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Moveable from "react-moveable";
import html2canvas from "html2canvas";

import "../styles/journalpage.css";
import JournalBackground from "./JournalBackground";
import JournalPageDraw from "./JournalPageDraw";
import background from "../assets/pictures/background.png";
import uploads from "../assets/pictures/upload.png";
import undo from "../assets/pictures/undo.png";
import redo from "../assets/pictures/redo.png";
import textIcon from "../assets/pictures/text.png";
import draw from "../assets/pictures/draw.png";
import bin from "../assets/pictures/bin.png";
import rotateIcon from "../assets/pictures/rotate.png";
import pencil from "../assets/pictures/pencil.png";
import marker from "../assets/pictures/marker.png";
import eraser from "../assets/pictures/eraser.png";
import colorPicker from "../assets/pictures/colorpicker.png";
import download from  "../assets/pictures/download.png";
function JournalPage() {

  const location = useLocation();
  const panelRef = useRef(null);
  const navbarRef = useRef(null);
  const workspaceRef = useRef(null);

  const [workspaceBg, setWorkspaceBg] = useState(null);
  const [cutouts, setCutouts] = useState([]);
  const [activePanel, setActivePanel] = useState(null);

  const [workspaceItems, setWorkspaceItems] = useState([]);
  const [currentCanvas, setCurrentCanvas] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  
  const [history, setHistory] = useState([{ items: [], canvas: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [drawPanel, setDrawPanel] = useState(false);
  const [drawTool, setDrawTool] = useState("pencil");
  const [drawColor, setDrawColor] = useState("#ff0000");
  
  useEffect(() => {
    if (location.state?.cutouts) {
      setCutouts(location.state.cutouts);
      localStorage.setItem(
        "journal_cutouts",
        JSON.stringify(location.state.cutouts)
      );
    } else {
      const saved = localStorage.getItem("journal_cutouts");
      if (saved) setCutouts(JSON.parse(saved));
    }
  }, [location]);

  /* ---------------- Close Panel Outside Click ---------------- */

  useEffect(() => {
    const handleClickOutside = (e) => {
  if (
    e.target.closest(".text-toolbar") ||
    e.target.closest(".workspace-item")
  ) {
    return; // ignore clicks on toolbar or selected items
  }

  if (
    panelRef.current &&
    !panelRef.current.contains(e.target) &&
    navbarRef.current &&
    !navbarRef.current.contains(e.target)
  ) {
    setActivePanel(null);
  }
};

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const closeAllPanels = () => {
    setActivePanel(null);
    setDrawPanel(false);
  };

  const togglePanel = (panel) => {
    closeAllPanels();
    setActivePanel(panel);
  };

  const saveState = (newItems, newCanvas = currentCanvas) => {
    const nextState = { items: JSON.parse(JSON.stringify(newItems)), canvas: newCanvas };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(nextState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setWorkspaceItems(newItems);
    setCurrentCanvas(newCanvas);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setWorkspaceItems(JSON.parse(JSON.stringify(history[prevIndex].items)));
      setCurrentCanvas(history[prevIndex].canvas);
      setSelectedIndex(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setWorkspaceItems(JSON.parse(JSON.stringify(history[nextIndex].items)));
      setCurrentCanvas(history[nextIndex].canvas);
      setSelectedIndex(null);
    }
  };


  /* ---------------- Add Text Item ---------------- */

  const addText = () => {
    const isDark = document.body.classList.contains("dark");
    const newItems = [
      ...workspaceItems,
      {
        type: "text",
        text: "Edit text",
        x: 350,
        y: 200,
        width: 200,
        fontSize: 32,
        fontFamily: "Arial",
        color: "#000000",
        rotation: 0
      }
    ];
    saveState(newItems);
  };

  /* ---------------- Download Page ---------------- */
  
  const handleDownload = async () => {
    if (!workspaceRef.current) return;
    
    setSelectedIndex(null);
    closeAllPanels();
    
    setTimeout(async () => {
      const canvas = await html2canvas(workspaceRef.current, {
        useCORS: true,
        backgroundColor: null,
      });
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "journal_page.png";
      link.href = url;
      link.click();
    }, 100);
  };

  return (
    <div className="journal-container">

      {/* NAVBAR */}

      <div ref={navbarRef} className="journal-navbar">

        <div className="nav-item" onClick={() => togglePanel("background")}>
          <img src={background} alt="" />
          <span>Background</span>
        </div>

        <div className="nav-item" onClick={() => togglePanel("uploads")}>
          <img src={uploads} alt="" />
          <span>Uploads</span>
        </div>


        <div className="nav-item" onClick={handleUndo} style={{ opacity: historyIndex > 0 ? 1 : 0.5 }}>
          <img src={undo} alt="" />
          <span>Undo</span>
        </div>

        <div className="nav-item" onClick={handleRedo} style={{ opacity: historyIndex < history.length - 1 ? 1 : 0.5 }}>
          <img src={redo} alt="" />
          <span>Redo</span>
        </div>

        <div
          className="nav-item nav-text"
          onClick={() => {
            closeAllPanels();
            addText();
          }}
        >
          <img src={textIcon} alt="" />
          <span>Text</span>
        </div>

        <div
          className="nav-item nav-draw"
          onClick={() => {
            closeAllPanels();
            setDrawPanel(true);
          
          }}
        >
          <img src={draw} alt="" />
          <span>Draw</span>
        </div>

      </div>

      <button
        className="icon-btn download-btn"
        onClick={handleDownload}
        title="Download Page"
      >
        <img src={download} alt="Download" />
      </button>

      {/* SIDE PANEL */}

      <div
        ref={panelRef}
        className={`side-panel ${activePanel ? "open" : ""}`}
      >

        {activePanel === "background" && (
          <JournalBackground
            onApply={(image) => {
              setWorkspaceBg(image);
              setActivePanel(null);
            }}
          />
        )}

        {activePanel === "uploads" && (
          <>
            <h3>Your Cutouts</h3>

            <div className="uploads-grid">
              {cutouts.map((img, index) => (
                <div key={index} className="upload-thumb">
                  <img
                    src={img}
                    alt=""
                    onClick={() =>
                      saveState([
                        ...workspaceItems,
                        {
                          type: "image",
                          src: img,
                          x: 350,
                          y: 120,
                          width: 120,
                          rotation: 0
                        }
                      ])
                    }
                  />
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* TEXT TOOLBAR */}

      {selectedIndex !== null &&
        workspaceItems[selectedIndex]?.type === "text" && (

          <div
            className="text-toolbar"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >

            <select
              value={workspaceItems[selectedIndex].fontFamily}
              onChange={(e) => {
                const font = e.target.value;
                const updated = [...workspaceItems];
                updated[selectedIndex].fontFamily = font;
                saveState(updated);
              }}
            >
              <option value="Gaegu">Gaegu</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Poppins">Poppins</option>
              <option value="Great Vibes">Calligraphy</option>
            </select>

            <input
              type="number"
              value={workspaceItems[selectedIndex].fontSize}
              onChange={(e) => {
                const size = Number(e.target.value);
                const updated = [...workspaceItems];
                updated[selectedIndex].fontSize = size;
                saveState(updated);
              }}
            />

            <input
              type="color"
              value={workspaceItems[selectedIndex].color}
              onChange={(e) => {
                const color = e.target.value;
                const updated = [...workspaceItems];
                updated[selectedIndex].color = color;
                saveState(updated);
              }}
            />

          </div>
        )}


        {/* DRAW TOOLBAR */}

      {drawPanel && (
        <div className="draw-toolbar">

          <button className="draw-tool" onClick={() => setDrawTool("pencil")}>
            <img src={pencil} alt="pencil" />
          </button>

          <button className="draw-tool" onClick={() => setDrawTool("marker")}>
            <img src={marker} alt="marker" />
          </button>

          <button className="draw-tool" onClick={() => setDrawTool("eraser")}>
            <img src={eraser} alt="eraser" />
          </button>

          <label className="draw-tool color-picker-btn">

  <div
    className="color-icon"
    style={{
      backgroundColor: drawColor,
      WebkitMaskImage: `url(${colorPicker})`,
      maskImage: `url(${colorPicker})`
    }}
  />

  <input
    type="color"
    value={drawColor}
    onChange={(e) => setDrawColor(e.target.value)}
  />

</label>

        </div>
      )}

      {/* WORKSPACE */}

      <div
  ref={workspaceRef}
  className="journal-workspace"
  onMouseDown={(e) => {
    const ignoreClick =
      e.target.closest(".workspace-item") ||
      e.target.closest(".text-toolbar") ||
      e.target.tagName === "INPUT" ||
      e.target.tagName === "SELECT";

    if (!ignoreClick) {
      setSelectedIndex(null);
    }
  }}
        style={{
          backgroundImage: workspaceBg ? `url(${workspaceBg})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
          <JournalPageDraw
            drawTool={drawTool}
            drawColor={drawColor}
            enabled={drawPanel}
            canvasState={currentCanvas}
            onDrawEnd={(newCanvasData) => saveState(workspaceItems, newCanvasData)}
          />
        {workspaceItems.map((item, index) => {

          if (item.type === "image") {
            return (
              <img
                key={index}
                src={item.src}
                alt=""
                className="workspace-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(index);
                }}
                style={{
                  position: "absolute",
                  left: item.x,
                  top: item.y,
                  width: item.width,
                  transform: `rotate(${item.rotation}deg)`
                }}
              />
            );
          }

          if (item.type === "text") {
            return (
              <div
                key={index}
                className="workspace-item"
                contentEditable
                spellCheck={false}
                suppressContentEditableWarning
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(index);
                }}
                onBlur={(e) => {
                  const value = e.currentTarget.textContent;
                  if (workspaceItems[index].text !== value) {
                    const updated = [...workspaceItems];
                    updated[index].text = value;
                    saveState(updated);
                  }
                }}
                
                style={{
                  position: "absolute",
                  left: item.x,
                  top: item.y,
                  width: item.width,
                  fontSize: item.fontSize,
                  fontFamily: item.fontFamily,
                  color: item.color,
                  transform: `rotate(${item.rotation}deg)`,
                  cursor: "move",
                  outline: "none",
                  border: selectedIndex === index ? "1px dashed #444" : "none",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  minWidth: "50px",
                }}
              >
               {item.text} 
              </div>
            );
          }

          return null;

        })}

        {/* MOVEABLE CONTROLS */}

        {selectedIndex !== null && (
          <Moveable
            target={document.querySelectorAll(".workspace-item")[selectedIndex]}
            draggable
            resizable
            rotatable
            origin={false}
            keepRatio={false} 

            onDrag={({ left, top }) => {
              const updated = [...workspaceItems];
              updated[selectedIndex].x = left;
              updated[selectedIndex].y = top;
              setWorkspaceItems(updated); // Live update without saving history
            }}
            onDragEnd={() => saveState(workspaceItems)}

            onResize={({ width, height, target }) => {
              const updated = [...workspaceItems];
              const item = updated[selectedIndex];

              if (item.type === "image") {
                item.width = width;
              }
              if (item.type === "text") {
                const scale = width / item.width;
                item.width = width;
                item.fontSize = item.fontSize * scale;
              }
              setWorkspaceItems(updated); // Live update

              target.style.width = `${width}px`;
              target.style.height = `${height}px`;
            }}
            onResizeEnd={() => saveState(workspaceItems)}

            onRotate={({ beforeRotate }) => {
              const updated = [...workspaceItems];
              updated[selectedIndex].rotation = beforeRotate;
              setWorkspaceItems(updated); // Live update
            }}
            onRotateEnd={() => saveState(workspaceItems)}
          />
        )}
{selectedIndex !== null && (
  <button
    className="delete-btn"
    style={{
      position: "absolute",
      left: workspaceItems[selectedIndex].x - 12,
      top: workspaceItems[selectedIndex].y - 30,
    }}
    onMouseDown={(e) => e.stopPropagation()}
    onClick={() => {
      const updated = workspaceItems.filter((_, i) => i !== selectedIndex);
      setSelectedIndex(null);
      saveState(updated);
    }}
  >
    <img src={bin} alt="delete"/>
  </button>
)}
      </div>

    </div>
  );
}

export default JournalPage;
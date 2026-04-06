import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/cutouttray.css";
import CropWorkspace from "./CropWorkspace";

function CutOutTray() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sourceImages, setSourceImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [cutouts, setCutouts] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showFinishWarning, setShowFinishWarning] = useState(false);

  const pushHistory = (newState) => {
    setHistory(prev => [...prev, cutouts]);
    setRedoStack([]);
    setCutouts(newState);
  };

  const undo = () => {
    if (!history.length) return;

    const prev = history[history.length - 1];
    setRedoStack(r => [...r, cutouts]);
    setCutouts(prev);
    setHistory(h => h.slice(0, -1));
  };

  const redo = () => {
    if (!redoStack.length) return;

    const next = redoStack[redoStack.length - 1];
    setHistory(h => [...h, cutouts]);
    setCutouts(next);
    setRedoStack(r => r.slice(0, -1));
  };

  const handleFinish = () => {
    if (!cutouts.length) {
      setShowFinishWarning(true);
      setTimeout(() => setShowFinishWarning(false), 2000);
      return;
    }

    navigate("/journal", {
      state: { cutouts }
    });
  };

  /* -------------------------
     RESTORE CUTOUTS
  ------------------------- */

  useEffect(() => {
    const savedCutouts = localStorage.getItem("journal_cutouts");
    if (savedCutouts) {
      setCutouts(JSON.parse(savedCutouts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("journal_cutouts", JSON.stringify(cutouts));
  }, [cutouts]);

  /* -------------------------
     RESTORE UPLOADED IMAGES
  ------------------------- */

  useEffect(() => {
    if (location.state?.files) {
      setSourceImages(location.state.files);

      // Save uploads to cache
      localStorage.setItem(
        "journal_uploads",
        JSON.stringify(location.state.files)
      );
    } else {
      const savedUploads = localStorage.getItem("journal_uploads");

      if (savedUploads) {
        setSourceImages(JSON.parse(savedUploads));
      } else {
        alert("No images found. Please upload pictures first.");
        navigate("/upload");
      }
    }
  }, [location, navigate]);

  return (
    <div className="cutout-container">
      <div className="left-tray-wrapper">
        <h2 className="upload-images">Uploaded Images</h2>

        <div className="left-tray">
          {sourceImages.map((item, index) => (
            <div
              key={index}
              className="left-thumb"
              onClick={() => setSelectedImage(item)}
            >
              <img src={item.preview} alt="uploaded" />
            </div>
          ))}
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="workspace">
        <CropWorkspace
          image={
            typeof selectedImage === "string"
              ? selectedImage
              : selectedImage?.preview
          }
          onConfirm={(action) => {
            if (action === "UNDO") {
              undo();
            } else if (action === "REDO") {
              redo();
            } else {
              pushHistory([...cutouts, action]);
            }
          }}
          onFinish={handleFinish}
        />
        {showFinishWarning && (
          <div className="tool-warning">
            No pictures cropped
          </div>
        )}
      </div>

      {/* RIGHT TRAY */}
      <div className="tray_right">
        <h2 className="cutout">Cutout Images</h2>

        <div className="right-grid">
          {cutouts.map((img, i) => (
            <div
              key={i}
              className="right-thumb"
              onClick={() => setSelectedImage(img)}
            >
              <img src={img} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CutOutTray;

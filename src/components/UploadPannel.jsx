import React, { useState, useRef, useEffect } from "react";
import "../styles/uploadPannel.css";
import uploadLight from "../assets/pictures/image_icon_black.png";
import uploadDark from "../assets/pictures/image_icon_light.png";
import { useNavigate } from "react-router-dom";

function UploadPannel({ isdarkTheme }) {
const [files, setFiles] = useState([]);
const inputRef = useRef(null);
const navigate = useNavigate();

const handleFiles = async (selectedFiles) => {
const filesArray = Array.from(selectedFiles);


const newFiles = await Promise.all(
  filesArray.map((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve({
          preview: reader.result
        });
      };

      reader.readAsDataURL(file);
    });
  })
);

setFiles((prev) => [...prev, ...newFiles]);


};

const handleChange = (e) => {
handleFiles(e.target.files);
};

const handleDrop = (e) => {
e.preventDefault();
handleFiles(e.dataTransfer.files);
};

const handleDragOver = (e) => {
e.preventDefault();
};

const removeFile = (index) => {
setFiles((prev) => prev.filter((_, i) => i !== index));
};

const handleContinue = () => {
if (files.length === 0) {
alert("Please attach pictures before continuing.");
return;
}


navigate("/cutout", { state: { files } });


};

useEffect(() => {
const saved = localStorage.getItem("journal_uploads");
if (saved) {
setFiles(JSON.parse(saved));
}
}, []);

useEffect(() => {
localStorage.setItem("journal_uploads", JSON.stringify(files));
}, [files]);

return ( <div className="upload-container"> <h2 className="upload-statement">
Upload stickers, papers or journal pages you want to experiment with </h2>

  <div
    className="drop-zone"
    onClick={() => inputRef.current.click()}
    onDrop={handleDrop}
    onDragOver={handleDragOver}
  >
    <img
      src={isdarkTheme ? uploadDark : uploadLight}
      alt="upload"
      className="drop-image"
    />

    <span>Drag & drop files here</span>
    <span>or click to choose files</span>

    <input
      type="file"
      accept="image/*"
      multiple
      hidden
      ref={inputRef}
      onChange={handleChange}
    />
  </div>

  <div className="preview-grid">
    {files.map((item, index) => (
      <div key={index} className="preview-card">
        <img src={item.preview} alt="preview" />

        <button
          className="preview-remove"
          onClick={() => removeFile(index)}
        >
          Remove
        </button>
      </div>
    ))}
  </div>

  <button className="continue" onClick={handleContinue}>
    Continue
  </button>
</div>

);
}

export default UploadPannel;

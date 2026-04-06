import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Skeleton from "../components/Skeleton";
import UploadPannel from "../components/UploadPannel";
import ParticleBackground from "../components/ParticleBackground";
import CutOutTray from "../components/CutOutTray";
import JournalPage from "../components/JournalPage";

function App() {
  // load saved theme on refresh
  const [isdarkTheme, setIsDarkTheme] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(isdarkTheme ? "dark" : "light");

    localStorage.setItem(
      "theme",
      isdarkTheme ? "dark" : "light"
    );
  }, [isdarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  return (
    <BrowserRouter>
    <ParticleBackground />
      <Routes>
        <Route
          path="/"
          element={
            <Skeleton
              isdarkTheme={isdarkTheme}
              toggleTheme={toggleTheme}
            />
          }
        />
        <Route path="/upload" 
          element={<UploadPannel isdarkTheme={isdarkTheme} />} />
        <Route
          path="/cutout"
          element={<CutOutTray />}
        /><Route path="/journal" element={<JournalPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

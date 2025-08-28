import { BrowserRouter, Route, Routes } from "react-router";

import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

import Rules from "./pages/Rules";
import Start from "./pages/Start";
import Game from "./pages/Game";
import GameProvider from "./contexts/GameProvider";

function App() {
  return (
    <GameProvider>
      <Toaster toastOptions={{ duration: 3000 }} />
      <Analytics />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;

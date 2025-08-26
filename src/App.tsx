import { BrowserRouter, Route, Routes } from "react-router";
import Rules from "./pages/Rules";
import Start from "./pages/Start";
import Game from "./pages/Game";
import GameProvider from "./contexts/GameProvider";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <GameProvider>
      <Toaster toastOptions={{ duration: 3000 }} />
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

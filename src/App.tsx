import { BrowserRouter, Route, Routes } from "react-router";
import Rules from "./pages/Rules";
import Start from "./pages/Start";
import Game from "./pages/Game";
import GameProvider from "./contexts/GameProvider";

function App() {
  return (
    <GameProvider>
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

import Board from "../components/Board";
import GameGrid from "../components/GameGrid";
import Navbar from "../ui/Navbar";

const Game = () => {
  return (
    <div className="relative min-h-screen">
      <div className="relative z-30">
        <Navbar />
      </div>

      <div className="absolute top-0 left-0 right-0 -bottom-15 z-00">
        <Board />
      </div>

      <div className="relative z-20">
        <GameGrid />
      </div>
    </div>
  );
};

export default Game;

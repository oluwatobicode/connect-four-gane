import GameGrid from "../components/GameGrid";
import Navbar from "../ui/Navbar";

const Game = () => {
  return (
    <div className="min-h-screen max-auto max-w-auto bg-[#7945FF]">
      <Navbar />
      <GameGrid />
    </div>
  );
};

export default Game;

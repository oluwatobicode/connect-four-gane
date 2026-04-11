import GameGrid from "../components/GameGrid";
import QuickMessages from "../components/game/QuickMessages";
import Navbar from "../ui/Navbar";

const Game = () => {
  return (
    <div className="min-h-screen max-auto max-w-auto bg-[#7945FF]">
      <Navbar />
      <GameGrid />
      <QuickMessages />
    </div>
  );
};

export default Game;

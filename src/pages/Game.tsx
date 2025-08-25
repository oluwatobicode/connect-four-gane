import GameGrid from "../components/GameGrid";
import Navbar from "../ui/Navbar";

const Game = () => {
  return (
    <div className=" min-h-screen bg-[#7945FF]">
      <div className="max-auto max-w-auto ">
        <Navbar />
        <GameGrid />
      </div>
    </div>
  );
};

export default Game;

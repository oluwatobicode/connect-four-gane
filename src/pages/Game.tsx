import GameGrid from "../components/GameGrid";
import Navbar from "../ui/Navbar";

const Game = () => {
  return (
    <main className=" w-full min-h-screen bg-[#7945FF]">
      <div className="text-white text-2xl mx-auto  max-w-4xl flex flex-col justify-center  items-center">
        <Navbar />
        <GameGrid />
      </div>
    </main>
  );
};
export default Game;

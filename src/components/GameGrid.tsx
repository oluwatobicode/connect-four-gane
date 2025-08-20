import { useGameContext } from "../contexts/GameProvider";

const GameGrid = () => {
  const { state } = useGameContext();

  return (
    <main className="grid md:w-full md:h-[584px] grid-cols-7 grid-rows-6 border-2">
      {state.grid.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className="w-[50px] h-[50px]">
            {cell || "empty"}
          </div>
        ))
      )}
    </main>
  );
};

export default GameGrid;

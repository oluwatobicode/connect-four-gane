import { useGameContext } from "../contexts/GameProvider";

const GameGrid = () => {
  const { state, dropDisc } = useGameContext();

  const handleColumnClick = (colIndex: number) => {
    if (state.isGameActive) {
      dropDisc(colIndex);
    }
  };

  console.log("Current Player:", state.currentPlayer);
  console.log("Game Grid:", state.grid);
  console.log("scores", state.scores);

  return (
    <main className="flex flex-col items-center justify-center h-screen mt-5 relative">
      {/* Container for both board layers */}
      <div className="relative inline-block">
        <img
          src="/images/board-layer-black-large.svg"
          alt=""
          className="absolute z-0 w-full h-full object-contain"
        />
        <img
          src="/images/board-layer-white-large.svg"
          alt=""
          className="relative z-10 w-full h-full object-contain"
        />

        {/* Grid positioned over the board holes */}
        <div className="absolute inset-0 z-20 grid grid-cols-7 grid-rows-6 p-6 gap-1">
          {state.grid.flatMap((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className="cell relative z-20 cursor-pointer rounded-full h-[3.8rem] w-[3.8rem] "
                onClick={() => handleColumnClick(colIndex)}
              >
                {cell === "player1" && (
                  <img
                    src="/images/counter-yellow-large.svg"
                    alt="Yellow disc"
                    className="w-16 h-16 object-contain"
                  />
                )}
                {cell === "player2" && (
                  <img
                    src="/images/counter-red-large.svg"
                    alt="Red disc"
                    className="w-16 h-16 object-contain"
                  />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default GameGrid;

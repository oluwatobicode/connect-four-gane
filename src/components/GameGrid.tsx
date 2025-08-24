import { useGameContext } from "../contexts/GameProvider";

const GameGrid = () => {
  const { state, dropDisc } = useGameContext();

  const handleColumnClick = (colIndex: number) => {
    if (state.isGameActive) {
      dropDisc(colIndex);
    }
  };

  return (
    <main className="grid min-h-screen grid-rows-1 grid-cols-2 md:grid-cols-4  md:grid-rows-1 items-center justify-center mt-5 relative">
      <div className="flex items-center justify-center md:col-start-1 row-start-1">
        <div className="flex relative flex-col items-center justify-center w-[272px] h-[100px] md:w-[141px] md:h-[187px] bg-white border-4 border-[#000] rounded-[20px] shadow-[0px_8px_0px_#000000]">
          <div className="absolute md:transform md:-translate-y-1/2 md:-top-2">
            <img src="/images/player-one.svg" alt="" />
          </div>

          <h1 className="text-black">Player 1</h1>
          <span className="text-black font-bold md:text-[56px]">
            {state.scores.player1}
          </span>
        </div>
      </div>

      <div className="relative col-span-2 md:col-start-2 inline-block">
        <img
          src="/images/board-layer-black-large.svg"
          alt=""
          className="absolute z-0 w-[632px] h-full object-contain"
        />
        <img
          src="/images/board-layer-white-large.svg"
          alt=""
          className=" bottom-2 z-10 w-[632px] h-full object-contain"
        />

        <div className="absolute w-auto md:h-auto inset-[30px] items-center justify-center grid grid-cols-7 grid-rows-6 p-[1px] gap-[10px] ">
          {state.grid.flatMap((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className="relative bottom-3 z-20 cursor-pointer rounded-full h-[60px] w-[60px]"
                onClick={() => handleColumnClick(colIndex)}
              >
                {cell === "player1" && (
                  <img
                    src="/images/counter-red-large.svg"
                    alt="Yellow disc"
                    className="w-16 h-16 object-contain"
                  />
                )}
                {cell === "player2" && (
                  <img
                    src="/images/counter-yellow-large.svg"
                    alt="Red disc"
                    className="w-16 h-16 object-contain"
                  />
                )}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-center cols-start-1">
        <div className="flex relative flex-col items-center justify-center border-4 border-[#000] font-medium w-[272px] h-[100px] md:w-[141px] md:h-[187px] bg-white rounded-[20px] shadow-[0px_8px_0px_#000000]">
          <div className="absolute md:transform md:-translate-y-1/2 md:-top-2">
            <img src="/images/player-two.svg" alt="" />
          </div>
          <h1 className="text-black">Player 2</h1>
          <span className="text-black font-bold md:text-[56px]">
            {state.scores.player2}
          </span>
        </div>
      </div>
    </main>
  );
};

export default GameGrid;

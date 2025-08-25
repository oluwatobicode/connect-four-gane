import { useGameContext } from "../contexts/GameProvider";

const GameGrid = () => {
  const { state, dropDisc } = useGameContext();

  const handleColumnClick = (colIndex: number) => {
    if (state.isGameActive) {
      dropDisc(colIndex);
    }
  };

  return (
    <main className="min-h-screen relative">
      <div className="grid grid-rows-2 grid-cols-2 md:grid-cols-4 md:grid-rows-1 items-center justify-center">
        <div className="flex items-center justify-center md:col-start-1 row-start-1 md:row-start-1">
          <div className="flex  relative flex-col items-center justify-center md:w-[141px] md:h-[187px] w-[142px] h-[81px] bg-white border-4 border-[#000] rounded-[20px] shadow-[0px_8px_0px_#000000]">
            <div className="absolute md:transform md:-translate-y-1/2 md:-top-2 -left-6 md:left-10">
              <img src="/images/player-one.svg" alt="player 1 icon" />
            </div>

            <h1 className="text-black mt-3 text-[16px] md:text-[20px] font-bold">
              Player 1
            </h1>
            <span className="text-black text-[32px] font-bold md:text-[56px]">
              {state.scores.player1}
            </span>
          </div>
        </div>

        <div className="relative flex items-center justify-center col-span-2 md:col-start-2 row-start-2 md:row-start-1">
          <div className="relative">
            <img
              src="/images/board-layer-black-large.svg"
              alt="game board border"
              className="hidden md:block absolute z-20 w-[632px] h-full object-contain"
            />
            <img
              src="/images/board-layer-white-large.svg"
              alt="game board holes"
              className="hidden md:block bottom-2 relative z-20 w-[632px] h-full object-contain"
            />

            <img
              src="/images/board-layer-black-small.svg"
              alt="game board border"
              className="md:hidden block absolute z-20 w-[335px]  h-full object-contain"
            />
            <img
              src="/images/board-layer-white-small.svg"
              alt="game board holes"
              className="bottom-2 md:hidden block relative z-20 w-[335px] h-full object-contain"
            />

            <div className="absolute -top-[3px] left-[15px] md:top-[18px] md:left-[19px] w-[313.8px] h-[285px] md:w-[596px] md:h-[510px] grid grid-cols-7 grid-rows-6 gap-[5px] md:gap-[6px]">
              {state.grid.flatMap((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    className="relative z-30 cursor-pointer rounded-full w-[33.92px] h-[33.92px] md:w-[75px] md:h-[75px] flex items-center justify-center hover:scale-105 transition-transform"
                    onClick={() => handleColumnClick(colIndex)}
                  >
                    {cell === "player1" && (
                      <>
                        <img
                          src="/images/counter-red-large.svg"
                          alt="Red disc"
                          className="w-[75px] h-[75px] hidden md:block object-cover rounded-full"
                        />

                        <img
                          src="/images/counter-red-small.svg"
                          alt="Red disc"
                          className="w-[33.92px] h-[33.92px] block md:hidden object-cover rounded-full"
                        />
                      </>
                    )}
                    {cell === "player2" && (
                      <>
                        <img
                          src="/images/counter-yellow-large.svg"
                          alt="Yellow disc"
                          className="w-[75px] h-[75px] hidden md:block object-cover rounded-full"
                        />

                        <img
                          src="/images/counter-yellow-small.svg"
                          alt="Yellow disc"
                          className="w-[33.92px] h-[33.92px] block md:hidden object-cover rounded-full"
                        />
                      </>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center row-start-1 md:row-start-1">
          <div className="flex relative  flex-col items-center justify-center border-4 border-[#000] font-medium md:w-[141px] md:h-[187px] w-[142px] h-[81px] bg-white rounded-[20px] shadow-[0px_8px_0px_#000000]">
            <div className="absolute md:transform md:-translate-y-1/2 md:-top-2 -right-6 md:right-10">
              <img src="/images/player-two.svg" alt="player 2 icon" />
            </div>
            <h1 className="text-black mt-3 text-[16px] md:text-[20px] font-bold">
              Player 2
            </h1>
            <span className="text-black text-[32px] font-bold md:text-[56px]">
              {state.scores.player2}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GameGrid;

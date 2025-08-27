import { useEffect } from "react";
import { useGameContext } from "../contexts/GameProvider";

const GameGrid = () => {
  const { state, dropDisc, playAgain, timerTick, cpuDropDisc } =
    useGameContext();

  const handleColumnClick = (colIndex: number) => {
    if (state.isGameActive) {
      dropDisc(colIndex);
    }
  };

  const handlePlayAgain = () => {
    playAgain();
  };

  useEffect(() => {
    let interval = undefined;
    if (!state.isGameActive) return;

    if (state.isGameActive) {
      interval = setInterval(() => {
        timerTick();
      }, 1000);
    } else if (state.isGameActive === false) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [state.isGameActive, state.currentPlayer]);

  useEffect(() => {
    if (
      state.currentPlayer === "player2" &&
      state.player2 === "cpu" &&
      state.isGameActive
    ) {
      setTimeout(() => {
        cpuDropDisc();
      }, 1000);
    }
  }, [state.currentPlayer]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="grid grid-rows-1 gap-[50px] md:gap-0 grid-cols-2 md:grid-cols-4 md:grid-rows-1 items-center justify-center">
        <div className="flex items-center justify-center md:col-start-1 row-start-1 md:row-start-1">
          <div className="flex  relative flex-col items-center justify-center md:w-[141px] md:h-[187px] w-[142px] h-[81px] bg-white border-4 border-[#000] rounded-[20px] shadow-[0px_8px_0px_#000000]">
            <div className="absolute md:transform md:-translate-y-1/2 md:-top-2 -left-6 md:left-10">
              {state.player2 === "human" ? (
                <img src="/images/player-one.svg" alt="player 1 icon" />
              ) : (
                <img src="/images/you.svg" alt="player 2 icon" />
              )}
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

          <div className="absolute bottom-5 md:bottom-15 left-1/2 transform -translate-x-1/2 translate-y-full z-30  flex items-center justify-center">
            {state.isGameActive && (
              <div className="relative">
                {state.currentPlayer === "player1" && (
                  <img
                    src="/images/turn-background-red.svg"
                    alt="Player 1 turn indicator"
                    className="w-auto h-auto"
                  />
                )}
                {state.currentPlayer === "player2" && (
                  <img
                    src="/images/turn-background-yellow.svg"
                    alt="Player 2 turn indicator"
                    className="w-auto h-auto"
                  />
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="pt-10 text-center">
                    <h2
                      className={`font-bold text-[16px] ${
                        state.currentPlayer === "player1"
                          ? "text-[#FFF]"
                          : "text-[#000]"
                      }`}
                    >
                      {state.currentPlayer === "player1"
                        ? "PLAYER 1'S TURN"
                        : "PLAYER 2'S TURN"}
                    </h2>
                    <h2
                      className={`font-bold text-[56px] ${
                        state.currentPlayer === "player1"
                          ? "text-[#FFF]"
                          : "text-[#000]"
                      }`}
                    >
                      {state.timer}s
                    </h2>
                  </div>
                </div>
              </div>
            )}

            {state.winner && state.winner !== "draw" && (
              <div className="relative w-[285px] h-[160px] rounded-[20px] bg-[#fff] border-2 border-[#000] shadow-[0px_10px_0px_#000000] flex items-center justify-center">
                <div className="absolute flex flex-col items-center justify-center ">
                  <h2 className="font-bold text-[16px] text-black">
                    {state.winner === "player1" || "player2"
                      ? state.winner
                      : " "}
                  </h2>
                  <h2 className="font-bold text-[56px] text-black">
                    {state.winner === "player1" || "player2"
                      ? "WINS!"
                      : "DRAW!"}
                  </h2>
                  <button
                    onClick={handlePlayAgain}
                    className="cursor-pointer w-[130px] h-[39px] text-white bg-[#5C2DD5] font-bold rounded-[20px] text-[16px]"
                  >
                    PLAY AGAIN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center row-start-1 md:row-start-1">
          <div className="flex relative  flex-col items-center justify-center border-4 border-[#000] font-medium md:w-[141px] md:h-[187px] w-[142px] h-[81px] bg-white rounded-[20px] shadow-[0px_8px_0px_#000000]">
            <div className="absolute md:transform md:-translate-y-1/2 md:-top-2 -right-6 md:right-10">
              {state.player2 === "human" ? (
                <img src="/images/player-two.svg" alt="player 2 icon" />
              ) : (
                <img src="/images/cpu.svg" alt="player 2 icon" />
              )}
            </div>
            <h1 className="text-black mt-3 text-[16px] md:text-[20px] font-bold">
              {state.player2 === "human" ? "Player 2 " : "CPU"}
            </h1>
            <span className="text-black text-[32px] font-bold md:text-[56px]">
              {state.scores.player2}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`w-full h-[250px] relative bg-[#5C2DD5] rounded-tl-[60px] rounded-tr-[60px]  ${
          state.winner === "player1" ? "bg-[#FD6687]" : " "
        } ${state.winner === "player2" ? "bg-[#FFCE67]" : " "}`}
      ></div>
    </main>
  );
};

export default GameGrid;

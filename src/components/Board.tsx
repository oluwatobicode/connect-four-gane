import { useEffect } from "react";
import { useGameContext } from "../contexts/GameProvider";

const Board = () => {
  const { state, playAgain, timerTick } = useGameContext();

  const handlePlayAgain = () => {
    playAgain();
  };

  console.log(state.timer);

  useEffect(() => {
    if (!state.isGameActive) return;

    const interval = setInterval(() => {
      timerTick();
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isGameActive, state.currentPlayer]);

  return (
    <div className="w-full h-full min-h-screen bg-[#7945FF]">
      <div
        className={`w-full h-[200px] absolute -bottom-10 bg-[#5C2DD5] rounded-tl-[60px] rounded-tr-[60px] flex items-center justify-center ${
          state.winner === "player1" ? "bg-[#FD6687]" : " "
        } ${state.winner === "player2" ? "bg-[#FFCE67]" : " "}`}
      >
        <div className="relative z-30 left-3 flex items-center justify-center">
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

              <div className="absolute inset-0 flex flex-col gap-2 pt-3 items-center justify-center">
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
          )}

          {state.winner && (
            <div className="relative w-[285px] h-[160px] rounded-[20px] bg-[#fff] border-2 border-[#000] shadow-[0px_10px_0px_#000000] flex items-center justify-center">
              <div className="absolute flex flex-col items-center justify-center ">
                <h2 className="font-bold text-[12px] md:text-[16px] text-black">
                  {state.winner === "player1" ? "PLAYER 1" : "PLAYER 2"}
                </h2>
                <h2 className="font-bold text-xs md:text-[56px] text-black">
                  WINS!
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
    </div>
  );
};

export default Board;

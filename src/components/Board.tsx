import { useGameContext } from "../contexts/GameProvider";

const Board = () => {
  const { state } = useGameContext();

  return (
    <div
      className={`w-full h-[200px] relative bg-[#5C2DD5] rounded-tl-[60px] rounded-tr-[60px] flex items-center justify-center ${
        state.winner === "player1" ? "bg-[#FD6687]" : " "
      } ${state.winner === "player2" ? "bg-[#FFCE67]" : " "}`}
    ></div>
  );
};

export default Board;

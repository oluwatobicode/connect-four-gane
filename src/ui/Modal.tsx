import { useNavigate } from "react-router";
import { useGameContext } from "../contexts/GameProvider";

const Modal = () => {
  const { showMenu, quitGame, restartGame } = useGameContext();
  const navigate = useNavigate();

  const handleClickOutSide = () => {
    showMenu({ show: false });
  };

  const handleQuitGame = () => {
    quitGame();
    navigate("/");
  };

  const handleRestartGame = () => {
    restartGame();
  };

  return (
    <div
      onClick={handleClickOutSide}
      className=" inset-0 bg-black/50 z-50 fixed  flex items-center justify-center p-4"
    >
      <div className="md:bg-[#7945FF] bg-[#7945FF] rounded-[40px] border-4 border-black shadow-[0px_8px_0px_#000000] md:rounded-[40px] md:border-4 flex flex-col items-center justify-center md:border-black md:w-[480px] md:h-[491px] w-[335px] h-[437px] mx-auto md:shadow-[0px_8px_0px_#000000]">
        <div className="mb-[30px] text-center text-white text-[56px] font-bold leading-[71px]">
          <h1>PAUSE</h1>
        </div>

        <button className="md:w-[400px] text-center md:h-[72px] md:text-[24px] w-[295px] h-[72px] font-bold flex items-center justify-between cursor-pointer bg-[#FFFF] text-[#000] p-3 rounded-[20px] border-4 border-black mb-4 transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000] hover:shadow-[0px_6px_0px_#5C2DD5] hover:border-[#5C2DD5] hover:border-4">
          <span className="text-center w-full">CONTINUE GAME</span>
        </button>

        <button
          onClick={handleRestartGame}
          className="md:w-[400px] md:h-[72px] md:text-[24px] w-[295px] h-[72px] font-bold flex items-center justify-between cursor-pointer bg-[#FFFF] text-[#000] p-3 rounded-[20px] border-4 border-black mb-4 transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000]"
        >
          <span className="text-center w-full">RESTART GAME</span>
        </button>

        <button
          onClick={handleQuitGame}
          className="md:w-[400px] md:h-[72px] md:text-[24px] w-[295px] h-[72px] font-bold flex items-center justify-between cursor-pointer text-[#FFFF] bg-[#FD6687] p-3 rounded-[20px] border-4 border-black mb-4 transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000]"
        >
          <span className="text-center w-full">QUIT GAME</span>
        </button>
      </div>
    </div>
  );
};

export default Modal;

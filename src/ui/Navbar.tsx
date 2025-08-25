import Modal from "../ui/Modal";
import { useGameContext } from "../contexts/GameProvider";

const Navbar = () => {
  const { showMenu, state, restartGame } = useGameContext();

  const onClick = () => {
    showMenu({ show: true });
  };

  const handleRestartGame = () => {
    restartGame();
  };

  return (
    <nav className="text-white p-5 md:p-10 w-full">
      <div className="mx-auto max-w-4xl flex items-center">
        <div className="mr-auto">
          <button
            onClick={onClick}
            className="cursor-pointer w-[89px] h-[39px] bg-[#5C2DD5] rounded-[20px] text-[16px]"
          >
            Menu
          </button>
        </div>
        <div className="flex items-center justify-center">
          <img
            src="/images/logo.svg"
            className="w-[52px] h-[52px]"
            alt="multi-player logo"
          />
        </div>

        {state.showMenu && <Modal />}

        <div className="ml-auto">
          <button
            onClick={handleRestartGame}
            className="cursor-pointer w-[89px] h-[39px] bg-[#5C2DD5] rounded-[20px] text-[16px]"
          >
            Restart
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
